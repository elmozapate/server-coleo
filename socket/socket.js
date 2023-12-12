const Variables = require("../models/variables")
const SocketController = require("./controller")

const VariablesC = Variables()
 const Soket = (socket, variables) => {
    let { salas = VariablesC.salas, PromosArray = VariablesC.PromosArray, done = VariablesC.done, conection = VariablesC.conection, listenSocket = VariablesC.listenSocket, init = VariablesC.init, conectionCount = VariablesC.conectionCount, juegos = VariablesC.juegos, empresa = VariablesC.empresa, newHistorial = VariablesC.newHistorial, log = VariablesC.log, ecpData = VariablesC.ecpData, chat = VariablesC.chat, users = VariablesC.users, usuarios = VariablesC.usuarios, usuariosIn = VariablesC.usuariosIn } = (variables || VariablesC)

    socket.emit('coleoServer', {
        actionTodo: "serverOn"
    })
    socket.on('domino', (data) => {
        SocketController( socket, variables, data)
    })
    socket.on('disconnect', () => {
        console.log('disconnect', socket.id)
    })
}
module.exports=Soket
