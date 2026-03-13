const db = require('../database/db');

/**
 * Submit a new score
 * POST /api/scores/submit
 * Body: { playerName, srn, game, score }
 */
const submitScore = async (req, res) => {
  try {
    const { playerName, srn, game, score } = req.body;

    // Validation
    if (!playerName || !game || !score) {
      return res.status(400).json({ 
        error: 'playerName, game, and score are required' 
      });
    }

    // Validate game exists
    const gameCheck = await db.query(
      'SELECT id FROM games WHERE id = ?',
      [game]
    );

    if (gameCheck.length === 0) {
      return res.status(400).json({ error: 'Game not found' });
    }

    // Input sanitization - prevent SQL injection
    const sanitizedPlayerName = String(playerName).trim().substring(0, 100);
    const sanitizedSrn = srn ? String(srn).trim().substring(0, 50) : null;
    const sanitizedScore = String(score).trim().substring(0, 100);
    const sanitizedGame = String(game).trim();

    // Insert score
    const result = await db.execute(
      'INSERT INTO scores (player_name, srn, score, game_id) VALUES (?, ?, ?, ?)',
      [sanitizedPlayerName, sanitizedSrn, sanitizedScore, sanitizedGame]
    );

    res.status(201).json({
      message: 'Score submitted successfully',
      scoreId: result.insertId
    });
  } catch (error) {
    console.error('Error submitting score:', error);
    res.status(500).json({ error: 'Failed to submit score' });
  }
};

/**
 * Get leaderboard (all scores)
 * GET /api/scores/leaderboard
 * Frontend filters by game on client side
 */
const getLeaderboard = async (req, res) => {
  try {
    // Get all scores with game info, sorted by creation date descending
    const scores = await db.query(`
      SELECT 
        s.id,
        s.player_name AS playerName,
        s.srn,
        s.score,
        s.game_id AS game,
        s.created_at
      FROM scores s
      ORDER BY s.created_at DESC
    `);

    res.status(200).json(scores);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
};

/**
 * Get leaderboard for a specific game
 * GET /api/scores/leaderboard/:gameId
 */
const getGameLeaderboard = async (req, res) => {
  try {
    const { gameId } = req.params;

    if (!gameId) {
      return res.status(400).json({ error: 'gameId is required' });
    }

    // Validate game exists
    const gameCheck = await db.query(
      'SELECT * FROM games WHERE id = ?',
      [gameId]
    );

    if (gameCheck.length === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Get top 10 scores for the game
    const scores = await db.query(`
      SELECT 
        s.id,
        s.player_name AS playerName,
        s.srn,
        s.score,
        s.game_id AS game,
        s.created_at
      FROM scores s
      WHERE s.game_id = ?
      ORDER BY s.created_at DESC
      LIMIT 10
    `, [gameId]);

    const game = gameCheck[0];

    res.status(200).json({
      game: game.name,
      leaderboard: scores
    });
  } catch (error) {
    console.error('Error fetching game leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
};

/**
 * Get all games
 * GET /api/scores/games
 */
const getAllGames = async (req, res) => {
  try {
    const games = await db.query('SELECT id, name, description FROM games');
    res.status(200).json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
};

module.exports = {
  submitScore,
  getLeaderboard,
  getGameLeaderboard,
  getAllGames
};
