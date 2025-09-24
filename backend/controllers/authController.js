import db from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { v4 as uuidv4 } from 'uuid';

export const register = async (req, res) => {
  const { email, username, password, firstName, lastName } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: 'Missing username or password' });

  const connection = await db.getConnection(); // lấy connection để transaction
  await connection.beginTransaction();

  try {
    const [rows] = await connection.execute(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );
    if (rows.length > 0) {
      await connection.rollback();
      connection.release();
      return res.status(409).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const id = uuidv4();           
    const now = new Date();

    // Insert vào users
    await connection.execute(
      `INSERT INTO users 
        (id, username, email, password, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, username, email, hashedPassword, now, now]
    );

    // Insert vào user_profile
    await connection.execute(
      `INSERT INTO user_profile (user_id, firstName, lastName) VALUES (?, ?, ?)`,
      [id, firstName, lastName]
    );

    // Insert vào user_setting
    await connection.execute(
      `INSERT INTO user_setting (user_id, darkmode, language) VALUES (?, ?, ?)`,
      [id, 'off', 'english']
    );

    await connection.commit();
    connection.release();

    res.status(201).json({ message: 'User registered successfully', userId: id });
  } catch (err) {
    await connection.rollback();
    connection.release();
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



export const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Missing username or password' });
  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });
    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
