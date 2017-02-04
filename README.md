# when.vote
Single-purpose site that detects visitors' states and shows upcoming elections
and registration deadlines.

Visit https://when.vote

## FAQ

### Why make this site?

I want to make it easier to find out about and participate in elections during
non-presidential years. Statewide elections, especially for state legislature
and executive positions, don't get a lot of coverage. These elections are often
scheduled on unexpected days (i.e., not necessarily on a Tuesday in November on
even-numbered years), and government websites don't always make it easy to find
this information. when.vote does exactly what it says on in the tin: when you
should vote next.

### Why doesn't my state have election data?

States schedule their elections largely independently of one another, so State X might
have dates finalized already but State Z is still planning (those State Z officials are
so corrupt and lazy!). The
[Civic Data API](https://www.usvotefoundation.org/Civic-Data-API) I use to
get scheduling data is updated as soon as that information is available, and
I push any changes to my site every 24 hours. Check back regularly to find
out when your next election is.

### Why not have local elections too?

Detecting states from IP addresses is easy, but getting users' municipalities 
requires fine-level geolocation from GPS or Wi-Fi router mapping. That's more 
work than it's worth right now.

### Why didn't the site correctly detect my state?

It could be one of two reasons. The first is that you're blocking ads in your
browser. Although the site has no ads or trackers at all, it does use freegeoip.net
to determine visitors' states, which is on many adblockers' lists. The other
reason is that you're browsing the site on a mobile connection. Mobile IP addresses
can be registered in unexpected places.

### Are you collecting any data from visitors?

No data is stored about visitors. I'm not even using any analytics at all. I'm
not interested in who's using this site or where they're from. This is mostly 
static web assets to maximize reliability and minimize hosting requirements.

### Can you send out email/text reminders as elections and deadlines come up?

I thought about doing this, but decided against it because that would have required me
to maintain and secure 51 subscription lists (for the 50 states + DC). I don't want to
be liable for any data breaches, so I'm abstaining from gathering any user data at
all.

In lieu of email/text reminders, when.vote generates ICS calendar files that you
can import into popular calendar platforms like Google Calendar, Apple Calendar
(formerly iCal), and Microsoft Outlook.

## Credits

Civic Data provided by [U.S. Vote Foundation](https://www.usvotefoundation.org/Civic-Data-API)

State-level IP geolocation by [freegeoip.net](https://freegeoip.net)

Site icon "voting booth" by [Alv Jorgen Bovolden](https://thenounproject.com/Alvbovo/) from the Noun Project

This site uses [jQuery](https://jquery.com)

The Civic API data retrieval script use the [Requests](http://docs.python-requests.org/en/master/)
and [Ics.py](https://icspy.readthedocs.io/en/v0.3/) modules for Python 3

