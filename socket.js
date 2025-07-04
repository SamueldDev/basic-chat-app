

import Message from "./model/messageModel.js";

import { Op } from 'sequelize';

export const handleSocket = (io) => {
  io.on('connection', async (socket) => {
    console.log('User connected:', socket.id);

    // Get last seen message ID from client
    const offset = socket.handshake.auth.serverOffset || 0;

    // If built-in recovery failed, recover manually from DB
    if (!socket.recovered) {
      try {
        const missedMessages = await Message.findAll({
          where: { id: { [Op.gt]: offset } },
          order: [['id', 'ASC']],
        });

        missedMessages.forEach((msg) => {
          socket.emit('chatMessage', { username: 'Recovered', text: msg.content }, msg.id);
        });

        console.log(`Recovered ${missedMessages.length} messages for client`);
      } catch (err) {
        console.error('Recovery error:', err.message);
      }
    }

    // Live incoming message handler
    // socket.on('chatMessage', async (msg) => {
    //   try {
    //     const savedMessage = await Message.create({
    //       content: msg.text,
    //       userId: null, // link to user if needed
    //     });

    //     // Broadcast to others
    //     socket.broadcast.emit('chatMessage', msg, savedMessage.id);

    //     // Re-send to sender if recovery wasn’t already used
    //     if (!socket.recovered) {
    //       socket.emit('chatMessage', msg, savedMessage.id);
    //     }

    //   } catch (err) {
    //     console.error('Error saving message:', err.message);
    //   }
    // });

    socket.on("chatMessage", async (msg, clientOffset, callback) => {
      try {
        const [newMessage, created] = await Message.findOrCreate({
          where: { clientOffset },
          defaults: {
            content: msg.text,
            clientOffset
          }
        });

        if (created) {
          io.emit("chatMessage", msg, newMessage.id);
        }

        callback(); //  Must call this or client keeps retrying
      } catch (err) {
        console.error("Failed to save message:", err);
        // still call callback to prevent endless retry
        callback();
      }
    });
    

    socket.on('deleteMessage', async (messageId) => {
    try {
        await Message.destroy({ where: { id: messageId } });
        io.emit('messageDeleted', messageId); // tell all clients
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
