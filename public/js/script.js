const socket = io();

//Elements
const $message = document.querySelector('#message');
const $send = document.querySelector('#send');
const $shareLocation = document.querySelector('#shareLocation');
const $displayMessages = document.querySelector('#displayMessages');

//Templates
const messageTemplate = document.querySelector("#messageTemplate").innerHTML;
const locationTemplate = document.querySelector("#locationTemplate").innerHTML;
const sidebarTemplate = document.querySelector("#sidebarTemplate").innerHTML; 

//Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

function autoScroll () {
  // New message element
  const $newMessage = $displayMessages.lastElementChild;
  // Height of the new message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  // Visible height
  const visibleHeight = $displayMessages.offsetHeight;

  // Height of messages container
  const containerHeight = $displayMessages.scrollHeight;

  // How far have I scrolled?
  const scrollOffset = $displayMessages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $displayMessages.scrollTop = $displayMessages.scrollHeight;
  }
}

socket.on('message', (response)=>{
  //console.log('The Message Is: ',response.text);

  const html = Mustache.render(messageTemplate, {
    message: response.text,
    name: response.name,
    time: moment(response.createdAt).format('h:mm a')
  });

  $displayMessages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

socket.on("location", (response)=>{
  //console.log(response);

  const html = Mustache.render(locationTemplate, {
    location: response.text,
    name: response.name,
    time: moment(response.createdAt).format('h:mm a')
  });
  
  $displayMessages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

$send.addEventListener('click', ()=>{
  const message = $message.value;
  $send.setAttribute("disabled", "disabled");

  if(!message) {
    //alert("Message Can't Be Empty!");
    return $send.removeAttribute("disabled");
  }  

  socket.emit('sendMessage', message, (error)=>{
    $send.removeAttribute("disabled");
    $message.value = "";
    $message.focus();

    if(error === 'Profanity Is Not Allowed!') {
      alert(error);
      console.log(error);
    }

    if(error !== 'Profanity Is Not Allowed!') {
      alert("Connection Lost Reloading The Page");
      window.location.reload();
      console.log(error);
    }

    //console.log("Message Sent!");
  });
});

socket.on('roomData', ({ room, users })=>{
  
  room = room[0].toUpperCase() + room.substring(1);

  const html = Mustache.render(sidebarTemplate, {
    room,
    users
  });

  document.querySelector('#sidebar').innerHTML = html;
});

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

function success(data) {

  const location = {
    lat: data.coords.latitude,
    long: data.coords.longitude
  };

  socket.emit('shareLocation', location, (error)=>{
    $shareLocation.removeAttribute("disabled");
    if(error) {
      alert("Connection Lost Reloading The Page");
      window.location.reload();
      console.log(message);
    }
    //console.log("Location Shared!");
  });

}

function error(error) {
  console.error(error);
  alert("Couldn't Fetch Location!");
}

$shareLocation.addEventListener('click', ()=>{
  if(!navigator.geolocation) {
    return alert("Your Browser Doesn't Support Geolocation");
  }
  
  $shareLocation.setAttribute("disabled", "disabled");
  navigator.geolocation.getCurrentPosition(success, error, options);
});

socket.emit("join", { username, room }, (error)=>{

  if(error) {
    console.error(error);
    alert(error);
    location.href="/";
  }

});