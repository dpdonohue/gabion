angular.module("gabi.controllers", [])

    .controller("TranslateCtrl", function($scope, AndroidSpeechRecognizer, GoogleTextToSpeech, GoogleTranslator, Settings, Lookup, Util) {
        $scope.settings = Settings;
        $scope.recognizedSpeech = [];
        $scope.lookup = Lookup;
        var termIndex = 0;
        var currentTerm = [];

        var audioFiles = [];

        var playAudio = function(src) {
            var my_media = new Media(src, audioSucceeded, audioFailed);
            my_media.play();
        };

        var storeAndPlayAudio = function(src, index) {
            audioFiles[index] = src;
            playAudio(src);
        }

        var downloadFile = function(url, fileName, callback, _index) {
            try {
                var fileTransfer = new FileTransfer();
                window.requestFileSystem(
                    LocalFileSystem.TEMPORARY,
                    0,
                    function (fileSystem) {

                        var downloadToDir = fileSystem.root.toURL();
                        var filePath = downloadToDir + fileName;
                        fileTransfer.download(
                            url,
                            filePath,
                            function (entry) {
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
            var termToUpdate = $scope.settings.terms[_termIndex];
            for (var i=0; i < translations.length; i++) {
                var translationObj = translations[i];
                var simplifiedTranslation = translationObj.translatedText;
                termToUpdate.push(simplifiedTranslation);
            };
            $scope.$apply();
        };

        $scope.playAudio = function(text, language) {
            if (audioFiles && audioFiles.length > termIndex && audioFiles[termIndex] != null) {
                playAudio(audioFiles[termIndex]);
                return;
            }
            var src = GoogleTextToSpeech.getUrl(text, language);

            //download
            downloadFile(src, "GabiTTS-" + termIndex, storeAndPlayAudio, termIndex);

        };

        $scope.receiveRecognizedSpeech = function(text) {
            $scope.recognizedSpeech = text;
            $scope.playAudio(currentTerm[1], Settings.targetLocale);
            $scope.$apply();
        };

        $scope.record = function() {
            AndroidSpeechRecognizer.recognizeSpeech($scope.receiveRecognizedSpeech, Settings.targetLocale);
        };

        $scope.translateTerm = function(currentTerm, termIndex) {
            GoogleTranslator.translate(handleTranslation, currentTerm, termIndex, Settings.nativeLocale, Settings.targetLocale);
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
            var targetTerms = [];
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
    //        AndroidTextToSpeech.setLanguage($scope.settings.targetLocale, function(success) {
    //            if (success) {
    //                AndroidTextToSpeech.speak(text);
    //            }
    //        });
    //    };

        Lookup.getTerms($scope.receiveTerms);

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
})









.controller("LetsgoCtrl", function($scope, $state, Settings, Util, GabsClient) {
    $scope.playList = Settings.playList;
    GabsClient.listPlays(Settings.getNativeLanguage(), function(playList) {
        Settings.playList = playList;
        $scope.playList = playList;
        $scope.$apply();
    });

    $scope.goToPlay = function(playid) {
        GabsClient.getPlay(playid, Settings.nativeLocale, Settings.getNativeLanguage(), Settings.targetLocale, Settings.getTargetLanguage(), function(payload) {
            Settings.play = payload.play;
            if (payload.nativeTranslation) {
                Settings.nativeTranslation = payload.nativeTranslation;
            } else {
                Settings.nativeTranslation = {};
            }
            Settings.targetTranslation = payload.targetTranslation;
            $state.go("tab.play");
        });
    }
})











.controller("PlayCtrl", function($scope, AndroidSpeechRecognizer, GoogleTextToSpeech, Settings, Util) {
    $scope.settings = Settings;
    $scope.native = Settings.nativeTranslation;
    $scope.target = Settings.targetTranslation;
    $scope.play = Settings.play;

    $scope.recognizedSpeech = [];
    var pageIndex = 0;
    var audioFiles = [];
    var preparedLines = [];

//    var showNative = function() {
//        return JSON.stringify($scope.native);
//    };

    var playAudio = function(src) {
        var my_media = new Media(src, function(){}, function(){});
        my_media.play();
    };

    var storeAndPlayAudio = function(src, index) {
        audioFiles[index] = src;
        playAudio(src);
    };

    $scope.receiveRecognizedSpeech = function(text) {
        $scope.recognizedSpeech = text;
        $scope.playAudio(currentTerm[1], Settings.targetLocale);
        $scope.$apply();
    };

    $scope.record = function() {
        AndroidSpeechRecognizer.recognizeSpeech($scope.receiveRecognizedSpeech, Settings.targetLocale);
    };

    $scope.nextPage = function() {
        pageIndex++;
        if (pageIndex >= Settings.play.pages.length) pageIndex = $scope.settings.play.pages.length - 1;

        //TODO for now clear previous answer but in future remember given answers
        $scope.recognizedSpeech = [];

        $scope.$apply();
    };

    $scope.previousPage = function() {
        pageIndex--;
        if (pageIndex < 0) pageIndex = 0;

        //for now clear previous answer but in future remember given answers
        $scope.recognizedSpeech = [];

        $scope.$apply();
    };

    $scope.getLines = function() {
        if (preparedLines && preparedLines.length > 0) return preparedLines;
        if (!Settings.play) return;

        var page = Settings.play.pages[pageIndex];
        alert("getLines(): page=" + JSON.stringify(page));

        var lines = [];
        var startLine = page.sln;
        var endLine = page.eln;
        alert("Settings.native=" + JSON.stringify(Settings.native))
        for (var lineIndex=startLine; lineIndex <= endLine; lineIndex++) {
            var actorIndex = Settings.play.lines[lineIndex].act;
            var actorLabel = Settings.play.actors[actorIndex].lbl.toUpperCase();
            alert("line #" + lineIndex + ": " + nativeActor);
            var nativeActor = Settings.native.actors[actorIndex].txt[0];

            if (! nativeActor) nativeActor = actorLabel;
            var targetActor = Settings.target.actors[actorIndex].txt[0];
            if (! targetActor) targetActor = actorLabel;
            var actorImg = Settings.play.actors[actorIndex].img;
            var nativeText = Settings.nativeTranslation.lines[lineIndex].txt[0];
            var targetText = Settings.targetTranslation.lines[lineIndex].txt[0];
            var line = {
                nativeActor: nativeActor,
                targetActor: targetActor,
                nativeText: nativeText,
                targetText: targetText,
                actorImg: actorImg
            };
            lines.push(line);
        }
        preparedLines = lines;
        alert("Lines=" + lines);
        return lines;
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
});