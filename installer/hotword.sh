#!/bin/bash

#--------------
# Hotword utils
#  Bugsounet
# v1.0.0
#--------------

Hotword_CloneSB() {
 cd ..
 Installer_info "Cloning Snowboy from Github..."
 git clone https://github.com/Kitt-AI/snowboy.git
 cd snowboy
 rm -rf .git
 Installer_info "Copying Snowboy models..."
 cp -r resources/models ..
npm install -y nan node-pre-gyp
./node_modules/node-pre-gyp/bin/node-pre-gyp clean configure build
npm install -y
npm install -y electron-rebuild
./node_modules/.bin/electron-rebuild
ls ~/MagicMirror/modules/MMM-Hotword/snowboy/lib/node/binding/Release
ls ~/MagicMirror/modules/MMM-Hotword/snowboy/lib/node/index.js
}
