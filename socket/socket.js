const SocketController = require("./controller")

 const Soket = (socket,usuarios,usuariosIn,actUsuarios,codigos,onLine) => {

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
     let oflineuser=false
     onLine.map((key,i)=>{
      if(key.id && socket.id &&key.id===socket.id){
                onPosc=i
                oflineuser=key.user
      } 
     })
     usuariosIn.map((key,i)=>{
            if(key.socket&&key.socket.id&&key.socket.id===socket.id){
                onPos=i
            }
        });
    
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
