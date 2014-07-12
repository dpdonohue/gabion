// Ionic Starter App

//IonicModule.constant('$ionicNavViewConfig', {
//    transition: 'slide-left-right-ios7'
//});

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('gabi', ['ionic', 'ui.router', 'gabi.services', 'gabi.controllers'])


    .config(function($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            // setup an abstract state for the tabs directive
            .state('tab', {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/tabs.html"
            })


//      .state('tab.translate', {
//          url: '/translate',
//          views: {
//              'translate-tab': {
//                  templateUrl: 'templates/translate.html',
//                  controller: 'TranslateCtrl'
//              }
//          }
//      })

            .state('tab.settings', {
                url: '/settings',
                views: {
                    'settings-tab': {
                        templateUrl: 'templates/settings.html',
                        controller: 'SettingsCtrl'
                    }
                }
            })

            .state('tab.settings-native', {
                url: '/settings-native',
                views: {
                    'settings-tab': {
                        templateUrl: 'templates/language-native.html',
                        controller: 'SettingsCtrl'
                    }
                }
            })

            .state('tab.settings-target', {
                url: '/settings-target',
                views: {
                    'settings-tab': {
                        templateUrl: 'templates/language-target.html',
                        controller: 'SettingsCtrl'
                    }
                }
            })

            .state('tab.letsgo', {
                url: '/letsgo',
                views: {
                    'letsgo-tab': {
                        templateUrl: 'templates/letsgo.html',
                        controller: 'LetsgoCtrl'
                    }
                }
            })

            .state('tab.play', {
                url: '/play',
                views: {
                    'play-tab': {
                        templateUrl: 'templates/play.html',
                        controller: 'PlayCtrl'
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/tab/letsgo');

    })

    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    });