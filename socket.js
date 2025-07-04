


import Message from "./model/messageModel.js";
import { Op } from 'sequelize';
import jwt from 'jsonwebtoken';
import User from "./model/userModel.js";

// import User from "./model/userModel.js"; // update path if needed

export const handleSocket = (io) => {

  // ✅ Authenticate using JWT before connection is accepted
  io.use(async (socket, next) => {
    try {
      const { token } = socket.handshake.auth;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id);
      if (!user) return next(new Error("Unauthorized"));

      socket.user = user; // Attach user info
      next();
    } catch (err) {
      console.error("Socket auth error:", err.message);
      next(new Error("Invalid token"));
    }
  });

  // ✅ On connection
  io.on('connection', async (socket) => {
    console.log('User connected:', socket.user.username);

    const offset = socket.handshake.auth.serverOffset || 0;

    // ✅ Recovery from missed messages
    if (!socket.recovered) {
      try {
        const missedMessages = await Message.findAll({
          where: { id: { [Op.gt]: offset } },
          order: [['id', 'ASC']],
        });

        missedMessages.forEach((msg) => {
          socket.emit('chatMessage', {
            username: msg.username,
            text: msg.content,
            clientOffset: msg.clientOffset,
            recovered: true // ✅ flag for client UI
          }, msg.id);
        });

        console.log(`Recovered ${missedMessages.length} messages for ${socket.user.username}`);
      } catch (err) {
        console.error('Recovery error:', err.message);
      }
    }

    // ✅ Handle incoming messages
    socket.on("chatMessage", async (msg, clientOffset, callback) => {
      try {
        const [newMessage, created] = await Message.findOrCreate({
          where: { clientOffset },
          defaults: {
            content: msg.text,
            clientOffset,
            username: socket.user.username,  // ✅ use authenticated user
            userId: socket.user.id           // ✅ optional: for ownership/deletion control
          }
        });

        const fullMsg = {
          username: socket.user.username,
          text: msg.text,
          clientOffset
        };

        if (created) {
          io.emit("chatMessage", fullMsg, newMessage.id);
        }

        callback(null, newMessage.id); // ✅ acknowledge with message ID
      } catch (err) {
        console.error("Failed to save message:", err.message);
        callback(err); // still call to prevent infinite retries
      }
    });

    // ✅ Handle message deletion
    socket.on('deleteMessage', async (messageId) => {
      try {
        // Optional: Only allow delete if socket.user.id === message.userId
        const msg = await Message.findByPk(messageId);
        if (!msg) return;

        // Optional check (enable if you store userId on messages)
        // if (msg.userId !== socket.user.id) return;

        await msg.destroy();
        io.emit('messageDeleted', messageId);
      } catch (err) {
        console.error('Delete error:', err.message);
      }
    });
  });
};



















// export const handleSocket = (io) => {
//   io.on('connection', (socket) => {
//     console.log('User connected');

//     socket.on('chatMessage', async (msg) => {
//       try {
//         const savedMessage = await Message.create({
//           content: msg.text,
//           userId: null,
//         });

//         io.emit('chatMessage', msg, savedMessage.id);

//         // Emit to sender if it was NOT recovered (i.e., not already seen before disconnect)
//         if (!socket.recovered) {
//             socket.emit('chatMessage', msg, savedMessage.id);
//         }

//       } catch (err) {
//         console.error('Message save error:', err.message);
//       }
//     });
//   });
// };
