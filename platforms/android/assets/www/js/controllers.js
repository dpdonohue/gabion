angular.module("gabi.controllers", ["ionic"])


.controller("SettingsCtrl", function($scope, $state, AndroidSpeechRecognizer, Settings, LangUtil, GabsClient) {
    $scope.settings = Settings;

    $scope.listSupportedLanguages = function() {
//        alert("Settings.getNativeLanguage()=" + Settings.getNativeLanguage() + ": " + );
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

//        $scope.skillLevel = Settings.skillLevels[Settings.targetLocale];

    $scope.goToNative = function() {
        $state.go("tab.settings-native");
    };

    $scope.goToTarget = function() {
        $state.go("tab.settings-target");
    };

    $scope.localize = function(english) {
//        alert("Existing localizations: " + JSON.stringify(Settings.localizations));
//        GabsClient.localize(english, Settings.nativeLocale, Settings.getNativeLanguage(), function(localizedText) {});
        return Settings.getLocalizedText(english);
    };

    $scope.showLocalizations = function() {
        return JSON.stringify(Settings.supportedLanguages) + "\n\n" + JSON.stringify(Settings.localizations);
    }

//    Settings.skillLevels[Settings.targetLocale] = 1;
    LangUtil.loadLanguageInfo();
    LangUtil.loadLanguageInfo("en-US");

    GabsClient.prepareLocalizations(["Your language", "Learning language", "Your proficiency level"]);
//    $scope.localize("Your language");
//    $scope.localize("Learning");
//    $scope.localize("Your proficiency level");
//    LangUtil.loadLanguageInfo();

})









.controller("LetsgoCtrl", function($scope, $state, Settings, Util, GabsClient, LangUtil) {
    $scope.playList = Settings.playList;


    $scope.goToPlay = function(playid) {
//        alert("goToPlay...");
        GabsClient.getPlay(playid, Settings.nativeLocale,  Settings.targetLocale, function(payload) {
//            alert("goToPlay received: " + JSON.stringify(payload.nativeTranslation));
            Settings.play = payload.play;
            if (payload.nativeTranslation) {
                Settings.nativeTranslation = payload.nativeTranslation;
            } else {
                Settings.nativeTranslation = {};
            }
            Settings.targetTranslation = payload.targetTranslation;
            Settings.loadLines();
            $state.go("tab.play");
        });
    };

    $scope.localize = function(english) {
//        GabsClient.localize(english, Settings.nativeLocale, Settings.getNativeLanguage(), function(localizedText) {});
        return Settings.getLocalizedText(english);
    };

    //initialize
//    alert("Initializing LetsGo...");
//    $scope.localize("Select a Simulation");

//    $scope.$watch('Settings.playList', function() {
//        $scope.playList = Settings.playList;
//    });

    LangUtil.loadLanguageInfo();
    LangUtil.loadLanguageInfo("en-US");

    GabsClient.prepareLocalizations(["Select a Simulation"]);

    if (Settings.loadedPlaysLevel == Settings.skillLevel) {
        $scope.playList = Settings.playList;
    } else {
        GabsClient.listPlays(Settings.nativeLocale, Settings.skillLevel, function (playList) {
            if (!playList) playList = [];
            Settings.playList = playList;
            Settings.loadedPlaysLevel = Settings.skillLevel;
            $scope.playList = playList;
//            alert("loaded plays: skill=" + Settings.skillLevel + "; play list has " + $scope.playList.length + "; Settings.loadedPlaysLevel=" + Settings.loadedPlaysLevel + "; applying...");
//            $scope.$apply();
        });
    };
})











.controller("PlayCtrl", function($scope, $state, $timeout, $ionicPopup, AndroidSpeechRecognizer, GoogleTextToSpeech, Settings, Util, LangUtil, GabsClient) {
    $scope.settings = Settings;
    $scope.native = Settings.nativeTranslation;
    $scope.target = Settings.targetTranslation;
    $scope.play = Settings.play;

    $scope.recognizedSpeech = [];

    $scope.lineIndex = 0;
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
            $scope.$apply();
        } else {
            line.fail++;
            line.currentStatus = -1;
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
        return Settings.lines;
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
        playOrDownloadAudio(Settings.lines[index].targetText, Settings.targetLocale, callback);
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

    $scope.goBack = function() {
        Settings.pageIndex = 0;
        $state.go("tab.letsgo");
        return;
    };

    $scope.nextPage = function() {
        Settings.pageIndex++;
        if (Settings.pageIndex >= Settings.play.pages.length) Settings.pageIndex = $scope.settings.play.pages.length - 1;
        $scope.lineIndex = Settings.play.pages[Settings.pageIndex].sln;
//        var lines = $scope.getLines();
//        $scope.$apply();
        $state.go("tab.play", {}, {reload: true});
    };

    $scope.previousPage = function() {
        Settings.pageIndex--;
        if (Settings.pageIndex < 0) {
            $scope.goBack();
            return;
        }

        $scope.lineIndex = Settings.play.pages[Settings.pageIndex].sln;
//        $scope.getLines();
//        $scope.$apply();
        $state.go("tab.play", {}, {reload: true});
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
        return $scope.lineIndex >= Settings.lines.length;
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

//    $scope.isPageFinished = function() {
//        if (! Settings.play.pages) return true;
//        var endLine = Settings.play.pages[Settings.pageIndex].eln;
//        return ($scope.lineIndex > endLine);
//    };

    $scope.isPlayFinished = function() {
        if (! Settings.play.pages) return true;
        var endLine = Settings.play.lines.length - 1;
        return ($scope.lineIndex > endLine);
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

    GabsClient.prepareLocalizations(["Gab", "Skip", "Try Again", "Finished", "Previous", "Next", prompt]);
//    $scope.getLines();
//    if (! lines[$scope.lineIndex].isYou) {
//        playTargetAndAdvance($scope.lineIndex);
//    }
});