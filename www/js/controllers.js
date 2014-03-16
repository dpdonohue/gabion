angular.module('gabi.controllers', [])

.controller('TranslateCtrl', function($scope, AndroidSpeechRecognizer, Settings, Lookup) {
    $scope.settings = Settings;
    $scope.recognizedSpeech = [];
    $scope.lookup = Lookup;
    var termIndex = 0;
    var currentTerm = [];

    $scope.receiveRecognizedSpeech = function(text) {
        $scope.recognizedSpeech = text;
        $scope.$apply();
    }

    $scope.record = function() {
        AndroidSpeechRecognizer.recognizeSpeech($scope.receiveRecognizedSpeech, Settings.targetLanguage);
    }

    $scope.nextTerm = function() {
        termIndex++;
        if (termIndex >= $scope.settings.terms.length) termIndex=0;
        currentTerm = $scope.settings.terms[termIndex];

        //for now clear previous answer but in future remember given answers
        $scope.recognizedSpeech = [];

        $scope.$apply();
    }

    $scope.previousTerm = function() {
        termIndex--;
        if (termIndex < 0) termIndex = $scope.settings.terms.length - 1;
        currentTerm = $scope.settings.terms[termIndex];

        //for now clear previous answer but in future remember given answers
        $scope.recognizedSpeech = [];

        $scope.$apply();
    }

    $scope.receiveTerms = function(terms) {
        $scope.settings.terms = terms;
        termIndex = -1;
        $scope.nextTerm();
        $scope.$apply();
    }

    $scope.getTargetTerms = function() {
        var targetTerms = new Array();
        for (var i=1; i<currentTerm.length; i++) {
            targetTerms.push(currentTerm[i]);
        }
        return targetTerms;
    }

    $scope.displayTargetTerms = function() {
        var terms = $scope.getTargetTerms();
        var str = "";
        for (var i=0; i < terms.length; i++) {
            if (str.length > 0) str += ", ";
            str += terms[i];
        }
        return str;
    }

    $scope.displayRecognizedSpeech = function() {
        var terms = $scope.recognizedSpeech;
        var str = "";
        for (var i=0; i < terms.length; i++) {
            if (str.length > 0) str += ", ";
            str += terms[i];
        }
        return str;
    }

    $scope.getNativeTerm = function() {
        return currentTerm[0];
    }

        $scope.getCorrect = function() {
//            alert('getCorrect(): $scope.recognizedSpeech=' + $scope.recognizedSpeech.length + '; $scope.getNativeTerm()=' + $scope.getNativeTerm() + '; $scope.getTargetTerms()=' + $scope.getTargetTerms().length);
            if (! $scope.recognizedSpeech || $scope.recognizedSpeech.length==0) return "";
            var nativeTerm = $scope.getNativeTerm();
            if (! nativeTerm) return "";
            var targetTerms = $scope.getTargetTerms();
            if (! targetTerms) return "";
            var correct = false;
            for (var t=0; t<targetTerms.length; t++) {
                for (var s=0; s<$scope.recognizedSpeech.length; s++) {
                    if (correct) break;
//                    alert(targetTerms[t] + ' == ' + $scope.recognizedSpeech[s].toLowerCase() + '? ' + (targetTerms[t] == $scope.recognizedSpeech[s].toLowerCase()))
                    if (targetTerms[t] == $scope.recognizedSpeech[s].toLowerCase()) {
                        correct = true;
                        break;
                    }
                }
            }
            if (correct) return "correct";
            return "incorrect";
        }

    Lookup.getTerms($scope.receiveTerms);

})

.controller('InfoCtrl', function($scope, AndroidSpeechRecognizer, Settings) {

    $scope.settings = Settings;

    $scope.supportedLanguages = [];

    $scope.receiveLanguages = function(languages) {
        $scope.supportedLanguages = languages;
        $scope.$apply();
    }

    loadSupportedLanguages = function() {
        AndroidSpeechRecognizer.getSupportedLanguages($scope.receiveLanguages);
    };

    loadSupportedLanguages();
});