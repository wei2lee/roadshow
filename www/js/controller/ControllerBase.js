(function() {
    var _module = angular.module('controller');
    _module.factory('ControllerBase', function() {
        return function($scope, $ionicScrollDelegate, viewid) {
            $scope.scrollTop = function() {
                $scope.$content.scrollTop(0);
                $scope.$scroll.scrollTop(0);
                $scope.$scroll.css({        'transform': 'translate3d(0px, 0px, 0px) scale(1)'});
                $scope.$scroll.css({'-webkit-transform': 'translate3d(0px, 0px, 0px) scale(1)'});
                $scope.$scroll.css({    '-ms-transform': 'translate3d(0px, 0px, 0px) scale(1)'});
            }
            $scope.afterEnter = function(viewInfo, state) {
                if(state.direction != 'back') {
                    $scope.contentReady = false;
                    $scope.contentAnimated = false;
                }
            }
            $scope.beforeEnter = function(viewInfo, state) {
                $scope.$element = $('#'+viewid+'[nav-view=active], #'+viewid+'[nav-view=entering]');
                $scope.$content = $scope.$element.find('ion-content .content>');
                $scope.$scroll = $scope.$element.find('ion-content>.scroll');
                if(state.direction == 'none' || state.direction == 'forward') {
                    $scope.scrollTop();
                }
            }
            $scope.afterLeave = function(viewInfo, state) {
                if(state.direction == 'none' || state.direction == 'back'){
                    $scope.contentReady = false;
                }
                if(state.direction == 'forward'){
                    $scope.contentAnimated = false;
                }
            }
        }
    });            
})();