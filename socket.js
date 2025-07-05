

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

       console.log('✅ Authenticated socket user:', user.username); // 👈 IMPORTANT
      socket.user = user;
      next();
    } catch (err) {
      console.error("Socket auth error:", err.message);
      next(new Error("Invalid token"));
    }
  });

  io.on('connection', async (socket) => {
    console.log(`✅ Connected: ${socket.user.username}`);
    socket.emit('me', socket.user.id);

    const offset = socket.handshake.auth.serverOffset || 0;

    if (!socket.recovered) {

      // In socket.js, update the recovery section


      const missedMessages = await Message.findAll({
        where: { id: { [Op.gt]: offset } },
        include: [{ model: User, attributes: ['username'] }],
        order: [['id', 'ASC']]
      });


      


      missedMessages.forEach((msg) => {
        const username = msg.User?.username;
        const userId = msg.userId;

        if (!username || !userId) {
          console.warn("⚠️ Skipping message due to missing user info", msg.id);
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




      console.log(`🔁 Recovered ${missedMessages.length} messages`);
    }


    socket.on("chatMessage", async (msg, clientOffset, callback) => {
      try {
        console.log('🔔 Received chat message from:', socket.user.username, '| text:', msg.text);
        const [newMessage, created] = await Message.findOrCreate({
          where: { clientOffset },
          defaults: {
            content: msg.text,
            clientOffset,
            userId: socket.user.id
          }
        });

         if (!socket.user?.username) {
      console.warn('⚠️ Username missing in socket.user!');
    }


      const payload = {
        username: socket.user.username, // ✅ always from socket
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



//     socket.on("chatMessage", async (msg, clientOffset, callback) => {
//     try {
//         const [newMessage, created] = await Message.findOrCreate({
//           where: { clientOffset },
//         defaults: {
//           content: msg.text,
//           clientOffset,
//           userId: socket.user.id
//         }
//       });

//     // ✅ Always emit with correct username
//     io.emit('chatMessage', {
//       username: socket.user.username,
//       userId: socket.user.id,
//       text: msg.text,
//       clientOffset
//     }, newMessage.id);

//     callback(null, newMessage.id);
//   } catch (err) {
//     console.error("chatMessage error:", err.message);
//     callback(err);
//   }
// });


//     socket.on("chatMessage", async (msg, clientOffset, callback) => {
//   try {
//     const [newMessage, created] = await Message.findOrCreate({
//       where: { clientOffset },
//       defaults: {
//         content: msg.text,
//         clientOffset,
//         userId: socket.user.id
//       }
//     });

//     const messagePayload = {
//       username: socket.user.username, // Always include username
//       userId: socket.user.id,
//       text: msg.text,
//       clientOffset
//     };

//     io.emit('chatMessage', messagePayload, newMessage.id);
//     callback(null, newMessage.id);
//   } catch (err) {
//     console.error("chatMessage error:", err.message);
//     callback(err);
//   }
// });



  });

};
















// export const handleSocket = (io) => {
//   io.use(async (socket, next) => {
//     try {
//       const { token } = socket.handshake.auth;
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       const user = await User.findByPk(decoded.id);
//       if (!user) return next(new Error("Unauthorized"));
//       socket.user = user;
//       next();
//     } catch (err) {
//       console.error("Socket auth error:", err.message);
//       next(new Error("Invalid token"));
//     }
//   });

//   io.on('connection', async (socket) => {
//     console.log(`✅ Connected: ${socket.user.username}`);

//     // ✅ Send own userId to frontend
//     socket.emit('me', socket.user.id);

//     const offset = socket.handshake.auth.serverOffset || 0;

//     if (!socket.recovered) {
//       const missedMessages = await Message.findAll({
//         where: { id: { [Op.gt]: offset } },
//         include: [{ model: User, attributes: ['username'] }],
//         order: [['id', 'ASC']]
//       });

//       missedMessages.forEach((msg) => {
//         socket.emit('chatMessage', {
//           username: msg.User?.username || msg.username,
//           userId: msg.userId,
//           text: msg.content,
//           clientOffset: msg.clientOffset,
//           recovered: true
//         }, msg.id);
//       });

//       console.log(`🔁 Recovered ${missedMessages.length} messages`);
//     }



//     // socket.on("chatMessage", async (msg, clientOffset, callback) => {
//     //   try {
//     //     const [newMessage, created] = await Message.findOrCreate({
//     //       where: { clientOffset },
//     //       defaults: {
//     //         content: msg.text,
//     //         clientOffset,
//     //         username: socket.user.username,
//     //         userId: socket.user.id
//     //       }
//     //     });

//     //     if (created) {
//     //       io.emit('chatMessage', {
//     //         username: socket.user.username,
//     //         userId: socket.user.id,
//     //         text: msg.text,
//     //         clientOffset
//     //       }, newMessage.id);
//     //     }

//     //     callback(null, newMessage.id);
//     //   } catch (err) {
//     //     console.error("chatMessage error:", err.message);
//     //     callback(err);
//     //   }
//     // });

//     socket.on("chatMessage", async (msg, clientOffset, callback) => {
//       try {
//         const [newMessage, created] = await Message.findOrCreate({
//           where: { clientOffset },
//           defaults: {
//             content: msg.text,
//             clientOffset,
//             userId: socket.user.id
//           },
//           include: [{ model: User, attributes: ['username'] }]
//         });

//         if (created) {
//           io.emit('chatMessage', {
//             username: socket.user.username,
//             userId: socket.user.id,
//             text: msg.text,
//             clientOffset
//           }, newMessage.id);
//         }

//       callback(null, newMessage.id);
//         } catch (err) {
//           console.error("chatMessage error:", err.message);
//           callback(err);
//         }
//       });



//     socket.on("deleteMessage", async (messageId) => {
//       try {
//         const msg = await Message.findByPk(messageId);
//         if (!msg || msg.userId !== socket.user.id) {
//           console.warn(`❌ Unauthorized delete attempt by ${socket.user.username}`);
//           return;
//         }

//         await msg.destroy();
//         io.emit('messageDeleted', messageId);
//       } catch (err) {
//         console.error("Delete error:", err.message);
//       }
//     });
//   });
// };

































// export const handleSocket = (io) => {
//   // ✅ Authenticate socket connection via JWT
//   io.use(async (socket, next) => {
//     try {
//       const { token } = socket.handshake.auth;
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       const user = await User.findByPk(decoded.id);
//       if (!user) return next(new Error("Unauthorized"));

//       socket.user = user; // Attach full user to socket
//       next();
//     } catch (err) {
//       console.error("Socket auth error:", err.message);
//       next(new Error("Invalid token"));
//     }
//   });

//   io.on("connection", async (socket) => {
//     console.log(`✅ Connected: ${socket.user.username}`);

//     const offset = socket.handshake.auth.serverOffset || 0;

//     // ✅ Recover missed messages (after offset)
//     if (!socket.recovered) {
//       try {
//         const missedMessages = await Message.findAll({
//           where: { id: { [Op.gt]: offset } },
//           order: [["id", "ASC"]]
//         });

//         missedMessages.forEach((msg) => {
//           socket.emit("chatMessage", {
//             username: msg.username,
//             text: msg.content,
//             clientOffset: msg.clientOffset,
//             recovered: true
//           }, msg.id);
//         });

//         console.log(`🔁 Recovered ${missedMessages.length} messages`);
//       } catch (err) {
//         console.error("Recovery error:", err.message);
//       }
//     }

//     // ✅ Handle new message from client
//     socket.on("chatMessage", async (msg, clientOffset, callback) => {
//       try {
//         const [newMessage, created] = await Message.findOrCreate({
//           where: { clientOffset },
//           defaults: {
//             content: msg.text,
//             clientOffset,
//             userId: socket.user.id,
//             username: socket.user.username
//           }
//         });

//         const fullMsg = {
//           username: socket.user.username,
//           text: msg.text,
//           clientOffset
//         };

//         if (created) {
//           io.emit("chatMessage", fullMsg, newMessage.id);
//         }

//         callback(null, newMessage.id); // ✅ Send ID back to client
//       } catch (err) {
//         console.error("Message error:", err.message);
//         callback(err);
//       }
//     });

//     // ✅ Secure delete — only allow user to delete their message
//     socket.on("deleteMessage", async (messageId) => {
//       try {
//         const msg = await Message.findByPk(messageId);
//         if (!msg) return;

//         if (msg.userId !== socket.user.id) {
//           console.warn(`❌ Unauthorized delete attempt by ${socket.user.username}`);
//           return;
//         }

//         await msg.destroy();
//         io.emit("messageDeleted", messageId);
//       } catch (err) {
//         console.error("Delete error:", err.message);
//       }
//     });
//   });
// };
















