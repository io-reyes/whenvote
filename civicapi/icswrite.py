from ics import Calendar, Event
from datetime import datetime

class ICSWrite:
    def __init__(self, state_data):
        self.election_title = ', '.join(state_data['election_names'])
        self.election_date = datetime(year=state_data['election_year'], month=state_data['election_month'], day=state_data['election_day'], hour=7) if min(state_data['election_year'], state_data['election_month'], state_data['election_day']) > 0 else None
        self.register_date = datetime(year=state_data['register_year'], month=state_data['register_month'], day=state_data['register_day'], hour=7) if min(state_data['register_year'], state_data['register_month'], state_data['register_day']) > 0 else None
        self.absentee_date = datetime(year=state_data['absentee_year'], month=state_data['absentee_month'], day=state_data['absentee_day'], hour=7) if min(state_data['absentee_year'], state_data['absentee_month'], state_data['absentee_day']) > 0 else None
        self.calendar = Calendar()

    def _add_event(self, prefix, date):
        # Only add events with valid dates
        if(date is not None):
            e = Event()
            e.name = '%s: %s' % (prefix, self.election_title)
            e.begin = date
            e.duration = {'hours': 12}

            self.calendar.events.append(e)

    def write(self, out_file):
        self.calendar.events[:] = []
        self._add_event('Election', self.election_date)
        self._add_event('Registration deadline', self.register_date)
        self._add_event('Absentee request deadline', self.absentee_date)

        # Remove timezone info from DTSTART lines
        calendar_lines = []
        for line in self.calendar:
            line = line.strip()
            processed = line.rstrip('Z') if line.startswith('DTSTART:') else line
            calendar_lines.append(processed + '\n')

        with open(out_file, 'w') as fp:
            fp.writelines(calendar_lines)
