💬 Real-Time Chat App
A real-time chat application built with Node.js, Socket.IO, and MySQL, featuring persistent message storage, reconnect-safe delivery, and user authentication.

🚀 Features
Real-time messaging between connected users

Persistent message storage with MySQL

User authentication using Sequelize & JWT

Message delivery with client-server recovery strategy

Message retry with acknowledgment & timeout

Author-only message deletion (even after refresh)

Graceful handling of disconnection and reconnection

Clean UI using HTML, CSS, and client-side JavaScript

🧠 Architecture Overview
Frontend

HTML/CSS/Vanilla JS

Stores username in localStorage

Connects via Socket.IO client

Acknowledges events, retries if necessary

Backend

Express.js server

Socket.IO for real-time comms

MySQL with Sequelize ORM

Models: User, Message

Routes: /api/users, /api/messages

Tracks serverOffset to sync lost messages on reconnect

📂 Folder Structure

chat-app/
│
├── server/

│   ├── controllers/

│   │   └── messageController.js

│   ├── models/

│   │   ├── User.js

│   │   └── Message.js

│   ├── routes/

│   │   ├── userRoutes.js

│   │   └── messageRoutes.js

│   ├── socket.js

│   └── server.js
│
├── client/

│   ├── chat.html

│   └── socket.js
│
├── .env

├── package.json

└── README.md

⚙️ Installation & Setup

Clone the repo

git clone https://github.com/SamueldDev/basic-chat-app

cd basic-chat-app

Install dependencies

npm install

Set up environment variables

Create a .env file in the root:

DB_HOST=localhost

DB_USER=root

DB_PASSWORD=yourpassword

DB_NAME=chatapp

JWT_SECRET=your_jwt_secret

Start MySQL & Run Migrations

Ensure MySQL is running and run:

npm run migrate   # Or use sequelize-cli if configured

Start the server

npm start

Open the client

Open client/chat.html in the browser or serve via a static file server.

📡 Socket.IO Logic
On connection:

Client sends username and serverOffset

Server uses serverOffset to send missed messages

On message send:

Client emits event with message data and a callback

Server stores message in DB and broadcasts it

On disconnect/reconnect:

Server restores messages using offset

On deletion:

Message can be deleted only by the sender

✨ Technologies Used
Node.js

Express.js

Socket.IO

MySQL + Sequelize

JWT Authentication

HTML/CSS/JavaScript

🛠 Future Improvements
Add typing indicators

Private messaging (DMs)

Image/file sharing

WebSocket performance optimizations

Deploy to Render/Vercel + Railway/MySQL cloud

👨🏽‍💻 Author
Samuel Friday

Fullstack Developer — building real-world apps that scale
💼 Open to backend roles, freelance work, and MVP building
📬 Connect on LinkedIn
🐙 GitHub

📌 License
This project is open-source under the MIT License.
