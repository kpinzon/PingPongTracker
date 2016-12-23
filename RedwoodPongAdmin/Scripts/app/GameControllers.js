 var  modules = modules || [];
(function () {
    'use strict';
    modules.push('Game');

    angular.module('Game',['ngRoute'])
    .controller('Game_list', ['$scope', '$http', function($scope, $http){

        $http.get('/Api/Game/')
        .then(function(response){$scope.data = response.data;});

    }])
    .controller('Game_details', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){

        $http.get('/Api/Game/' + $routeParams.id)
        .then(function(response){$scope.data = response.data;});

    }])
    .controller('Game_create', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location){

        $scope.data = {};
                $http.get('/Api/Player/')
        .then(function(response){$scope.PlayerRedId_options = response.data;});
                $http.get('/Api/Player/')
        .then(function(response){$scope.PlayerBlueId_options = response.data;});
        
        $scope.save = function(){
            $http.post('/Api/Game/', $scope.data)
            .then(function(response){ $location.path("Game"); });
        }

    }])
    .controller('Game_edit', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location){

        $http.get('/Api/Game/' + $routeParams.id)
        .then(function(response){$scope.data = response.data;});

                $http.get('/Api/Player/')
        .then(function(response){$scope.PlayerRedId_options = response.data;});
                $http.get('/Api/Player/')
        .then(function(response){$scope.PlayerBlueId_options = response.data;});
        
        $scope.save = function(){
            $http.put('/Api/Game/' + $routeParams.id, $scope.data)
            .then(function(response){ $location.path("Game"); });
        }

    }])
    .controller('Game_delete', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location){

        $http.get('/Api/Game/' + $routeParams.id)
        .then(function(response){$scope.data = response.data;});
        $scope.save = function(){
            $http.delete('/Api/Game/' + $routeParams.id, $scope.data)
            .then(function(response){ $location.path("Game"); });
        }

    }])

    .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
            .when('/Game', {
                title: 'Game - List',
                templateUrl: '/Static/Game_List',
                controller: 'Game_list'
            })
            .when('/Game/Create', {
                title: 'Game - Create',
                templateUrl: '/Static/Game_Edit',
                controller: 'Game_create'
            })
            .when('/Game/Edit/:id', {
                title: 'Game - Edit',
                templateUrl: '/Static/Game_Edit',
                controller: 'Game_edit'
            })
            .when('/Game/Delete/:id', {
                title: 'Game - Delete',
                templateUrl: '/Static/Game_Delete',
                controller: 'Game_delete'
            })
            .when('/Game/:id', {
                title: 'Game - Details',
                templateUrl: '/Static/Game_Details',
                controller: 'Game_details'
            })
    }])
;

})();
