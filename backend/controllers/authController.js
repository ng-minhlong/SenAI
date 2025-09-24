import db from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  const { username, password, firstName, lastName } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: 'Missing username or password' });

  try {
    const [rows] = await db.execute('SELECT id FROM users WHERE username = ?', [username]);
    if (rows.length > 0)
      return res.status(409).json({ message: 'Username already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const now = new Date(); // lấy thời gian hiện tại
    await db.execute(
      'INSERT INTO users (username, password, firstName, lastName, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
      [username, hashedPassword, firstName, lastName, now, now]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
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
