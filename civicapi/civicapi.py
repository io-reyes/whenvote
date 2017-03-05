import requests
from datetime import datetime,timezone

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
        
    def _level_filter(self, level_name):
        """Accept state and federal elections"""
        lower_level = level_name.lower()
        return lower_level.startswith('state') or lower_level.startswith('federal')

    def _request_level_mapping(self):
        """Get the mapping of election levels to level IDs"""
        if(self._level_mapping != None):
            return self._level_mapping
        else:
            levels = self._request_all('election_levels')
            if(len(levels) > 0):
                self._level_mapping =  {x['name']:x['id'] for x in levels if self._level_filter(x['name'])}
                return self._level_mapping
            else:
                return {}

    def _has_date_passed(self, api_date):
        """Returns true if the date (in the API's YYYY-MM-DD format) is in the past"""
        now = datetime.now(timezone.utc)
        now_date_string = '%04d-%02d-%02d' % (now.year, now.month, now.day)

        return api_date < now_date_string

    def _request_elections(self):
        """Get all elections in the levels specified by the mapping"""
        level_mapping = self._request_level_mapping()

        elections = []
        for name,levid in level_mapping.items():
            elections_in_level = [x for x in self._request_all('elections', params={'election_level_id':levid}) if not self._has_date_passed(x['election_date'])]
            elections.extend(elections_in_level)

        return elections

    def _request_upcoming_elections(self):
        """For each state, return only the most immediate upcoming elections"""
        elections = self._request_elections()

        upcoming_elections = []
        states = set([x['state']['name'] for x in elections])
        for state in states:
            state_elections = [x for x in elections if x['state']['name'] == state]
            upcoming_date = min([x['election_date'] for x in state_elections])
            upcoming_elections.extend([x for x in state_elections if x['election_date'] == upcoming_date])

        return upcoming_elections

    def _date_split(self, api_date):
        """Splits the API's YYYY-MM-DD date format into a dict with integer year, month, and day entries"""
        components = api_date.split('-')

        if(len(components) == 3):
            return {'year':int(components[0]), 'month':int(components[1]), 'day':int(components[2])}
        else:
            return {'year':-1, 'month':-1, 'day':-1}


    def _get_deadlines(self, state_elections):
        all_deadlines = []
        for election in state_elections:
            all_deadlines.extend(election['dates'])

        upcoming_deadlines = [x for x in all_deadlines if x['date'] is not None and not self._has_date_passed(x['date'])]
        registration_deadlines = [x['date'] for x in upcoming_deadlines if x['kind'] == 'DRD']
        absentee_deadlines = [x['date'] for x in upcoming_deadlines if x['kind'] == 'DBRD']

        registration_deadline = self._date_split(min(registration_deadlines)) if len(registration_deadlines) > 0 else self._date_split('')
        absentee_deadline = self._date_split(min(absentee_deadlines)) if len(absentee_deadlines) > 0 else self._date_split('')

        return (registration_deadline, absentee_deadline)


    def get_upcoming_elections(self):
        """For each state with an upcoming election, return only the data
        that will be shown on the site:
        > State
        > Election date
        > Election name(s)
        > First upcoming domestic registration deadline
        > First upcoming domestic absentee request deadline, if any
        """
        raw_upcoming_elections = self._request_upcoming_elections()
        state_abbrevs = set([x['state']['short_name'] for x in raw_upcoming_elections])
        
        website_elections = {}
        for state in state_abbrevs:
            state_elections = [x for x in raw_upcoming_elections if x['state']['short_name'] == state]

            election_date = self._date_split(state_elections[0]['election_date'])
            election_names = [x['title'] for x in state_elections]
            register_by, absentee_by = self._get_deadlines(state_elections)

            state_data = {}
            state_data['election_year'] = election_date['year']
            state_data['election_month'] = election_date['month']
            state_data['election_day'] = election_date['day']
            state_data['election_names'] = election_names
            state_data['register_year'] = register_by['year']
            state_data['register_month'] = register_by['month']
            state_data['register_day'] = register_by['day']
            state_data['absentee_year'] = absentee_by['year']
            state_data['absentee_month'] = absentee_by['month']
            state_data['absentee_day'] = absentee_by['day']

            website_elections[state] = state_data

        return website_elections
