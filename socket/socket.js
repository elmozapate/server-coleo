const SocketController = require("./controller")

 const Soket = (socket,usuarios,usuariosIn,actUsuarios) => {

  console.log(usuarios)
    socket.emit('coleoServer', {
        actionTodo: "serverOn"
    })
    socket.on('coleo', (data) => {
        SocketController( socket, data,usuariosIn,actUsuarios)
    })
    socket.on('disconnect', () => {
        console.log('disconnect', socket.id)
    let onPos=false
     usuariosIn.map((key,i)=>{
            if(key.socket.id===socket.ip){
                onPos=i
            }
        })
     onPos&&usuariosIn.splice(onPos,1)
       onPos&&actUsuarios(usuariosIn)
    })
}
module.exports=Soket
