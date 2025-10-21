#!/bin/bash
# Copy media files from Telebrain to WarmSwarm

set -e

# Paths
TELEBRAIN_DIR="/home/kgalvin/CascadeProjects/telebrain-master/public"
WARMSWARM_PUBLIC_DIR="public"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Telebrain Media Copy Tool               ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

if [ ! -d "${TELEBRAIN_DIR}" ]; then
    echo -e "${YELLOW}⚠️  Telebrain directory not found: ${TELEBRAIN_DIR}${NC}"
    echo "Update TELEBRAIN_DIR in this script if it's in a different location"
    exit 1
fi

# Create public directory structure
echo -e "${BLUE}📁 Creating directory structure...${NC}"
mkdir -p "${WARMSWARM_PUBLIC_DIR}/snd/uploads"
mkdir -p "${WARMSWARM_PUBLIC_DIR}/snd/ttsdb"
mkdir -p "${WARMSWARM_PUBLIC_DIR}/snd/ttsaudio"
mkdir -p "${WARMSWARM_PUBLIC_DIR}/snd/urls"
mkdir -p "${WARMSWARM_PUBLIC_DIR}/snd/phrases"
mkdir -p "${WARMSWARM_PUBLIC_DIR}/pics"

# Copy audio files
echo -e "${BLUE}🎵 Copying audio files...${NC}"

echo "  - Uploaded audio files..."
if [ -d "${TELEBRAIN_DIR}/snd/uploads" ]; then
    cp -v "${TELEBRAIN_DIR}/snd/uploads"/*.mp3 "${WARMSWARM_PUBLIC_DIR}/snd/uploads/" 2>/dev/null || true
    UPLOAD_COUNT=$(ls -1 "${WARMSWARM_PUBLIC_DIR}/snd/uploads"/*.mp3 2>/dev/null | wc -l)
    echo -e "${GREEN}    ✅ Copied ${UPLOAD_COUNT} uploaded audio files${NC}"
fi

echo "  - Text-to-speech audio..."
if [ -d "${TELEBRAIN_DIR}/snd/ttsdb" ]; then
    cp -v "${TELEBRAIN_DIR}/snd/ttsdb"/*.mp3 "${WARMSWARM_PUBLIC_DIR}/snd/ttsdb/" 2>/dev/null || true
    TTS_COUNT=$(ls -1 "${WARMSWARM_PUBLIC_DIR}/snd/ttsdb"/*.mp3 2>/dev/null | wc -l)
    echo -e "${GREEN}    ✅ Copied ${TTS_COUNT} TTS audio files${NC}"
fi

echo "  - URL audio files..."
if [ -d "${TELEBRAIN_DIR}/snd/urls" ]; then
    cp -v "${TELEBRAIN_DIR}/snd/urls"/*.mp3 "${WARMSWARM_PUBLIC_DIR}/snd/urls/" 2>/dev/null || true
    URL_COUNT=$(ls -1 "${WARMSWARM_PUBLIC_DIR}/snd/urls"/*.mp3 2>/dev/null | wc -l)
    echo -e "${GREEN}    ✅ Copied ${URL_COUNT} URL audio files${NC}"
fi

# Copy images
echo -e "${BLUE}🖼️  Copying image files...${NC}"

if [ -d "${TELEBRAIN_DIR}/pics" ]; then
    cp -v "${TELEBRAIN_DIR}/pics"/*.{jpg,jpeg,png,gif,svg} "${WARMSWARM_PUBLIC_DIR}/pics/" 2>/dev/null || true
    IMAGE_COUNT=$(ls -1 "${WARMSWARM_PUBLIC_DIR}/pics" 2>/dev/null | wc -l)
    echo -e "${GREEN}✅ Copied ${IMAGE_COUNT} image files${NC}"
fi

# Show disk usage
echo ""
echo -e "${BLUE}💾 Disk Usage:${NC}"
du -sh "${WARMSWARM_PUBLIC_DIR}/snd" 2>/dev/null || echo "  snd/: 0"
du -sh "${WARMSWARM_PUBLIC_DIR}/pics" 2>/dev/null || echo "  pics/: 0"

echo ""
echo -e "${GREEN}🎉 Media copy complete!${NC}"
echo ""
echo "Files are now available at:"
echo "  - Audio: ${WARMSWARM_PUBLIC_DIR}/snd/"
echo "  - Images: ${WARMSWARM_PUBLIC_DIR}/pics/"

