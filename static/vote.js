$(document).ready(function(){
    $('#stateSelect').ready(function(){
        // Check if a state is specified in the URL
        var query = location.search.substring(1);
        if(query.length == 2) {
            var state = query;
            $('#stateSelect').val(state);
            getStateData(state);
        } else {
            // Default to Alabama, the first item in the list alphabetically
            getStateData('AL');

            // Try to get it from the IP address
            $.getJSON('https://freegeoip.net/json/github.com?callback=?', function(data, stat, xhr){
                var state = data.region_code;
                $('#stateSelect').val(state);
                getStateData(state);
            });
        }

    });

    // Respond to drop-down changes
    $('#stateSelect').change(function(){
        var state = this.value;

        var myURL = document.location.toString();
        myURL = myURL.replace(/\?.*/, '');
        document.location = myURL + '?' + state;

        getStateData(state);
    });

    // Pull election data and update the UI
    function getStateData(state) {
        // TODO This is placeholder code. Need access to the US Vote Foundation API.
        if(state == 'VA') {
            updateUI({
                'elections':['Virginia Gubernatorial Election', 'Virginia House of Delegates Election'],
                'date':makeDate(2017, 11, 7),
                'registerBy':makeDate(2017, 10, 16),
                'requestAbsenteeBy':makeDate(2017, 10, 31)
            });
        } else {
            updateUINoDataFound(state);
        }

    }

    // Update the UI with election data
    function updateUI(data) {
        // Election info
        var electionName = formatElectionName(data.elections);
        var date = formatElectionDate(data.date);
            
        // Registration info
        var registration = 'Register by ' + formatDeadline(data.registerBy);
        var absentee = 'Request absentee ballot by ' + formatDeadline(data.requestAbsenteeBy);
        var deadlines = registration + '<br/>' + absentee;

        $('#election').html(electionName + '<br/>' + date + '<br/>' + deadlines);
    }

    // Update the UI with null data
    function updateUINoDataFound(state) {
        $('#election').html('<div class="electionName">No data available for upcoming elections in ' + state + ' :-(</div>');
    }

    // Make a Date object on the specified day with the latest possible time
    function makeDate(year, month, day){
        return new Date(year, month-1, day, 23, 59, 59, 999);
    }

    function formatElectionName(elections){
        var str = '<div class="electionName">';
        for(var n = 0; n < elections.length; n++){
            str += elections[n] + '<br/>';
        }
        str += '</div>';

        return str;
    }

    function formatElectionDate(date){
        var str = '<div class ="electionDate">';
        str += date.toDateString();

        var days = daysUntil(date);
        if(days == 1){
            str += ' (in ' + days + ' day)';
        } else{
            str += ' (in ' + days + ' days)';
        }
        str += '</div>'

        return str;
    }

    function formatDeadline(date){
        var days = daysUntil(date);
        var str = '<span class ="deadline">';
        if(days < 0) {
            str = '<span class ="deadline strike">'
        }

        str += date.toDateString();
        if(days == 1){
            str += ' (in ' + days + ' day)';
        } else if(days > 1){
            str += ' (in ' + days + ' days)';
        } else {
            str += ' (deadline has passed)';
        }
        str += '</span>'

        return str;
    }

    function daysUntil(date){
        var oneDay = 24*60*60*1000; 
        var current = new Date();
        return Math.floor((date.getTime() - current.getTime())/(oneDay));
    }
});

