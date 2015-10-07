(function () {
    var _module = angular.module('route', []);
    _module.config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                views: {
                    'main': {
                        templateUrl: 'templates/login.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('events', {
                url: '/events',
                views: {
                    'main': {
                        templateUrl: 'templates/events.html',
                        controller: 'EventsCtrl'
                    }
                }
            })
            .state('event', {
                url: '/event/{id}',
                views: {
                    'main': {
                        templateUrl: 'templates/event.html',
                        controller: 'EventCtrl'
                    }
                }
            })
            .state('event-agents', {
                url: '/agents',
                views: {
                    'agents-tab': {
                        templateUrl: 'templates/agents-event.html',
                        controller: 'AgentsEventCtrl'
                    }
                }
            })
            .state('event-costitems', {
                url: '/costitems',
                views: {
                    'costitems-tab': {
                        templateUrl: 'templates/costitems-event.html',
                        controller: 'CostItemsEventCtrl'
                    }
                }
            })

        .state('tab-content', {
            url: '/agents-event/{id}',
            templateUrl: 'templates/agents-event.html',
            controller: 'AgentsEventCtrl'
        })


        $urlRouterProvider.otherwise('/');
    });

})();

//http://codepen.io/markbeekman/pen/ogwqax