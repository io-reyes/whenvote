from ics import Calendar, Event

class ICSWrite:
    def __init__(self, state_data):
        self.election_title = ', '.join(state_data['election_names'])
        self.election_date = '%04d%02d%02d 23:59:59' % (state_data['election_year'], state_data['election_month'], state_data['election_day']) if min(state_data['election_year'], state_data['election_month'], state_data['election_day']) > 0 else None
        self.register_date = '%04d%02d%02d 23:59:59' % (state_data['register_year'], state_data['register_month'], state_data['register_day']) if min(state_data['register_year'], state_data['register_month'], state_data['register_day']) > 0 else None
        self.absentee_date = '%04d%02d%02d 23:59:59' % (state_data['absentee_year'], state_data['absentee_month'], state_data['absentee_day']) if min(state_data['absentee_year'], state_data['absentee_month'], state_data['absentee_day']) > 0 else None
        self.calendar = Calendar()

    def _add_event(self, prefix, date):
        # Only add events with valid dates
        if(date is not None):
            e = Event()
            e.name = '%s: %s' % (prefix, self.election_title)
            e.begin = date
            e.make_all_day()

            self.calendar.events.append(e)

    def write(self, out_file):
        self.calendar.events[:] = []
        self._add_event('Election', self.election_date)
        self._add_event('Registration deadline', self.register_date)
        self._add_event('Absentee request deadline', self.absentee_date)

        with open(out_file, 'w') as fp:
            fp.writelines(self.calendar)
