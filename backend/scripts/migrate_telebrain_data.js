/**
 * Migrate Telebrain MongoDB Data to WarmSwarm PostgreSQL
 * 
 * Reads MongoDB JSON export and converts to proper relational schema
 */

const fs = require('fs');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/swarms',
});

// MongoDB parent_id hierarchy (from Telebrain)
const PARENT_IDS = {
  ROLES: '12',
  VENUES: '15',
  WEB_IMAGES: '17',
  UPLOADED_IMAGES: '18',
  TELEPROMPTS: '19',
  WEB_AUDIO: '21',
  UPLOADED_AUDIO: '22',
  TTS_AUDIO: '23',
  TIMERS: '35',
  METRONOMES: '36',
  MULTI_ROLE_FRAGMENTS: '50',
  FRACTIONAL_FRAGMENTS: '51',
};

async function parseMongoDBExport(filePath) {
  console.log(`Reading ${filePath}...`);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Parse line-by-line JSON format (MongoDB mongoexport format)
  const lines = content.trim().split('\n');
  const documents = lines.map(line => {
    try {
      // Handle MongoDB extended JSON
      const doc = JSON.parse(line);
      
      // Convert MongoDB ObjectID to UUID-compatible format
      if (doc._id && typeof doc._id === 'object' && doc._id.$oid) {
        doc._id = doc._id.$oid;
      }
      
      return doc;
    } catch (e) {
      console.error('Error parsing line:', line.substring(0, 50));
      return null;
    }
  }).filter(Boolean);
  
  console.log(`Parsed ${documents.length} documents`);
  return documents;
}

async function createDemoSwarm() {
  console.log('\n=== Creating Demo Swarm ===');
  
  const result = await pool.query(`
    INSERT INTO swarms (name, description, privacy, category, invite_code)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id
  `, ['Telebrain Demo', 'Migrated data from original Telebrain', 'public', 'event', 'TELEBRAIN']);
  
  const swarmId = result.rows[0].id;
  console.log(`Created swarm: ${swarmId}`);
  
  return swarmId;
}

async function migrateRoles(swarmId, documents) {
  console.log('\n=== Migrating Roles ===');
  
  const roles = documents.filter(doc => doc.parent_id === PARENT_IDS.ROLES);
  console.log(`Found ${roles.length} roles`);
  
  const roleIdMap = new Map(); // MongoDB ID -> PostgreSQL UUID
  
  for (const role of roles) {
    if (!role.name || role.permissions === '1') continue; // Skip templates
    
    console.log(`  - ${role.name}`);
    
    try {
      const result = await pool.query(`
        INSERT INTO swarm_roles (
          swarm_id, name, description,
          can_send_audio, can_receive_audio,
          can_send_text, can_receive_text,
          can_send_images, can_receive_images,
          can_view_members, can_view_activity_log,
          show_menu, show_title
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING id
      `, [
        swarmId,
        role.name,
        role.description || null,
        role.audioSend === 'checked',
        role.audioReceive === 'checked',
        role.textSend === 'checked',
        role.textReceive === 'checked',
        role.imageSend === 'checked',
        role.imageReceive === 'checked',
        role.performerList === 'checked',
        role.activityLog === 'checked',
        role.showMenu === 'checked',
        role.showTitle === 'checked'
      ]);
      
      roleIdMap.set(role._id, result.rows[0].id);
    } catch (error) {
      console.error(`Error migrating role ${role.name}:`, error.message);
    }
  }
  
  return roleIdMap;
}

async function migrateImages(swarmId, documents) {
  console.log('\n=== Migrating Images ===');
  
  const webImages = documents.filter(doc => doc.parent_id === PARENT_IDS.WEB_IMAGES && doc.permissions !== '1');
  const uploadedImages = documents.filter(doc => doc.parent_id === PARENT_IDS.UPLOADED_IMAGES && doc.permissions !== '1');
  
  console.log(`Found ${webImages.length} web images, ${uploadedImages.length} uploaded images`);
  
  for (const img of [...webImages, ...uploadedImages]) {
    if (!img.name) continue;
    
    console.log(`  - ${img.name}`);
    
    try {
      // Create base content
      const contentResult = await pool.query(`
        INSERT INTO swarm_content (swarm_id, type, name, description)
        VALUES ($1, 'image', $2, $3)
        RETURNING id
      `, [swarmId, img.name, img.description || null]);
      
      const contentId = contentResult.rows[0].id;
      
      // Add image metadata
      await pool.query(`
        INSERT INTO swarm_content_images (content_id, source_type, url)
        VALUES ($1, $2, $3)
      `, [
        contentId,
        img.parent_id === PARENT_IDS.WEB_IMAGES ? 'url' : 'upload',
        img.image || null
      ]);
    } catch (error) {
      console.error(`Error migrating image ${img.name}:`, error.message);
    }
  }
}

async function migrateAudio(swarmId, documents) {
  console.log('\n=== Migrating Audio ===');
  
  const webAudio = documents.filter(doc => doc.parent_id === PARENT_IDS.WEB_AUDIO && doc.permissions !== '1' && doc.deleteFlag !== 1);
  const uploadedAudio = documents.filter(doc => doc.parent_id === PARENT_IDS.UPLOADED_AUDIO && doc.permissions !== '1');
  const ttsAudio = documents.filter(doc => doc.parent_id === PARENT_IDS.TTS_AUDIO && doc.permissions !== '1' && doc.deleteFlag !== 1);
  
  console.log(`Found ${webAudio.length} web audio, ${uploadedAudio.length} uploaded audio, ${ttsAudio.length} TTS`);
  
  for (const audio of [...webAudio, ...uploadedAudio]) {
    if (!audio.name) continue;
    
    console.log(`  - ${audio.name}`);
    
    try {
      const contentResult = await pool.query(`
        INSERT INTO swarm_content (swarm_id, type, name, description)
        VALUES ($1, 'audio', $2, $3)
        RETURNING id
      `, [swarmId, audio.name, audio.description || null]);
      
      const contentId = contentResult.rows[0].id;
      
      await pool.query(`
        INSERT INTO swarm_content_audio (content_id, source_type, url, file_path)
        VALUES ($1, $2, $3, $4)
      `, [
        contentId,
        audio.parent_id === PARENT_IDS.WEB_AUDIO ? 'url' : 'upload',
        audio.audio || null,
        audio.audio || null
      ]);
    } catch (error) {
      console.error(`Error migrating audio ${audio.name}:`, error.message);
    }
  }
  
  // Migrate TTS
  for (const tts of ttsAudio) {
    if (!tts.name) continue;
    
    console.log(`  - TTS: ${tts.name}`);
    
    try {
      const contentResult = await pool.query(`
        INSERT INTO swarm_content (swarm_id, type, name, description)
        VALUES ($1, 'audio', $2, $3)
        RETURNING id
      `, [swarmId, tts.name, tts.description || null]);
      
      const contentId = contentResult.rows[0].id;
      
      await pool.query(`
        INSERT INTO swarm_content_audio (
          content_id, source_type, 
          tts_text, tts_language, 
          file_path
        )
        VALUES ($1, 'tts', $2, $3, $4)
      `, [
        contentId,
        tts.text || null,
        tts.language || 'en',
        `snd/ttsdb/${tts._id}.mp3`
      ]);
    } catch (error) {
      console.error(`Error migrating TTS ${tts.name}:`, error.message);
    }
  }
}

async function migrateTeleprompts(swarmId, documents) {
  console.log('\n=== Migrating Teleprompts ===');
  
  const teleprompts = documents.filter(doc => doc.parent_id === PARENT_IDS.TELEPROMPTS && doc.permissions !== '1');
  console.log(`Found ${teleprompts.length} teleprompts`);
  
  for (const tp of teleprompts) {
    if (!tp.name || !tp.text) continue;
    
    console.log(`  - ${tp.name}`);
    
    try {
      const contentResult = await pool.query(`
        INSERT INTO swarm_content (swarm_id, type, name, description)
        VALUES ($1, 'text', $2, $3)
        RETURNING id
      `, [swarmId, tp.name, tp.description || null]);
      
      const contentId = contentResult.rows[0].id;
      
      await pool.query(`
        INSERT INTO swarm_content_text (
          content_id, text_content,
          font_family, font_size, font_color, background_color
        )
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        contentId,
        tp.text,
        tp.font || 'Geneva',
        tp.size ? parseInt(tp.size) : 32,
        tp.color || '#000000',
        tp.bgcolor || '#FFFFFF'
      ]);
    } catch (error) {
      console.error(`Error migrating teleprompt ${tp.name}:`, error.message);
    }
  }
}

async function migrateTimers(swarmId, documents) {
  console.log('\n=== Migrating Timers ===');
  
  const timers = documents.filter(doc => doc.parent_id === PARENT_IDS.TIMERS && doc.permissions !== '1');
  console.log(`Found ${timers.length} timers`);
  
  for (const timer of timers) {
    if (!timer.name) continue;
    
    console.log(`  - ${timer.name}`);
    
    try {
      // Convert "05:30" format to milliseconds
      const min = parseInt(timer.min) || 0;
      const sec = parseInt(timer.sec) || 0;
      const ms = parseInt(timer.ms) || 0;
      const durationMs = (min * 60 * 1000) + (sec * 1000) + ms;
      
      const contentResult = await pool.query(`
        INSERT INTO swarm_content (swarm_id, type, name, description)
        VALUES ($1, 'timer', $2, $3)
        RETURNING id
      `, [swarmId, timer.name, timer.description || null]);
      
      const contentId = contentResult.rows[0].id;
      
      await pool.query(`
        INSERT INTO swarm_content_timers (content_id, duration_ms, label)
        VALUES ($1, $2, $3)
      `, [contentId, durationMs, timer.name]);
    } catch (error) {
      console.error(`Error migrating timer ${timer.name}:`, error.message);
    }
  }
}

async function generateStats(swarmId) {
  console.log('\n=== Migration Statistics ===');
  
  const stats = await pool.query(`
    SELECT 
      COUNT(*) FILTER (WHERE sr.id IS NOT NULL) as role_count,
      COUNT(*) FILTER (WHERE sc.type = 'audio') as audio_count,
      COUNT(*) FILTER (WHERE sc.type = 'image') as image_count,
      COUNT(*) FILTER (WHERE sc.type = 'text') as text_count,
      COUNT(*) FILTER (WHERE sc.type = 'timer') as timer_count
    FROM swarms s
    LEFT JOIN swarm_roles sr ON s.id = sr.swarm_id
    LEFT JOIN swarm_content sc ON s.id = sc.swarm_id
    WHERE s.id = $1
  `, [swarmId]);
  
  const counts = stats.rows[0];
  console.log(`Roles:       ${counts.role_count}`);
  console.log(`Audio:       ${counts.audio_count}`);
  console.log(`Images:      ${counts.image_count}`);
  console.log(`Text:        ${counts.text_count}`);
  console.log(`Timers:      ${counts.timer_count}`);
}

async function main() {
  const telebrainFile = process.argv[2] || '/home/kgalvin/CascadeProjects/telebrain-master/content_4_21_17.json';
  
  console.log('╔════════════════════════════════════════════╗');
  console.log('║  Telebrain → WarmSwarm Migration Tool     ║');
  console.log('╚════════════════════════════════════════════╝\n');
  
  try {
    // Parse MongoDB export
    const documents = await parseMongoDBExport(telebrainFile);
    
    // Create demo swarm
    const swarmId = await createDemoSwarm();
    
    // Migrate each content type
    await migrateRoles(swarmId, documents);
    await migrateImages(swarmId, documents);
    await migrateAudio(swarmId, documents);
    await migrateTeleprompts(swarmId, documents);
    await migrateTimers(swarmId, documents);
    
    // Show stats
    await generateStats(swarmId);
    
    console.log('\n✅ Migration complete!');
    console.log(`\nSwarm created with invite code: TELEBRAIN`);
    console.log(`View at: http://localhost:3333/swarms/TELEBRAIN`);
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error(error);
    process.exit(1);
  });
}

