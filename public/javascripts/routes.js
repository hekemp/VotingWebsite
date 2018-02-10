angular.module('app')
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
      $routeProvider
      // home page
          .when('/', {
            templateUrl: 'views/home.html',
            controller: 'MainController'
          })
          // add other routes here
          .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginController'
          });
      $locationProvider.html5Mode(true);
    }]);