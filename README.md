# whenvote
Single-purpose site that detects visitors' states and shows upcoming elections
and registration deadlines.

Mock-up available at https://when.vote

## FAQ

### Why make this site?

To help people become more aware of elections during non-presidential years.
Statewide elections, especially for state legislature and executive positions,
don't get a lot of coverage.

### Why don't most of the states have election data?

I'm still looking for a good data source for election dates and registration
deadlines. This is surprisingly hard to find, as states do their own thing.
If I can't find such a data source, I'll have to write scrapers to get this
data from each state's Secretary of State website.

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

State-level IP geolocation by [link](https://freegeoip.net "freegeoip.net")
Site icon "voting" licensed under Creative Commons, credit to [link](https://thenounproject.com/Luis/ "Luis Prado")

