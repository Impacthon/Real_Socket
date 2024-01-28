import  express from "express";
import http from "http";
import SocketIO from "socket.io"

// app 객체안에 express를 넣음
const app = express();

// view 기초 설정
app.set("view engine","pug");
app.set("views",__dirname+"/views");

//use 로 public를 쓰겠다고 선언(라우트(경로 선언) 해줌 아마..?)
app.use("/public",express.static(__dirname+"/public"));

//home 을 처음에 get하게 해주는 코드(route handler)
app.get("/",(req,res)=> res.render("home"));
app.get("/*",(req,res)=> res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection",(socket)=>{
    socket.onAny((event)=>{
        console.log(`Socket Event:${event}`)
    })
    socket.on("enter_room", (roomName,done) =>{
        socket.join(roomName)
        done()
        socket.to(roomName).emit("welcome")
    }); 
    socket.on("disconnecting",()=>{
        socket.rooms.forEach((room) => socket.to(room).emit("bye"));
    })//나가졌을떄
    socket.on("new_message",(msg,room,done)=>{
        socket.to(room).emit("new_message",msg)
        done()
    })
})// 서버는 백엔드에서 호출, 함수는 프론트엔드에서 실행

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);

