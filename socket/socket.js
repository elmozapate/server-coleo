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
    })
}
module.exports=Soket
