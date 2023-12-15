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
const actUsuarios=(usuarios)=>{
  usuariosIn = usuarios
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
  io.on("connection", (socket) => {
      conectionCount++;
      console.log("User connection");
      Soket(socket,respuesta,usuariosIn,actUsuarios);
    });
};
recDb();
app.use(express.static("public"));
