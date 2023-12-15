const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http").Server(app);
let conectionCount= 0
const Soket = require("./socket/socket.js");
const Basededatos  = require("./db/basededatos.js");
const DbWhile  = require("./db/dbWhile.js");
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
  if(respuesta){
    let manyH = respuesta.length
    const mandarNuevU=async(veces)=>{
      if(veces>0){
         let newUser={
           validate: false,
           contactado: false,
           ip: 0,
           email:'',
           id: 0,
           conectado: false,
           admin: false,
           telefono:0,
           acceso:{
             dias:[],
           },
           dias:{
             jueves:false,
             viernes:false,
             sabado:false,
             domingo:false
           },
           amin:false,
           conecciones:1,
           pago:false
         }
        const vez=veces - 1
        const req= await dbWhile({value:{...newUser,...respuesta[vez]},coleccion:'users'})
        if(req){
          mandarNuevU(vez)
        }
      }
    }
    mandarNuevU(manyH)
  }
  io.on("connection", (socket) => {
      conectionCount++;
      console.log("User connection");
      Soket(socket,respuesta,usuariosIn,actUsuarios);
    });
};
recDb();
app.use(express.static("public"));
