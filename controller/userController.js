

import User from "../model/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


// register a user
export const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existing = await User.findOne({ where: { username } });
    if (existing) return res.status(400).json({ error: 'Username already taken' });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({ username, password: hashed });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
};




// log a user in
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};
















// export const createUser = async (req, res) => {
//   const { username } = req.body;
//   try {
//     const user = await User.create({ username });
//     res.status(201).json(user);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// export const updateStatus = async (req, res) => {
//   const { username } = req.params;
//   const { status } = req.body;
//   try {
//     await User.update({ status }, { where: { username } });
//     res.status(200).json({ message: 'Status updated' });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };