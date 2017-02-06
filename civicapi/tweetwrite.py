import tweepy
import time

class TweetWrite:
    def __init__(self, secrets):
        auth = tweepy.OAuthHandler(secrets['tw_consumer_key'], secrets['tw_consumer_secret'])
        auth.set_access_token(secrets['tw_access_token'], secrets['tw_access_secret'])

        self.api = tweepy.API(auth)

    def tweet_update(self, state, state_data, old_state_data):
        # Tweet any elections that weren't in the old data
        current_elections = set(state_data['election_names'])
        old_elections = set(old_state_data['election_names']) if old_state_data is not None else set([])
        to_tweet = current_elections - old_elections

        for election in to_tweet:
            tweet = 'Upcoming election: %s. Visit https://when.vote/?%s for more information' % (election.upper(), state)
            if(len(tweet) > 140):
                tweet = 'Upcoming election in %s. Visit https://when.vote/?%s for more information. (Election name too long for Twitter)' % state

            # Post tweet and wait 5 seconds until the next one
            try:
                self.api.update_status(status=tweet)
                time.sleep(5)
            except tweepy.error.TweepError:
                # TODO ignoring failed Tweets for now
                continue

