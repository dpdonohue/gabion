angular.module('gabi.controllers', [])

.controller('TranslateCtrl', function($scope, AndroidSpeechRecognizer, Settings, Lookup) {
    $scope.settings = Settings;
    $scope.recognizedSpeech = "";
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
        if (termIndex >= $scope.settings.terms.length) termIndex=0;
        currentTerm = $scope.settings.terms[termIndex];
    }

    $scope.receiveTerms = function(terms) {
        $scope.settings.terms = terms;
        $scope.nextTerm();
        $scope.$apply();
    }

    $scope.getTargetTerms = function() {
        var targetTerms = new Array(currentTerm);
        return targetTerms.shift();
    }

    $scope.getNativeTerm = function() {
        return currentTerm[0];
    }

        $scope.getCorrect = function() {
            if (! $scope.recognizedSpeech) return "";
            if (! $scope.getNativeTerm()) return "";
            if (! $scope.getTargetTerms()) return "";
            var correct = false;
            for (var t=0; t<$scope.getTargetTerms().length; t++) {
                for (var s=0; s<$scope.recognizedSpeech.length; s++) {
                    if ($scope.getTargetTerms().equals($scope.recognizedSpeech.toLowerCase())) {
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