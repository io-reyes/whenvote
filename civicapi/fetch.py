from civicapi import CivicAPI
import argparse

def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument('secret', help='text file containing only the secret Civic API token')

    return parser.parse_args()

if __name__ == '__main__':
    args = parse_args()
    secret_file = args.secret

    secret = None
    with open(secret_file, 'r') as f:
        secret = f.readline().strip()

    api = CivicAPI(secret)
    data = api.get_upcoming_elections()

    for election in data:
        print('%s : %s' % (election['title'], election['election_date']))
