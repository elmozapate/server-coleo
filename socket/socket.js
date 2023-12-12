const SocketController = require("./controller")

 const Soket = (socket) => {

    socket.emit('coleoServer', {
        actionTodo: "serverOn"
    })
    socket.on('domino', (data) => {
        SocketController( socket, data)
    })
    socket.on('disconnect', () => {
        console.log('disconnect', socket.id)
    })
}
module.exports=Soket
