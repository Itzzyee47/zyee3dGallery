# Cloudinary Setup Guide for XR Gallery

## Quick Start (5 minutes)

### 1️⃣ Create Cloudinary Account
- Visit [cloudinary.com](https://cloudinary.com)
- Click **Sign Up** (free tier gives 25GB storage)
- Create account and verify email
- You're now on the **Dashboard**

### 2️⃣ Get Your Cloud Name
On the Dashboard, find and copy your **Cloud Name** (looks like: `abc123def`)

### 3️⃣ Create Upload Preset
1. Click **Settings** (⚙️ icon, bottom left)
2. Go to **Upload** tab
3. Scroll to **Upload presets**
4. Click **Add upload preset**
5. Configure:
   - **Preset name**: `gallery_unsigned`
   - **Unsigned**: Toggle `ON` ✅
   - **Folder**: `xr-gallery/images` (optional)
6. Click **Save**

### 4️⃣ Create `.env.local` File
In your project root, create a `.env.local` file:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
VITE_CLOUDINARY_UPLOAD_PRESET=gallery_unsigned
```

Replace `your_cloud_name_here` with your actual cloud name.

### 5️⃣ Start Using It
```bash
# Make sure dev server is running
npm run dev

# Visit http://localhost:5173/gallery
# Press P to place images (they'll upload to Cloudinary)
```

---

## How It Works

```
User presses P
    ↓
Opens image picker
    ↓
Selects image from computer
    ↓
Uploads to Cloudinary (browser-side, no server needed)
    ↓
Gets secure URL from Cloudinary
    ↓
Stores URL + metadata in IndexedDB (local)
    ↓
Renders image as 3D plane in gallery
```

### Storage Architecture:
- **Images**: Cloudinary CDN (global, fast, backed up)
- **Metadata** (position, rotation, etc): IndexedDB (local, fast)
- **Synced**: Via Cloudinary Public ID + metadata

---

## Key Differences from IndexedDB-Only

| Aspect | IndexedDB Only | Cloudinary |
|--------|---|---|
| Image Storage | Device only (0-500MB limit) | Cloud (25GB+ free) |
| Multi-Device | ❌ Not synced | ✅ URLs work everywhere |
| Backup | ❌ No backup | ✅ Automatic |
| Performance | Fast local | Fast global CDN |
| File Size | Limited by browser | Unlimited |

---

## Environment Variables Explained

### `VITE_CLOUDINARY_CLOUD_NAME`
- Your unique Cloudinary identifier
- Found on dashboa​rd
- Example: `nzenze-dev`

### `VITE_CLOUDINARY_UPLOAD_PRESET`
- Uploaded presets allow uploads WITHOUT exposing API secret
- Must have `Unsigned: ON`
- Never use the API Secret in browser code

---

## Troubleshooting

### "Cloudinary credentials missing"
→ Make sure `.env.local` exists with correct variable names (check spelling!)

### "Upload failed"
→ Check browser console for error details
→ Verify upload preset exists and is set to "Unsigned: ON"

### Images not showing
→ Check Cloudinary console to see if upload succeeded
→ Try hard refresh (Ctrl+Shift+R) in browser

### CORS error
→ This shouldn't happen with unsigned presets
→ Check that cloud name matches exactly

---

## File Structure After Setup

```
project/
├── .env.local ✨ (CREATE THIS - has your credentials)
├── .env.local.example (reference file)
├── src/
│   └── components/
│       ├── Gallery.jsx (updated to use Cloudinary)
│       ├── cloudinaryStore.js ✨ (new storage module)
│       ├── GalleryImagePlane.jsx (updated)
│       ├── ImageSelectMenu.jsx (updated)
│       └── galleryImageStore.js (kept for reference, not used)
└── ...
```

---

## Deploying to Production

When deploying (Vercel, Netlify, etc):

1. Add environment variables in your hosting dashboard:
   - `VITE_CLOUDINARY_CLOUD_NAME`
   - `VITE_CLOUDINARY_UPLOAD_PRESET`

2. Deploy normally - Cloudinary will work automatically

3. **DO NOT** add `.env.local` to git - it's in `.gitignore`

---

## Advanced: Deleting Images from Cloudinary

If you want to delete images from Cloudinary, you'd need a backend endpoint:

```javascript
// This would require server-side code with API_SECRET
// For now, deletion only removes from IndexedDB metadata
// Images remain in Cloudinary (harmless, takes up quota)
```

Contact support if you need to bulk delete old images.

---

## Support

- **Cloudinary Docs**: https://cloudinary.com/documentation
- **Upload API**: https://cloudinary.com/documentation/image_upload_api_reference
- **Video Guide**: Search YouTube for "Cloudinary React upload"

Enjoy your cloud-powered 3D gallery! 🚀
