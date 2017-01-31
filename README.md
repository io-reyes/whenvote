# when.vote
Single-purpose site that detects visitors' states and shows upcoming elections
and registration deadlines.

Deployed at https://when.vote

## FAQ

### Why make this site?

To help people become more aware of elections during non-presidential years.
Statewide elections, especially for state legislature and executive positions,
don't get a lot of coverage.

### Why doesn't my state have election data?

States organize their elections independently of one another, so state X might
have dates set already but state Y is still working on it. The
[Civic Data API](https://www.usvotefoundation.org/Civic-Data-API) I use to
get this scheduling data is updated as soon as that information is available,
so check back regularly to find out when your next election is.

### Why not have local elections too?

That's for future work. Detecting states from IP addresses is easy. Detecting
users' congressional districts (federal and state) requires fine-level
geolocation from GPS or Wi-Fi router mapping. That's more complicated than it's
worth right now.

### Why didn't the site correctly detect my state?

It could be one of two reasons. The first is that you're blocking ads in your
browser. Although the site has no ads or trackers at all, it does use freegeoip.net
to determine visitors' states, which is on many adblockers' lists. The other
reason is that you're browsing the site on a mobile connection. Mobile IP addresses
are registered in strange places.

### Are you collecting any data from visitors?

No data is stored about visitors. I'm not even using any analytics at all. I'm
not interested in who's using this site or where they're from. This is mostly 
static web assets to maximize reliability and minimize hosting requirements.

## Credits

Civic Data provided by [U.S. Vote Foundation](https://www.usvotefoundation.org/Civic-Data-API)

State-level IP geolocation by [freegeoip.net](https://freegeoip.net)

Site icon "voting booth" by [Alv Jorgen Bovolden](https://thenounproject.com/Alvbovo/) from the Noun Project

This site uses [jQuery](https://jquery.com)
