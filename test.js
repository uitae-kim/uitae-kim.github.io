var spreadsheetUrl = 'https://spreadsheets.google.com/feeds/cells/1vi0uJPviR9DXmB_RsPtyqwEOiYERoEZsiJWoai-lkv0/1/public/values?alt=json-in-script&callback=doData';


// The callback function the JSONP request will execute to load data from API
function doData(data) {
    // Final results will be stored here	
    var results = [];

    // Get all entries from spreadsheet
    var entries = data.feed.entry;

    // Set initial previous row, so we can check if the data in the current cell is from a new row
    var previousRow = 0;

    // Iterate all entries in the spreadsheet
    for (var i = 0; i < entries.length; i++) {
        // check what was the latest row we added to our result array, then load it to local variable
        var latestRow = results[results.length - 1];

        // get current cell
        var cell = entries[i];

        // get text from current cell
        var text = cell.content.$t;

        // get the current row
        var row = cell.gs$cell.row;

        // Determine if the current cell is in the latestRow or is a new row
        if (row > previousRow) {
            // this is a new row, create new array for this row
            var newRow = [];

            // add the cell text to this new row array  
            newRow.push(text);

            // store the new row array in the final results array
            results.push(newRow);

            // Increment the previous row, since we added a new row to the final results array
            previousRow++;
        } else {
            // This cell is in an existing row we already added to the results array, add text to this existing row
            latestRow.push(text);
        }

    }

    handleResults(results);
}

// Do what ever you please with the final array
function handleResults(spreadsheetArray) {
    console.log(spreadsheetArray);
    document.getElementById('Test').innerHTML = parseData(spreadsheetArray);
}


const parseData = (data) => {
    result = '';

    for (i = 1; i < data.length; i++) {
        line = data[i].toString().split(',');

        result += '<p>';

        for (j = 0; j < line.length; j++) {
            result += line[j] + ' ';
        }

        result += '</p><br>';
    }

    return result;
}



// Create JSONP Request to Google Docs API, then execute the callback function doData
$.ajax({
    url: spreadsheetUrl,
    jsonp: 'doData',
    dataType: 'jsonp'
});