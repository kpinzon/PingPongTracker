app.service("pongService", function(){

    //all players
    this.players = null;

    this.setPlayers = function(players) {
        this.players = players;
    }

    this.getPlayers = function() {
        return this.players;
    }

    //set red player
    this.redPlayer = null;

    this.setRedPlayer = function(player) {
        this.redPlayer = player;
        console.log("setting: " + player)
    };

    this.getRedPlayer = function() {
        return this.redPlayer
    };

    //set Blue player
    this.bluePlayer = null;

    this.setBluePlayer = function(player) {
        this.bluePlayer = player;
    }

    this.getBluePlayer = function() {
        return this.bluePlayer;
    }


    //keep track of who is serving

    this.redServing = false;

    this.setRedServing = function(bool) {
        this.redServing = bool;
    }

    this.getRedServing = function() {
        return this.redServing;
    }

    this.blueServing = false;

    this.setBlueServing = function(bool) {
        this.blueServing = bool;
    }

    this.getBlueServing = function() {
        return this.blueServing;
    }


    //set score playing to 
    this.playToScore = null;

    this.setPlayToScore = function(score) {
        this.playToScore = score;
        console.log("setting play to score");
    }

    this.getPlayToScore = function() {
        return this.playToScore;
    }

    //Setting scores and other logic for a live game

    this.redPlayerScore = 0;

    this.setRedPlayerScore = function(score) {
        this.redPlayerScore = score;
    }    

    this.getRedPlayerScore = function() {
        return this.redPlayerScore;
    }

    this.bluePlayerScore = 0;

    this.setBluePlayerScore = function(score) {
        this.bluePlayerScore = score;
    }    

    this.getBluePlayerScore = function() {
        return this.bluePlayerScore;
    }

    //total score
    
    this.totalScore = this.redPlayerScore - this.BluePlayerScore;

    this.getTotalScore = function() {
        return this.totalScore;
    }

    //set winner for ng-ifs
    this.winner = null;

    this.setWinner = function(winner) {
    this.winner = winner;
}    

    this.getWinner = function() {
    return this.winner;
}

//head to head stats
    this.headToHead = "0 - 0";

    this.setHeadToHead = function(x) {
        this.headToHead = x;

    }

    this.getHeadToHead = function() {
        return this.headToHead;
    }

    //Red is best against
    this.redBestAgainst = "";

    this.setRedBestAgainst = function(string) {
        this.redBestAgainst = string;
    }

    this.getRedBestAgainst = function() {
        return this.redBestAgainst;
    }
    
    //Red is worst against
    this.redWorstAgainst = "";

    this.setRedWorstAgainst = function(string) {
        this.redWorstAgainst = string;
    }

    this.getRedWorstAgainst = function() {
        return this.redWorstAgainst;
    }

    //Blue is best against
    this.blueBestAgainst = "";

    this.setBlueBestAgainst = function(string) {
        this.blueBestAgainst = string;
    }

    this.getBlueBestAgainst = function() {
        return this.blueBestAgainst;
    }
    
    //Blue is worst against
    this.blueWorstAgainst = "";

    this.setBlueWorstAgainst = function(string) {
        this.blueWorstAgainst = string;
    }

    this.getBlueWorstAgainst = function() {
        return this.blueWorstAgainst;
    }

    //current state for the buttons 
    this.currentState = 'home';
    
    this.setCurrentState = function(state) {
        this.currentState = state;
    }

    this.getCurrentState = function() {
        return this.currentState;
    }

    //stream loaded for livegame

    this.loaded = false;

    this.setLoaded = function(bool) {
        this.loaded = bool;
    }

    this.getLoaded = function() {
        return this.loaded;
    }

    //last matchup between current players
    this.lastMatchup = null;


    this.setLastMatchup = function(data) {
        this.lastMatchup = data;
    }

    this.getLastMatchup = function() {
        return this.lastMatchup;
    }
})