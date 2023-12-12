const Variables = require("../models/variables")
const SocketController = require("./controller")

const VariablesC = Variables()
 const Soket = (socket, variables) => {
    let { salas = VariablesC.salas, PromosArray = VariablesC.PromosArray, done = VariablesC.done, conection = VariablesC.conection, listenSocket = VariablesC.listenSocket, init = VariablesC.init, conectionCount = VariablesC.conectionCount, juegos = VariablesC.juegos, empresa = VariablesC.empresa, newHistorial = VariablesC.newHistorial, log = VariablesC.log, ecpData = VariablesC.ecpData, chat = VariablesC.chat, users = VariablesC.users, usuarios = VariablesC.usuarios, usuariosIn = VariablesC.usuariosIn } = (variables || VariablesC)

    socket.emit('dominoServer', {
        actionTodo: "serverOn"
    })
    socket.on('domino', (data) => {
        SocketController( socket, variables, data)
    })
    socket.on('disconnect', () => {
        let posi = -1
        let posiB = -1
        let userD = ''
        usuariosIn.map((key, i) => {
            if (key.socket.id === socket.id) {
                posi = i
                userD = key.usuario || key.user

            }
        })
        usuarios.map((key, i) => {
            if ((key.usuario || key.user) === userD) {
                posiB = i
            }
        })
        posi !== -1 && usuariosIn.splice(posi, 1);
        posiB !== -1 && usuarios.splice(posiB, 1);
        socket.broadcast.emit('dominoServer', {
            actionTodo: "usuarios",
            usuarios: usuarios,
            salas: salas,
            chat: chat
        })
        console.log('disconnect', socket.id)
    })
}
module.exports=Soket