from feedgen.feed import FeedGenerator
from datetime import datetime, timezone

class FeedWrite:
    def __init__(self, state_data, old_state_data=None):
        self.election_title = ', '.join(state_data['election_names'])
        self.old_election_title = ', '.join(old_state_data['election_names']) if old_state_data is not None else None

    def _make_feed(self, state):
            fg = FeedGenerator()

            fg.id(state)
            fg.title('%s\'s next election' % state)
            fg.link(href='https://when.vote/?' + state, rel='alternate')
            fg.link(href='https://when.vote/feed/%s.atom' % state, rel='self')
            fg.language('en')

            return fg

    def write(self, state, out_file, force=False):
        # Only allow feeds to be written if it's a new election
        if force or self.election_title != self.old_election_title:
            fg = self._make_feed(state)
            url = 'https://when.vote/?' + state

            fe = fg.add_entry()
            fe.id('%s-election' % state)
            fe.title('New %s election: %s' % (state, self.election_title))
            fe.link(href=url, rel='alternate')
            fe.content(content='Visit %s to see election date and registration deadlines' % url)
            fe.published(datetime.now(timezone.utc))

            fg.atom_file(out_file, pretty=True)
