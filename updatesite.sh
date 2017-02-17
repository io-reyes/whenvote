#!/bin/bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
pushd $DIR

git pull

source civicapi/venv/bin/activate
pip install -r civicapi/requirements.txt
SCRIPT_OUT=$(python civicapi/fetch.py civicapi/api.secret static/data.json)

if [ "$SCRIPT_OUT" == "Update OK" ]; then
    git commit -a -m "Auto-update on $(date)"
    git push

    pushd firebase
    rsync -az --delete ../static/ public/
    firebase deploy
    popd
fi
