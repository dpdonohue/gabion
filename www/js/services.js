angular.module("gabi.services", [])

.factory("Settings", function() {

    return {
        targetLanguage: "es-ES",
        nativeLanguage: "en-US",
        googleApiKey: "AIzaSyBiP5o_Zvty1wte0P8BzVsDmW9hlJxVcz4",
        terms: []
    }
})

.factory("Lookup", ["$http", function($http){
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
            // let"s check to see which kind of value we
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


            // Now that we have our value string, let"s add
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
//            alert("read file: " + response.data);
            callback(csvToArray(response.data, ";"));
        });
      }
    }
}])

/**
 * A simple example service that returns some data.
 */
.factory("AndroidSpeechRecognizer", function() {

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

/**
 * AndroidTextToSpeech - DOES NOT WORK - A simple example service that returns some data.
 */
    .factory("AndroidTextToSpeech", function() {

        var currentLanguage;
        var initialized=false;

        return {
            init: function() {
                if (initialized) return;
                alert('cordova=' + cordova);
                var tts;
                try {
                    tts = cordova.require("cordova/plugin/tts");
                    alert('tts=' + tts + '; window.plugins=' + JSON.stringify(window.plugins));
                } catch (e) {
                    alert("Error: " + e);
                }
                if (!tts ) {
                    alert("AndroidTextToSpeech plugin is NOT active");
                    return;
                }
                tts.startup(
                    function() { alert('TTS started'); initialized = true; },
                    function() { alert('Failed to startup Text to Speech')}
                );
            },

            setLanguage: function(language, callback) {
                if (currentLanguage == language) {
                    callback(true);
                } else {
                    var tts = cordova.require("cordova/plugin/tts");
                    alert('tts=' + tts + '; window.plugins=' + JSON.stringify(window.plugins));
                    if (!tts ) {
                        alert("AndroidTextToSpeech plugin is NOT active");
                        callback(false);
                        return;
                    }

                    tts.isLanguageAvailable(language, function() {
                            tts.setLanguage(language);
                            currentLanguage = language;
                        }, function() {
                            alert("AndroidTextToSpeech plugin cannot set language: " + language);
                            callback(false);
                        });
                    callback(true);
                }
            },

            speak: function(text) {
                var tts = cordova.require("cordova/plugin/tts");
                if (!tts ) {
                    alert("AndroidTextToSpeech plugin is NOT active");
                    return;
                }
                tts.speak(text);
            }
        }
    })


    .factory("Util", function() {
        return { }
    })


    /* Google OAuth2 */
    .service('GoogleLogin', ['$http', '$rootScope', '$q', function ($http, $rootScope, $q) {
        var clientId = '{MY CLIENT ID}',
            apiKey = '{MY API KEY}',
            scopes = 'https://www.googleapis.com/auth/userinfo.email https://www.google.com/m8/feeds',
            domain = '{MY COMPANY DOMAIN}',
            userEmail,
            deferred = $q.defer();

        this.login = function () {
            gapi.auth.authorize({ client_id: clientId, scope: scopes, immediate: false, hd: domain }, this.handleAuthResult);

            return deferred.promise;
        }

        this.handleClientLoad = function () {
            gapi.client.setApiKey(apiKey);
            gapi.auth.init(function () { });
            window.setTimeout(checkAuth, 1);
        };

        this.checkAuth = function() {
            gapi.auth.authorize({ client_id: clientId, scope: scopes, immediate: true, hd: domain }, this.handleAuthResult );
        };

        this.handleAuthResult = function(authResult) {
            if (authResult && !authResult.error) {
                var data = {};
                gapi.client.load('oauth2', 'v2', function () {
                    var request = gapi.client.oauth2.userinfo.get();
                    request.execute(function (resp) {
                        $rootScope.$apply(function () {
                            data.email = resp.email;
                        });
                    });
                });
                deferred.resolve(data);
            } else {
                deferred.reject('error');
            }
        };

        this.handleAuthClick = function (event) {
            gapi.auth.authorize({ client_id: clientId, scope: scopes, immediate: false, hd: domain }, this.handleAuthResult );
            return false;
        };

    }])


    /* Google Translator */
    .factory("GoogleTranslator", function() {
        var languages = new Array();
        return {
            getSupportedLanguages: function(callback) {
                if (languages.length > 0) {
                    callback(languages);
                } else {
                    var request = gapi.client.request({
                        path: '/language/languages/v2',
                        method: 'GET',
                        params: {

                        }
                    });
                    request.execute(function(response) {
                        console.log(request);
                        languages = response.data;
                        callback(response.data);
                    }, function(errorMessage){
                        alert("Error message: " + errorMessage);
                    });
                }
            },

            translate: function(callback, text, termIndex, fromLanguage, toLanguage) {
                var request = gapi.client.request({
                    path: '/language/translate/v2',
                    method: 'GET',
                    params: {
                        q: text,
                        target:  toLanguage.substring(0,2),
                        source: fromLanguage.substring(0,2)
                    }
                });
                request.execute(function(jsonResp, rawResp) {
//                    alert('response=' + JSON.stringify(rawResp));
                    callback(jsonResp, termIndex);
                }
//                    , function(errorMessage){
//                    alert("Error message: " + errorMessage);
//                }
                );
            },

            detectLanguage: function(callback, text) {
                var request = gapi.client.request({
                    path: '/language/detection/v2',
                    method: 'GET',
                    params: {
                        q: text
                    }
                });
                request.execute(function(response) {
                    console.log(request);
                    callback(response);
                }, function(errorMessage){
                    alert("Error message: " + errorMessage);
                });
            }
        }
    })

    /* Google TTS http://translate.google.com/translate_tts?ie=UTF-8&tl=en&q= */
    .factory("GoogleTextToSpeech", function() {

        var currentLanguage;
        var initialized=false;

        return {

            getUrl: function(text, language) {
                var url = "http://translate.google.com/translate_tts?ie=UTF-8&tl=";
                url += language;
                url += "&q=";
                url += encodeURIComponent(text);
                return url;
            }
        }
    })
;
