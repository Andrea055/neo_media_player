#!/bin/sh

npm i
cd electron
npm i
cd ..
npm run build-capacitor-electron
cd electron
npm run build electron:make
cd ..