import db from '../db.js';

export const getUsers = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT id, username, firstName, lastName, createdAt FROM users');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute('SELECT id, username, firstName, lastName, createdAt FROM users WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute('SELECT id FROM users WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    await db.execute('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
