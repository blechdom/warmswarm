# Favicon Setup Guide

## Quick Summary

Use an online favicon generator like:
- https://realfavicongenerator.net/
- https://www.favicon-generator.org/
- https://favicon.io/

Upload: `/public/warmswarm-logo-transparent.png`

## Files You Need to Generate

Place all generated files in `/home/kgalvin/CascadeProjects/warmswarm/public/`

### Required Files:
- `favicon.ico` - Classic favicon (16x16, 32x32, 48x48 multi-size)
- `favicon-16x16.png` - Small browser tab icon
- `favicon-32x32.png` - Standard browser tab icon
- `favicon-96x96.png` - Larger displays
- `apple-touch-icon.png` - 180x180 (iOS home screen)
- `android-chrome-192x192.png` - Android home screen
- `android-chrome-512x512.png` - Android splash screen

## What's Already Set Up

✅ `layout.tsx` - Updated with icon references  
✅ `manifest.json` - PWA configuration created  

## After Generating Icons

1. Download all the icon files from the generator
2. Copy them to `/home/kgalvin/CascadeProjects/warmswarm/public/`
3. That's it! Your app will automatically use them

## Testing

- **Browser Tab**: Should show your logo immediately after placing files
- **iOS**: Add to home screen and check icon
- **Android**: Add to home screen and check icon
- **PWA**: Install as app and check icon

## Current Source

Source image: `public/warmswarm-logo-transparent.png` (752 x 785, PNG with transparency)

