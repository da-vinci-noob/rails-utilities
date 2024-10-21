#!/usr/bin/sh

./bin/setup
yarn install
gem install foreman
export PORT=3000

# foreman start -f Procfile.dev
