const express = require('express');
const router = express.Router();
const {
  submitScore,
  getLeaderboard,
  getGameLeaderboard,
  getAllGames
} = require('../controllers/scoreController');

/**
 * Score endpoints
 * All routes are public - no authentication required
 */

// POST /api/scores/submit - Submit a new score
router.post('/submit', submitScore);

// GET /api/scores/leaderboard - Get all scores
router.get('/leaderboard', getLeaderboard);

// GET /api/scores/leaderboard/:gameId - Get leaderboard for specific game
router.get('/leaderboard/:gameId', getGameLeaderboard);

// GET /api/scores/games - Get all available games
router.get('/games', getAllGames);

module.exports = router;
