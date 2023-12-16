const SocketController = require("./controller")

 const Soket = (socket,usuarios,usuariosIn,actUsuarios,codigos) => {

    socket.emit('coleoServer', {
        actionTodo: "serverOn"
    })
    socket.on('coleo', (data) => {
        SocketController( socket, data,usuariosIn,actUsuarios,codigos)
    })
    socket.on('disconnect', () => {
        console.log('disconnect', socket.id)
    let onPos=false
     usuariosIn.map((key,i)=>{
            if(key.socket&&key.socket.id&&key.socket.id===socket.id){
                onPos=i
            }
        });
       (onPos && usuariosIn[onPos]&& usuariosIn[onPos].usuario && usuariosIn[onPos].usuario.usuario ) && onPos&&usuariosIn.splice(onPos,1);
       (onPos && usuariosIn[onPos]&& usuariosIn[onPos].usuario && usuariosIn[onPos].usuario.usuario ) && onPos&&actUsuarios(usuariosIn);
    })
}
module.exports=Soket
