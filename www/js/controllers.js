angular.module('gabi.controllers', [])

.controller('TranslateCtrl', function($scope, AndroidSpeechRecognizer, Settings) {
    $scope.settings = Settings;
    $scope.recognizedSpeech = "";

    $scope.receiveRecognizedSpeech = function(text) {
        $scope.recognizedSpeech = text;
        $scope.$apply();
    }

    $scope.record = function() {
        AndroidSpeechRecognizer.recognizeSpeech($scope.receiveRecognizedSpeech, Settings.targetLanguage);
    }
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