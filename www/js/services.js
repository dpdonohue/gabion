angular.module('gabi.services', [])

.factory('Settings', function() {

    return {
        targetLanguage: 'es-ES',

        terms: []
    }
})

.factory('Lookup', ['$http', function($http){
    var url   = "lookup/en-US_es-ES.csv";
    var terms = new Array();

    function csvToArray( strData, strDelimiter ){
        // Check to see if the delimiter is defined. If not,
        // then default to comma.
        strDelimiter = (strDelimiter || ",");

        // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp(
            (
                // Delimiters.
                "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

                    // Quoted fields.
                    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

                    // Standard fields.
                    "([^\"\\" + strDelimiter + "\\r\\n]*))"
                ),
            "gi"
        );


        // Create an array to hold our data. Give the array
        // a default empty first row.
        var arrData = [[]];

        // Create an array to hold our individual pattern
        // matching groups.
        var arrMatches = null;


        // Keep looping over the regular expression matches
        // until we can no longer find a match.
        while (arrMatches = objPattern.exec( strData )){

            // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[ 1 ];

            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know
            // that this delimiter is a row delimiter.
            if (
                strMatchedDelimiter.length &&
                    (strMatchedDelimiter != strDelimiter)
                ){

                // Since we have reached a new row of data,
                // add an empty row to our data array.
                arrData.push( [] );

            }


            // Now that we have our delimiter out of the way,
            // let's check to see which kind of value we
            // captured (quoted or unquoted).
            if (arrMatches[ 2 ]){

                // We found a quoted value. When we capture
                // this value, unescape any double quotes.
                var strMatchedValue = arrMatches[ 2 ].replace(
                    new RegExp( "\"\"", "g" ),
                    "\""
                );

            } else {

                // We found a non-quoted value.
                var strMatchedValue = arrMatches[ 3 ];

            }


            // Now that we have our value string, let's add
            // it to the data array.
            arrData[ arrData.length - 1 ].push( strMatchedValue );
        }

        // Return the parsed data.
        return( arrData );
    }

    return {
        getTerms: function(callback) {
            $http.get(url).then(function(response){
            terms = response.data;
            alert('read file: ' + response.data);
            callback(csvToArray(response.data, ";"));
        });
      }
    }
}])

/**
 * A simple example service that returns some data.
 */
.factory('AndroidSpeechRecognizer', function() {

  var languages = new Array();
  return {

    getSupportedLanguages: function(callback) {
        if (languages.length > 0) {
            callback(languages);
        } else {
            if (window.plugins && window.plugins.speechrecognizer ) {
                window.plugins.speechrecognizer.getSupportedLanguages(function(foundLanguages){
                    languages = foundLanguages;
                    callback(foundLanguages);
                }, function(error){
                    alert("Could not retrieve the supported languages : " + error);
                });
            } else {
                alert("SpeechRecognizer plugin is NOT active");
            }
        }
    },

    recognizeSpeech: function(callback, language) {
        var maxMatches = 5;
        var promptString = "Say it in " + language; // optional
        if (window.plugins && window.plugins.speechrecognizer ) {
            window.plugins.speechrecognizer.startRecognize(function(result){
                callback(result);
            }, function(errorMessage){
                alert("Error message: " + errorMessage);
            }, maxMatches, promptString, language);
        } else {
            alert("SpeechRecognizer plugin is NOT active");
        }
    }
  }
})


    .factory('Util', function() {

        return {


}
});
