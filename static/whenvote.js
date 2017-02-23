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

    // Set a 3 second timeout for ajax requests
    $.ajaxSetup({
        timeout: 3000
    });

    // Read the data file
    var data = $.parseJSON(
        $.ajax({
            url: 'data.json',
            async: false,
            dataType: 'json'
        }).responseText
    );

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
        $.getJSON('https://freegeoip.net/json/?callback=?', function(data, stat, xhr){
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

        if(daysUntilDate > 1) {
            daysUntilDateStr = rwdLine(' (in ' + daysUntilDate + ' days)');
        } else if(daysUntilDate == 1) {
            daysUntilDateStr = rwdLine(' (tomorrow)');
        } else if(daysUntilDate == 0) {
            daysUntilDateStr = rwdLine(' (TODAY!)');
        } else {
            daysUntilDateStr = '';
        }

        return rwdLine(date.toDateString()) + daysUntilDateStr;
    }

    function validDate(stateData, prefix) {
        var year = stateData[prefix + '_year'];
        var month = stateData[prefix + '_month'];
        var day = stateData[prefix + '_day'];

        if(year > 0 && month > 0 && day > 0) {
            return formatDate(makeDate(year, month, day));
        } else {
            return '';
        }
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
        var permalink = makeLink('?' + abbrev, 'permalink');
        $('#permalink').html(permalink);
        
        // Update the updates-feed link
        var atomLink = makeLink('feed/' + abbrev + '.atom', 'atom/rss');
        $('#atom').html(atomLink);


        // Show state data, if available
        if(data.hasOwnProperty(abbrev)) {
            var stateData = data[abbrev];

            // Show election date if valid
            var electionDate = validDate(stateData, 'election');
            if(electionDate) {
                $('#electionDate').html(electionDate);
            }

            // Election names
            var electionNames = stateData['election_names'];
            var electionNamesStr = '';
            for(n = 0; n < electionNames.length; n++) {
                if(n > 0) {
                    electionNamesStr += '<br/>&<br/>';
                }

                electionNamesStr += electionNames[n];
            }
            $('#electionName').html(electionNamesStr);

            // Calendar link
            $('#addToCalendar').html('&#128197; ' + makeLink('cal/' + abbrev + '.ics', 'Add to calendar'));

            // Show any valid deadlines
            var registerDate = validDate(stateData, 'register');
            var absenteeDate = validDate(stateData, 'absentee');

            var deadlineString = '';
            if(registerDate) {
                deadlineString += rwdLine('Register by ') + registerDate;
            }
            if(absenteeDate) {
                if(registerDate) {
                    deadlineString += '<br/>';
                }
                deadlineString += rwdLine('Request absentee by ') + absenteeDate;
            }
            $('#electionDeadlines').html(deadlineString);

            showElectionData();
        } else {
            $('#noDataWarning').text('No state-level elections in ' + full + ' at this time');
            hideElectionData();
        }

        var regLink = makeLink('https://www.usvotefoundation.org/vote/us/state-voting-information/' + abbrev,
                               'Learn more about registering and voting in ' + full)
        $('.stateRegInfo').html('&#10003; ' + regLink);
    }

    function makeLink(url, text) {
        return '<a href="' + url + '">' + text + '</a>';
    }
})

