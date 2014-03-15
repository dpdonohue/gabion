angular.module('gabi.services', [])

.factory('Settings', function() {

    return {
        targetLanguage: 'es-ES'
    }
})

.factory('Lookup', ['$http', function($http){
    var url   = "lookup/en-US_es-ES.csv";
    var terms = $http.get(url).then(function(response){
        return csvParser(response.data);
    });
    return {
        getTerms: function() {
            return terms;
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
        var promptString = "Speak now"; // optional
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
});
