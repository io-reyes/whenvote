#!/bin/bash
set -e

# Check for required system-installed programs
command -v python3 >/dev/null 2>&1 || { echo 'ERROR: python3 not available' >&2; exit 1; }
command -v virtualenv>/dev/null 2>&1 || { echo 'ERROR: virtualenv not available' >&2; exit 1; }
command -v firebase>/dev/null 2>&1 || { echo 'ERROR: firebase not available' >&2; exit 1; }

# Change to script directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
pushd $DIR

# Check for Git info and the required credentials
git config user.name >/dev/null 2>&1 || { echo 'ERROR: Git user.name must be set' >&2; exit 1; }
git config user.email >/dev/null 2>&1 || { echo 'ERROR: Git user.email must be set' >&2; exit 1; }

test -f civicapi/api.secret >/dev/null 2>&1 || { echo 'ERROR: Civic API secrets file (civicapi/api.secret) not found' >&2; exit 1; }
test $# -eq 1 >/dev/null 2>&1 || { echo 'ERROR: Firebase token must be passed as a parameter to this script' >&2; exit 1; }
export FIREBASE_TOKEN="$1"

# Set up pre-push hooks
if [ ! -L .git/hooks/pre-push ]; then
        echo 'Setting up pre-push hook'
        echo '------------------------'

        pushd .git/hooks
        ln -s $DIR/hooks/pre-push
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

# Set up the firebase folder
if [ ! -d firebase ]; then
        mkdir firebase

        pushd firebase
        firebase init
        popd
fi

# Set up the cronjob wrapper
WRAPPER_FILE=$DIR/cronjob.sh
echo 'Setting up cronjob wrapper'
echo '--------------------------'


echo '#!/bin/bash' > $WRAPPER_FILE
echo '' >> $WRAPPER_FILE
echo "FIREBASE_TOKEN='$FIREBASE_TOKEN' $DIR/updatesite.sh" >> $WRAPPER_FILE
echo '' >> $WRAPPER_FILE

echo "NOTE: Please add $WRAPPER_FILE to cron in order to schedule automatic site updates"

# Remove the token from the environment
export FIREBASE_TOKEN=''
