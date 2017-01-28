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
    var stateSetSuccess = initialState != void(0);
    $.getJSON('https://freegeoip.net/json/github.com?callback=?', function(data, stat, xhr){
        if(initialState == void(0)) {
            initialState = data.region_code;
        }
    }).done(function() {
        stateSetSuccess = true;
    }).always(function() {
        if(!stateSetSuccess) {
            initialState = 'AL';
        }

        $('#stateDropdown').val(initialState);
        update(initialState);
    });

    // Respond to drop-down changes
    $('#stateDropdown').change(function(){
        update(this.value);
    });

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

        $('#stateRegInfo').text(full + ' : ' + abbrev);
    }
})

