

import User from "../model/userModel.js";
import Message from "../model/messageModel.js";


// create a message
export const createMessage = async (req, res) => {
  const { username, content } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const message = await Message.create({
      content,
      userId: user.id,
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// get all message
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({
      order: [['id', 'ASC']],
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
}



// delete mesahe by id
export const deleteMessagebyId = async (req, res) => {
  try {
    await Message.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
};

