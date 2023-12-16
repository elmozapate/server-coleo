const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http").Server(app);
let conectionCount= 0
const Soket = require("./socket/socket.js");
const Basededatos  = require("./db/basededatos.js");
const DbPut  = require("./db/dbput.js");
let PORT = process.env.PORT || 3005;
let usuariosIn=[]
let codigos=[]
let onLine=[]
const actUsuarios=(value,codigos,onLine)=>{
  if(onLine){
    onLine=value
  }else{
    if(!codigos){
      usuariosIn = value
    }else{
      codigos = value
    }
  }
}
app.use(cors());
http.listen(PORT, () => {
  console.log("listening t ", PORT);
});
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});
const recDb = async () => {
  const respuesta = await Basededatos()
  const respuestaa = await Basededatos('usar')
  io.on("connection", (socket) => {
      conectionCount++;
      console.log("User connection");
    socket.emit('coleoServer',{
     actionTodo:'develop',
      data:respuesta
    })
     socket.emit('coleoServer',{
     actionTodo:'develops',
      data:respuestaa
    })
    
    Soket(socket,respuesta,usuariosIn,actUsuarios,codigos,onLine);
    });
};
recDb();
app.use(express.static("public"));
