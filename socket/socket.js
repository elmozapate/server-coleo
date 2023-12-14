const SocketController = require("./controller")

 const Soket = (socket,usuarios,usuariosIn,actUsuarios) => {

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
            if(key.socket.id===socket.id){
                onPos=i
            }
        })
       ( usuariosIn[onPos].usuario &&!usuariosIn[onPos].usuario.usuario) && onPos&&usuariosIn.splice(onPos,1)
       ( usuariosIn[onPos].usuario &&!usuariosIn[onPos].usuario.usuario) && onPos&&actUsuarios(usuariosIn)
    })
}
module.exports=Soket
