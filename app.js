

import { createServer } from "http"


import { Server } from "socket.io"

import path from 'path';
import { fileURLToPath } from 'url';

// These two lines help replicate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


import express from "express"

const app = express()

const server = createServer(app)
const io = new Server(server,
    {
         connectionStateRecovery: {}
    }
)

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Optional: route for '/'
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on("connection", (socket) => {
    console.log("a user is connected")

    // socket.on("disconnect", () => {
    //     console.log("a user is disconnected")
    // })

    socket.on("chat message", (msg) => {  
        // console.log("message: " +  msg);


    // socket.broadcast.emit("chat message", (msg)) // 🔁 everyone EXCEPT sender

    io.emit("chat message", (msg)); // 🔁 broadcast to ALL clients

    })


}) 

// server.listen(8000, () => {
//     console.log("server running at 8000")  
// })



server.listen(8000, '0.0.0.0', () => {
  console.log("✅ Server running on http://localhost:8000");
  console.log("🌐 Accessible on local network at http://192.168.43.51:8000");
});




// nodemon app.js






























// // Serve static files from the "public" folder
// app.use(express.static(path.join(__dirname, 'public')));

// // Optional: route for '/'
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });



// // app.get("/", (req, res) => {
// //     res.send("welcome to websocket")
// // }) 



