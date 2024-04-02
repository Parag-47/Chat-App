const users = [];

// Add Users
function addUsers({ id, username, room }) {
  
  // Data Clean UP
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // Check If Empty
  if(!username || !room) {
    return {
      Error: "Username and Room Can't Be Empty!"
    };
  }

  // Check If User Already Exists
  const existingUser = users.find((user)=>{
    return user.room === room && user.username === username;
  });

  if(existingUser) {
    return {
      Error: "Username Is In Use!"
    };
  }

  // Add New User
  const user = { id, username, room };
  users.push(user);
  return { user };

}

// Remove User
function removeUser(id) {
  const index = users.findIndex( (user)=> user.id === id );

  if(index !== -1) {
    return users.splice(index, 1)[0];  
  }

  /*return {
    Error: "User Not Found!"
  };*/

}

// Get User
function getUser(id) {
  const user = users.find((user)=>{
   return user.id === id; 
  });

  if(!user) {
    return {
      Error: "User Not Found!"
    };
  }

  return { user };
}

// Get USers In Room
function getUsersInRoom(room) {
  const sameRoom = users.filter((user)=>{
    return user.room === room;
  }); 

  if(sameRoom.length===0) {
    return {
      Error: 'Room Is Empty!'
    };
  }

  return sameRoom;

}

// ToDo toUpCase()
/* function toUpCase(text) {
  const name = username.split(" ");

  for (let i = 0; i < name.length; i++) {
    name[i] = name[i][0].toUpperCase() + name[i].substr(1);
  }

  name.join(" ");
} */

module.exports = { addUsers, removeUser, getUser, getUsersInRoom };