(function () {
    var _module = angular.module('controller');
    _module.controller('CostItemsEventCtrl', function ($scope, $timeout, u, $state, $ionicScrollDelegate, ControllerBase, apiEvent, apiUser) {
        ControllerBase($scope, $ionicScrollDelegate, 'events');
        $scope.sortKeys = [];
        $scope.toggleSortKey = function (key) {
            var i = -1;
            if (_.contains($scope.sortKeys, key)) {
                $scope.sortKeys = _.without($scope.sortKeys, key);
            } else {
                $scope.sortKeys.push(key);
            }
            console.log($scope.sortKeys);
        }
        $scope.isSortedBy = function (key) {
            return $scope.sortKeys.indexOf(key) >= 0;
        }
        $scope.getTotalEventCostDetailAmount = function() {
            var ret = 0;
            if($scope.details) {
                for(var i = 0 ; i < $scope.details.length ; i++) {
                    ret += $scope.details[i].EventCostDetailAmount;  
                }
            }
            return ret;
        }
        
        $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
            $scope.beforeEnter(viewInfo, state);
            $scope.details = [];
        });
        $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
            $scope.afterEnter(viewInfo, state);
            if (state.direction != 'back') {
                u.loading.show();
                var id = $state.params.id || (App.event?App.event.EventId:undefined);
                apiEvent.useCache().getById(id).then(function (result) {
                    
                    $scope.details = result.RoadShow.EventCostDetails;
                    console.log($scope.details);
                }).catch(function (error) {
                    u.alert.showError(error);
                }).finally(function () {
                    u.loading.hide();
                });
            }
        });
        $scope.$on('$ionicView.afterLeave', function (viewInfo, state) {
            $scope.afterLeave(viewInfo, state);
            if (state.direction == 'none' || state.direction == 'back') {
                $scope.details = [];
            }
        });
    });
})();