angular.module('gabi.controllers', [])

.controller('TranslateCtrl', function($scope, AndroidSpeechRecognizer, GoogleTextToSpeech, GoogleTranslator, Settings, Lookup, Util) {
    $scope.settings = Settings;
    $scope.recognizedSpeech = [];
    $scope.lookup = Lookup;
    var termIndex = 0;
    var currentTerm = [];

        var fileSystem;
        var documentRoot;

        function gotFS(_fileSystem) {
            fileSystem = _fileSystem;
            documentRoot = fileSystem.root.fullPath;
            alert('got FS:' + documentRoot);
        }

        var downloadFile = function(url, fileName) {
            var ft = new FileTransfer();
            ft.download(
                url,
                documentRoot + fileName,
                function(entry) {
                    alert('File Downloaded: ' + fileName + '; entry=' + JSON.stringify(entry));
                },
                function(error) {
                    alert('ERROR downloading File: ' + fileName + '; error=' + JSON.stringify(error));
                }
            );
        }

        var audioSucceeded = function() {

        };

        var audioFailed = function() {

        };

        var handleTranslation = function(response, _termIndex) {
            var translations = response.data.translations;
//            var translationsArr = new Array();
            var termToUpdate = $scope.settings.terms[_termIndex];
//            alert('_termIndex=' + _termIndex);
            for (var i=0; i < translations.length; i++) {
                var translationObj = translations[i];
//                var simplifiedTranslation = translationObj.translatedText.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");
//                var simplifiedTranslation = Util.stripPunctuation(translationObj.translatedText);
                var simplifiedTranslation = translationObj.translatedText;
//                translationsArr.push(simplifiedTranslation);
                termToUpdate.push(simplifiedTranslation);
            };
            $scope.$apply();
        };





    $scope.playAudio = function(text, language) {
        var src = GoogleTextToSpeech.getUrl(text, language);
        downloadFile(src, 'GabiTTS-' + termIndex);
        var my_media = new Media(src, audioSucceeded, audioFailed);

        // Play audio
        my_media.play();
    };

    $scope.receiveRecognizedSpeech = function(text) {
        $scope.recognizedSpeech = text;
        $scope.playAudio(currentTerm[1], Settings.targetLanguage);
        $scope.$apply();
    };

    $scope.record = function() {
        AndroidSpeechRecognizer.recognizeSpeech($scope.receiveRecognizedSpeech, Settings.targetLanguage);
    };

    $scope.translateTerm = function(currentTerm, termIndex) {
        GoogleTranslator.translate(handleTranslation, currentTerm, termIndex, Settings.nativeLanguage, Settings.targetLanguage);
    };

    $scope.nextTerm = function() {
        termIndex++;
        if (termIndex >= $scope.settings.terms.length) termIndex=0;
        currentTerm = $scope.settings.terms[termIndex];

        if (currentTerm.length < 2) {
            $scope.translateTerm(currentTerm, termIndex);
        }
        //for now clear previous answer but in future remember given answers
        $scope.recognizedSpeech = [];

        $scope.$apply();
    };

    $scope.previousTerm = function() {
        termIndex--;
        if (termIndex < 0) termIndex = $scope.settings.terms.length - 1;
        currentTerm = $scope.settings.terms[termIndex];

        //for now clear previous answer but in future remember given answers
        $scope.recognizedSpeech = [];

        $scope.$apply();
    };

    $scope.receiveTerms = function(terms) {
        $scope.settings.terms = terms;
        termIndex = -1;
        $scope.nextTerm();
        $scope.$apply();
    };

    $scope.getTargetTerms = function() {
        var targetTerms = new Array();
        for (var i=1; i<currentTerm.length; i++) {
            targetTerms.push(currentTerm[i]);
        }
        return targetTerms;
    };

    $scope.displayTargetTerms = function() {
        var terms = $scope.getTargetTerms();
        var str = "";
        for (var i=0; i < terms.length; i++) {
            if (str.length > 0) str += ", ";
            str += terms[i];
        }
        return str;
    };

    $scope.displayRecognizedSpeech = function() {
        var terms = $scope.recognizedSpeech;
        var str = "";
        for (var i=0; i < terms.length; i++) {
            if (str.length > 0) str += ", ";
            str += terms[i];
        }
        return str;
    };

    $scope.getNativeTerm = function() {
        return currentTerm[0];
    };

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
                if (Util.stripPunctuation(targetTerms[t].toLowerCase()) == Util.stripPunctuation($scope.recognizedSpeech[s].toLowerCase())) {
                    correct = true;
                    break;
                }
                if (Util.soundex(targetTerms[t]) == Util.soundex($scope.recognizedSpeech[s])) {
                    correct = true;
                    break;
                }
            }
        }
        if (correct) return "correct";
        return "incorrect";
    };

//    $scope.speak = function(text) {
//        AndroidTextToSpeech.setLanguage($scope.settings.targetLanguage, function(success) {
//            if (success) {
//                AndroidTextToSpeech.speak(text);
//            }
//        });
//    };

    Lookup.getTerms($scope.receiveTerms);
//    window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, gotFS, function(err) {
//        alert('Failed to requestFileSystem: ' + JSON.stringify(err));
//    });
        window.resolveLocalFileSystemURI("file:///data/data/io.gablab.gabi", gotFS, function(err) {
            alert('Failed to requestFileSystem: ' + JSON.stringify(err));
        });

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