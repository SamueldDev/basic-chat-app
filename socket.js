
import Message from "./model/messageModel.js";
import { Op } from 'sequelize';
import jwt from 'jsonwebtoken';
import User from "./model/userModel.js";

export const handleSocket = (io) => {
  io.use(async (socket, next) => {
    try {
      const { token } = socket.handshake.auth;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id);
      if (!user) return next(new Error("Unauthorized"));

       console.log(' Authenticated socket user:', user.username); 
      socket.user = user;
      next();
    } catch (err) {
      console.error("Socket auth error:", err.message);
      next(new Error("Invalid token"));
    }
  });

  io.on('connection', async (socket) => {
    console.log(` Connected: ${socket.user.username}`);
    socket.emit('me', socket.user.id);

    const offset = socket.handshake.auth.serverOffset || 0;

    if (!socket.recovered) {

      const missedMessages = await Message.findAll({
        where: { id: { [Op.gt]: offset } },
        include: [{ model: User, attributes: ['username'] }],
        order: [['id', 'ASC']]
      });

      missedMessages.forEach((msg) => {
        const username = msg.User?.username;
        const userId = msg.userId;

        if (!username || !userId) {
          console.warn(" Skipping message due to missing user info", msg.id);
          return;
        }

        socket.emit('chatMessage', {
          username,
          userId,
          text: msg.content,
          clientOffset: msg.clientOffset,
          recovered: true
        }, msg.id);
      });

      console.log(` Recovered ${missedMessages.length} messages`);
    }

    socket.on("chatMessage", async (msg, clientOffset, callback) => {
      try {

        // console.log(' Received chat message from:', socket.user.username, '| text:', msg.text);

        const [newMessage, created] = await Message.findOrCreate({
          where: { clientOffset },
          defaults: {
            content: msg.text,
            clientOffset,
            userId: socket.user.id
          }
        });

         if (!socket.user?.username) {
      console.warn(' Username missing in socket.user!');
    }

      const payload = {
        username: socket.user.username, // 
        userId: socket.user.id,
        text: msg.text,
        clientOffset
      };

      io.emit('chatMessage', payload, newMessage.id);
      callback(null, newMessage.id);
    } catch (err) {
      console.error("chatMessage error:", err.message);
      callback(err);
    }
  });

  });

};

















