import requests

class CivicAPI:
    def __init__(self, token):
        self._url = 'https://localelections.usvotefoundation.org/api/v1/elections'
        self._headers = {'Authorization':'Token %s' % token,'Accept':'application/json; indent=4'}

    def getElectionsAndDeadlines(self):
        r = requests.get(self._url, self._headers)
        return r
