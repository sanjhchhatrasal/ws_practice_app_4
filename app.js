const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

let users = [];

const server = http.createServer(app);
const io = socketIo(server);

io.on("connection", function(socket){
    console.log("Connected to socket.io");

    socket.on("username", function(username){
        users.push({username: username, socketId: socket.id})
        console.log(users);
        socket.emit("username-set", username);
        io.emit("connected-user", {totalUsers: users.length, users: users.map(user => user.username), socketId: socket.id})
    });

    socket.on("message", function(data){
        let user = users.find(user => user.socketId === socket.id)
        io.emit("recieve-message", {... data, id: socket.id, user: user.username})
    });

    socket.on("typing", function(){
        socket.broadcast.emit("typing")
    })

    socket.on("disconnect", function(){
        const user = users.find(user => user.socketId === socket.id);
        users = users.filter(user => user.socketId !== socket.id);
        if(user){
            io.emit("disconnected-user", {totalUsers: users.length, users: users.map(user => user.username), socketId: socket.id})
        }
        
        console.log("User Disconnected", "current users", users);
    })
})

app.get("/", (req, res) => {
    res.render("index")
})

server.listen(3000)