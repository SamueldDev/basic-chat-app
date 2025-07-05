
import { createServer } from "http"
import { Server } from "socket.io"
import path from 'path';
import { fileURLToPath } from 'url';

import { sequelize } from "./model/index.js"

//import sequelize from "./config/db.js"

import dotenv from "dotenv"
dotenv.config()
import userRoute  from "./routes/userRoute.js"
import messageRoute from './routes/messageRoute.js';
import { handleSocket } from "./socket.js";
import express from "express"      

const PORT = process.env.PORT || 5000;

// get the fileaname and dirname 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express()  

// parse the josn bodies
app.use(express.json())    

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Optional: route for '/'
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.get("/chat", (req, res) => {  
  res.send("chat_blog API is Live")   
})

app.use("/api/user", userRoute)  

app.use('/api/messages', messageRoute);
  
const server = createServer(app)  
const io = new Server(server,
    {
         connectionStateRecovery: {}
    }  
)

handleSocket(io)

const start = async () => {
    try{
      await sequelize.authenticate()
      console.log('DB connected')

      // // production-safe  
      // await sequelize.sync();
      // console.log("database synced")   

      // dev only 

      await sequelize.sync({ alter: true})
      console.log("database synced ")

      // await sequelize.sync({ force: true})
      // console.log("all tables dropped and recreated ")

      server.listen(PORT, () => {  

        console.log(`server running on port ${PORT}`)
        console.log(" Accessible on local network at http://192.168.43.51:3000");
      })
    }catch(err){    
        console.error("Unable to connect to database:", err)
    }
}  

start()








// nodemon app.js
























// node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
























































// raw chat-app without mysql
// import { createServer } from "http"
// import { Server } from "socket.io"
// import path from 'path';
// import { fileURLToPath } from 'url';

// // get the fileaname and dirname 
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);


// import express from "express"  

// const app = express()

// const server = createServer(app)
// const io = new Server(server,
//     {
//          connectionStateRecovery: {}
//     }
// )

// // Serve static files from the "public" folder
// app.use(express.static(path.join(__dirname, 'public')));

// // Optional: route for '/'
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// io.on("connection", (socket) => {
//     console.log("a user is connected")

//     // socket.on("disconnect", () => {
//     //     console.log("a user is disconnected")
//     // })

//     socket.on("chatMessage", (msg) => {  
//         // console.log("message: " +  msg);


//     socket.broadcast.emit("chatMessage", (msg)) //  everyone EXCEPT sender

//     // io.emit("chatMessage", (msg)); //  broadcast to ALL clients

//     })


// }) 



// // liste to thes server and also expose the port interface
// server.listen(8000, '0.0.0.0', () => {
//   console.log(" Server running on http://localhost:8000"); 
//   console.log(" Accessible on local network at http://192.168.43.51:8000");
// });










