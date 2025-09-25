import db from '../db.js';

export const getAllMemberships = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT *  FROM user_membership');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getMembership = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.execute(
      `SELECT membership_id, start_date, end_date, is_active, created_at
       FROM user_membership
       WHERE user_id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


