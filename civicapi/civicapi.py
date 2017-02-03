import requests
from datetime import datetime

class CivicAPI:
    def __init__(self, token):
        self._url = 'https://localelections.usvotefoundation.org/api/v1/'
        self._level_mapping = None
        self._headers = {'Authorization':'Token %s' % token}

    def _request_all(self, method, params={}):
        """Continually make requests against a method until no further data is available.

        Positional arguments:
        method -- Civic Data API method, per https://localelections.usvotefoundation.org/api/docs

        Keyword arguments:
        params -- dictionary of parameter names and values
        """
        url = self._url + method
        params['limit'] = 100

        page = 0
        data = []
        while(True):
            params['offset'] = params['limit'] * page
            r = requests.get(url, headers=self._headers, params=params)

            payload = dict(r.json())
            objects = payload['objects']

            if(len(objects) > 0):
                data.extend(objects)
                page += 1
            else:
                break

        return data
        

    def _request_level_mapping(self):
        """Get the mapping of state and federal election levels to level IDs"""
        if(self._level_mapping != None):
            return self._level_mapping
        else:
            levels = self._request_all('election_levels')
            if(len(levels) > 0):
                self._level_mapping =  {x['name']:x['id'] for x in levels if x['name'].startswith('State') or x['name'].startswith('Federal')}
                return self._level_mapping
            else:
                return {}

    def _request_elections(self):
        """Get all elections in the levels specified by the mapping"""
        level_mapping = self._request_level_mapping()

        # Use this to filter out all resulting elections that have already happened
        now = datetime.now()
        now_date_string = '%04d-%02d-%02d' % (now.year, now.month, now.day)

        elections = []
        for name,levid in level_mapping.items():
            elections_in_level = [x for x in self._request_all('elections', params={'election_level_id':levid}) if x['election_date'] >= now_date_string]
            elections.extend(elections_in_level)

        return elections

    def get_upcoming_elections(self):
        """For each state, return only the most immediate upcoming elections"""
        elections = self._request_elections()

        upcoming_elections = []
        states = set([x['state']['name'] for x in elections])
        for state in states:
            state_elections = [x for x in elections if x['state']['name'] == state]
            upcoming_date = min([x['election_date'] for x in state_elections])
            upcoming_elections.extend([x for x in state_elections if x['election_date'] == upcoming_date])

        return upcoming_elections

