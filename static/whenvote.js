$(document).ready(function() {
    // State names <--> abbreviations lookup
    var stateAbbrevs = {
        "AL":"Alabama",
        "AK":"Alaska",
        "AZ":"Arizona",
        "AR":"Arkansas",
        "CA":"California",
        "CO":"Colorado",
        "CT":"Connecticut",
        "DE":"Delaware",
        "DC":"District of Columbia",
        "FL":"Florida",
        "GA":"Georgia",
        "HI":"Hawaii",
        "ID":"Idaho",
        "IL":"Illinois",
        "IN":"Indiana",
        "IA":"Iowa",
        "KS":"Kansas",
        "KY":"Kentucky",
        "LA":"Louisiana",
        "ME":"Maine",
        "MT":"Montana",
        "NE":"Nebraska",
        "NV":"Nevada",
        "NH":"New Hampshire",
        "NJ":"New Jersey",
        "NM":"New Mexico",
        "NY":"New York",
        "NC":"North Carolina",
        "ND":"North Dakota",
        "OH":"Ohio",
        "OK":"Oklahoma",
        "OR":"Oregon",
        "MD":"Maryland",
        "MA":"Massachusetts",
        "MI":"Michigan",
        "MN":"Minnesota",
        "MS":"Mississippi",
        "MO":"Missouri",
        "PA":"Pennsylvania",
        "RI":"Rhode Island",
        "SC":"South Carolina",
        "SD":"South Dakota",
        "TN":"Tennessee",
        "TX":"Texas",
        "UT":"Utah",
        "VT":"Vermont",
        "VA":"Virginia",
        "WA":"Washington",
        "WV":"West Virginia",
        "WI":"Wisconsin",
        "WY":"Wyoming",
        "Alabama":"AL",
        "Alaska":"AK",
        "Arizona":"AZ",
        "Arkansas":"AR",
        "California":"CA",
        "Colorado":"CO",
        "Connecticut":"CT",
        "Delaware":"DE",
        "District of Columbia":"DC",
        "Florida":"FL",
        "Georgia":"GA",
        "Hawaii":"HI",
        "Idaho":"ID",
        "Illinois":"IL",
        "Indiana":"IN",
        "Iowa":"IA",
        "Kansas":"KS",
        "Kentucky":"KY",
        "Louisiana":"LA",
        "Maine":"ME",
        "Montana":"MT",
        "Nebraska":"NE",
        "Nevada":"NV",
        "New Hampshire":"NH",
        "New Jersey":"NJ",
        "New Mexico":"NM",
        "New York":"NY",
        "North Carolina":"NC",
        "North Dakota":"ND",
        "Ohio":"OH",
        "Oklahoma":"OK",
        "Oregon":"OR",
        "Maryland":"MD",
        "Massachusetts":"MA",
        "Michigan":"MI",
        "Minnesota":"MN",
        "Mississippi":"MS",
        "Missouri":"MO",
        "Pennsylvania":"PA",
        "Rhode Island":"RI",
        "South Carolina":"SC",
        "South Dakota":"SD",
        "Tennessee":"TN",
        "Texas":"TX",
        "Utah":"UT",
        "Vermont":"VT",
        "Virginia":"VA",
        "Washington":"WA",
        "West Virginia":"WV",
        "Wisconsin":"WI",
        "Wyoming":"WY"
    };

    // Hide the "election data" div and show the "no data" div
    function hideElectionData() {
        $('#electionData').addClass('removed');
        $('#noData').removeClass('removed');
    }

    // Show the "election data" div and hide the "no data" div
    function showElectionData() {
        $('#electionData').removeClass('removed');
        $('#noData').addClass('removed');
    }

    // Get the state from a URL parameter
    function getStateFromURL() {
        var state = location.search.substring(1);
        if(state.length == 2 && stateAbbrevs[state] != void(0)) {
            return state;
        }

        return void(0);
    }

    // Attempt to get the state in the following order: URL query, IP address, default
    var initialState = getStateFromURL();
    if(initialState != void(0)) {
        $('#stateDropdown').val(initialState);
        update(initialState);
    } else {
        $.getJSON('https://freegeoip.net/json/github.com?callback=?', function(data, stat, xhr){
            var response = data.region_code;
            if(response.length == 2 && stateAbbrevs[response] != void(0)) {
                initialState = response;
            }
        }).fail(function() {
            $('#detectWarning').removeClass('removed');
        }).always(function() {
            if(initialState == void(0)) {
                initialState = 'AL';
            }

            $('#stateDropdown').val(initialState);
            update(initialState);
        });
    }

    // Respond to drop-down changes
    $('#stateDropdown').change(function(){
        $('#detectWarning').addClass('removed');
        update(this.value);
    });

    // Remove the warning on click
    $('#stateDropdown').click(function() {
        $('#detectWarning').addClass('removed');
    });

    // Make a Date object on the specified day with the latest possible time
    function makeDate(year, month, day){
        return new Date(year, month-1, day, 23, 59, 59, 999);
    }

    // Computes the number of days until a given Date object
    function daysUntil(date){
        var oneDay = 24*60*60*1000; 
        var current = new Date();
        return Math.floor((date.getTime() - current.getTime())/(oneDay));
    }

    // Write the text in <span> tags in the rwd-line class
    function rwdLine(text) {
        return '<span class="rwd-line">' + text + '</span>';
    }

    // Show "<date> (<days until then, if not negative>)"
    function formatDate(date) {
        var daysUntilDate = daysUntil(date);
        var daysUntilDateStr = '';
        if(daysUntilDate == 1) {
            daysUntilDateStr = ' (in 1 day)';
        } else if(daysUntilDate == 0 || daysUntilDate > 1) {    
            daysUntilDateStr = ' (in ' + daysUntilDate + ' days)';
        }

        return rwdLine(date.toDateString()) + rwdLine(daysUntilDateStr);
    }

    // Update elements when a state is selected
    function update(state) {
        var full, abbrev;
        if(state.length == 2) {
            full = stateAbbrevs[state];
            abbrev = state;
        } else {
            full = state;
            abbrev = stateAbbrevs[state];
        }

        // Update the permalink
        var permalink = makeLink('?' + abbrev, '[permalink]');
        $('#permalink').html(permalink);

        // TODO Dummy data for Virginia; replace with USVF API calls
        if(abbrev == 'VA') {
            // Election date
            var electionDate = makeDate(2017, 11, 7);
            $('#electionDate').html(formatDate(electionDate));

            // Elections
            var electionNames = ['Virginia Gubernatorial Election', 'Virginia House of Delegates Election'];
            var electionNamesStr = '';
            for(n = 0; n < electionNames.length; n++) {
                if(n > 0) {
                    electionNamesStr += '<br/>&<br/>';
                }

                electionNamesStr += electionNames[n];
            }
            $('#electionName').html(electionNamesStr);

            // Deadlines
            var registerDate = makeDate(2017, 10, 16);
            var absenteeRequestDate = makeDate(2017, 10, 31);
            $('#electionDeadlines').html(rwdLine('Register by ') + formatDate(registerDate) + '<br/>' +
                                         rwdLine('Request absentee by ') + formatDate(absenteeRequestDate));
            
            showElectionData();
        } else {
            $('#noDataWarning').text('No statewide elections in ' + full + ' at this time');
            hideElectionData();
        }

        var regLink = makeLink('https://www.usvotefoundation.org/vote/us/state-voting-information/' + abbrev,
                               'Learn more about voting and elections in ' + full)
        $('.stateRegInfo').html(regLink);
    }

    function makeLink(url, text) {
        return '<a href="' + url + '" target="_blank">' + text + '</a>';
    }
})

