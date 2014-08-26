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

            .state('home', {
                url: '/home',
                views: {
                    'home': {
                        templateUrl: 'templates/home.html',
                        controller: 'HomeCtrl'
                    }
                }
            });

//            .state('settings', {
//                url: '/settings',
//                views: {
//                    'settings': {
//                        templateUrl: 'templates/settings.html',
//                        controller: 'SettingsCtrl'
//                    }
//                }
//            })
//
//            .state('settings-native', {
//                url: '/settings-native',
//                views: {
//                    'settings': {
//                        templateUrl: 'templates/language-native.html',
//                        controller: 'SettingsCtrl'
//                    }
//                }
//            })
//
//            .state('settings-target', {
//                url: '/settings-target',
//                views: {
//                    'settings': {
//                        templateUrl: 'templates/language-target.html',
//                        controller: 'SettingsCtrl'
//                    }
//                }
//            })
//
//            .state('drills', {
//                url: '/drills',
//                views: {
//                    'drills': {
//                        templateUrl: 'templates/drills.html',
//                        controller: 'DrillsCtrl'
//                    }
//                }
//            })
//
//            .state('drill-go', {
//                url: '/drill-go',
//                views: {
//                    'drills': {
//                        templateUrl: 'templates/drill-go.html',
//                        controller: 'PlayCtrl'
//                    }
//                }
//            })
//
//            .state('sims', {
//                url: '/sims',
//                views: {
//                    'sims': {
//                        templateUrl: 'templates/sims.html',
//                        controller: 'SimsCtrl'
//                    }
//                }
//            })
//
//            .state('sim-go', {
//                url: '/sim-go',
//                views: {
//                    'sims': {
//                        templateUrl: 'templates/sim-go.html',
//                        controller: 'PlayCtrl'
//                    }
//                }
//            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/home');

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