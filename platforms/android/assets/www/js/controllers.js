angular.module("gabi.controllers", ["ionic"])

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





.controller("SettingsCtrl", function($scope, $state, AndroidSpeechRecognizer, Settings, LangUtil, UI) {
    $scope.settings = Settings;
    $scope.ui = UI;

//    $scope.supportedLanguages = [];

//    var receiveLanguages = function(languages) {
//        console.log("supported languages=" + JSON.stringify(languages));
//        $scope.supportedLanguages = languages;
////        $scope.$apply();
//    };

//    var loadLanguageInfo = function() {
//        if (Settings.supportedLanguages && Settings.supportedLanguages[Settings.getNativeLanguage()]) return;
//
//        LangUtil.getLanguageMap(Settings.getNativeLanguage(), function(map) {
////            alert("Loaded language map: " + JSON.stringify(map));
//
//            Settings.supportedLanguages[Settings.getNativeLanguage()] = [];
//            AndroidSpeechRecognizer.getSupportedLanguages(function(languages) {
//                for (langi in languages) {
//                    var locale = languages[langi];
////                    var lang = locale.substring(0,2);
////                    var country = locale.substr(3);
////                    var langName = LangUtil.getLanguageName(Settings.getNativeLanguage(), lang);
////                    var langDisplay = langName + " (" + country + ")";
//                    var langDisplay = LangUtil.getLocaleDisplay(Settings.getNativeLanguage(), locale);
//                    Settings.supportedLanguages[Settings.getNativeLanguage()].push(
//                        {
//                            id: languages[langi],
//                            name: langDisplay
//                        }
//                    );
//                }
//
//                //sort the languages
//                Settings.supportedLanguages[Settings.getNativeLanguage()].sort(function(a, b) {
//                    var textA = a.name.toUpperCase();
//                    var textB = b.name.toUpperCase();
//                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
//                });
////                alert("Loaded supportedLanguages= " + Settings.supportedLanguages[Settings.getNativeLanguage()]);
////            LangUtil.getSupportedLanguages(Settings.getNativeLanguage(), receiveLanguages);
//            });
//        });
//    };

    $scope.listSupportedLanguages = function() {
        return Settings.supportedLanguages[Settings.getNativeLanguage()];
    };

    $scope.displayNativeLanguage = function() {
        return LangUtil.getLanguageName(Settings.getNativeLanguage(), Settings.getNativeLanguage());
    };

    $scope.displayTargetLanguage = function() {
        return LangUtil.getLanguageName(Settings.getNativeLanguage(), Settings.getTargetLanguage());
    };

    $scope.displayNativeLocale = function() {
        return LangUtil.getLocaleDisplay(Settings.getNativeLanguage(), Settings.nativeLocale);
    };

    $scope.displayTargetLocale = function() {
        return LangUtil.getLocaleDisplay(Settings.getNativeLanguage(), Settings.targetLocale);
    };

//        $scope.skillLevel = Settings.skillLevels[Settings.targetLocale];

    $scope.goToNative = function() {
        $state.go("tab.settings-native");
    };

    $scope.goToTarget = function() {
        $state.go("tab.settings-target");
    };

//    Settings.skillLevels[Settings.targetLocale] = 1;
    LangUtil.loadLanguageInfo();
})









.controller("LetsgoCtrl", function($scope, $state, Settings, Util, GabsClient) {
    $scope.playList = Settings.playList;
    GabsClient.listPlays(Settings.getNativeLanguage(), function(playList) {
        Settings.playList = playList;
        $scope.playList = playList;
//        $scope.$apply();
    });

    $scope.goToPlay = function(playid) {
//        alert("goToPlay...");
        GabsClient.getPlay(playid, Settings.nativeLocale, Settings.getNativeLanguage(), Settings.targetLocale, Settings.getTargetLanguage(), function(payload) {
//            alert("goToPlay received: " + JSON.stringify(payload.play))
            Settings.play = payload.play;
            if (payload.nativeTranslation) {
                Settings.nativeTranslation = payload.nativeTranslation;
            } else {
                Settings.nativeTranslation = {};
            }
            Settings.targetTranslation = payload.targetTranslation;
            $state.go("tab.play");
        });
    };


})











.controller("PlayCtrl", function($scope, $state, $timeout, $ionicPopup, AndroidSpeechRecognizer, GoogleTextToSpeech, Settings, Util, LangUtil, UI) {
    $scope.settings = Settings;
    $scope.native = Settings.nativeTranslation;
    $scope.target = Settings.targetTranslation;
    $scope.play = Settings.play;

    $scope.recognizedSpeech = [];

    $scope.lineIndex = 0;
//    var audioFiles = [];
    var preparedLines = [];
    var lines = [];
//    var showNative = function() {
//        return JSON.stringify($scope.native);
//    };

    var my_media;

    //the src argument could be a (string) URL, or it could be fileEntry
    var playAudio = function(file, callback) {
        var src = file;
        if (file.fullPath) src = file.fullPath;
//        alert("playAudio: " + src);
        my_media = new Media(src, audioSucceeded, audioFailed);
        my_media.play();
        if (callback) {
//            $timeout(function(){callback()}, 2000);
            callback();
        }
    };

//        var storeAndPlayAudio = function(filename, key) {
//            audioFiles[key] = filename;
//            playAudio(filename);
//        }

    var audioSucceeded = function() {
        if (my_media) my_media.release();
    };

    var audioFailed = function(msg) {
        if (my_media) my_media.release();
        alert("audioFailed: " + JSON.stringify(msg));
    };

    var playOrDownloadAudio = function(text, language, callback) {
        var url = GoogleTextToSpeech.getUrl(text, language);
        var hashedUrl = Util.hashCode(url);
        var filename = "gablab/TTS/tts" + hashedUrl + ".mpeg";
//        alert("playOrDownloadAudio: url=" + url + "; filename=" + filename);
        //if the file exists, play it.  If not, download it then play it
        Util.fileExists(
            filename,
            function(file) {
                playAudio(file, callback);
            },
            function() {
//                alert("file does NOT exist: download and play it");
//                Util.downloadFile(url, filename, playAudio);
                Util.downloadFile(url, filename, function(file) {
                    playAudio(file, callback);
                });
            });
    };

    var receiveRecognizedSpeech = function(text, index) {
        var line = lines[index];
        $scope.recognizedSpeech = text;
//        playAudio(lines[0], Settings.targetLocale);
        var correct = checkResponse(text, index);
        if (correct) {
            line.currentStatus = 1;
            line.success++;
            $scope.$apply();
        } else {
            line.fail++;
            line.currentStatus = -1;
            $scope.$apply();
        }
        playOrDownloadAudio(lines[index].targetText, Settings.targetLocale, function() {
            if (correct && index >= $scope.lineIndex) {
                return advanceLine();
            }
        });

//        if (correct) {
//            line.currentStatus = 1;
//            line.success++;
//            $scope.$apply();
//            if (index >= $scope.lineIndex) {
//                return advanceLine();
//            }
//        } else {
//            line.fail++;
//            line.currentStatus = -1;
//            $scope.$apply();
//        }
//        $scope.$apply();
    };

    // An alert dialog
    $scope.confirmSkip = function(index, callback) {
        var targetTexts = lines[index].targetTexts;
        var message = "";
        for (var ti in targetTexts) {
            var txt = targetTexts[ti];
            message += "<p>\"" + txt + "\"</p>";
        }
        var confirmPopup = $ionicPopup.confirm({
            title: lines[index].nativeText,
            template: message,
            cancelText: "Skip",
            okText: "Try Again"
        });
        confirmPopup.then(function(res) {
            if(res) {
                if (callback) callback();
            } else {
                if (index >= $scope.lineIndex) {
                    lines[index].fail++;
                    lines[index].currentStatus = -1;
                    playTarget(index, function() {
                        advanceLine();
                    });
                }
            }
        });
    };

    $scope.getPageTitleNative = function() {
        var page = Settings.nativeTranslation.pages[Settings.pageIndex];
        if (! page || ! page.txt || page.txt.length == 0) {
            return "";
        }
        return page.txt[0];
    };

    $scope.getPageTitleTarget = function() {
        var page = Settings.targetTranslation.pages[Settings.pageIndex];
        if (! page || ! page.txt || page.txt.length == 0) {
            return "";
        }
        return page.txt[0];
    };

    var playTarget = function(index, callback) {
        playOrDownloadAudio(lines[index].targetText, Settings.targetLocale, callback);
    };

    var playTargetAndAdvance = function(index) {
        playTarget(index, function() {
            $timeout(function() {
                advanceLine();
            }, 2000);
        });
    };

    $scope.playLine = function(index) {
        playTarget(index, function() {
            if (index >= $scope.lineIndex) {
                return advanceLine();
            }
        });
    };

    $scope.record = function(index) {
        var line = lines[index];
        var prompt = UI.localize("Say in " + LangUtil.getLocaleDisplay(Settings.getNativeLanguage(), Settings.targetLocale));
        if (line.fail >= 2) {
            $scope.confirmSkip(index, function() {
                AndroidSpeechRecognizer.recognizeSpeech(prompt, line.nativeText, Settings.targetLocale, receiveRecognizedSpeech, index);
            })
        } else {
            AndroidSpeechRecognizer.recognizeSpeech(prompt, line.nativeText, Settings.targetLocale, receiveRecognizedSpeech, index);
        }
    };

    $scope.nextPage = function() {
        Settings.pageIndex++;
        if (Settings.pageIndex >= Settings.play.pages.length) Settings.pageIndex = $scope.settings.play.pages.length - 1;
        $scope.lineIndex = Settings.play.pages[Settings.pageIndex].sln;
        var lines = $scope.getLines();
//        $scope.$apply();
        $state.go("tab.play", {}, {reload: true});
    };

    $scope.previousPage = function() {
        Settings.pageIndex--;
        if (Settings.pageIndex < 0) {
            Settings.pageIndex = 0;
            $state.go("tab.letsgo");
            return;
        }

        $scope.lineIndex = Settings.play.pages[Settings.pageIndex].sln;
        $scope.getLines();
//        $scope.$apply();
        $state.go("tab.play", {}, {reload: true});
    };

    $scope.getLines = function() {
        if (preparedLines && preparedLines.length > 0) return preparedLines;
        if (!Settings.play) return;

        var page = Settings.play.pages[Settings.pageIndex];

        var startLine = page.sln;
        var endLine = page.eln;

//        alert("Settings.targetTranslation=" + JSON.stringify(Settings.targetTranslation))
        var index = 0;
        for (var linei = startLine; linei <= endLine; linei++) {
            var actorIndex = Settings.play.lines[linei].act;
            var actorLabel = Settings.play.actors[actorIndex].lbl.toUpperCase();
            var nativeActor = Settings.nativeTranslation.actors[actorIndex].txt[0];
            if (! nativeActor) nativeActor = actorLabel;
            //ERROR BELOW SOMEWHERE
            var targetActor = Settings.targetTranslation.actors[actorIndex].txt[0];
            if (! targetActor) targetActor = actorLabel;
            var actorImg = Settings.play.actors[actorIndex].img;
            var nativeText = Settings.nativeTranslation.lines[linei].txt[0];
            var targetText = Settings.targetTranslation.lines[linei].txt[0];
            var targetTexts = Settings.targetTranslation.lines[linei].txt;
            if ( (actorLabel=="YOU") && !actorImg) {
                actorImg = "http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/64/Emotes-face-smile-icon.png";
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
//            alert("line #" + lineIndex + ": " + JSON.stringify(line));
            lines.push(line);
            index++;
        }
        preparedLines = lines;
        return lines;
    };

    $scope.getMyIcon = function(index) {
        var line = lines[index];
        var emotion = "smile";
        if (line.currentStatus==1) {
            if (line.fail == 0) emotion = "smile-big";
            if (line.fail == 1) emotion = "smile";
            if (line.fail == 2) emotion = "wink";
            if (line.fail == 3) emotion = "raspberry";
            if (line.fail > 4) emotion = "uncertain";
        }

        if (line.currentStatus==-1) {
            if (line.fail == 1) emotion = "wink";
            if (line.fail == 2) emotion = "uncertain";
            if (line.fail == 3) emotion = "surprise";
            if (line.fail > 3) emotion = "embarrassed";
        }

        return "http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/64/Emotes-face-" + emotion + "-icon.png";
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

    var advanceLine = function() {
        if ($scope.lineIndex < lines.length) {
            $scope.lineIndex++;
            $scope.$apply();
//            var newline = lines[$scope.lineIndex];
            //Stop auto-advancing - comment out the below
//            if (! newline.isYou) {
//                $timeout(function() {playTargetAndAdvance($scope.lineIndex)}, 1000);
//            }
        }
    };

    $scope.showBottomNav = function() {
        return $scope.lineIndex >= lines.length;
    };

    //iheard can be a string or an array of strings
    var checkResponse = function(iheard, index) {
//        alert("checkResponse(): iheard=" + iheard + "; index=" + index);
        var line = lines[index];
        if (! iheard || iheard.length==0) {
            return;
        }
        if( typeof iheard === 'string' ) {
            iheard = [ iheard ];
        }
        var correct = false;

        var acceptableResponses = line.targetTexts;
        if (! acceptableResponses) {
            alert("No acceptableResponses for Settings.pageIndex=" + Settings.pageIndex + "; line=" + index);
            return;
        }
        for (var t=0; t<acceptableResponses.length; t++) {
            for (var s=0; s < iheard.length; s++) {
//                alert("t=" + t + "; s=" + s);
                if (Util.stripPunctuation(acceptableResponses[t].toLowerCase()) == Util.stripPunctuation(iheard[s].toLowerCase())) {
                    correct = true;
                    break;
                }
                if (Util.soundex(acceptableResponses[t]) == Util.soundex(iheard[s])) {
                    correct = true;
                    break;
                }
            }
        }

        return correct;
    };

    $scope.swipeLeft = function(elem) {
        $scope.nextPage();
    };

    $scope.swipeRight = function(elem) {
        $scope.previousPage();
    };

    $scope.getPageImage = function() {
        var page = Settings.play.pages[Settings.pageIndex];
        if (page && page.img) return page.img;
        return Settings.play.img;
    };

    $scope.isActiveButton = function(index) {
//        if (endLine)
        return index == $scope.lineIndex;
    };

    $scope.isPageFinished = function() {
        var endLine = Settings.play.pages[Settings.pageIndex].eln;
        return ($scope.lineIndex > endLine);
    };

    //initialize
    LangUtil.loadLanguageInfo();
    $scope.getLines();
//    if (! lines[$scope.lineIndex].isYou) {
//        playTargetAndAdvance($scope.lineIndex);
//    }
});