angular.module("gabi.services", ["ionic"])

.factory("Settings", function() {

    return {
        targetLocale: "es-US",
        nativeLocale: "en-US",
        googleApiKey: "AIzaSyBiP5o_Zvty1wte0P8BzVsDmW9hlJxVcz4",
        gabsUrl: "http://gabs-gablabio.rhcloud.com/",
//        gabsUrl: "http://localhost:3000/",
        terms: [],
        currentPlay: "trip1.txt",
        playList: [],
        loadedPlaysLevel: 0,
        play: {},
        pageIndex : 0,
        targetTranslation: {},
        nativeTranslation: {},
        localizations: {},
        parseLanguageId: function(loc) {
            var divider = loc.lastIndexOf("-");
            if (divider < 0) return loc;
            var lang = loc.substring(0,divider);
            return lang;
        },
        parseCountry: function(loc) {
            var divider = loc.lastIndexOf("-");
            if (divider < 0) return "";
            var country = loc.substring(divider + 1);
            return country;
        },
        getTargetLanguage: function() {
            return this.parseLanguageId(this.targetLocale);
        },

        getNativeLanguage: function() {
            return this.parseLanguageId(this.nativeLocale);
        },
        getLocalizedText: function(english) {
            if ("en" == this.getNativeLanguage()) return english;
            if (localizations[this.getNativeLanguage()][english]) {
                return localizations[this.getNativeLanguage()][english];
            }
            return english;
        },
//        getSkillLevel: function() {
////            if (! this.skillLevels[this.getTargetLanguage()]) return 1;
////            return this.skillLevels[this.getTargetLanguage()];
//            return this.skillLevel;
//        },
        skillLevel: 3,
        supportedLanguages: [],
        lines: [],

        loadLines: function() {
            if (!this.play || !this.nativeTranslation || !this.targetTranslation) return;

            this.lines = [];
            var page = this.play.pages[this.pageIndex];

            var startLine = page.sln;
            var endLine = page.eln;

            var index = 0;
            for (var linei = startLine; linei <= endLine; linei++) {
                var actorIndex = this.play.lines[linei].act;
                var actorLabel = this.play.actors[actorIndex].lbl.toUpperCase();
                var nativeActor = this.nativeTranslation.actors[actorIndex].txt[0];
                if (! nativeActor) nativeActor = actorLabel;
                //ERROR BELOW SOMEWHERE
                var targetActor = this.targetTranslation.actors[actorIndex].txt[0];
                if (! targetActor) targetActor = actorLabel;
                var actorImg = this.play.actors[actorIndex].img;
                var nativeText = this.nativeTranslation.lines[linei].txt[0];
                var targetText = this.targetTranslation.lines[linei].txt[0];
                var targetTexts = this.targetTranslation.lines[linei].txt;
                if ( (actorLabel=="YOU") && !actorImg) {
                    actorImg = "http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/64/Emotes-face-smile-icon.png";
                }
                if (!actorImg) {
                    actorImg = "http://icons.iconarchive.com/icons/saki/nuoveXT-2/64/Apps-user-info-icon.png";
                }
                var line = {
                    index: index,
                    isYou: actorLabel=="YOU",
                    nativeActor: nativeActor,
                    targetActor: targetActor,
                    nativeText: nativeText,
                    targetText: targetText,
                    targetTexts: targetTexts,
                    actorImg: actorImg,
                    success: 0,
                    fail: 0,
                    currentStatus: 0
                };
                this.lines.push(line);
                index++;
            }
        }
    }
})


/** Lookup terms from local CSV file (LEGACY) */
//.factory("Lookup", ["$http", function($http){
//    var url   = "lookup/terms-en.csv";
//    var terms = new Array();
//
//    function csvToArray( strData, strDelimiter ){
//        // Check to see if the delimiter is defined. If not,
//        // then default to comma.
//        strDelimiter = (strDelimiter || ",");
//
//        // Create a regular expression to parse the CSV values.
//        var objPattern = new RegExp(
//            (
//                // Delimiters.
//                "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
//
//                    // Quoted fields.
//                    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
//
//                    // Standard fields.
//                    "([^\"\\" + strDelimiter + "\\r\\n]*))"
//                ),
//            "gi"
//        );
//
//
//        // Create an array to hold our data. Give the array
//        // a default empty first row.
//        var arrData = [[]];
//
//        // Create an array to hold our individual pattern
//        // matching groups.
//        var arrMatches = null;
//
//
//        // Keep looping over the regular expression matches
//        // until we can no longer find a match.
//        while (arrMatches = objPattern.exec( strData )){
//
//            // Get the delimiter that was found.
//            var strMatchedDelimiter = arrMatches[ 1 ];
//
//            // Check to see if the given delimiter has a length
//            // (is not the start of string) and if it matches
//            // field delimiter. If id does not, then we know
//            // that this delimiter is a row delimiter.
//            if (
//                strMatchedDelimiter.length &&
//                    (strMatchedDelimiter != strDelimiter)
//                ){
//
//                // Since we have reached a new row of data,
//                // add an empty row to our data array.
//                arrData.push( [] );
//
//            }
//
//
//            // Now that we have our delimiter out of the way,
//            // let"s check to see which kind of value we
//            // captured (quoted or unquoted).
//            if (arrMatches[ 2 ]){
//
//                // We found a quoted value. When we capture
//                // this value, unescape any double quotes.
//                var strMatchedValue = arrMatches[ 2 ].replace(
//                    new RegExp( "\"\"", "g" ),
//                    "\""
//                );
//
//            } else {
//
//                // We found a non-quoted value.
//                var strMatchedValue = arrMatches[ 3 ];
//
//            }
//
//
//            // Now that we have our value string, let"s add
//            // it to the data array.
//            arrData[ arrData.length - 1 ].push( strMatchedValue );
//        }
//
//        // Return the parsed data.
//        return( arrData );
//    }
//
//    return {
//        getTerms: function(callback) {
//            $http.get(url).then(function(response){
//            terms = response.data;
////            alert("read file: " + response.data);
//            callback(csvToArray(response.data, ";"));
//        });
//      }
//    }
//}])

/**
 * Perform Android-based speech recognition
 */
.factory("AndroidSpeechRecognizer", function(Settings) {

  var languages = new Array();
  return {

    getSupportedLanguages: function(callback) {
        if (languages.length > 0) {
            callback(languages);
        } else {
            if (window.plugins && window.plugins.speechrecognizer ) {
                window.plugins.speechrecognizer.getSupportedLanguages(function(foundLanguages){
                    //remove langauges not supported by Google translate
                    languages = [];
                    for (languagei in foundLanguages) {
//                        var languageObj = languages[languagei];
                        if(["he-IL", "yue-Hant-HK"].indexOf(foundLanguages[languagei]) == -1) {
                            languages.push(foundLanguages[languagei]);
                        }
                    }
                    callback(languages);
                }, function(error){
                    alert("Could not retrieve the supported languages : " + error);
                });
            } else {
                alert("SpeechRecognizer plugin is NOT active");
            }
        }
    },

    recognizeSpeech: function(prompt, text, locale, callback, arg) {
        var maxMatches = 5;

        var promptString = prompt + ': "' + text + '"'; // optional
        if (window.plugins && window.plugins.speechrecognizer ) {
            window.plugins.speechrecognizer.startRecognize(function(result){
                callback(result, arg);
            }, function(errorMessage){
                alert("Error recognizing speech: " + errorMessage);
            }, maxMatches, promptString, locale);
        } else {
            alert("SpeechRecognizer plugin is NOT active");
        }
    }
  }
})

/**
 * AndroidTextToSpeech - DOES NOT WORK - A simple example service that returns some data.
 */
//.factory("AndroidTextToSpeech", function() {
//
//    var currentLanguage;
//    var initialized=false;
//
//    return {
//        init: function() {
//            if (initialized) return;
//            var tts;
//            try {
//                tts = cordova.require("cordova/plugin/tts");
//            } catch (e) {
//                alert("Error: " + e);
//            }
//            if (!tts ) {
//                alert("AndroidTextToSpeech plugin is NOT active");
//                return;
//            }
//            tts.startup(
//                function() { alert('TTS started'); initialized = true; },
//                function() { alert('Failed to startup Text to Speech')}
//            );
//        },

//        setLanguage: function(language, callback) {
//            if (currentLanguage == language) {
//                callback(true);
//            } else {
//                var tts = cordova.require("cordova/plugin/tts");
//                if (!tts ) {
//                    alert("AndroidTextToSpeech plugin is NOT active");
//                    callback(false);
//                    return;
//                }
//
//                tts.isLanguageAvailable(language, function() {
//                        tts.setLanguage(language);
//                        currentLanguage = language;
//                    }, function() {
//                        alert("AndroidTextToSpeech plugin cannot set language: " + language);
//                        callback(false);
//                    });
//                callback(true);
//            }
//        },
//
//        speak: function(text) {
//            var tts = cordova.require("cordova/plugin/tts");
//            if (!tts ) {
//                alert("AndroidTextToSpeech plugin is NOT active");
//                return;
//            }
//            tts.speak(text);
//        }
//    }
//})

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
        },

        hashCode : function(str) {
            var hash = 0, i, chr, len;
            if (str.length == 0) return hash;
            for (i = 0, len = str.length; i < len; i++) {
                chr   = str.charCodeAt(i);
                hash  = ((hash << 5) - hash) + chr;
                hash |= 0; // Convert to 32bit integer
            }
            return hash;
        },

        downloadFile : function(url, filename, callback) {
            try {
                var fileTransfer = new FileTransfer();
                window.requestFileSystem(
                    LocalFileSystem.TEMPORARY,
                    0,
                    function (fileSystem) {

                        var downloadToDir = fileSystem.root.toURL();
                        var filePath = downloadToDir + filename;
//                        alert("download to " + filePath);
                        fileTransfer.download(
                            url,
                            filePath,
//                            function (entry) {
//                                if (callback) callback(filePath);
//                            },
//                            callback,
                            function() {
                                callback(filePath);
                            },
                            function (error) {
                                alert("ERROR downloading File: " + filePath + "; error=" + error);
                            }
                        );
                    },
                    function (err) {
                        alert("Failed to requestFileSystem: " + err);
                    }
                );
            } catch (e) {
                alert("error in downloadFile: " + e);
            }
        },

        //if the file exists, pass the file path to the callback
        fileExists: function(filename, callbackFileExists, callbackFileNotExists) {
            window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, function (fileSystem) {
                var downloadToDir = fileSystem.root.toURL();
                var path = downloadToDir + filename;
//                alert("testing path: " + filename);
                fileSystem.root.getFile(filename, { create: false }, function() {
                    callbackFileExists(path);
                }, callbackFileNotExists);
            }, function (evt) {
                console.log(evt.target.error.code);
            }); //of requestFileSystem
        },

        //Untested; get the full filepath and return it to the callback function
        getFilepath : function(filename, callback) {
            try {
                var fileTransfer = new FileTransfer();
                window.requestFileSystem(
                    LocalFileSystem.TEMPORARY,
                    0,
                    function (fileSystem) {

                        var rootDir = fileSystem.root.toURL();
                        var filepath = rootDir + filename;
                        callback(filepath);
                    },
                    function (err) {
                        return alert("Failed to requestFileSystem: " + err);
                    }
                );
            } catch (e) {
                alert("error in downloadFile: " + e);
            }
        }
    }
})


/* Google OAuth2 - not tested*/
//.service('GoogleLogin', ['$http', '$rootScope', '$q', function ($http, $rootScope, $q) {
//    var clientId = '{MY CLIENT ID}',
//        apiKey = '{MY API KEY}',
//        scopes = 'https://www.googleapis.com/auth/userinfo.email https://www.google.com/m8/feeds',
//        domain = '{MY COMPANY DOMAIN}',
//        userEmail,
//        deferred = $q.defer();
//
//    this.login = function () {
//        gapi.auth.authorize({ client_id: clientId, scope: scopes, immediate: false, hd: domain }, this.handleAuthResult);
//
//        return deferred.promise;
//    }
//
//    this.handleClientLoad = function () {
//        gapi.client.setApiKey(apiKey);
//        gapi.auth.init(function () { });
//        window.setTimeout(checkAuth, 1);
//    };
//
//    this.checkAuth = function() {
//        gapi.auth.authorize({ client_id: clientId, scope: scopes, immediate: true, hd: domain }, this.handleAuthResult );
//    };
//
//    this.handleAuthResult = function(authResult) {
//        if (authResult && !authResult.error) {
//            var data = {};
//            gapi.client.load('oauth2', 'v2', function () {
//                var request = gapi.client.oauth2.userinfo.get();
//                request.execute(function (resp) {
//                    $rootScope.$apply(function () {
//                        data.email = resp.email;
//                    });
//                });
//            });
//            deferred.resolve(data);
//        } else {
//            deferred.reject('error');
//        }
//    };
//
//    this.handleAuthClick = function (event) {
//        gapi.auth.authorize({ client_id: clientId, scope: scopes, immediate: false, hd: domain }, this.handleAuthResult );
//        return false;
//    };
//
//}])


/* Google Translator */
//.factory("GoogleTranslator", function($http, Settings) {
//    var languages = new Array();
//    return {
//        getSupportedLanguages: function(callback, targ) {
//            if (languages.length > 0) {
//                callback(languages);
//            } else {
//                alert("getSupportedLanguages for: " + targ);
//                var request = gapi.client.request({
//                    path: '/language/languages/v2',
//                    method: 'GET',
//                    params: {
////                        target: targ
//                    }
//                });
//                request.execute(function(response) {
//                    console.log(request);
//                    languages = response.data;
//                    callback(response.data);
//                }, function(errorMessage){
//                    alert("Error message: " + errorMessage);
//                });
//            }
//        },
//
//        translate: function(callback, text, termIndex, fromLanguage, toLanguage) {
//            var request = gapi.client.request({
//                path: '/language/translate/v2',
//                method: 'GET',
//                params: {
//                    q: text,
//                    target:  toLanguage.substring(0,2),
//                    source: fromLanguage.substring(0,2)
//                }
//            });
//            request.execute(function(jsonResp, rawResp) {
////                    alert('response=' + JSON.stringify(rawResp));
//                callback(jsonResp, termIndex);
//            }
////                    , function(errorMessage){
////                    alert("Error message: " + errorMessage);
////                }
//            );
//        },
//
//        detectLanguage: function(callback, text) {
//            var request = gapi.client.request({
//                path: '/language/detection/v2',
//                method: 'GET',
//                params: {
//                    q: text
//                }
//            });
//            request.execute(function(response) {
//                console.log(request);
//                callback(response);
//            }, function(errorMessage){
//                alert("Error message: " + errorMessage);
//            });
//        }
//    }
//})

/* Google TTS http://translate.google.com/translate_tts?ie=UTF-8&tl=en&q= */
.factory("GoogleTextToSpeech", function() {

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

///* DB Operations */
//.factory("DeviceDB", function () {
//    var db = window.openDatabase("gablabdb", "1.0", "Gablab Database", 2000000);
//    return {
//        ensureCreated: function() {
//            tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id unique, data)');
//        }
//    }
//})

/* Client for the Gabs web service */
.factory("GabsClient", function($http, Settings) {
    return {
        listPlays: function(lan, lev, callback) {
//            alert("GET: " + Settings.gabsUrl + "play/list?lan=" + lan + "&lev=" + lev);
            $http.get(Settings.gabsUrl + "play/list?lan=" + lan + "&lev=" + lev)
                .then(
                    function(result) {
                        if (!result || !result.data) {
                            return callback([]);
                        }
                        var payload = result.data;

                        return callback(payload.plays);
                    }, function(error) {
                        alert("listPlays() error: " + JSON.stringify(error));
                        return callback([]);
                    }
                );
        },

        //TODO support locale
        getPlay: function(playid, nlo, nla, tlo, tla, callback) {
            $http.get(Settings.gabsUrl + "play/load/" + playid + "?nlo=" + nlo + "&nla=" + nla + "&tla=" + tla).then(function(result) {
                var payload = result.data;
                callback(payload);
            });
        },

        //TODO load this from Gabs
        //get languages supported by Google Translate
        getSupportedLanguages: function(targ, callback) {
            var url = "https://www.googleapis.com/language/translate/v2/languages?key=" + Settings.googleApiKey + "&target=" + targ;
            $http.get(url).then(function(result) {
                var payload = result.data.data.languages;
//                //remove langauges not supported by Google translate
//                delete languages["he-IL"];
                callback(payload);
            });
        },

        //TODO support localizations with locale rather than language
        localize: function(english, tlo, tla, callback) {
            if ("en"==tla) return callback(english);
            if (! Settings.localizations[tla]) Settings.localizations[tla] = {};
            if (Settings.localizations[tla][english]) return callback(Settings.localizations[tla][english]);
            $http.get(Settings.gabsUrl + "loc/localize?src=Gabi-UI-localize&nlo=en-US&nla=en&tlo=" + tlo + "&tla=" + tla + "&t=" + encodeURIComponent(english)).then(function(result) {
//                alert("localize received: " + JSON.stringify(result));
                if (! result.data.trm.txt) {
                    //unable to get localization
                    return callback(english);
                }
                Settings.localizations[tla][english] = result.data.trm.txt;
                callback(result.data.trm.txt);
            });
        }
    }
})




/* Client for the Gabs web service */
.factory("LangUtil", function(GabsClient, Settings, AndroidSpeechRecognizer) {
    var langMap = [];
    var langArr = [];
    return {

        getLanguageArray: function(nativeLang, callback) {
            if (langArr && langArr[nativeLang]) callback(langArr[nativeLang]);

//            alert("getLanguageArray()...");
            GabsClient.getSupportedLanguages(nativeLang, function(languages) {

                langArr[nativeLang] = languages;
//                alert("langArr[nativeLang]=" + JSON.stringify(langArr[nativeLang]));
                callback(languages);
            });
        },

        getLanguageMap: function(nativeLang, callback) {
            if (langMap && langMap[nativeLang]) return callback(langMap[nativeLang]);
            langMap[nativeLang] = { };
            this.getLanguageArray(nativeLang, function(larr) {
                for (var langi in larr) {
                    var langObj = larr[langi];
//                    alert("langObj=" + JSON.stringify(langObj));
                    var key = langObj.language;
                    langMap[nativeLang][key] = langObj.name;
                }
//                alert("langMap[nativeLang]=" + langMap[nativeLang]);
                callback(langMap[nativeLang]);
            });
        },

        //assumes we have already loaded the map for nativeLang
        getLanguageName: function(nativeLang,languageId) {
            if (langMap && langMap[nativeLang] && langMap[nativeLang][languageId]) return langMap[nativeLang][languageId];
            console.log("Failed to look up the name for language: " + languageId + " in " + nativeLang);
            return languageId;
        },

        //assumes we have already loaded the map for nativeLang
        getLocaleDisplay: function(nativeLang, locale) {
//            var divider = locale.indexOf("-");
//            var lang = locale.substring(0,divider);
            var lang = Settings.parseLanguageId(locale);
            var country = Settings.parseCountry(locale);
            var langName = this.getLanguageName(nativeLang, lang);
            if (! langName || langName == lang) {
                if (lang == "cmn-Hans") langName = this.getLanguageName(nativeLang, "zh");
                if (lang == "cmn-Hant") langName = this.getLanguageName(nativeLang, "zh-TW");
                if (lang == "fil") langName = this.getLanguageName(nativeLang, "tl");
                if (lang == "nb") langName = this.getLanguageName(nativeLang, "no");
            }
            if (! country) return langName;
            return langName + " (" + country + ")";
        },

        loadLanguageInfo: function() {
//            alert("loadLanguageInfo()...");
            var self = this;
            if (Settings.supportedLanguages && Settings.supportedLanguages[Settings.getNativeLanguage()]) return;

            self.getLanguageMap(Settings.getNativeLanguage(), function(map) {
//            alert("Loaded language map: " + JSON.stringify(map));

                Settings.supportedLanguages[Settings.getNativeLanguage()] = [];
                AndroidSpeechRecognizer.getSupportedLanguages(function(languages) {
                    for (var langi in languages) {
                        var locale = languages[langi];
//                    var lang = locale.substring(0,2);
//                    var country = locale.substr(3);
//                    var langName = LangUtil.getLanguageName(Settings.getNativeLanguage(), lang);
//                    var langDisplay = langName + " (" + country + ")";
                        var langDisplay = self.getLocaleDisplay(Settings.getNativeLanguage(), locale);
                        Settings.supportedLanguages[Settings.getNativeLanguage()].push(
                            {
                                id: languages[langi],
                                name: langDisplay
                            }
                        );
                    }

                    //sort the languages
                    Settings.supportedLanguages[Settings.getNativeLanguage()].sort(function(a, b) {
                        var textA = a.name.toUpperCase();
                        var textB = b.name.toUpperCase();
                        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                    });
//                alert("Loaded supportedLanguages= " + Settings.supportedLanguages[Settings.getNativeLanguage()]);
//              LangUtil.getSupportedLanguages(Settings.getNativeLanguage(), receiveLanguages);
                });
            });
        }
    }
})

.directive("swipePage", function($ionicGesture, $state) {
    return {
        restrict : 'A',
        link : function(scope, elem, attr) {
            $ionicGesture.on("swipeleft", scope.swipeLeft, elem);
            $ionicGesture.on("swiperight", scope.swipeRight, elem);

        }
    }
})

;
