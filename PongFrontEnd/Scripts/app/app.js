var app = angular.module("pongApp", ['ui.router', 'ngAnimate']);

app.animation('.notifications', [function() {
    return {
        enter:  function(element, doneFn) {
            jQuery(element).slideDown("slow", doneFn);
        },

        leave:  function(element, doneFn) {
            jQuery(element).slideUp("slow", doneFn);
        }
    }
}]);

app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: './Views/Home.html',
            controller: "pongController"
        })

        .state('selectPlayers', {
            url: '/selectPlayers',
            templateUrl: "./Views/SelectPlayers.html",
            controller: "pongController"
        })

        .state('pushButton', {
            url: '/pushButton',
            templateUrl: "./Views/PushButton.html",
            controller: "pongController"
        })

        .state('pregameStats', {
            url: '/pregameStats',
            templateUrl: "./Views/PregameStats.html",
            controller: "pongController"
        })

        .state('liveGame', {
            url: '/liveGame',
            templateUrl: "./Views/LiveGame.html",
            controller: "liveGameController"
            
        })

        .state('endMatch', {
            url: '/endMatch',
            templateUrl: "./Views/EndMatch.html",
            controller: "pongController"
        })
})