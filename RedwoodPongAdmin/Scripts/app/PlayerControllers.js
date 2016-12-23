 var  modules = modules || [];
(function () {
    'use strict';
    modules.push('Player');

    angular.module('Player',['ngRoute'])
    .controller('Player_list', ['$scope', '$http', function($scope, $http){

        $http.get('/Api/Player/')
        .then(function(response){$scope.data = response.data;});

    }])
    .controller('Player_details', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){

        $http.get('/Api/Player/' + $routeParams.id)
        .then(function(response){$scope.data = response.data;});

    }])
    .controller('Player_create', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location){

        $scope.data = {};
        
        $scope.save = function(){
            $http.post('/Api/Player/', $scope.data)
            .then(function(response){ $location.path("Player"); });
        }

    }])
    .controller('Player_edit', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location){

        $http.get('/Api/Player/' + $routeParams.id)
        .then(function(response){$scope.data = response.data;});

        
        $scope.save = function(){
            $http.put('/Api/Player/' + $routeParams.id, $scope.data)
            .then(function(response){ $location.path("Player"); });
        }

    }])
    .controller('Player_delete', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location){

        $http.get('/Api/Player/' + $routeParams.id)
        .then(function(response){$scope.data = response.data;});
        $scope.save = function(){
            $http.delete('/Api/Player/' + $routeParams.id, $scope.data)
            .then(function(response){ $location.path("Player"); });
        }

    }])

    .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
            .when('/Player', {
                title: 'Player - List',
                templateUrl: '/Static/Player_List',
                controller: 'Player_list'
            })
            .when('/Player/Create', {
                title: 'Player - Create',
                templateUrl: '/Static/Player_Edit',
                controller: 'Player_create'
            })
            .when('/Player/Edit/:id', {
                title: 'Player - Edit',
                templateUrl: '/Static/Player_Edit',
                controller: 'Player_edit'
            })
            .when('/Player/Delete/:id', {
                title: 'Player - Delete',
                templateUrl: '/Static/Player_Delete',
                controller: 'Player_delete'
            })
            .when('/Player/:id', {
                title: 'Player - Details',
                templateUrl: '/Static/Player_Details',
                controller: 'Player_details'
            })
    }])
;

})();
