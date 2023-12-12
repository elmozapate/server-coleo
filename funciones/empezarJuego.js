const FmandarFichas = require('./FmandarFichas.js');
const FmezclarFichas = require('./FmezclarFichas.js');

const FempezarJuego = (variables, sala, Socket, time) => {

    const Variables = require('../models/variables.js');
    const mezclarFichas = FmezclarFichas
    const mandarFichas = FmandarFichas
    const VariablesC = Variables()
    let { salas = VariablesC.salas, PromosArray = VariablesC.PromosArray, done = VariablesC.done, conection = VariablesC.conection, listenSocket = VariablesC.listenSocket, init = VariablesC.init, conectionCount = VariablesC.conectionCount, juegos = VariablesC.juegos, empresa = VariablesC.empresa, newHistorial = VariablesC.newHistorial, log = VariablesC.log, ecpData = VariablesC.ecpData, chat = VariablesC.chat, users = VariablesC.users, usuarios = VariablesC.usuarios, usuariosIn = VariablesC.usuariosIn } = variables
    let variablesAux = variables
    let newTime = time - 1
    Socket.broadcast.emit('dominoServer', {
        actionTodo: "salaTime",
        sala: sala,
        time: newTime
    })
    Socket.emit('dominoServer', {
        actionTodo: "salaTime",
        sala: sala,
        time: newTime
    })
    setTimeout(() => {
        let aSocket = Socket
        let newTimeIN = newTime
        if (newTimeIN >= 0) {
            FempezarJuego(variables, sala, aSocket, newTimeIN)
        } else {
            let aSocket = Socket
            let newTimeIN = newTime
            let mezcladas = async () => {
                let res = await mezclarFichas(variables)
                if (res) {
                    mandarFichas(variables, res, sala, aSocket, newTimeIN)
                    return res

                }
            }
            mezcladas()

            aSocket.broadcast.emit('dominoServer', {
                actionTodo: "salaTimeReady",
                sala: sala,
                time: newTime
            })
            aSocket.emit('dominoServer', {
                actionTodo: "salaTimeReady",
                sala: sala,
                time: newTime
            })
        }

    }, 1000)
}
module.exports = FempezarJuego