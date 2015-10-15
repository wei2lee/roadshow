(function () {
    var _module = angular.module('controller');
    _module.controller('AgentsEventCtrl', function ($scope, $timeout, u, $state, $ionicScrollDelegate, ControllerBase, apiEvent, apiUser, App) {
        ControllerBase($scope, $ionicScrollDelegate, 'events');
        $scope.sortKeys = ['User.FullName'];
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
        $scope.getTotalTotalUnitSaleInPeriod = function() {
            var ret = 0;
            if($scope.agents) {
                console.log($scope.agents);
                for(var i = 0 ; i < $scope.agents.length ; i++) {
                    ret += ($scope.agents[i].RoadShowTotalUnitSaleInPeriod || 0);  
                }
            }
            return ret;
        }
        $scope.getTotalTotalSaleInPeriod = function() {
            var ret = 0;
            if($scope.agents) {
                for(var i = 0 ; i < $scope.agents.length ; i++) {
                    ret += ($scope.agents[i].RoadShowTotalSaleInPeriod || 0);  
                }
            }
            return ret;
        }
        $scope.navigateToCost = function() {
            var id = $state.params.id || (App.event?App.event.EventId:undefined);
            $state.go('costitems-event', {'id':id});   
        }
        
        
        $scope.click = function (agent) {
            var phone = '';
            if(agent.Phones && agent.Phones[0] && agent.Phones[0] != '0') {
                phone = agent.Phones[0];
            }
            var email = '';
            if(agent.Emails && agent.Emails[0] && agent.Emails[0] != '0') {
                email = agent.Emails[0];
            }
            var buttons = [];
            if(phone) buttons.push({text:'Phone'});
            if(email) buttons.push({text:'Email'});
            
            if(buttons) {
            
                var sheet = $ionicActionSheet.show({
                    'buttons': buttons,
                    titleText: 'Contact',
                    cancelText: 'Cancel',
                    cancel: function () {
                    },
                    buttonClicked: function (index) {
                        if(buttons[index].text == 'Email'){
                            
                        }
                        if(buttons[index].text == 'Phone'){
                            
                        }
                        return true;
                    }
                });
                
            }
        }

        $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
            $scope.beforeEnter(viewInfo, state);
            $scope.sortKeys = [];
        });
        $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
            $scope.afterEnter(viewInfo, state);
            if (state.direction != 'back') {
                u.loading.show();
                var id = $state.params.id || (App.event?App.event.EventId:undefined);
                apiEvent.useCache().getById(id).then(function (result) {
                    $scope.agents = result.RoadShow.AgentModelList;
                    if (result.RoadShow.PersonInChargeId != null) {
                        apiUser.getById(result.RoadShow.PersonInChargeId).then(function (result) {
                            $scope.personInCharge = result;
                        });
                    }
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
                $scope.agents = [];
            }
        });
    });
})();