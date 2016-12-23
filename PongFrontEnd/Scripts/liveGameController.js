app.controller("liveGameController", function ($scope, $http, pongService, $state) {
   
    $http.get(Config.returnFrontEndAPI() + `/getLastMatchup?playerRedId=${pongService.redPlayer.Id}&playerBlueId=${pongService.bluePlayer.Id}`)
        .then(function (response) {
            if (response.data[0] == undefined) {
                $scope.tempLastMatchup = {};
                 $scope.tempLastMatchup.PlayerRedScore = 0;
                $scope.tempLastMatchup.PlayerBlueScore = 0;
                $scope.tempLastMatchup.PlayerRed_FirstName = pongService.redPlayer.FirstName;
                $scope.tempLastMatchup.PlayerBlue_FirstName = pongService.bluePlayer.FirstName;
                pongService.setLastMatchup($scope.tempLastMatchup);
            }
            else if (pongService.redPlayer.Id == response.data[0].PlayerRedId) {
                pongService.setLastMatchup(response.data[0]);
                console.log("Red Same")
                console.log(pongService.lastMatchup);
            }
            else if (pongService.redPlayer.Id != response.data[0].PlayerRedId) {
                $scope.tempLastMatchup = {};
                $scope.tempLastMatchup.PlayerRedScore = response.data[0].PlayerBlueScore;
                $scope.tempLastMatchup.PlayerBlueScore = response.data[0].PlayerRedScore;
                $scope.tempLastMatchup.PlayerRed_FirstName = response.data[0].PlayerBlue_FirstName;
                $scope.tempLastMatchup.PlayerBlue_FirstName = response.data[0].PlayerRed_FirstName;
                pongService.setLastMatchup($scope.tempLastMatchup);
                console.log("BLUE change");
                console.log(pongService.lastMatchup);
            }

            pongService.setCurrentState('liveGame');
            $state.go('liveGame');
        })

    $scope.getDateTime = function () {
        return new Date().toLocaleString();
    };

    $scope.redPlayer = pongService.getRedPlayer();
    $scope.bluePlayer = pongService.getBluePlayer();
    console.log($scope.redPlayer);
    console.log($scope.bluePlayer);

    $scope.pongService = pongService;


    $scope.playToScore = pongService.getPlayToScore();
    $scope.redPlayerScore = 0;
    $scope.bluePlayerScore = 0;
    $scope.totalScore = 0;
    $scope.scoreForceOT = (pongService.playToScore - 1) * 2;
    $scope.overtime = false;
    $scope.redGamePoint = false;
    $scope.blueGamePoint = false;

    //function to switch server
    $scope.switchServer = function () {


        if (pongService.redServing == true) {
            pongService.setRedServing(false);
            pongService.setBlueServing(true);
        }

        else if (pongService.blueServing == true) {

            pongService.setRedServing(true);
            pongService.setBlueServing(false);
        }
    }

    $scope.winner = pongService.getWinner();


    $scope.getHeadToHead = function(){
        $http.get(Config.returnFrontEndAPI() + `/getHeadToHead?x=${pongService.redPlayer.Id}&y=${pongService.bluePlayer.Id}`)
            .then(function (response) {
                pongService.setHeadToHead(response.data);
              
                
              
            })
    }

    $scope.ifRedWinEloDelta = Elo.getRatingDelta(pongService.redPlayer.ELO, pongService.bluePlayer.ELO, 1);
    $scope.ifRedLoseEloDelta = Elo.getRatingDelta(pongService.redPlayer.ELO, pongService.bluePlayer.ELO, 0);
    $scope.ifBlueWinEloDelta = Elo.getRatingDelta(pongService.bluePlayer.ELO, pongService.redPlayer.ELO, 1);
    $scope.ifBlueLoseEloDelta = Elo.getRatingDelta(pongService.bluePlayer.ELO, pongService.redPlayer.ELO, 0);

    $scope.redWinNewElo = Elo.getNewRating(pongService.redPlayer.ELO, pongService.bluePlayer.ELO, 1);
    $scope.redLoseNewElo = Elo.getNewRating(pongService.redPlayer.ELO, pongService.bluePlayer.ELO, 0);
    $scope.blueWinNewElo = Elo.getNewRating(pongService.bluePlayer.ELO, pongService.redPlayer.ELO, 1);
    $scope.blueLoseNewElo = Elo.getNewRating(pongService.bluePlayer.ELO, pongService.redPlayer.ELO, 0);

    $scope.redStreak = 0;
    $scope.blueStreak = 0;
    
    //Add points, logic to determine who is serving/game point
    $scope.addRedPoint = function () {
        $scope.redPlayerScore++;
        $scope.redStreak++;
        $scope.blueStreak = 0;
        $scope.totalScore = $scope.redPlayerScore + $scope.bluePlayerScore;


        //switch serving player every two 
        if ($scope.playToScore == 21 && $scope.totalScore != 0 && $scope.totalScore % 5 == 0 && $scope.overtime == false && $scope.totalScore < $scope.scoreForceOT) {
            $scope.switchServer();
        }

        if ($scope.playToScore != 21 && $scope.totalScore != 0 && $scope.totalScore % 2 == 0 && $scope.overtime == false && $scope.totalScore < $scope.scoreForceOT) {
            $scope.switchServer();
        }

        if ($scope.redPlayerScore >= (pongService.playToScore - 1) && $scope.redPlayerScore > $scope.bluePlayerScore && $scope.overtime == false) {
            $scope.redGamePoint = true;
            $scope.blueGamePoint = false;

        }

        if ($scope.redPlayerScore == $scope.bluePlayerScore && $scope.totalScore >= $scope.scoreForceOT) {
            $scope.overtime = true;

        }

        if ($scope.overtime == true && ($scope.redPlayerScore - $scope.bluePlayerScore) == 1) {
            $scope.switchServer();
            $scope.redGamePoint = true;
            $scope.blueGamePoint = false;

        }

        if ($scope.overtime == true && $scope.redPlayerScore == $scope.bluePlayerScore) {
            $scope.redGamePoint = false;
            $scope.blueGamePoint = false;
            $scope.switchServer();
        }

        if ($scope.overtime == true && ($scope.redPlayerScore - $scope.bluePlayerScore) >= 2) {
            var redData = {
                Date: $scope.getDateTime(),
                PlayerRedScore: $scope.redPlayerScore,
                PlayerBlueScore: $scope.bluePlayerScore,
                PlayerRedId: $scope.redPlayer.Id,
                PlayerBlueId: $scope.bluePlayer.Id,
                WinningPlayerId: $scope.redPlayer.Id,
                LosingPlayerId: $scope.bluePlayer.Id

            };


            $http.post(Config.returnFrontEndAPI() + '/postGame', redData);
            pongService.setWinner('red');
            pongService.setRedPlayerScore($scope.redPlayerScore);
            pongService.setBluePlayerScore($scope.bluePlayerScore);

            $scope.redPlayer.CurrentWinStreak++;
            //if current win streak is larger than the older streak
            if ($scope.redPlayer.CurrentWinStreak > $scope.redPlayer.BiggestWinStreak) {
                $scope.redPlayer.BiggestWinStreak = $scope.redPlayer.CurrentWinStreak;
            }
            $scope.bluePlayer.CurrentLosingStreak++;

            $http.put(Config.returnFrontEndAPI() + `/player/${$scope.redPlayer.Id}`, { Id: $scope.redPlayer.Id, CurrentWinStreak: $scope.redPlayer.CurrentWinStreak, BiggestWinStreak: $scope.redPlayer.BiggestWinStreak, FirstName: $scope.redPlayer.FirstName, LastName: $scope.redPlayer.LastName, Image: $scope.redPlayer.Image, CurrentLosingStreak: 0, ELO: $scope.redWinNewElo })
                .then(function () {
                    $http.put(Config.returnFrontEndAPI() + `/player/${$scope.bluePlayer.Id}`, { Id: $scope.bluePlayer.Id, CurrentWinStreak: 0, CurrentLosingStreak: $scope.bluePlayer.CurrentLosingStreak, BiggestWinStreak: $scope.bluePlayer.BiggestWinStreak, FirstName: $scope.bluePlayer.FirstName, LastName: $scope.bluePlayer.LastName, Image: $scope.bluePlayer.Image, ELO: $scope.blueLoseNewElo })
                        .then(function () {
                            $scope.liveStream.abort();
                            console.log("Aborting at state: " + pongService.currentState);
                            $scope.getHeadToHead();
                            $state.go('endMatch');
                            pongService.setCurrentState('endMatch');
                        })
                })

        }

        if ($scope.overtime != true && $scope.redPlayerScore >= $scope.playToScore && ($scope.redPlayerScore - $scope.bluePlayerScore) >= 2) {

            var redData = {
                Date: $scope.getDateTime(),
                PlayerRedScore: $scope.redPlayerScore,
                PlayerBlueScore: $scope.bluePlayerScore,
                PlayerRedId: $scope.redPlayer.Id,
                PlayerBlueId: $scope.bluePlayer.Id,
                WinningPlayerId: $scope.redPlayer.Id,
                LosingPlayerId: $scope.bluePlayer.Id

            };
            $http.post(Config.returnFrontEndAPI() + '/postGame', redData);

            pongService.setWinner('red');
            pongService.setRedPlayerScore($scope.redPlayerScore);
            pongService.setBluePlayerScore($scope.bluePlayerScore);
            $scope.redPlayer.CurrentWinStreak++;

            if ($scope.redPlayer.CurrentWinStreak > $scope.redPlayer.BiggestWinStreak) {
                $scope.redPlayer.BiggestWinStreak = $scope.redPlayer.CurrentWinStreak;
            }
            $scope.bluePlayer.CurrentLosingStreak++;

            $http.put(Config.returnFrontEndAPI() + `/player/${$scope.redPlayer.Id}`, { Id: $scope.redPlayer.Id, CurrentWinStreak: $scope.redPlayer.CurrentWinStreak, BiggestWinStreak: $scope.redPlayer.BiggestWinStreak, FirstName: $scope.redPlayer.FirstName, LastName: $scope.redPlayer.LastName, Image: $scope.redPlayer.Image, CurrentLosingStreak: 0, ELO: $scope.redWinNewElo })
                .then(function () {
                    $http.put(Config.returnFrontEndAPI() + `/player/${$scope.bluePlayer.Id}`, { Id: $scope.bluePlayer.Id, CurrentWinStreak: 0, CurrentLosingStreak: $scope.bluePlayer.CurrentLosingStreak, BiggestWinStreak: $scope.bluePlayer.BiggestWinStreak, FirstName: $scope.bluePlayer.FirstName, LastName: $scope.bluePlayer.LastName, Image: $scope.bluePlayer.Image, ELO: $scope.blueLoseNewElo })
                        .then(function () {
                            $scope.liveStream.abort();
                            console.log("Aborting at state: " + pongService.currentState);
                            $scope.getHeadToHead();
                            $state.go('endMatch');
                            pongService.setCurrentState('endMatch');

                        })
                })



        }


    }
    $scope.addBluePoint = function () {
        $scope.redStreak = 0;
        $scope.blueStreak++;
        $scope.bluePlayerScore++;
        $scope.totalScore = $scope.redPlayerScore + $scope.bluePlayerScore;

        //switch serving player every two 

        if ($scope.playToScore == 21 && $scope.totalScore != 0 && $scope.totalScore % 5 == 0 && $scope.overtime == false && $scope.totalScore < $scope.scoreForceOT) {
            $scope.switchServer();
        }
        if ($scope.playToScore != 21 && $scope.totalScore != 0 && $scope.totalScore % 2 == 0 && $scope.overtime == false && $scope.totalScore < $scope.scoreForceOT) {
            $scope.switchServer();
        }

        if ($scope.bluePlayerScore >= (pongService.playToScore - 1) && $scope.bluePlayerScore > $scope.redPlayerScore && $scope.overtime == false) {
            $scope.blueGamePoint = true;
            $scope.redGamePoint = false;

        }

        if ($scope.bluePlayerScore == $scope.redPlayerScore && $scope.totalScore >= $scope.scoreForceOT) {
            $scope.overtime = true;

        }

        if ($scope.overtime == true && ($scope.bluePlayerScore - $scope.redPlayerScore) == 1) {
            $scope.switchServer();
            $scope.blueGamePoint = true;
            $scope.redGamePoint = false;

        }

        if ($scope.overtime == true && $scope.redPlayerScore == $scope.bluePlayerScore) {
            $scope.redGamePoint = false;
            $scope.blueGamePoint = false;
            $scope.switchServer();
        }

        if ($scope.overtime == true && ($scope.bluePlayerScore - $scope.redPlayerScore) >= 2) {
            var blueData = {
                Date: $scope.getDateTime(),
                PlayerRedScore: $scope.redPlayerScore,
                PlayerBlueScore: $scope.bluePlayerScore,
                PlayerRedId: $scope.redPlayer.Id,
                PlayerBlueId: $scope.bluePlayer.Id,
                WinningPlayerId: $scope.bluePlayer.Id,
                LosingPlayerId: $scope.redPlayer.Id

            };


            $http.post(Config.returnFrontEndAPI() + '/postGame', blueData);

            pongService.setWinner("blue");
            pongService.setRedPlayerScore($scope.redPlayerScore);
            pongService.setBluePlayerScore($scope.bluePlayerScore);

            $scope.bluePlayer.CurrentWinStreak++;

            if ($scope.bluePlayer.CurrentWinStreak > $scope.bluePlayer.BiggestWinStreak) {
                $scope.bluePlayer.BiggestWinStreak = $scope.bluePlayer.CurrentWinStreak;
            }
            $scope.redPlayer.CurrentLosingStreak++

            $http.put(Config.returnFrontEndAPI() + `/player/${$scope.bluePlayer.Id}`, { Id: $scope.bluePlayer.Id, CurrentWinStreak: $scope.bluePlayer.CurrentWinStreak, BiggestWinStreak: $scope.bluePlayer.BiggestWinStreak, FirstName: $scope.bluePlayer.FirstName, LastName: $scope.bluePlayer.LastName, Image: $scope.bluePlayer.Image, CurrentLosingStreak: 0, ELO: $scope.blueWinNewElo })
                .then(function () {
                    $http.put(Config.returnFrontEndAPI() + `/player/${$scope.redPlayer.Id}`, { Id: $scope.redPlayer.Id, CurrentWinStreak: 0, CurrentLosingStreak: $scope.redPlayer.CurrentLosingStreak, FirstName: $scope.redPlayer.FirstName, LastName: $scope.redPlayer.LastName, Image: $scope.redPlayer.Image, BiggestWinStreak: $scope.redPlayer.BiggestWinStreak, ELO: $scope.redLoseNewElo })
                        .then(function () {
                            $scope.liveStream.abort();
                            console.log("Aborting at state: " + pongService.currentState);
                            $scope.getHeadToHead();
                            $state.go('endMatch');
                            pongService.setCurrentState('endMatch')
                        })
                })


        }

        if ($scope.overtime != true && $scope.bluePlayerScore >= $scope.playToScore && ($scope.bluePlayerScore - $scope.redPlayerScore) >= 2) {
            var blueData = {
                Date: $scope.getDateTime(),
                PlayerRedScore: $scope.redPlayerScore,
                PlayerBlueScore: $scope.bluePlayerScore,
                PlayerRedId: $scope.redPlayer.Id,
                PlayerBlueId: $scope.bluePlayer.Id,
                WinningPlayerId: $scope.bluePlayer.Id,
                LosingPlayerId: $scope.redPlayer.Id

            };
            $http.post(Config.returnFrontEndAPI() + '/postGame', blueData);


            pongService.setWinner("blue");
            pongService.setRedPlayerScore($scope.redPlayerScore);
            pongService.setBluePlayerScore($scope.bluePlayerScore);

            $scope.bluePlayer.CurrentWinStreak++;
            $scope.redPlayer.CurrentLosingStreak++;
            if ($scope.bluePlayer.CurrentWinStreak > $scope.bluePlayer.BiggestWinStreak) {
                $scope.bluePlayer.BiggestWinStreak = $scope.bluePlayer.CurrentWinStreak;
            }

            $http.put(Config.returnFrontEndAPI() + `/player/${$scope.bluePlayer.Id}`, { Id: $scope.bluePlayer.Id, CurrentWinStreak: $scope.bluePlayer.CurrentWinStreak, BiggestWinStreak: $scope.bluePlayer.BiggestWinStreak, FirstName: $scope.bluePlayer.FirstName, LastName: $scope.bluePlayer.LastName, Image: $scope.bluePlayer.Image, CurrentLosingStreak: 0, ELO: $scope.blueWinNewElo })
                .then(function () {
                    $http.put(Config.returnFrontEndAPI() + `/player/${$scope.redPlayer.Id}`, { Id: $scope.redPlayer.Id, CurrentWinStreak: 0, CurrentLosingStreak: $scope.redPlayer.CurrentLosingStreak, FirstName: $scope.redPlayer.FirstName, LastName: $scope.redPlayer.LastName, Image: $scope.redPlayer.Image, BiggestWinStreak: $scope.redPlayer.BiggestWinStreak, ELO: $scope.redLoseNewElo })
                        .then(function () {
                            $scope.liveStream.abort();
                            console.log("Aborting at state: " + pongService.currentState);
                            $scope.getHeadToHead();
                            $state.go('endMatch');
                            pongService.setCurrentState('endMatch');
                        })
                })


        }



    }

    $scope.removeRedPoint = function () {
        $scope.redPlayerScore--;

        $scope.totalScore = $scope.redPlayerScore + $scope.bluePlayerScore;

        if ($scope.totalScore > 0 && $scope.totalScore % 2 != 0 && $scope.overtime == false && $scope.totalScore < $scope.scoreForceOT) {
            $scope.switchServer();
        }

        if ($scope.redPlayerScore < (pongService.playToScore - 1) && $scope.redPlayerScore > $scope.bluePlayerScore && $scope.overtime == false) {
            $scope.redGamePoint = false;
            $scope.blueGamePoint = false;

        }
        //removed a point, if we are out in overtime and point removal takes us out of overtime, we need to remove it to make sure game flows correctly
        if ($scope.overtime == true && $scope.totalScore < $scope.scoreForceOT) {
            $scope.overtime = false;
            $scope.blueGamePoint = true;
            $scope.switchServer();

        }

        if ($scope.overtime == true && ($scope.redPlayerScore == $scope.bluePlayerScore)) {
            $scope.switchServer();
            $scope.redGamePoint = false;
            $scope.blueGamePoint = false;
        }

        if ($scope.overtime == true && ($scope.bluePlayerScore - $scope.redPlayerScore) == 1) {
            $scope.switchServer();
            $scope.redGamePoint = false;
            $scope.blueGamePoint = true;
        }

    }

    $scope.removeBluePoint = function () {
        $scope.bluePlayerScore--;

        $scope.totalScore = $scope.redPlayerScore + $scope.bluePlayerScore;

        if ($scope.totalScore > 0 && $scope.totalScore % 2 != 0 && $scope.overtime == false && $scope.totalScore < $scope.scoreForceOT) {
            $scope.switchServer();
        }

        if ($scope.bluePlayerScore < (pongService.playToScore - 1) && $scope.bluePlayerScore > $scope.redPlayerScore && $scope.overtime == false) {
            $scope.redGamePoint = false;
            $scope.blueGamePoint = false;

        }
        //removed a point, if we are out in overtime and point removal takes us out of overtime, we need to remove it to make sure game flows correctly
        if ($scope.overtime == true && $scope.totalScore < $scope.scoreForceOT) {
            $scope.overtime = false;
            $scope.redGamePoint = true;
            $scope.switchServer();

        }

        if ($scope.overtime == true && ($scope.redPlayerScore == $scope.bluePlayerScore)) {
            $scope.switchServer();
            $scope.redGamePoint = false;
            $scope.blueGamePoint = false;
        }

        if ($scope.overtime == true && ($scope.redPlayerScore - $scope.bluePlayerScore) == 1) {
            $scope.switchServer();
            $scope.redGamePoint = true;
            $scope.blueGamePoint = false;
        }

    }

    var particle = new Particle();

    $scope.timeButtonPressed = null;

    particle.getEventStream({ deviceId: 'mine', auth: Config.returnBtnAuth() })
        .then(function (stream) {

            console.log("EVENT STREAM RESTARTED - LIVEGAMECONTROLLER - CURRENT STATE: " + pongService.currentState);
            $scope.liveStream = stream;
            pongService.setLoaded(true);
            $scope.$apply(function () { pongService.loaded });
            stream.on('event', function (data) {
                //get time of button press so we can see if it was a multiple press - we would remove points

                if (data.coreid == "310043000447343337373737" && data.name == "button2") {
                    $scope.addRedPoint();
                    $scope.$apply(function () { $scope.redPlayerScore });
                }

                if (data.coreid == "1b0036001147353230333635" && data.name == "button2") {
                    $scope.addBluePoint();
                    $scope.$apply(function () { $scope.bluePlayerScore });
                }

            });
        });
})