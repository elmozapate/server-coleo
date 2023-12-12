const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http").Server(app);

const Soket = require("./socket/socket.js");
const Variables = require("./models/variables.js");
const FdbRes = require("./funciones/FdbRes.js");
let PORT = process.env.PORT || 3005;
const VariablesC = Variables();

let {
  salas = VariablesC.salas,
  PromosArray = VariablesC.PromosArray,
  done = VariablesC.done,
  conection = VariablesC.conection,
  listenSocket = VariablesC.listenSocket,
  init = VariablesC.init,
  conectionCount = VariablesC.conectionCount,
  juegos = VariablesC.juegos,
  empresa = VariablesC.empresa,
  newHistorial = VariablesC.newHistorial,
  log = VariablesC.log,
  ecpData = VariablesC.ecpData,
  chat = VariablesC.chat,
  users = VariablesC.users,
  usuarios = VariablesC.usuarios,
  usuariosIn = VariablesC.usuariosIn,
} = VariablesC;
let variablesAux = VariablesC;

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
  const respuesta = await FdbRes(variablesAux);
    variablesAux = respuesta
    io.on("connection", (socket) => {
      variablesAux.conectionCount++;
      conectionCount++;
      console.log("User connection");
      Soket(socket, variablesAux);
    });
};
recDb();

app.use(express.static("public"));
