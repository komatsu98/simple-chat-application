
var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require("body-parser")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

//create Database
var mongoose = require("mongoose")
var conString = "mongodb://komatsu98:ckemgio123@ds261040.mlab.com:61040/komatsu98"
// const conString = "mongodb://cuong:123456a@ds159020.mlab.com:59020/chatfriend"
app.use(express.static(__dirname))
var Chats = mongoose.model("Chats", {
    name: String,
    mess: String
})
var Users = mongoose.model("users",{
    account: String,
    password: String
})
// app.listen(3000);
mongoose.connect(conString, { useMongoClient: true }, (err) => {
    console.log("Database connection", err)
})
server.listen(3000);


app.get('/', function(request, response) {
    response.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    socket.on('join', function(name){
        socket.name = name;
        io.emit('chat', {name : name, mess : "Da tham gia vao phong"})
    });
    socket.on('chat', function(message) {
        io.emit('chat', message);
    });
    socket.on('disconnect', function() {
        io.emit('chat', 'User has disconnected.');
    });
});

app.post("/chats", async (req, res) => {
    try {
        var chat = new Chats(req.body)
        await chat.save()
        res.sendStatus(200)
    } catch (error) {
        res.sendStatus(500)
        console.error(error)
    }
})
app.post("/login", function (req, res){
    try {
        var login = new Users(req.body)
        Users.find({account: login.account, password: login.password},(error, users) => {
            res.send(users)
        })
    } catch (error) {
        res.sendStatus(500)
        console.error(error)
    }
})
app.get("/chats", (req, res) => {
    Chats.find({}, (error, chats) => {
        res.send(chats)
        console.log(chats)
    })
})
app.get("/users", (req, res) => {
    Users.find({}, (error, users) => {
        res.send(users)
        console.log(users)
    })
})

