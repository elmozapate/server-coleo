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
     onLine.map((key,i)=>{
      if(key.socket&&key.socket.id&&key.socket.id===socket.id){
                onPosc=i
      } 
     })
     usuariosIn.map((key,i)=>{
            if(key.socket&&key.socket.id&&key.socket.id===socket.id){
                onPos=i
            }
        });
    
     let oldOnline=[]
     onPos && usuariosIn[onPos]&& usuariosIn[onPos].usuario && usuariosIn[onPos].usuario.usuario  && onPos&&usuariosIn.splice(onPos,1);
     oldOnline=(onPosc && onLine[onPosc]? onLine.splice(onPos,1):onLine;
     (onPos && usuariosIn[onPos]&& usuariosIn[onPos].usuario && usuariosIn[onPos].usuario.usuario ) && onPos&&actUsuarios(usuariosIn);
     actUsuarios(oldOnline,false,true)
    })
}
module.exports=Soket
