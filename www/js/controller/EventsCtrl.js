(function() {
    var _module = angular.module('controller');
    _module.controller('EventsCtrl', function($scope, $timeout, u, $state, $ionicScrollDelegate, ControllerBase, apiEvent, apiUser,App) {
        ControllerBase($scope, $ionicScrollDelegate, 'events');
        
        $scope.filterStatus = function(value, index, array) {
            for(k in $scope.statuses) {
                var status = $scope.statuses[k];
                if(status.on && status.value == value.RoadShow.status) {
                    return true;   
                }
            }
            return false;
        }
        $scope.click = function(event) {
            App.event = event;
            //$state.go('event', {id:event.EventId});
            $state.go('agents-event', {id:event.EventId});
        }
        
        $scope.statuses = [
            {
                name:'OnGoing',
                color:'#8CC63E',
                value:'ongoing',
                on:true
            },
            {
                name:'Pending',
                color:'#FFD600',
                value:'pending',
                on:true
            },
            {
                name:'Closed',
                color:'#ED1C24',
                value:'closed',
                on:true
            },
        ]; 
        
        
        $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
            $scope.beforeEnter(viewInfo, state);
        });
        $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
            $scope.afterEnter(viewInfo, state);
            if(state.direction != 'back') {
                u.loading.show();
                apiEvent.getAll().then(function(result) {
                    $scope.events = result;
                    _.each(result, function(o) {
                        if(o.RoadShow.PersonInChargeId != null) {
                            apiUser.getById(o.RoadShow.PersonInChargeId).then(function(result) {
                                o.RoadShow.PersonInCharge = result;
                            });
                        }
                    });                        
                }).catch(function(error){
                    u.alert.showError(error);
                }).finally(function(){
                    u.loading.hide();  
                });
            }
        });
        $scope.$on('$ionicView.afterLeave', function (viewInfo, state) {
            $scope.afterLeave(viewInfo, state);
            if(state.direction == 'none' || state.direction == 'back'){
                $scope.events = [];
            }
        });
    });    
})();