# Build InterventionsHub Desktop App

Run these commands on your PC after cloning from GitHub:

```bash
# 1. Install project dependencies
npm install

# 2. Install Electron + packager (one time)
npm run electron:install

# 3a. Test the desktop app locally
npm run electron:dev

# 3b. Build a Windows .exe
npm run electron:pack:win
# → output: electron-release/InterventionsHub-win32-x64/InterventionsHub.exe

# 3c. (Optional) Mac or Linux builds
npm run electron:pack:mac
npm run electron:pack:linux
```

**Important:** before running `electron:pack:*`, copy the build output into the electron folder so it gets bundled:

```bash
# After electron:build, copy the dist into electron/ so packager includes it
cp -r electron-dist electron/electron-dist
```

Or run this one-liner for Windows:

```bash
npm run electron:build && cp -r electron-dist electron/electron-dist && npx electron-packager electron InterventionsHub --platform=win32 --arch=x64 --out=electron-release --overwrite
```

Data is persisted in `localStorage` so interventions survive app restarts.
