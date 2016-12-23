app.controller("pongController", function ($scope, $http, pongService, $state) {

    console.log(Elo.getNewRating(1000,1900,1));

    $scope.getDateTime = function () {
        return new Date().toLocaleString();
    };
    $scope.pongService = pongService;
    $scope.players = null;
    $scope.biggestWinStreakPlayer = {};
    $scope.losingStreakPlayer = {};
    $scope.biggestBeatDown = null;
    $scope.mostGamesPlayer = {};
    $scope.mostGamesTotal = null;
    $scope.lastGame = null;

    $scope.currentState = pongService.getCurrentState();

    //Get players by ELO

    $http.get(Config.returnFrontEndAPI() +'/leaderBoard')
        .then(function (response) {
            pongService.setPlayers(response.data);
            $scope.players = pongService.getPlayers();

            //set player with the largest win streak ever
            $scope.biggestWinStreakPlayer = $scope.players[0];
            for (var i = 0; i < $scope.players.length; i++) {
                if ($scope.players[i].BiggestWinStreak > $scope.biggestWinStreakPlayer.BiggestWinStreak) {
                    $scope.biggestWinStreakPlayer = $scope.players[i];

                }
            }
            //set player with CURRENT losing stream
            $scope.losingStreakPlayer = $scope.players[0];
            for (var i = 0; i < $scope.players.length; i++) {
                if ($scope.players[i].CurrentLosingStreak > $scope.losingStreakPlayer.CurrentLosingStreak) {
                    $scope.losingStreakPlayer = $scope.players[i];

                }
            }
            //set player with most games played
            $scope.mostGamesPlayer = $scope.players[0];
            $scope.mostGamesTotal = $scope.mostGamesPlayer.Wins + $scope.mostGamesPlayer.Losses;
            for (var i = 0; i < $scope.players.length; i++) {
                if (($scope.players[i].Wins + $scope.players[i].Losses) > ($scope.mostGamesPlayer.Wins + $scope.mostGamesPlayer.Losses)) {
                    $scope.mostGamesPlayer = $scope.players[i];
                    $scope.mostGamesTotal = $scope.mostGamesPlayer.Wins + $scope.mostGamesPlayer.Losses;
                }

            }

            $http.get(Config.returnFrontEndAPI() + `/getLastGamePlayed`)
                .then(function(response) {
                    $scope.lastGame = response.data[0];
                })

        });



    $http.get(Config.returnFrontEndAPI() + '/games')
        .then(function (response) {
            $scope.games = response.data;

        });
    //get game with biggest point differential
    $http.get(Config.returnFrontEndAPI() + '/beatDown')
        .then(function (response) {
            $scope.biggestBeatDown = response.data[0];

        });


    //clicking new game button takes you to player select
    $scope.newGameButton = function () {

        pongService.setCurrentState('selectPlayers');
        $scope.liveStream.abort();
        $state.go('selectPlayers');

    }

    //selecting a player for the red side
    $scope.redPlayer = pongService.redPlayer;
    $scope.redDropdownText = "Select Player For Red Side";

    $scope.selectRedPlayer = function (player) {
        pongService.setRedPlayer(player);

        $scope.redPlayer = pongService.getRedPlayer();
        $scope.redDropdownText = player.FirstName;


    }

    //selecting Player for Blue Side
    $scope.bluePlayer = pongService.getBluePlayer();
    $scope.blueDropdownText = "Select Player For Blue Side";

    $scope.selectBluePlayer = function (player) {
        pongService.setBluePlayer(player);

        $scope.bluePlayer = pongService.getBluePlayer();
        $scope.blueDropdownText = player.FirstName;


    }

    //select score to play to 
    $scope.chooseScores = [7, 11, 15, 21];
    $scope.chooseScoreDropdownText = "Select Score";
    $scope.playToScore = pongService.getPlayToScore();

    $scope.selectScore = function (score) {
        pongService.setPlayToScore(score);
        $scope.chooseScoreDropdownText = score;
        $scope.playToScore = pongService.getPlayToScore();
        console.log("SERVICE: " + $scope.playToScore);
    }

    //Go to Select Sides Page 
    $scope.goToPregame = function () {
        $http.get(Config.returnFrontEndAPI() + `/getBestAgainst?bestPlayer=${$scope.redPlayer.Id}`)
            .then(function (response) {
                pongService.setRedBestAgainst(response.data);

                $http.get(Config.returnFrontEndAPI() + `/getWorstAgainst?worstPlayer=${$scope.redPlayer.Id}`)
                    .then(function (response) {
                        pongService.setRedWorstAgainst(response.data);

                        $http.get(Config.returnFrontEndAPI() + `/getBestAgainst?bestPlayer=${$scope.bluePlayer.Id}`)
                            .then(function (response) {
                                pongService.setBlueBestAgainst(response.data);

                                $http.get(Config.returnFrontEndAPI() + `/getWorstAgainst?worstPlayer=${$scope.bluePlayer.Id}`)
                                    .then(function (response) {
                                        pongService.setBlueWorstAgainst(response.data);
                                        pongService.setCurrentState('pregameStats');
                                        $scope.liveStream.abort();
                                        $state.go('pregameStats');
                                        console.log("GO TO SELECT SIDES" + $scope.currentState);
                                    })
                            })
                    })
            })
    }




    ///
    //// Selecting player who will be serving first, storing it then taking to page and setting the server notif display

    $scope.redServing = pongService.getRedServing();
    $scope.blueServing = pongService.getBlueServing();
    //getting best and worst against data
    $scope.redBestAgainst = pongService.getRedBestAgainst();
    $scope.redWorstAgainst = pongService.getRedWorstAgainst();
    $scope.blueWorstAgainst = pongService.getBlueWorstAgainst();
    $scope.blueBestAgainst = pongService.getBlueBestAgainst();

    $scope.redServeFirst = function () {

        pongService.setRedServing(true);
        $scope.redServing = pongService.getRedServing();
        $scope.startGame()

    }

    $scope.blueServeFirst = function () {

        pongService.setBlueServing(true);
        $scope.blueServing = pongService.getBlueServing();
        $scope.startGame();

    }

    //Start game from PreGame Stats
    $scope.headToHead = pongService.getHeadToHead();
    
    $scope.startGame = function () {

        $http.get(Config.returnFrontEndAPI() + `/getHeadToHead?x=${$scope.redPlayer.Id}&y=${$scope.bluePlayer.Id}`)
            .then(function (response) {
                pongService.setHeadToHead(response.data);
              $scope.liveStream.abort();
                pongService.setCurrentState('liveGame');
                $state.go('liveGame');

            })


    }
    $scope.redPlayerScore = pongService.getRedPlayerScore();
    $scope.bluePlayerScore = pongService.getBluePlayerScore();
    $scope.winner = pongService.getWinner();
    $scope.redPlayer = pongService.getRedPlayer();
    $scope.bluePlayer = pongService.getBluePlayer();
    
    $scope.goHome = function () {
        pongService.setRedPlayer(null);
        pongService.setBluePlayer(null);
        pongService.setRedServing(false);
        pongService.setBlueServing(false);
        pongService.setPlayToScore(null);
        pongService.setRedPlayerScore(0);
        pongService.setBluePlayerScore(0);
        pongService.setWinner(null);
        pongService.setLoaded(false);
        $scope.liveStream.abort();
        pongService.setCurrentState('home');
        $state.go('home');
    }

    //particle button stuff

    var particle = new Particle();

    $scope.testNumber = 1;



    particle.getEventStream({ deviceId: 'mine', auth: Config.returnBtnAuth() })
        .then(function (stream) {
            console.log("EVENT STREAM RESTARTED - CURRENT STATE: " + pongService.currentState);
            $scope.liveStream = stream;
            if (pongService.currentState == 'liveGame') {
                stream.abort();
                console.log("Aborting at state: " + pongService.currentState);
                return;
            }

            stream.on('event', function (data) {


                if (pongService.currentState == 'home') {

                    stream.abort();
                    console.log("Aborting at state: " + pongService.currentState);
                    $scope.newGameButton();

                }

                if (pongService.currentState == 'pregameStats') {
                    stream.abort();
                    if (data.coreid == "310043000447343337373737" && data.name == "button2") {

                        console.log("Aborting at state: " + pongService.currentState);
                        $scope.redServeFirst();
                        console.log($scope.currentState);
                    }

                    if (data.coreid == "1b0036001147353230333635" && data.name == "button2") {

                        console.log("Aborting at state: " + pongService.currentState);
                        $scope.blueServeFirst();
                        console.log($scope.currentState);
                    }
                }



                if (pongService.currentState == "endMatch") {
                    stream.abort();
                    console.log("Aborting at state: " + pongService.currentState);
                    $scope.goHome();
                }


            });
        });

})

