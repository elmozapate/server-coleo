const SocketController = require("./controller")
const Basededatos = require("../db/basededatos.js");
const Soket = (socket,usuarios,usuariosIn,actUsuarios,codigos,onLine) => {
 const doUrl=async()=>{
  const urlGet=await Basededatos('url')
  if(urlGet){
   socket.emit("coleoServer", {
    actionTodo: "newUrl",
    data: urlGet[urlGet.length - 1].url
   })
  }
 }
 doUrl()
 socket.emit('coleoServer', {
        actionTodo: "serverOn"
    })
    socket.on('coleo', (data) => {
        SocketController( socket, data,usuariosIn,actUsuarios,codigos,onLine)
    })
    socket.on('disconnect', () => {
     console.log('disconnect', socket.id)
     let onPos=false
     let onPosc=false
     let losSockets=[]
     let oflineuser=false
     onLine.map((keyO,iO)=>{
      usuariosIn.map((key,i)=>{
       if(key.socket&&key.socket.id&& socket.id === keyO.id){
        losSockets.push(key.usuario.usuario)
        return
        }
        if(key.socket&&key.socket.id&&key.socket.id===socket.id){
         onPos=i
         return
        }
       });
     })
     onLine.map((keyO,iO)=>{
      if(keyO.id && socket.id &&keyO.id===socket.id){
       onPosc=iO
       oflineuser=keyO.user
       return
      } 
      losSockets.map((key,i)=>{
       if(keyO.user&& keyO.user.usuario && key === keyO.user.usuario){
        onPosc=iO
        oflineuser=keyO.user        }
        if(key.socket&&key.socket.id&&key.socket.id===socket.id){
         onPos=i
         return
        }
       });
     })
     let oldOnline=[]
     onPos && usuariosIn[onPos]&& usuariosIn[onPos].usuario && usuariosIn[onPos].usuario.usuario  && onPos&&usuariosIn.splice(onPos,1);
     oldOnline= onPosc ? onLine.splice(onPosc,1):onLine;
     (onPos && usuariosIn[onPos]&& usuariosIn[onPos].usuario && usuariosIn[onPos].usuario.usuario ) && onPos&&actUsuarios(usuariosIn);
     actUsuarios(oldOnline,false,true)
     socket.emit("coleoServer", {
      actionTodo: "onlineUsers",
      user: oldOnline
     })
     socket.broadcast.emit("coleoServer", {
      actionTodo: "onlineUsers",
      user: oldOnline
     });
    })
}
module.exports=Soket
