#!/bin/bash
set -e
git add . && git commit -m "update" && git push
npm run publish && git push
