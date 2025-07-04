



// import express from 'express';
// import { createServer } from 'http';
// import { Server } from 'socket.io';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// const server = createServer(app);
// const io = new Server(server);

// app.use(express.static(path.join(__dirname, 'public')));



// io.on('connection', (socket) => {
//   console.log('A user connected:', socket.id);

//   socket.on('joinRoom', (room) => {
//     socket.join(room);
//     console.log(`${socket.id} joined room ${room}`);

//     // Notify only users in that room
//     io.to(room).emit('chatMessage', `${socket.id} has joined the room.`);
    
//     // Send a message to all users EXCEPT those in that room
//     io.except(room).emit('chatMessage', `A user joined a different room: ${room}`);
//   });

//   socket.on('chatMessage', (msg) => {
//     // Broadcast to all rooms the socket is in
//     for (const room of socket.rooms) {
//       if (room !== socket.id) { // default room is socket.id
//         io.to(room).emit('chatMessage', msg);
//       }
//     }
//   });  

//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id); 

//     // io.to('devs').emit('chatMessage', `User ${socket.id} has left.`);

//   });


// //   // User leaves a specific room (but stays connected)
// // socket.on('leaveRoom', (roomName) => {
// //   socket.leave(roomName);
// //   socket.emit('leftRoom', roomName);
// // });


// });

// server.listen(8000, '0.0.0.0', () => {
//   console.log('Server running on http://localhost:8000');
// });
