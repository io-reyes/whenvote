from civicapi import CivicAPI
from jsoncompare import jsoncompare

import argparse
import json
import os

def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument('secret', help='text file containing only the secret Civic API token')
    parser.add_argument('output', help='path and filename of the output JSON file, will overwrite existing file if values are different')

    return parser.parse_args()

if __name__ == '__main__':
    # Get arguments
    args = parse_args()
    secret_file = args.secret
    out_file = os.path.abspath(args.output)

    # Read in any existing data
    current_data = None
    if os.path.isfile(out_file):
        with open(out_file, 'r') as fp:
            current_data = json.load(fp)

    # Read the API secret
    secret = None
    with open(secret_file, 'r') as f:
        secret = f.readline().strip()

    # Get election data
    api = CivicAPI(secret)
    data = api.get_upcoming_elections()

    # Write election data if it's changed
    if(current_data != data):
        with open(out_file, 'w') as fp:
            json.dump(data, fp, indent=4)
            print('Civic Data updated')
