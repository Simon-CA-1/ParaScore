const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  adminLogin,
  createGame,
  deleteGame,
  deleteScore,
  resetLeaderboard,
  getAllScores
} = require('../controllers/adminController');

/**
 * Admin endpoints
 * POST /api/admin/login - Public, no auth required
 * All other routes require JWT authentication
 */

// POST /api/admin/login - Admin authentication
router.post('/login', adminLogin);

// Protected routes
router.use(authMiddleware);

// GET /api/admin/scores - Get all scores
router.get('/scores', getAllScores);

// POST /api/admin/games - Create a new game
router.post('/games', createGame);

// DELETE /api/admin/games/:id - Delete a game
router.delete('/games/:id', deleteGame);

// DELETE /api/admin/scores/:id - Delete a specific score
router.delete('/scores/:id', deleteScore);

// DELETE /api/admin/leaderboard/:gameId - Reset leaderboard
router.delete('/leaderboard/:gameId', resetLeaderboard);

module.exports = router;
