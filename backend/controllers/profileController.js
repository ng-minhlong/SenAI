import db from '../db.js';

export const getAllProfiles = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT id, username, firstName, lastName, createdAt FROM users');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.execute(
      `SELECT 
         up.id,
         up.user_id,
         up.phone_number,
         up.dob,
         up.firstName,
         up.lastName,
         u.email,
         u.username
       FROM user_profile up
       JOIN users u ON up.user_id = u.id
       WHERE up.user_id = ?`,
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



export const editProfile = async (req, res) => {
  const userId = req.user.id;
  const {
    firstName,
    lastName,
    phone_number,
    dob,
  } = req.body;

  try {
    const [rows] = await db.execute(
      'SELECT id FROM user_profile WHERE user_id = ?',
      [userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ✅ Update user_profile
    await db.execute(
      `UPDATE user_profile SET 
        firstName = ?,
        lastName = ?,
        phone_number = ?,       
        dob = ?
      WHERE user_id = ?`,
      [firstName, lastName, phone_number, dob, userId]
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
