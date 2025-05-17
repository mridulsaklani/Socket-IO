import dotenv from "dotenv"
dotenv.config()

import express from 'express';
const app = express();
import { Server } from "socket.io";
import {createServer} from "http"
import cors from "cors"

const PORT = process.env.PORT || 5000


app.use(cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "DELETE", 'PATCH'],
        credentials: true
}))

const server = createServer(app)



const io = new Server(server, {
    cors:{
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "DELETE", 'PATCH'],
        credentials: true
    }
});

io.use((socket, next)=>{

    next();
})

io.on("connection", (socket)=>{
  
     console.log("user connected, socket id: ", socket.id)
     socket.emit("welcome",  "welcome to the server")
   
     socket.on("message", ({messages, socketId})=>{


         console.log(messages)
        
         socket.on("create-room",(id)=>{
            socket.join(id);
            
         })

         if(socketId){
            let userId = socket.id
             socket.to(socketId).emit("receive-msg",{ messages, userId})
            }
            else{
                let userId = socket.id
                socket.broadcast.emit("receive-msg-all",{ messages, userId})
            }

            
         
     })
     socket.on("disconnect", ()=>{
       console.log(`user disconnected: ${socket.id} `)})
})


app.get("/", (req,res)=>{
    res.send("Hello world")
})

server.listen(PORT, ()=>{
    console.log(`app is listen on http://localhost:${PORT}`)
})



