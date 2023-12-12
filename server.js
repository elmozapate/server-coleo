const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http").Server(app);
let conectionCount= 0
const Soket = require("./socket/socket.js");
const Variables = require("./models/variables.js");
const FdbRes = require("./funciones/FdbRes.js");
let PORT = process.env.PORT || 3005;
const VariablesC = Variables();


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
  const respuesta = true /*await FdbRes(variablesAux);*/
    io.on("connection", (socket) => {
      conectionCount++;
      console.log("User connection");
      Soket(socket);
    });
};
recDb();

app.use(express.static("public"));
