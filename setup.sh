#!/bin/bash
set -e

# Check for required system-installed programs
command -v python3 >/dev/null 2>&1 || { echo 'ERROR: Python 3 not installed' >&2; exit 1; }
command -v virtualenv>/dev/null 2>&1 || { echo 'ERROR: Python virtualenv not installed' >&2; exit 1; }

# Change to script directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
pushd $DIR

# Check for credentials file
test -d civicapi/api.secret >/dev/null 2>&1 || { echo 'ERROR: Civic API secrets file (civicapi/api.secret) not found' >&2; exit 1; }

# Set up pre-commit hooks
if [ ! -L .git/hooks/pre-commit ]; then
        echo 'Setting up pre-commit hook'
        echo '--------------------------'

        pushd .git/hooks
        ln -s $DIR/hooks/pre-commit
        popd

        echo ''
fi

# Set up the Python virtualenv
if [ ! -d civicapi/venv ]; then
        echo 'Setting up Python 3 virtualenv'
        echo '------------------------------'

        pushd civicapi
        virtualenv -p python3 venv
        source venv/bin/activate
        pip install -r requirements.txt
        deactivate
        popd

        echo ''
fi
