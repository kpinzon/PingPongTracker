var axios = require('axios');
var config = require('../config.js');

function show(req, res) {
    axios.get(config.backEndAPI + `/Api/Player`)
        .then(function (response) {
            res.json(response.data);
            console.log(response.data)
        })
        
}

function leaderboard (req,res) {
    axios.get(config.backEndAPI + `/Api/Player?leaderboard=1`)
        .then(function(response){
            res.json(response.data);
        })
}

function games (req, res) {
    axios.get(config.backEndAPI + `/Api/Game`)
        .then(function(response){
            res.json(response.data);
        })
}

function beatDown (req, res) {
    axios.get(config.backEndAPI + `/Api/Game?beatDown=1`)
        .then(function(response){
            res.json(response.data)
        })
}


function postGame (req,res) {
    var dataPost = req.body;
    axios.post(config.backEndAPI + `/Api/Game`, dataPost)
        .then(function (response) {
            res.json(response.data);
        })
}

function playerUpdate (req,res) {
    console.log(req.params.id);
    var dataPut = req.body;
    axios.put(config.backEndAPI + `/Api/Player/${req.params.id}`, dataPut)
        .then(function (response){
            console.log(response.data);
            res.json(response.data);
            
        })
   
}

function getHeadToHead (req,res) {

    
    axios.get(config.backEndAPI + `/Api/Game/?x=${req.query.x}&y=${req.query.y}`)
        .then(function(response){
            res.json(response.data);
        })

}

function getBestAgainst (req,res) {
    axios.get(config.backEndAPI + `/Api/Player?bestPlayer=${req.query.bestPlayer}`)
        .then(function (response){
            res.json(response.data);
        })
}

function getWorstAgainst (req,res) {
    axios.get(config.backEndAPI + `/Api/Player?worstPlayer=${req.query.worstPlayer}`)
        .then(function (response){
            res.json(response.data);
        })
}

function getLastMatchup (req, res) {
    axios.get(config.backEndAPI + `/API/Game?playerRedId=${req.query.playerRedId}&playerBlueId=${req.query.playerBlueId}`)
    .then(function (response){
            res.json(response.data);
        })
}

function getLastGamePlayed (req,res) {
    axios.get(config.backEndAPI + `/API/Game?lastGame=1`)
        .then(function (response){
            res.json(response.data);
        })
}


module.exports = {
    show: show,
    leaderboard: leaderboard,
    games: games,
    beatDown: beatDown,
    postGame: postGame,
    playerUpdate: playerUpdate,
    getHeadToHead: getHeadToHead,
    getBestAgainst: getBestAgainst,
    getWorstAgainst: getWorstAgainst,
    getLastMatchup: getLastMatchup,
    getLastGamePlayed: getLastGamePlayed
}
