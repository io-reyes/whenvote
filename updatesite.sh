#!/bin/bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
pushd $DIR

git pull

source civicapi/venv/bin/activate
SCRIPT_OUT=$(python civicapi/fetch.py civicapi/api.secret static/data.json)

if [ "$SCRIPT_OUT" == "Update OK" ]; then
    git commit -a -m "Auto-update on $(date)"
    git push
fi
