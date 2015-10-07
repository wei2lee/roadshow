(function() {
    var _module = angular.module('controller');
    _module.controller('EventCtrl', function ($scope, $timeout, u, $state, $ionicScrollDelegate, ControllerBase) {
        ControllerBase($scope, $ionicScrollDelegate, 'event');
        $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
            $scope.beforeEnter(viewInfo, state);
            $scope.id = $state.params.id;
            $scope.params = $state.params;
            if (state.direction != 'back') {
            }
        });
        $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
            $scope.afterEnter(viewInfo, state);
            if (state.direction != 'back') {
                $scope.id = $state.params.id;
                $scope.params = $state.params;
            }
        });
        $scope.$on('$ionicView.afterLeave', function (viewInfo, state) {
            $scope.afterLeave(viewInfo, state);
        });
    });            
})();

