var express = require('express');
var router = express.Router();
var path = require('path');

var APIController = require('../controllers/APIController')

router.get('/player', APIController.show);
router.get('/leaderBoard', APIController.leaderboard);
router.get('/games', APIController.games);
router.get('/beatDown', APIController.beatDown);
router.post('/postGame', APIController.postGame);
router.put('/player/:id', APIController.playerUpdate);
router.get('/getHeadToHead', APIController.getHeadToHead);
router.get('/getBestAgainst', APIController.getBestAgainst);
router.get('/getWorstAgainst', APIController.getWorstAgainst);
router.get('/getLastMatchup', APIController.getLastMatchup);
router.get('/getLastGamePlayed', APIController.getLastGamePlayed);

router.get('/', function(req, res){
  res.sendFile(path.join(__dirname + '/../views/index.html'));
});

module.exports = router;
