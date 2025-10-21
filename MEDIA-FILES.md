# Media Files Documentation

## Overview

WarmSwarm includes media files (audio and images) migrated from the Telebrain project. These files are **not committed to git** due to their size (~18MB), but can be easily copied from the Telebrain repository.

---

## Media Inventory

### Audio Files (15MB total)

| Directory | Files | Purpose |
|-----------|-------|---------|
| `public/snd/uploads/` | 38 | User-uploaded audio (musical notes, beeps, sounds) |
| `public/snd/ttsdb/` | 165 | Text-to-speech generated audio |
| `public/snd/urls/` | 40 | Audio downloaded from URLs |
| **Total Audio** | **243** | |

### Image Files (3.1MB total)

| Directory | Files | Purpose |
|-----------|-------|---------|
| `public/pics/` | 90 | UI icons, diagrams, performance visuals |

### File Types

- **Audio**: MP3 files
- **Images**: JPG, PNG, GIF, SVG

---

## Setup

### Copy Media from Telebrain

If you have the Telebrain repository cloned, run:

```bash
bash backend/scripts/copy_telebrain_media.sh
```

This will copy all referenced media files to the correct locations in WarmSwarm.

### Manual Setup

If you don't have access to Telebrain:

1. The database references are preserved
2. Media files can be re-uploaded as needed
3. Missing files will show as broken links/404s

---

## Audio Files

### Uploaded Sounds (`snd/uploads/`)

Musical notes and effects:

```
Musical Notes:
- A3-220.0.mp3 through Gsharp4-415.3.mp3 (chromatic scale)
- Musical tones at various frequencies

Sound Effects:
- Beep.mp3, DoubleBeep.mp3
- Laugh.mp3
- Spring.mp3, Slide.mp3
- MTBrain.mp3 (signature sound)
- Various clicks, tones, and effects
```

**Note**: Audio files are served at:
```
http://localhost:3444/snd/uploads/Beep.mp3
http://localhost:3444/pics/brain.jpg
```

### Text-to-Speech (`snd/ttsdb/`)

Generated TTS audio files with MongoDB-style IDs:
- Format: `5103435ae0d1ac2d16000035.mp3`
- 165 files from various TTS generations
- Used for narration and instructions

### URL Audio (`snd/urls/`)

Audio files downloaded from external URLs:
- 40 cached audio files
- Similar MongoDB ID naming scheme

---

## Image Files

### UI Icons and Visuals (`pics/`)

**Performance Visuals:**
- `perform-bus.png`, `perform-mesh.png`, `perform-ring.png`
- `perform-star.png`, `perform-tree.png`, `perform-line.png`
- `perform-roles.jpg`, `perform-full.png`

**Interface Elements:**
- `audio.jpg`, `audioUpload.jpg`, `audioURL.jpg`
- `imageUpload.jpg`, `imageURL.jpg`
- `type.jpg`, `synth.jpg`, `metronome.jpg`
- `timer.png`, `program.jpg`

**Musical Notation:**
- `AMajor.png`
- `music-example.jpg`, `notation-3.jpg`
- `notation_example.png`, `notation-chemical.png`
- `half_note.jpg`

**Roles:**
- `conductor.gif` (animated)
- `lead.gif`

**Diagrams:**
- `network.jpg`
- `interface.png`, `interfaces.png`
- `team.png`
- `brain.jpg`, `brainphones.jpg`, `mtbrain.png`

**Controls:**
- `go.png`, `pause.png`, `stop.jpg`, `record.png`
- `up.png`, `arrows.jpg`
- `repeat.jpg`, `random.jpg`/`random.png`

**Miscellaneous:**
- `Goethehaeuschen.jpg` (Goethe's summer house)
- `Wanderers.jpg` (Schubert reference)
- Various wine bottle labels (argiano.jpg, etc.)
- `user_default.png`

---

## Database Integration

### Audio References

Audio files are stored in `swarm_content_audio`:

```sql
SELECT 
  c.name, 
  ca.file_path, 
  ca.source_type,
  ca.tts_text
FROM swarm_content c
JOIN swarm_content_audio ca ON c.id = ca.content_id
WHERE c.swarm_id = (SELECT id FROM swarms WHERE invite_code = 'TELEBRAIN')
LIMIT 5;
```

### Image References

Image files are stored in `swarm_content_images`:

```sql
SELECT 
  c.name,
  ci.file_path,
  ci.alt_text
FROM swarm_content c
JOIN swarm_content_images ci ON c.id = ci.content_id
WHERE c.swarm_id = (SELECT id FROM swarms WHERE invite_code = 'TELEBRAIN')
LIMIT 5;
```

---

## Serving Media Files

### Next.js Public Directory

Files in `public/` are served at the root URL:

```
public/snd/uploads/Beep.mp3 → http://localhost:3444/snd/uploads/Beep.mp3
public/pics/brain.jpg → http://localhost:3444/pics/brain.jpg
```

### Usage in Components

```typescript
// Audio
<audio src="/snd/uploads/Beep.mp3" />

// Image
<img src="/pics/brain.jpg" alt="Brain" />

// Next.js Image
import Image from 'next/image';
<Image src="/pics/brain.jpg" alt="Brain" width={200} height={200} />
```

---

## File Size Considerations

### Why Not Commit to Git?

- **Total Size**: ~18MB
- **Git Bloat**: Would increase repo size permanently
- **Easy to Regenerate**: Can be copied from Telebrain anytime
- **Optional**: Not required for core functionality

### Alternative Storage Options

For production, consider:

1. **S3/Cloud Storage**
   ```bash
   aws s3 sync public/snd/ s3://warmswarm/media/snd/
   ```

2. **CDN**
   - CloudFront, Cloudflare
   - Faster delivery
   - Lower server load

3. **Git LFS**
   ```bash
   git lfs track "public/snd/**/*.mp3"
   git lfs track "public/pics/**/*.{jpg,png,gif}"
   ```

---

## Adding New Media

### Upload Audio

```javascript
// API endpoint for audio upload
POST /api/content/audio
Content-Type: multipart/form-data

{
  swarmId: string,
  file: File,
  name: string
}
```

### Upload Image

```javascript
// API endpoint for image upload
POST /api/content/image
Content-Type: multipart/form-data

{
  swarmId: string,
  file: File,
  name: string,
  altText: string
}
```

---

## Maintenance

### Check Missing Files

```bash
# Find database references to missing files
docker compose exec postgres psql -U postgres -d swarms -c "
SELECT file_path 
FROM swarm_content_audio 
WHERE file_path IS NOT NULL 
  AND file_path NOT LIKE 'http%'
LIMIT 10;
" | while read path; do
  if [ ! -f "public/$path" ]; then
    echo "Missing: $path"
  fi
done
```

### Copy Script Details

The `copy_telebrain_media.sh` script:
- ✅ Creates directory structure
- ✅ Copies all referenced files
- ✅ Shows progress and statistics
- ✅ Handles missing source files gracefully

---

## Summary

| Metric | Value |
|--------|-------|
| Total Audio Files | 243 |
| Total Image Files | 90 |
| Total Size | ~18MB |
| Audio Format | MP3 |
| Image Formats | JPG, PNG, GIF, SVG |
| Storage | `public/` (excluded from git) |
| Restore Command | `bash backend/scripts/copy_telebrain_media.sh` |

---

## See Also

- `backend/scripts/copy_telebrain_media.sh` - Media copy script
- `DATABASE-SCHEMA.md` - Content tables documentation
- `TELEBRAIN-ANALYSIS.md` - Original system analysis

