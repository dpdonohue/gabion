//LEGACY!
//    .controller("TranslateCtrl", function($scope, AndroidSpeechRecognizer, GoogleTextToSpeech, GoogleTranslator, Settings, Lookup, Util) {
//        $scope.settings = Settings;
//        $scope.recognizedSpeech = [];
//        $scope.lookup = Lookup;
//        var termIndex = 0;
//        var currentTerm = [];
//
//        var audioFiles = [];
//
//        var playAudio = function(filepath) {
//            var my_media = new Media(filepath, audioSucceeded, audioFailed);
//            my_media.play();
//        };
//
//        var storeAndPlayAudio = function(src, index) {
//            audioFiles[index] = src;
//            playAudio(src);
//        }
//
//        var downloadFile = function(url, fileName, callback) {
//            try {
//                var fileTransfer = new FileTransfer();
//                window.requestFileSystem(
//                    LocalFileSystem.TEMPORARY,
//                    0,
//                    function (fileSystem) {
//
//                        var downloadToDir = fileSystem.root.toURL();
//                        var filePath = downloadToDir + fileName;
//                        fileTransfer.download(
//                            url,
//                            filePath,
//                            function (entry) {
//                                if (callback) callback(filePath, _index);
//                            },
//                            function (error) {
//                                alert("ERROR downloading File: " + filePath + "; error=" + error);
//                            }
//                        );
//                    },
//                    function (err) {
//                        alert("Failed to requestFileSystem: " + err);
//                    }
//                );
//            } catch (e) {
//                alert("error in downloadFile: " + e);
//            }
//        };
//
//        var audioSucceeded = function() {
//
//        };
//
//        var audioFailed = function() {
//
//        };
//
//        var handleTranslation = function(response, _termIndex) {
//            var translations = response.data.translations;
//            var termToUpdate = $scope.settings.terms[_termIndex];
//            for (var i=0; i < translations.length; i++) {
//                var translationObj = translations[i];
//                var simplifiedTranslation = translationObj.translatedText;
//                termToUpdate.push(simplifiedTranslation);
//            };
//            $scope.$apply();
//        };
//
//        $scope.playAudio = function(text, language) {
//            var textHash = Util.hashCode(language + ":" + text);
//            if (audioFiles && audioFiles[textHash] != null) {
//                playAudio(audioFiles[textHash]);
//                return;
//            }
//            var src = GoogleTextToSpeech.getUrl(text, language);
//
//            //download
//            downloadFile(src, "GabiTTS-" + textHash, storeAndPlayAudio);
//
//        };
//
//        $scope.receiveRecognizedSpeech = function(text) {
//            $scope.recognizedSpeech = text;
//            $scope.playAudio(currentTerm[1], Settings.targetLocale);
//            $scope.$apply();
//        };
//
//        $scope.record = function() {
//            AndroidSpeechRecognizer.recognizeSpeech($scope.receiveRecognizedSpeech, Settings.targetLocale);
//        };
//
//        $scope.translateTerm = function(currentTerm, termIndex) {
//            GoogleTranslator.translate(handleTranslation, currentTerm, termIndex, Settings.nativeLocale, Settings.targetLocale);
//        };
//
//        $scope.nextTerm = function() {
//            termIndex++;
//            if (termIndex >= $scope.settings.terms.length) termIndex=0;
//            currentTerm = $scope.settings.terms[termIndex];
//
//            if (currentTerm.length < 2) {
//                $scope.translateTerm(currentTerm, termIndex);
//            }
//            //for now clear previous answer but in future remember given answers
//            $scope.recognizedSpeech = [];
//
//            $scope.$apply();
//        };
//
//        $scope.previousTerm = function() {
//            termIndex--;
//            if (termIndex < 0) termIndex = $scope.settings.terms.length - 1;
//            currentTerm = $scope.settings.terms[termIndex];
//
//            //for now clear previous answer but in future remember given answers
//            $scope.recognizedSpeech = [];
//
//            $scope.$apply();
//        };
//
//        $scope.receiveTerms = function(terms) {
//            $scope.settings.terms = terms;
//            termIndex = -1;
//            $scope.nextTerm();
//            $scope.$apply();
//        };
//
//        $scope.getTargetTerms = function() {
//            var targetTerms = [];
//            for (var i=1; i<currentTerm.length; i++) {
//                targetTerms.push(currentTerm[i]);
//            }
//            return targetTerms;
//        };
//
//        $scope.displayTargetTerms = function() {
//            var terms = $scope.getTargetTerms();
//            var str = "";
//            for (var i=0; i < terms.length; i++) {
//                if (str.length > 0) str += ", ";
//                str += terms[i];
//            }
//            return str;
//        };
//
//        $scope.displayRecognizedSpeech = function() {
//            var terms = $scope.recognizedSpeech;
//            var str = "";
//            for (var i=0; i < terms.length; i++) {
//                if (str.length > 0) str += ", ";
//                str += terms[i];
//            }
//            return str;
//        };
//
//        $scope.getNativeTerm = function() {
//            return currentTerm[0];
//        };
//
//        $scope.getCorrect = function() {
//    //            alert("getCorrect(): $scope.recognizedSpeech=" + $scope.recognizedSpeech.length + "; $scope.getNativeTerm()=" + $scope.getNativeTerm() + "; $scope.getTargetTerms()=" + $scope.getTargetTerms().length);
//            if (! $scope.recognizedSpeech || $scope.recognizedSpeech.length==0) return "";
//            var nativeTerm = $scope.getNativeTerm();
//            if (! nativeTerm) return "";
//            var targetTerms = $scope.getTargetTerms();
//            if (! targetTerms) return "";
//            var correct = false;
//            for (var t=0; t<targetTerms.length; t++) {
//                for (var s=0; s<$scope.recognizedSpeech.length; s++) {
//                    if (correct) break;
//                    if (Util.stripPunctuation(targetTerms[t].toLowerCase()) == Util.stripPunctuation($scope.recognizedSpeech[s].toLowerCase())) {
//                        correct = true;
//                        break;
//                    }
//                    if (Util.soundex(targetTerms[t]) == Util.soundex($scope.recognizedSpeech[s])) {
//                        correct = true;
//                        break;
//                    }
//                }
//            }
//            if (correct) return "correct";
//            return "incorrect";
//        };
//
//    //    $scope.speak = function(text) {
//    //        AndroidTextToSpeech.setLanguage($scope.settings.targetLocale, function(success) {
//    //            if (success) {
//    //                AndroidTextToSpeech.speak(text);
//    //            }
//    //        });
//    //    };
//
//        Lookup.getTerms($scope.receiveTerms);
//
//    })



