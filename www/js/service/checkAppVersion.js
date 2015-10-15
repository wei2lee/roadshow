(function() {
    var _module = angular.module('checkAppVersion', ['u', 'apiAppstore']);
    _module.service('checkAppVersion', function($rootScope, u, App, apiApp, Popup, $timeout, $q, $cordovaAppVersion) {
        this.onAppLaunched = function() {
            var _self = this;
            document.addEventListener("deviceready", function () {
                console.log('checkAppVersion@' + 'deviceready');
                App.resume = true;
                $cordovaAppVersion.getVersionNumber().then(function (version) {
                    console.log('checkAppVersion@' + 'getVersionNumber');
                    
                    App.versionNumber = version;
                    App.version = u.SemanticVersion(version);
                }).then(function(){
                    console.log('checkAppVersion@' + 'getVersionNumber.then');
                    
                    //$timeout(function() {
                    //    console.log('checkAppVersion@' + 'getVersionNumber.then, timeout to check');
                        
                        _self.check();            
                    //}, 2000);
                    document.addEventListener("resume", function(){
                        console.log('checkAppVersion@' + 'resume');
                        
                        
                        //$timeout(function() {
                        //    console.log('checkAppVersion@' + 'getVersionNumber.then, resume, timeout to check');
                            
                            _self.check();
                        //}, 1000);
                        App.resume = true;
                    }, false);    
                    document.addEventListener("pause", function () {
                        console.log('checkAppVersion@' + 'pause');
                        App.resume = false;
                    });
                });
                $cordovaAppVersion.getVersionCode().then(function (build) {
                    App.versionCode = build;
                });
            }, false);
        }
        this.check = function() {
            console.log("checkAppVersion.check");
            var _self = this;
            var now = new Date();
            if(App.lastCheckAppVersion && (now.getTime() - App.lastCheckAppVersion.getTime() <= minimumCheckAppVersionTimeSpan*1000)) {
                return;
            }
            App.lastCheckAppVersion = now;
            console.log("checkAppVersion.check2");
            var vm = $rootScope;
            vm.newVersionModal = {};
            vm.close = function() {
                vm.newVersionModal.modal.hide(); 
            }
            return apiApp.get().then(function(result) {
                var appstoreversion = u.SemanticVersion(result.version);
                var appversion = App.version || u.SemanticVersion('0.0.0');
                
                console.log("checkAppVersion.check3");
                console.log(appstoreversion);
                console.log(appversion);
                
                if(appstoreversion.compare(appversion) > 0) {
                    console.log("checkAppVersion.check4");
                    
                    _self.openDownloadPopup(appstoreversion,appversion,result);
                }
            });
        }
        
        this.openDownloadPopup = function(appstoreversion,appversion,result) {
            console.log("checkAppVersion.openDownloadPopup");
            
            var _self = this;
            if(_self.downloadPopup) {
                return $q(function(resolve,reject) { resolve(); });
            }
            
            console.log("checkAppVersion.openDownloadPopup2");
            _self.downloadPopup = Popup.alert({
                'title': 'Newer version ('+appstoreversion.toString()+') is available<br/>Current version('+appversion.toString()+')',
                'buttons': [{
                    'text': 'Download',
                    'type': 'button-positive',
                    'onTap': function (e) {
                        window.open(result.downloadsrc, '_system','location=yes');   
                    }
                },{
                    'text': 'Close',
                    'type': 'button-default'
                }]
            }).then(function(){

            }).finally(function(){
                _self.downloadPopup = null;
            });
            
            console.log("checkAppVersion.openDownloadPopup3");
            
            return _self.downloadPopup;
        }
        
        this.downloadApp = function() {
            var _self = this;
            return apiApp.get().then(function(result) {
                var appstoreversion = u.SemanticVersion(result.version);
                var appversion = App.version || u.SemanticVersion('0.0.0');
                return _self.openDownloadPopup(appstoreversion,appversion,result);
            });
        }
        return this;
    });
})();