(function() {
    var _module = angular.module('controller');
    _module.controller('LoginCtrl', function(App,$scope, $state, $timeout, $ionicScrollDelegate, ControllerBase, u, apiUser, checkAppVersion) {
        $scope.App = App;
        ControllerBase($scope, $ionicScrollDelegate, 'login');
        $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
            $scope.beforeEnter(viewInfo, state);
            if(state.direction != 'back') {
                $scope.loginData = {};
                $scope.loginData.username = '';
                $scope.loginData.password = '';
            }
        });
        $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
            $scope.afterEnter(viewInfo, state);
        });
        $scope.$on('$ionicView.afterLeave', function (viewInfo, state) {
            $scope.afterLeave(viewInfo, state);
        });
        $scope.submit = function() {
            u.loading.show();
            apiUser.login($scope.loginData.username, $scope.loginData.password).then(function(result) {
                $state.go('events');
            }).catch(function(error) {
                u.alert.showError(error);
            }).finally(function() {
                u.loading.hide(); 
            });
        }
        $scope.download = function() {
             checkAppVersion.downloadApp();  
//            checkAppVersion.check();
        }
    });            
})();