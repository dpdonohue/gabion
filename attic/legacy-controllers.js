angular.module("gabi.controllers", ["ionic"])


.controller("HomeCtrl", function() {

        alert("HomeCtrl...");
//        $scope.displayNativeLanguage = function() {
//            return LangUtil.getLanguageName(Settings.nativeLocale, Settings.nativeLocale);
//        };
//
//        $scope.displayTargetLanguage = function() {
//            return LangUtil.getLanguageName(Settings.nativeLocale, Settings.targetLocale);
//        };
//
//        $scope.displayNativeLocale = function() {
//            return LangUtil.getLocaleDisplay(Settings.nativeLocale, Settings.nativeLocale);
//        };
//
//        $scope.displayTargetLocale = function() {
//            return LangUtil.getLocaleDisplay(Settings.nativeLocale, Settings.targetLocale);
//        };
//
////        $scope.goToNative = function() {
////            $state.go("settings-native");
////        };
////
////        $scope.goToTarget = function() {
////            $state.go("settings-target");
////        };
//
//        $scope.localize = function(english) {
//            return Settings.getLocalizedText(english);
//        };
//
//
//        LangUtil.loadLanguageInfo();
//        LangUtil.loadLanguageInfo("en-US");
//
//        GabsClient.prepareLocalizations(["Home", "Settings", "Your Language", "Learning Language", "Your proficiency level"]);
})




.controller("SettingsCtrl", function($scope, $state, AndroidSpeechRecognizer, Settings, LangUtil, GabsClient) {
    $scope.settings = Settings;

    $scope.listSupportedLanguages = function() {
//        alert("Settings.supportedLanguages=" + JSON.stringify(Settings.supportedLanguages));
        return Settings.supportedLanguages[LangUtil.getLanguageId(Settings.nativeLocale)];
    };

    $scope.displayNativeLanguage = function() {
        return LangUtil.getLanguageName(Settings.nativeLocale, Settings.nativeLocale);
    };

    $scope.displayTargetLanguage = function() {
        return LangUtil.getLanguageName(Settings.nativeLocale, Settings.targetLocale);
    };

    $scope.displayNativeLocale = function() {
        return LangUtil.getLocaleDisplay(Settings.nativeLocale, Settings.nativeLocale);
    };

    $scope.displayTargetLocale = function() {
        return LangUtil.getLocaleDisplay(Settings.nativeLocale, Settings.targetLocale);
    };

    $scope.goToNative = function() {
        $state.go("tab.settings-native");
    };

    $scope.goToTarget = function() {
        $state.go("tab.settings-target");
    };

    $scope.localize = function(english) {
        return Settings.getLocalizedText(english);
    };

    $scope.showLocalizations = function() {
        return JSON.stringify(Settings.supportedLanguages) + "\n\n" + JSON.stringify(Settings.localizations);
    }

//    Settings.skillLevels[Settings.targetLocale] = 1;
    LangUtil.loadLanguageInfo();
    LangUtil.loadLanguageInfo("en-US");

    GabsClient.prepareLocalizations(["Settings", "Your Language", "Learning Language", "Your proficiency level"]);

})









.controller("SimsCtrl", function($scope, $state, Settings, Util, GabsClient, LangUtil) {
    $scope.playList = Settings.playList;

    $scope.goToPlay = function(playid) {
        GabsClient.getPlay(playid, Settings.nativeLocale,  Settings.targetLocale, function(payload) {
            Settings.play = payload.play;
            if (payload.nativeTranslation) {
                Settings.nativeTranslation = payload.nativeTranslation;
            } else {
                Settings.nativeTranslation = {};
            }
            Settings.targetTranslation = payload.targetTranslation;
            Settings.loadLines();
            $state.go("tab.sim-go");
        });
    };

    $scope.localize = function(english) {
        return Settings.getLocalizedText(english);
    };

    //initialize
    LangUtil.loadLanguageInfo();
    LangUtil.loadLanguageInfo("en-US");

    GabsClient.prepareLocalizations(["Travel", "Go", "Select a Simulation"]);

    if (Settings.loadedPlaysLevel == Settings.skillLevel && Settings.loadedPlaysLoc == Settings.nativeLocale) {
        $scope.playList = Settings.playList;
    } else {
        GabsClient.listPlays("trip", Settings.nativeLocale, Settings.skillLevel, function (playList) {
            if (!playList) playList = [];
            Settings.playList = playList;
            Settings.loadedPlaysLevel = Settings.skillLevel;
            Settings.loadedPlaysLoc = Settings.nativeLocale;
            $scope.playList = playList;
        });
    };
})





.controller("DrillsCtrl", function($scope, $state, Settings, Util, GabsClient, LangUtil) {
    $scope.drillList = Settings.drillList;

    $scope.goToPlay = function(playid) {
        GabsClient.getPlay(playid, Settings.nativeLocale,  Settings.targetLocale, function(payload) {
            Settings.play = payload.play;
            if (payload.nativeTranslation) {
                Settings.nativeTranslation = payload.nativeTranslation;
            } else {
                Settings.nativeTranslation = {};
            }
            Settings.targetTranslation = payload.targetTranslation;
            Settings.loadLines();
            $state.go("tab.drill-go");
        });
    };

    $scope.localize = function(english) {
        return Settings.getLocalizedText(english);
    };

    //initialize
    LangUtil.loadLanguageInfo();
    LangUtil.loadLanguageInfo("en-US");

    GabsClient.prepareLocalizations(["Learn", "Go", "Select a Lesson", "Lesson"]);

    if (Settings.loadedDrillsLevel == Settings.skillLevel && Settings.loadedDrillsLoc == Settings.nativeLocale) {
        $scope.drillList = Settings.drillList;
    } else {
        GabsClient.listPlays("drill", Settings.nativeLocale, Settings.skillLevel, function (drillList) {
            if (!drillList) drillList = [];
            Settings.drillList = drillList;
            Settings.loadedDrillsLevel = Settings.skillLevel;
            Settings.loadedDrillsLoc = Settings.nativeLocale;
            $scope.drillList = drillList;
        });
    };
})









.controller("PlayCtrl", function($scope, $state, $timeout, $ionicPopup, AndroidSpeechRecognizer, GoogleTextToSpeech, Settings, Util, LangUtil, GabsClient) {
    $scope.settings = Settings;
    $scope.native = Settings.nativeTranslation;
    $scope.target = Settings.targetTranslation;
    $scope.play = Settings.play;

    $scope.playIsFinished = false;

    $scope.recognizedSpeech = [];

    $scope.lineIndex = 0;

    if (Settings.play.pages && Settings.play.pages.length > Settings.pageIndex) {
        $scope.lineIndex = Settings.play.pages[Settings.pageIndex].sln;
    } else {
        $scope.lineIndex = 0;
    }

//    var audioFiles = [];
    var preparedLines = [];
//    var lines = [];
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
        var line = Settings.lines[index];
        $scope.recognizedSpeech = text;
//        playAudio(lines[0], Settings.targetLocale);
        var correct = checkResponse(text, index);

        if (correct) {
            line.currentStatus = 1;
            line.success++;
            if (Settings.debugMode) alert("Correct!  I heard:\n" + text);
            $scope.$apply();
        } else {
            line.fail++;
            line.currentStatus = -1;
            if (Settings.debugMode) alert("Fail. # of Fails=" + line.fail + ";I heard:\n" + text);
            $scope.$apply();
        }
        playOrDownloadAudio(Settings.lines[index].targetText, Settings.targetLocale, function() {
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
        var targetTexts = Settings.lines[index].targetTexts;
        var message = "";
        for (var ti in targetTexts) {
            var txt = targetTexts[ti];
            message += "<p>\"" + txt + "\"</p>";
        }
        var confirmPopup = $ionicPopup.confirm({
            title: Settings.lines[index].nativeText,
            template: message,
            cancelText: $scope.localize("Skip"),
            okText: $scope.localize("Try Again")
        });
        confirmPopup.then(function(res) {
            if(res) {
                if (callback) callback();
            } else {
                if (index >= $scope.lineIndex) {
                    Settings.lines[index].fail++;
                    Settings.lines[index].currentStatus = -1;
                    playTarget(index, function() {
                        advanceLine();
                        $scope.$apply();
                    });
                }
            }
        });
    };

    $scope.getLines = function() {
        try {
            var page = Settings.play.pages[Settings.pageIndex];
//            alert("page=" + JSON.stringify(page));
            var linesArray = [];
            for (var linei=page.sln; linei <= page.eln; linei++) {
                linesArray.push(Settings.lines[linei]);
            }
            return linesArray;
        } catch (err) {
            alert(err);
        }
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
//        alert("playTarget(" + index + ") " + JSON.stringify(Settings.lines));
        playOrDownloadAudio(Settings.lines[index].targetText, Settings.targetLocale, callback);
    };

    var playTargetAndAdvance = function(index) {
        playTarget(index, function() {
            $timeout(function() {
                advanceLine();
            }, 2000);
        });
    };

        /**
         * This is called from play.html when the other person speaks
         * @param index
         */
    $scope.playLine = function(index) {
        playTarget(index, function() {
            Settings.lines[index].currentStatus = 1;
            if (index >= $scope.lineIndex) {
//                alert("index=" + index + "; set currentStatus to 1");
                return advanceLine();
            }
        });
    };

    $scope.record = function(index) {

        var line = Settings.lines[index];
        var targetLanguageInEnglish = LangUtil.getLocaleDisplay("en-US", Settings.targetLocale, true);
        var textToLocalize = "Say in " + targetLanguageInEnglish;

//        GabsClient.localize(textToLocalize, Settings.getTargetLanguage(), Settings.targetLocale, function(prompt) {
        var prompt = $scope.localize(textToLocalize);
        if (Settings.parseCountry(Settings.targetLocale)) prompt += " (" +  Settings.parseCountry(Settings.targetLocale) + ")";
        prompt += ": " + line.nativeText;
//        alert("Record()ing: prompt=" + prompt);
        if (line.fail >= 1) {
            $scope.confirmSkip(index, function() {
                AndroidSpeechRecognizer.recognizeSpeech(prompt, line.nativeText, Settings.targetLocale, receiveRecognizedSpeech, index);
            })
        } else {
            AndroidSpeechRecognizer.recognizeSpeech(prompt, line.nativeText, Settings.targetLocale, receiveRecognizedSpeech, index);
        }
//        });
    };

    $scope.goToTrips = function() {
        Settings.pageIndex = 0;
        $state.go("tab.sims");
        return;
    };

    $scope.goToDrills = function() {
        Settings.pageIndex = 0;
        $state.go("tab.drills");
        return;
    };

    $scope.nextPage = function() {
        Settings.pageIndex++;
        if (Settings.pageIndex >= Settings.play.pages.length) Settings.pageIndex = $scope.settings.play.pages.length - 1;
        $scope.lineIndex = Settings.play.pages[Settings.pageIndex].sln;
//        Settings.loadLines();
//        var lines = $scope.getLines();
//        $scope.$apply();
        $state.go("tab.sim-go", {}, {reload: true});
    };

    $scope.previousTripPage = function() {
        Settings.pageIndex--;
        if (Settings.pageIndex < 0) {
            $scope.goToTrips();
            return;
        }
        $scope.lineIndex = Settings.play.pages[Settings.pageIndex].sln;
        $state.go("tab.sim-go", {}, {reload: true});
    };

    $scope.previousDrillPage = function() {
        Settings.pageIndex--;
        if (Settings.pageIndex < 0) {
            $scope.goToDrills();
            return;
        }
        $scope.lineIndex = Settings.play.pages[Settings.pageIndex].sln;
        $state.go("tab.drill-go", {}, {reload: true});
    };

//    $scope.getLines = function() {
//
//    };

    $scope.getMyIcon = function(index) {
        var line = Settings.lines[index];
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
//        alert("Advancing to line index: " + $scope.lineIndex + 1);
//        $scope.lineIndex++;
//        $scope.$apply();
        if ($scope.lineIndex < Settings.lines.length) {
            $scope.lineIndex++;
            $scope.$apply();
//            var newline = lines[$scope.lineIndex];
            //Stop auto-advancing - comment out the below
//            if (! newline.isYou) {
//                $timeout(function() {playTargetAndAdvance($scope.lineIndex)}, 1000);
//            }
        }
    };

    $scope.isPageFinished = function() {
        var page = Settings.play.pages[Settings.pageIndex];
        return $scope.lineIndex > page.eln;
    };

    //iheard can be a string or an array of strings
    var checkResponse = function(iheard, index) {
//        alert("checkResponse(): iheard=" + iheard + "; index=" + index);
        var line = Settings.lines[index];
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

    $scope.swipeTripLeft = function(elem) {
        $scope.nextPage();
    };

    $scope.swipeTripRight = function(elem) {
        $scope.previousTripPage();
    };

    $scope.swipeDrillLeft = function(elem) {
        $scope.nextPage();
    };

    $scope.swipeDrillRight = function(elem) {
        $scope.previousDrillPage();
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

//    $scope.isPageFinished = function() {
//        if (! Settings.play.pages) return true;
//        var endLine = Settings.play.pages[Settings.pageIndex].eln;
//        return ($scope.lineIndex > endLine);
//    };

        /**
         * The play is finished when the last line is complete
         * @returns {*|line.currentStatus|number|Settings.lines.currentStatus}
         */
    $scope.isPlayFinished = function() {
        if ($scope.playIsFinished) return true;
        try {
            for (var lineIx=Settings.lines.length-1; lineIx >= 0; lineIx--) {
                var line = Settings.lines[lineIx];
                if (! line.isYou) continue;
                if (! line) return false;
                if (! line.currentStatus) return false;
                if ( line.currentStatus != 1) return false;
            }
            $scope.playIsFinished = true;
            return true;

//        if (! Settings.play.pages) return true;
//        var atLastLine = $scope.lineIndex >= (Settings.lines.length - 1);
//            var lastLineFinished = Settings.lines[$scope.lineIndex] && Settings.lines[$scope.lineIndex].currentStatus;
//        return atLastLine && lastLineFinished;
//            alert("$scope.lineIndex=" + $scope.lineIndex + "; endLine=" + endLine + "; lastLineFinished=" + lastLineFinished);
//            return ($scope.lineIndex >= endLine && lastLineFinished);
        } catch (err) {
            alert(err);
            return false;
        }
    };

    $scope.hasNextPage = function() {
        if (! Settings.play.pages) return false;
        return Settings.pageIndex < (Settings.play.pages.length - 1);
    };

        //Refactor from Englisg
    $scope.localize = function(english) {
//        GabsClient.localize(english, "en", Settings.getNativeLanguage(), function(localizedText) {});
        return Settings.getLocalizedText(english);
    };

    $scope.getPageBackgroundStyle = function() {
        if ($scope.isPageFinished() || $scope.isPlayFinished()) {
            return "gabi-page-finished";
        }
        return "";
    };

//    $scope.nextButtonStyle = function() {
//        if ($scope.isPageFinished()) {
//            return "gabi-button-highlighted";
//        }
//        return "gabi-button-old";
//    };
    //initialize
//    $scope.$watch('Settings.playList', function() {
//        $scope.getLines();
//    });

    LangUtil.loadLanguageInfo();
    LangUtil.loadLanguageInfo("en-US");

//    $scope.localize("Gab");
//    $scope.localize("Skip");
//    $scope.localize("Try Again");
    var targetLanguageInEnglish = LangUtil.getLocaleDisplay("en-US", Settings.targetLocale, true);
    var prompt = "Say in " + targetLanguageInEnglish;
//    $scope.localize(textToLocalize);

//    var targetLanguageInEnglish = LangUtil.getLanguageName("en", Settings.targetLocale);
//    var prompt = "Say in " + targetLanguageInEnglish;

//    GabsClient.prepareLocalizations(["Gab", "Skip", "Try Again", "Finished", "Previous", "Next", prompt]);
        GabsClient.prepareLocalizations(["Travel", "Go", "Gab", "Skip", "Try Again", "Finished", "Previous", "Next", prompt]);
//    $scope.getLines();
//    if (! lines[$scope.lineIndex].isYou) {
//        playTargetAndAdvance($scope.lineIndex);
//    }
});