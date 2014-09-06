angular.module('gabi', ['ionic', 'ui.router', 'LocalForageModule', 'gabi.services', 'gabi.controllers'])

    .config(['$localForageProvider', function($localForageProvider){
        $localForageProvider.config({
            driver      : 'localStorageWrapper', // if you want to force a driver
            name        : 'gabi', // name of the database and prefix for your data
            version     :  0.1, // version of the database, you shouldn't have to use this
            storeName   : 'gabi-progress', // name of the table
            description : 'stores the users progress'
        });
    }])

    .config(function($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            .state('home', {
                url: '/home',
                templateUrl: 'templates/home.html',
                controller: 'HomeCtrl'
            })

            .state('settings', {
                url: '/settings',
                templateUrl: 'templates/settings.html',
                controller: 'SettingsCtrl'
            })

            .state('missions', {
                url: '/missions',
                templateUrl: 'templates/missions.html',
                controller: 'MissionsCtrl'
            })

            .state('settings-native', {
                url: '/settings-native',
                templateUrl: 'templates/language-native.html',
                controller: 'SettingsCtrl'
            })

            .state('settings-target', {
                url: '/settings-target',
                templateUrl: 'templates/language-target.html',
                controller: 'SettingsCtrl'
            })

            .state('drills', {
                url: '/drills',
                templateUrl: 'templates/drills.html',
                controller: 'DrillsCtrl'
            })

            .state('drill-go', {
                url: '/drill-go',
                templateUrl: 'templates/drill-go.html',
                controller: 'PlayCtrl'
            })

            .state('sims', {
                url: '/sims',
                templateUrl: 'templates/sims.html',
                controller: 'SimsCtrl'
            })

            .state('sim-go', {
                url: '/sim-go',
                templateUrl: 'templates/sim-go.html',
                controller: 'PlayCtrl'
            });

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

//alert("app.js");