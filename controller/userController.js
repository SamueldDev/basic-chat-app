

import User from "../model/userModel.js";



export const createUser = async (req, res) => {
  const { username } = req.body;
  try {
    const user = await User.create({ username });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateStatus = async (req, res) => {
  const { username } = req.params;
  const { status } = req.body;
  try {
    await User.update({ status }, { where: { username } });
    res.status(200).json({ message: 'Status updated' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};