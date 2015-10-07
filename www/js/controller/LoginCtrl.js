(function() {
    var _module = angular.module('controller');
    _module.controller('LoginCtrl', function($scope, $state, $timeout, $ionicScrollDelegate, ControllerBase, u, apiUser) {
        ControllerBase($scope, $ionicScrollDelegate, 'login');
        $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
            $scope.beforeEnter(viewInfo, state);
            if(state.direction != 'back') {
                $scope.username = '';
                $scope.password = '';
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
            apiUser.login($scope.username, $scope.password).then(function(result) {
                $state.go('events');
            }).catch(function(error) {
                u.alert.showError(error);
            }).finally(function() {
                u.loading.hide(); 
            });
        }
    });            
})();