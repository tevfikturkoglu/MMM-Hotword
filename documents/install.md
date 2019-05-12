# HOW TO INSTALL

## From Old version (v 1.x.x)
You need to remove your old module then re-install freshly.
```sh
cd ~/MagicMirror/modules
rm -rf MMM-Hotword
```

## Fresh Install
```sh
sudo apt update
sudo apt upgrade
sudo apt install libmagic-dev libatlas-base-dev sox libsox-fmt-all

cd ~/MagicMirror/modules
git clone https://github.com/eouia/MMM-Hotword.git
cd MMM-Hotword
npm install

chmod +x ./installer/install.sh
./installer/install.sh
```
It will take 10~30 min. Don't power off during the installation.

If you can see something with these similar on last part of installation log, Installation would be success
```sh
Rebuild Complete
electron-V3.0-linux-arm64  node-v64-linux-arm64
lib/node/index.js
```
`electron-V3.0-linux-arm64` or `node-v64-linux-arm64` may be different by your environment.
