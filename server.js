const http = require('node:http');
const Filter = require('bad-words');
const socketIO = require('socket.io');
const app = require('./app');
const { generateMessage } = require("./utils/messages");
const { addUsers, removeUser, getUser, getUsersInRoom } = require("./utils/users");
const PORT = process.env.PORT || 8000;

const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket)=>{
  console.log('New Client Connected!');  

  socket.on("join", ({ username, room }, callback)=>{
    const { Error, user } = addUsers({ id: socket.id, username, room });

    //console.log(user);

    if(Error) {
      return callback(Error);
    }

    socket.join(user.room);
    
    socket.emit('message', generateMessage("Welcome!", "Admin"));
    socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} Has Joined!`, "Admin"));

    io.to(user.room).emit('roomData', { 
      room: user.room,
      users: getUsersInRoom(user.room)
    });

    callback();

  });

  socket.on('sendMessage', (getMessage, callback)=>{

    const { Error, user } = getUser(socket.id);
    
    if(Error) {
      return callback(Error);
    }

    //console.log(Error);

    const filter = new Filter();
    
    if(filter.isProfane(getMessage)) {
      return callback('Profanity IS Not Allowed!');
    }

    console.log('New Message: ',getMessage);
    io.to(user.room).emit('message', generateMessage(getMessage, user.username));
    callback();
  });

  socket.on('shareLocation', (coords, callback)=>{

    const user = getUser(socket.id);

    //console.log(coords);
    const location = `https://www.google.com/maps?q=${coords.lat},${coords.long}`;
    io.to(user.room).emit('location', generateMessage(location, user.username));
    callback();
  });

  socket.on('disconnect', ()=>{
    const user = removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('message', generateMessage(`${user.username} Has Left!`, "Admin"));
      io.to(user.room).emit('roomData', { 
        room: user.room,
        users: getUsersInRoom(user.room)
      });
    }

  });

});

async function startServer() {
  server.listen(PORT, ()=>{
    console.log(`Server Is Listing On Port ${5000}`);
  });
}

startServer();