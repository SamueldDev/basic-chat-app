

import User from "../model/userModel.js";
import Message from "../model/messageModel.js";


// create a message- optional

// export const createMessage = async (req, res) => {
//   const { username, content } = req.body;

//   try {
//     const user = await User.findOne({ where: { username } });
//     if (!user) return res.status(404).json({ error: 'User not found' });

//     const message = await Message.create({
//       content,
//       userId: user.id,
//     });

//     res.status(201).json(message);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };


export const createMessage = async (req, res) => {
  const { content } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const message = await Message.create({
      content,
      username: user.username, // 💡 save redundant username
      userId: user.id,
    });

    res.status(201).json({
      id: message.id,
      text: message.content,
      username: message.username,
      userId: user.id,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



export const getMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({
      order: [['createdAt', 'ASC']],
      include: [{ model: User, attributes: ['username'] }]
    });

    const formatted = messages.map(msg => ({
      id: msg.id,
      text: msg.content,
      username: msg.User?.username || 'Unknown',
      clientOffset: msg.clientOffset
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load messages' });
  }
};





// delete mesahe by id
export const deleteMessageById = async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);

    if (!message) return res.status(404).json({ error: 'Message not found' });
    if (message.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this message' });
    }

    await message.destroy();
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
};


