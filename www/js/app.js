
angular.module('roadshow', [
    'ionic',
    'config',
    'controller',
    'service',
    'ngCordova',
    'tabSlideBox',
    'ngIOS9UIWebViewPatch'])

.run(function ($ionicPlatform,$timeout,App) {
    $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            StatusBar.styleLightContent();
        }
    });
    document.addEventListener("deviceready", function () {
        App.resume = true;
        $cordovaAppVersion.getVersionNumber().then(function (version) {
            App.versionNumber = version;
            App.version = new SemanticVersion(version);
        }).then(function(){
            $timeout(function() {
                return u.checkAppVersion();            
            }, 2000);
            document.addEventListener("resume", function(){
                $timeout(function() {
                    u.checkAppVersion();
                }, 1000);
            }, false);    
            document.addEventListener("pause", function () {
                App.resume = false;
            });
        });
        $cordovaAppVersion.getVersionCode().then(function (build) {
            App.versionCode = build;
        });
    }, false);
})