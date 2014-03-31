angular.module("gabi.controllers", [])

.controller("TranslateCtrl", function($scope, AndroidSpeechRecognizer, GoogleTextToSpeech, GoogleTranslator, Settings, Lookup, Util) {
    $scope.settings = Settings;
    $scope.recognizedSpeech = [];
    $scope.lookup = Lookup;
    var termIndex = 0;
    var currentTerm = [];

        var audioFiles = [];

//        $scope.fileSystem;
//        var documentRoot;

//        var gotFS = function(_fileSystem) {
//            alert("gotFS:" + JSON.stringify(_fileSystem));
//            $scope.fileSystem = _fileSystem;
//        };
//            window.resolveLocalFileSystemURI("file:///data/data/io.gablab.gabi/",
//                function(_dir) {
////                    documentRoot = _fs.root.fullPath;
//                    documentRoot = _dir.;
//                    alert("got FS:" + documentRoot);
//                },
//                function(err) {
//                    alert("Failed to requestFileSystem: " + JSON.stringify(err));
//                }
//            );
//            fileSystem = _fileSystem;

        var playAudio = function(src) {
            var my_media = new Media(src, audioSucceeded, audioFailed);
            my_media.play();
        };

        var storeAndPlayAudio = function(src, index) {
//            if (audioFiles.length < termIndex) {
//                audioFiles.push(src);
//            }
            audioFiles[index] = src;
            playAudio(src);
        }

        var downloadFile = function(url, fileName, callback, _index) {
            try {
                var fileTransfer = new FileTransfer();
//                alert("downloadFile:fileName=" + fileName + "; url=" + url);
                window.requestFileSystem(
                    LocalFileSystem.TEMPORARY,
                    0,
                    function (fileSystem) {
//                        alert("requestFileSystem: fileSystem=" + fileSystem + "; location.href=" + location.href + "; fileSystem.name=" + fileSystem.name + "; fileSystem.root.fullPath=" + fileSystem.root.fullPath);
//                        fileSystem.root.getDirectory("temp", {create: true, exclusive: false},
//                            function (entry) {
//                                alert("entry.fullPath=" + entry.fullPath);
//                                fileTransfer.download(
//                                    url,
//                                    "file://" + entry.fullPath + "/" + fileName,
//                                    function (entry) {
//                                        alert("File Downloaded: " + fileName + "; entry=" + entry);
//                                    },
//                                    function (error) {
//                                        alert("ERROR downloading File: " + fileName + "; error=" + JSON.stringify(error));
//                                    }
//                                );
//                            },
//                            function (error) {
//                                alert("ERROR getting File: " + fileName + "; error=" + JSON.stringify(error));
//                            }
//                        );

                        var downloadToDir = fileSystem.root.toURL();
                        var filePath = downloadToDir + fileName;
//                        alert("downloadToDir=" + downloadToDir);
                        fileTransfer.download(
                            url,
                            filePath,
                            function (entry) {
//                                alert("File Downloaded: " + filePath + "; entry=" + entry);
                                if (callback) callback(filePath, _index);
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
        };

        var audioSucceeded = function() {

        };

        var audioFailed = function() {

        };

        var handleTranslation = function(response, _termIndex) {
            var translations = response.data.translations;
//            var translationsArr = new Array();
            var termToUpdate = $scope.settings.terms[_termIndex];
//            alert("_termIndex=" + _termIndex);
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
        if (audioFiles && audioFiles.length > termIndex && audioFiles[termIndex] != null) {
            playAudio(audioFiles[termIndex]);
//            alert('replaying from: ' + audioFiles[termIndex]);
            return;
        }
        var src = GoogleTextToSpeech.getUrl(text, language);

        //download
        downloadFile(src, "GabiTTS-" + termIndex, storeAndPlayAudio, termIndex);

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
//            alert("getCorrect(): $scope.recognizedSpeech=" + $scope.recognizedSpeech.length + "; $scope.getNativeTerm()=" + $scope.getNativeTerm() + "; $scope.getTargetTerms()=" + $scope.getTargetTerms().length);
        if (! $scope.recognizedSpeech || $scope.recognizedSpeech.length==0) return "";
        var nativeTerm = $scope.getNativeTerm();
        if (! nativeTerm) return "";
        var targetTerms = $scope.getTargetTerms();
        if (! targetTerms) return "";
        var correct = false;
        for (var t=0; t<targetTerms.length; t++) {
            for (var s=0; s<$scope.recognizedSpeech.length; s++) {
                if (correct) break;
//                    alert(targetTerms[t] + " == " + $scope.recognizedSpeech[s].toLowerCase() + "? " + (targetTerms[t] == $scope.recognizedSpeech[s].toLowerCase()))
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
//        alert("Failed to requestFileSystem: " + JSON.stringify(err));
//    });
//        window.resolveLocalFileSystemURI("file:///data/data/io.gablab.gabi", gotFS, function(err) {
//            alert("Failed to requestFileSystem: " + JSON.stringify(err));
//        });

})

.controller("InfoCtrl", function($scope, AndroidSpeechRecognizer, Settings) {

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