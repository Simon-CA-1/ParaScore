const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../database/db');

/**
 * Admin login - Issues JWT token
 * POST /api/admin/login
 * Body: { username, password }
 */
const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Hardcoded admin credentials for now
    // In production, store these securely in database with hashed passwords
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'deltatime2024';

    // Simple credential check
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { username, role: 'admin' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      username
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

/**
 * Create a new game
 * POST /api/admin/games
 * Auth: Required
 * Body: { id, name, description }
 */
const createGame = async (req, res) => {
  try {
    const { id, name, description } = req.body;

    if (!id || !name) {
      return res.status(400).json({ error: 'id and name are required' });
    }

    // Check if game already exists
    const existing = await db.query('SELECT id FROM games WHERE id = ?', [id]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Game id already exists' });
    }

    // Input sanitization
    const sanitizedId = String(id).trim().substring(0, 50);
    const sanitizedName = String(name).trim().substring(0, 100);
    const sanitizedDescription = description ? String(description).trim().substring(0, 500) : null;

    await db.execute(
      'INSERT INTO games (id, name, description) VALUES (?, ?, ?)',
      [sanitizedId, sanitizedName, sanitizedDescription]
    );

    res.status(201).json({
      message: 'Game created successfully',
      game: { id: sanitizedId, name: sanitizedName, description: sanitizedDescription }
    });
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).json({ error: 'Failed to create game' });
  }
};

/**
 * Delete a game
 * DELETE /api/admin/games/:id
 * Auth: Required
 */
const deleteGame = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Game id is required' });
    }

    // Check if game exists
    const game = await db.query('SELECT id FROM games WHERE id = ?', [id]);
    if (game.length === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Delete game (scores will be cascade deleted)
    await db.execute('DELETE FROM games WHERE id = ?', [id]);

    res.status(200).json({ message: 'Game deleted successfully' });
  } catch (error) {
    console.error('Error deleting game:', error);
    res.status(500).json({ error: 'Failed to delete game' });
  }
};

/**
 * Delete a specific score
 * DELETE /api/admin/scores/:id
 * Auth: Required
 */
const deleteScore = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Score id is required' });
    }

    // Check if score exists
    const score = await db.query('SELECT id FROM scores WHERE id = ?', [id]);
    if (score.length === 0) {
      return res.status(404).json({ error: 'Score not found' });
    }

    await db.execute('DELETE FROM scores WHERE id = ?', [id]);

    res.status(200).json({ message: 'Score deleted successfully' });
  } catch (error) {
    console.error('Error deleting score:', error);
    res.status(500).json({ error: 'Failed to delete score' });
  }
};

/**
 * Reset leaderboard for a game (delete all scores for that game)
 * DELETE /api/admin/leaderboard/:gameId
 * Auth: Required
 */
const resetLeaderboard = async (req, res) => {
  try {
    const { gameId } = req.params;

    if (!gameId) {
      return res.status(400).json({ error: 'game_id is required' });
    }

    // Check if game exists
    const game = await db.query('SELECT id FROM games WHERE id = ?', [gameId]);
    if (game.length === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Get count of scores before deletion
    const scoresBefore = await db.query(
      'SELECT COUNT(*) as count FROM scores WHERE game_id = ?',
      [gameId]
    );

    // Delete all scores for this game
    await db.execute('DELETE FROM scores WHERE game_id = ?', [gameId]);

    res.status(200).json({
      message: 'Leaderboard reset successfully',
      scoresDeleted: scoresBefore[0].count
    });
  } catch (error) {
    console.error('Error resetting leaderboard:', error);
    res.status(500).json({ error: 'Failed to reset leaderboard' });
  }
};

/**
 * Get all scores (admin view)
 * GET /api/admin/scores
 * Auth: Required
 */
const getAllScores = async (req, res) => {
  try {
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
    console.error('Error fetching scores:', error);
    res.status(500).json({ error: 'Failed to fetch scores' });
  }
};

module.exports = {
  adminLogin,
  createGame,
  deleteGame,
  deleteScore,
  resetLeaderboard,
  getAllScores
};
