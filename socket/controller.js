const DbPut = require("../db/dbput.js");
const DbMod = require("../db/dbMod.js");
const Basededatos = require("../db/basededatos.js");

const SocketController = (socket,data) => {
  
  const actionTodo = data.actionTodo ? data.actionTodo : "sin action";
  const user = data.user ? data.user : "sin usuario";
  const usuario =
    data.data && data.data.usuario ? data.data.usuario : "sin usuario";
 
  if (actionTodo === "test") {
    
    socket.emit("coleoServer", {
      actionTodo: "resChat",
    });
    socket.broadcast.emit("coleoServer", {
      actionTodo: "resChat",
    });
  }
  if (actionTodo === "sendLogin") {
    let usuariosReq= async ()=>{
      let usuariosRes= await Basededatos() 
      let isReg=false
      if(usuariosRes){
        usuariosRes.map((key,i)=>{
          if(key.usuario===data.user.usuario){
            if(key.usuario===data.user.usuario&&key.pssword===data.user.password){
              socket.emit("coleoServer", {
                actionTodo: "correctLogin",
                user:key
              });
            }else{
              socket.emit("coleoServer", {
                actionTodo: "inCorrectLoginData",
              });
            }
            isReg=true
          }
        })
        !isReg&&  socket.emit("coleoServer", {
          actionTodo: "inCorrectLogin",
        });
      }
    }
    usuariosReq()
  }
  if (actionTodo === "sendRegister") {
    let randomC=parseInt(Math.random()*89000+10000)
    let randomId=parseInt(Math.random()*80000000+10000000)
    let nuevoUser={
      ...data.user,
      validate:false,
      password:randomC,
      acceso:{dias:[]},
      ip:0,
      id:randomId,
      conectado:false
    }
    let usuariosReqR= async ()=>{
      let usuariosResR= await Basededatos() 
      if(usuariosRes){
        let isIN=false
        usuariosRes.map((key,i)=>{
          if(key.usuario===data.user.usuario){
           isIN=true
          }
        })
        if(isIN){
          const darRandom=(nombre)=>{
            let isINr=false
            let randomN=parseInt(Math.random()*89+10)
            let randomNombre=`${nombre}${randomN}`
            usuariosRes.map((key,i)=>{
              if(key.usuario===randomNombre){
                isINr=true
              }
            })
            if(isINr){
              randomNombre=darRandom(nombre)
            }
            return randomNombre
          }
          let nuevoNombre=darRandom(data.user.usuario)
          nuevoUser.usuario=nuevoNombre
        }

        let usuariosEnd= async ()=>{
          await DbPut({coleccion:'usuarios',value:nuevoUser})
          socket.emit("coleoServer", {
              actionTodo: "correctRegister"
            })
        }
        usuariosEnd()
    }
  }
};
module.exports = SocketController;
