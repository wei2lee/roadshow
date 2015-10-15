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
            .state('eventagents', {
                url: '/agents',
                views: {
                    'agents-tab': {
                        templateUrl: 'templates/agents-event.html',
                        controller: 'AgentsEventCtrl'
                    }
                }
            })
            .state('eventcostitems', {
                url: '/costitems',
                views: {
                    'costitems-tab': {
                        templateUrl: 'templates/costitems-event.html',
                        controller: 'CostItemsEventCtrl'
                    }
                }
            })

        .state('agents-event', {
            url: '/agents-event/{id}',
            views: {
                'main': {
                    templateUrl: 'templates/agents-event.html',
                    controller: 'AgentsEventCtrl'
                }
            }
        })
        
        .state('costitems-event', {
            url: '/costitems-event/{id}',
            views: {
                'main': {
                    templateUrl: 'templates/costitems-event.html',
                    controller: 'CostItemsEventCtrl'
                }
            }
        })


        $urlRouterProvider.otherwise('/');
    });

})();

//http://codepen.io/markbeekman/pen/ogwqax

//http://codepen.io/gnomeontherun/pen/encAb