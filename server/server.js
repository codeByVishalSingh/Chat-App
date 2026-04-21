import express from "express";
import "dotenv/config";
import http from "http";
import cors from "cors";
import { connectDb } from "./lib/db.js";
import userRouter from "./Routes/user.Routes.js";
import messageRouter from "./Routes/message.Routes.js";
import {Server} from "socket.io";
import User from "./models/User.js";
import { Socket } from "dgram";
 
const app =express();
const server = http.createServer(app);

// Initialize Socket.io server

export  const io = new  Server(server,{
    cors:{origin: "*"}
})

// Store online User
export const userSocketMap = {}

// Socket.io Connection Handler
io.on("connection", (Socket)=>{
   const userId = Socket.handshake.query.userId;
   console.log("User Connected", userId);
   if(userId) userSocketMap[userId] = Socket.id;


   io.emit("getOnlineUsers",Object.keys[userSocketMap]);

   Socket.on("disconnect",()=>{
    console.log("User Disconnected",userId);
    delete userSocketMap[userId]
    io.emit("getOnlineUser", Object.keys(userSocketMap))
    
   })
   
})

// Middleware setup

app.use(express.json({limit:"4mb"}));
app.use(cors());

app.use("/api/status",(req,res)=> res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages",messageRouter)

// Connect to Mongodb

await connectDb();

const PORT = process.env.PORT || 5000;
server.listen(PORT,()=> console.log("Server is runing on PORT:"+PORT));


