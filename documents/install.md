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

If you can see something with these similar on last part of installation log, Installation would be success
```sh

```
