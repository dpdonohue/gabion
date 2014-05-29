angular.module("gabi.services", [])

.factory("Settings", function() {

    return {
        targetLocale: "es-US",
        nativeLocale: "en-US",
        googleApiKey: "AIzaSyBiP5o_Zvty1wte0P8BzVsDmW9hlJxVcz4",
        terms: [],
        currentPlay: "trip1.txt",
        playList: [],
        play: {},
        getTargetLanguage: function() {
            return this.targetLocale.substring(0,2);
        },

        getNativeLanguage: function() {
            return this.nativeLocale.substring(0,2);
        }

    }
})

/** Lookup terms from local CSV file (LEGACY) */
.factory("Lookup", ["$http", function($http){
    var url   = "lookup/terms-en.csv";
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
 * Perform Android-based speech recognition
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

/**
 * Soundex and other text functions
 */
.factory("Util", function() {
    return {
        soundex: function(str) {
            //  discuss at: http://phpjs.org/functions/soundex/
            // original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
            // original by: Arnout Kazemier (http://www.3rd-Eden.com)
            // improved by: Jack
            // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
            // bugfixed by: Onno Marsman
            // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
            //    input by: Brett Zamir (http://brett-zamir.me)
            //  revised by: Rafał Kukawski (http://blog.kukawski.pl)
            //   example 1: soundex('Kevin');
            //   returns 1: 'K150'
            //   example 2: soundex('Ellery');
            //   returns 2: 'E460'
            //   example 3: soundex('Euler');
            //   returns 3: 'E460'

            str = (str + '')
                .toUpperCase();
            if (!str) {
                return '';
            }
            var sdx = [0, 0, 0, 0],
                m = {
                    B: 1,
                    F: 1,
                    P: 1,
                    V: 1,
                    C: 2,
                    G: 2,
                    J: 2,
                    K: 2,
                    Q: 2,
                    S: 2,
                    X: 2,
                    Z: 2,
                    D: 3,
                    T: 3,
                    L: 4,
                    M: 5,
                    N: 5,
                    R: 6
                },
                i = 0,
                j, s = 0,
                c, p;

            while ((c = str.charAt(i++)) && s < 4) {
                if (j = m[c]) {
                    if (j !== p) {
                        sdx[s++] = p = j;
                    }
                } else {
                    s += i === 1;
                    p = 0;
                }
            }

            sdx[0] = str.charAt(0);
            return sdx.join('');
        },

        /* too restrictive - removes accented letters*/
//        stripAllNonAlphanumeric: function(str) {
//            return str.translatedText.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");
//        },

        /* DOES NOT WORK! */
//        stripPunctuation: function(str) {
//            return str.translatedText.replace(/[.,!?:;'"-]+/g, '').replace(/\s+/g, " ");
//        }

        stripPunctuation: function(str) {
            return str.replace(/[!-#%-\x2A,-/:;\x3F@\x5B-\x5D_\x7B}\u00A1\u00A7\u00AB\u00B6\u00B7\u00BB\u00BF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E3B\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]+/g, '').replace(/\s+/g, " ");
        },

        escapeNumericEntities: function (str) {
            return str.replace(/&#([0-9]{1,3});/gi, function(match, numStr) {
                var num = parseInt(numStr, 10); // read num as normal number
                return String.fromCharCode(num);
            });
        }
    }
})


/* Google OAuth2 - not tested*/
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

/* DB Operations */
.factory("DeviceDB", function () {
    var db = window.openDatabase("gablabdb", "1.0", "Gablab Database", 2000000);
    return {
        ensureCreated: function() {
            tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id unique, data)');
        }
    }
})

/* Client for the Gabs web service */
.factory("GabsClient", function() {
    return {
        listPlays: function(lan, callback) {
            $http.get("http://localhost:3000/play/list?lan=" + lan).then(function(result) {
                var payload = result.data;
                callback(payload.plays);
            });
        },

        getPlay: function(playid, nlo, nla, tlo, tla, callback) {
            $http.get("http://localhost:3000/play/load/" + playid + "?nlo=" + nlo + "&nla=" + nla + "&tlo=" + tlo + "&tla=" + tla).then(function(result) {
                var payload = result.data;
                callback(payload);
            });
        }
    }
})

;
