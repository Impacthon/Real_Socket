const socket = io();

const welcome = document.getElementById("welcome")
const form = welcome.querySelector("form")
const room = document.getElementById("room")



room.hidden= true;
let roomName

function addMesseage(message){
  const ul = room.querySelector("ul")
  const li = document.createElement("li")
  li.innerHTML = message
  ul.appendChild(li);
}

function handleMessageSubmit(event){
  event.preventDefault()
  const input = room.querySelector("input");
  const value = input.value
  socket.emit("new_message",input.value,roomName,()=>{
    addMesseage(`You: ${value}`)

  })//send  message
  input.value=""
}

function showRoom(){
  welcome.hidden = true
  room.hidden = false
  const h3Change = room.querySelector("h3")
  h3Change.innerText = `Room:${roomName}`
  const form = room.querySelector("form");
  form.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(event){
  event.preventDefault()
  const input = form.querySelector("input");
  socket.emit("enter_room",input.value,showRoom)//방만들기
  roomName = input.value;
  input.value=""
}

socket.on("welcome",()=>{
  const ul = room.querySelector("ul")
  const li = document.createElement("li")

  li.innerText = "Someone Joined"
  ul.appendChild(li)
})
form.addEventListener("submit",handleRoomSubmit) 

socket.on("welcome",()=>{
  addMesseage("Someone Joined!")
})

socket.on("bye",()=>{
  addMesseage("Someone left!")
})

socket.on("new_message",addMesseage)
