const FautoPlay = require('./autoPlay.js');

 const FenviarTiempo = (variables,sala, socket) => {

    const Variables = require('../models/variables.js');
const autoPlay=FautoPlay
    const VariablesC = Variables()
    let { salas = VariablesC.salas, PromosArray = VariablesC.PromosArray, done = VariablesC.done, conection = VariablesC.conection, listenSocket = VariablesC.listenSocket, init = VariablesC.init, conectionCount = VariablesC.conectionCount, juegos = VariablesC.juegos, empresa = VariablesC.empresa, newHistorial = VariablesC.newHistorial, log = VariablesC.log, ecpData = VariablesC.ecpData, chat = VariablesC.chat, users = VariablesC.users, usuarios = VariablesC.usuarios, usuariosIn = VariablesC.usuariosIn } = variables
    let variablesAux = variables
    if (salas[sala].etapa.etapa === 'jugando') {
        let elTiempo = salas[sala].salaInfo.playTime[salas[sala].salaInfo.turno]
        if (elTiempo > 0) {
            elTiempo = elTiempo - 1
            salas[sala].salaInfo.playTime[salas[sala].salaInfo.turno] = elTiempo
            setTimeout(() => {
                socket.emit('dominoServer', {
                    actionTodo: "jugadaTime",
                    time: elTiempo
                })
                socket.broadcast.emit('dominoServer', {
                    actionTodo: "jugadaTime",
                    time: elTiempo
                })
                FenviarTiempo(variables,sala, socket)
            }, 1000);
        }
        else {
            setTimeout(() => {
                socket.emit('dominoServer', {
                    actionTodo: "jugadaTime",
                    time: 'perdio'
                })
                socket.broadcast.emit('dominoServer', {
                    actionTodo: "jugadaTime",
                    time: 'perdio'
                })
                juegos.map((keyJu, iJu) => {
                    if (keyJu.id === salas[sala].id) {
                        salas[sala].salaInfo.playTime[salas[sala].salaInfo.turno] = 30
                        autoPlay(variables,sala, salas[sala].jugadores[salas[sala].salaInfo.turno], socket)
                    }
                })
                FenviarTiempo(variables, sala, socket)
            }, 1000);
        }
    }
}
module.exports = FenviarTiempo