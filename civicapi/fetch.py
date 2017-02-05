from civicapi import CivicAPI
from icswrite import ICSWrite
from feedwrite import FeedWrite

from datetime import datetime

import argparse
import json
import os

def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument('secret', help='text file containing only the secret Civic API token')
    parser.add_argument('output', help='path and filename of the output JSON file, will overwrite existing file if values are different')
    parser.add_argument('--force', help='bypass update validity checks and force files to be written', action='store_true')

    return parser.parse_args()

def is_valid_update(data_old, data_new):
    data_old_exists = data_old is not None and len(data_old) > 0
    data_new_exists = data_new is not None and len(data_new) > 0

    if data_old_exists and data_new_exists and data_old != data_new:
        current = datetime.now()
        old_upcoming = {state:data for state,data in data_old.items() if data['election_year'] >= current.year and data['election_month'] >= current.month and data['election_day'] >= current.day}
        old_upcoming_names = []
        for state,data in old_upcoming.items():
            old_upcoming_names.extend(data['election_names'])

        # All upcoming elections from the old data file must be present in the new one
        new_upcoming_names = []
        for state,data in data_new.items():
            new_upcoming_names.extend(data['election_names'])

        return set(old_upcoming_names) <= set(new_upcoming_names)

    return data_new_exists and not data_old_exists

def write_data(data, out_file, force=False):
    """Write the election JSON file and accompanying ICS
    files if data differs from previously written. Nothing
    written if the same

    Positional arguments:
    data -- dictionary of state elections to be written to JSON
    out_file -- path and filename of output JSON file; ICS files 
                will be written to a cal/ subfolder accompanying this

    Keyword arguments:
    force -- set to True to force files to be written
    """
    out_file = os.path.abspath(out_file)
    out_folder = os.path.dirname(out_file)
    out_cal_folder = os.path.join(out_folder, 'cal')
    out_feeds_folder = os.path.join(out_folder, 'feed')

    # Read in any old data
    old_data = None
    if os.path.isfile(out_file):
        with open(out_file, 'r') as f:
            old_data = json.load(f)

    if(force or is_valid_update(old_data, data)):
        # Write the JSON file
        with open(out_file, 'w') as fp:
            json.dump(data, fp, indent=4)

        # Write the ICS and feed files
        if(not os.path.exists(out_cal_folder)):
            os.makedirs(out_cal_folder)
        if(not os.path.exists(out_feeds_folder)):
            os.makedirs(out_feeds_folder)
        for state,state_data in data.items():
            icsdata = ICSWrite(state_data)
            icsdata.write(os.path.join(out_cal_folder, state + '.ics'))

            old_state_data = old_data[state] if old_data is not None and state in old_data else None
            feeddata = FeedWrite(state_data, old_state_data)
            feeddata.write(state, os.path.join(out_feeds_folder, state + '.atom'), force=force)

        print('Update OK')

if __name__ == '__main__':
    # Get arguments
    args = parse_args()
    secret_file = args.secret
    force_write = args.force
    out_file = os.path.abspath(args.output)

    # Read the API secret and get election data
    secret = None
    with open(secret_file, 'r') as f:
        secret = f.readline().strip()
    api = CivicAPI(secret)
    data = api.get_upcoming_elections()

    # Write out the data
    write_data(data, out_file, force=force_write)
