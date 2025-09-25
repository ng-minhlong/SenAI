import db from '../db.js';

export const getAllAddresss = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM user_address');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getAddress = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.execute(
      `SELECT country, city, zip_code, tax_id FROM user_address WHERE user_id = ?`,
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




export const editAddress = async (req, res) => {
  const userId = req.user.id;
  const {
    country,
    city,
    zip_code,
    tax_id,
  } = req.body;

  try {
    const [rows] = await db.execute(
      'SELECT id FROM user_address WHERE user_id = ?',
      [userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ✅ Update user_address
    await db.execute(
      `UPDATE user_address SET 
        country = ?,
        city = ?,
        zip_code = ?,       
        tax_id = ?
      WHERE user_id = ?`,
      [country, city, zip_code, tax_id, userId]
    );

    res.json({ message: 'Address updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
