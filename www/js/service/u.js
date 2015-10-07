(function () {
    var _module = angular.module('u', ['API']);

    _module.service('u', function ($ionicLoading,$ionicPopup) {

        this.SemanticVersion = function (str) {
            this.major = 0;
            this.minor = 0;
            this.patch = 0;

            var splits = str.split('.');
            this.major = splits.length > 0 ? parseInt(splits[0]) : 0;
            this.minor = splits.length > 1 ? parseInt(splits[1]) : 0;
            this.patch = splits.length > 2 ? parseInt(splits[2]) : 0;

            function compareInt(left, right) {
                if (left == right) return 0;
                else if (left > right) return 1;
                else return -1;
            }


            this.compare = function (right) {
                var compareResult = [
                    compareInt(right.major, left.major),
                    compareInt(right.minor, left.minor),
                    compareInt(right.patch, left.patch)
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

        this.checkAppVersoin = function () {

        }
        this.loading = {};
        this.loading.show = function () {
            $ionicLoading.show({
                template: 'Loading...'
            });
        };
        this.loading.hide = function () {
            $ionicLoading.hide();
        };
        
        this.alert = {};
        this.alert.showError = function(error) {
            var alertPopup = $ionicPopup.alert({
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