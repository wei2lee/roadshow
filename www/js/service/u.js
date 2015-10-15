(function () {
    var _module = angular.module('u', ['value']);

    _module.service('u', function ($ionicLoading,Popup) {

        this.SemanticVersion = function (str) {
            var ret = {};
            ret.major = 0;
            ret.minor = 0;
            ret.patch = 0;

            var splits = str.split('.');
            ret.major = splits.length > 0 ? parseInt(splits[0]) : 0;
            ret.minor = splits.length > 1 ? parseInt(splits[1]) : 0;
            ret.patch = splits.length > 2 ? parseInt(splits[2]) : 0;

            function compareInt(left, right) {
                if (left == right) return 0;
                else if (left > right) return 1;
                else return -1;
            }


            ret.compare = function (right) {
                var left = this;
                var compareResult = [
                    compareInt(left.major, right.major),
                    compareInt(left.minor, right.minor),
                    compareInt(left.patch, right.patch)
                ];
                if (compareResult[0] == 0) {
                    if (compareResult[1] == 0) {
                        return compareResult[2];
                    } else {
                        return compareResult[1];
                    }
                } else {
                    return compareResult[0];
                }
            }
            ret.toString = function() {
                return this.major + '.' + this.minor + '.' + this.patch;   
            }
            return ret;
        }

        this.Error = function (str) {
            var ret = {};
            ret.domain = '';
            ret.code = 0;
            ret.description = str || '';
            return ret;
        }

        this.ErrorDomain = {
            ServerInfracture: 'ServerInfracture',
            ServerApplication: 'ServerApplication',
            ClientInfracture: 'ClientInfracture',
            ClientApplication: 'ClientApplication',
            ClientHTTP: 'ClientHTTP'
        }
        
        this.loading = {};
        this.loading.show = function () {
            $ionicLoading.show({
                template: 'Loading...',
                delay:200
            });
        };
        this.loading.hide = function () {
            $ionicLoading.hide();
        };
        
        this.alert = {};
        this.alert.showError = function(error) {
            var alertPopup = Popup.alert({
                'title': error.description,
                'buttons': [{
                    'text': 'Close',
                    'type': 'button-assertive'
                }]
            });
            return alertPopup;  
        };

    });
})();