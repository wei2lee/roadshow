
angular.module('roadshow', [
    'ionic',
    'config',
    'controller',
    'service',
    'ngCordova',
    'tabSlideBox',
    'ngIOS9UIWebViewPatch'])

.run(function ($ionicPlatform,$timeout,App,u,checkAppVersion) {
    $ionicPlatform.ready(function () {
        App.ionicPlatformReady = true;
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleLightContent();
        }
    });
    checkAppVersion.onAppLaunched();
})