angular.module('app')
    .controller('LoginController', ['$scope', '$http', function($scope, $http) {
        $scope.formData = {};
        $scope.tagline = "Log In";

        $scope.login = function() {
            $http.post('/api/login', $scope.formData)
                .success(function(data) {
                    $scope.user = data;
                    console.log(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        }
    }]);