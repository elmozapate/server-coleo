const FjalaPozo = (variables,data, socket) => {

    const Variables = require('../models/variables.js');

    const VariablesC = Variables()
    let { salas = VariablesC.salas, PromosArray = VariablesC.PromosArray, done = VariablesC.done, conection = VariablesC.conection, listenSocket = VariablesC.listenSocket, init = VariablesC.init, conectionCount = VariablesC.conectionCount, juegos = VariablesC.juegos, empresa = VariablesC.empresa, newHistorial = VariablesC.newHistorial, log = VariablesC.log, ecpData = VariablesC.ecpData, chat = VariablesC.chat, users = VariablesC.users, usuarios = VariablesC.usuarios, usuariosIn = VariablesC.usuariosIn } = variables
    let variablesAux = variables
    let newFichas = []
    let jTablero = []
    let oldPozo = []
    let oldPozoF = []
    let lasFichas = []
    let fichasReadyDraft = []
    juegos.map((key, i) => {
        if (key.id === salas[data.sala].id) {
            oldPozo = key.pozo
            oldPozoF = key.pozof
            lasFichas = key.fichas
            fichasReadyDraft = key.fichasReadyDraft
            let ready = false

            key.jugadores.map((keyJ, iJ) => {
                if (!ready && keyJ.usuario === data.user) {
                    juegos[i].jugadores[iJ].fichas.map((ketTuF, iTuF) => {
                        !ready && newFichas.push(ketTuF.value)
                    })
                    let newJ = juegos[i].jugadores[iJ].fichas
                    fichasReadyDraft.map((keyFd, iFd) => {
                        if (!ready && keyFd.id === (oldPozo[oldPozo.length - 1].id - 1)) {
                            newJ.push(keyFd)
                            newFichas.push(keyFd.value)
                            ready = true
                        }
                    })
                    juegos[i].jugadores[iJ].fichas = newJ
                    oldPozo.splice(oldPozo.length - 1, 1)
                    jTablero = juegos[i].jugadoresTablero
                    juegos[i].jugadoresTablero.map((ketT, iT) => {
                        if (ketT.nombre === data.user) {
                            jTablero[iT].fichas = jTablero[iT].fichas + 1

                        }
                    })
                    juegos[i].jugadoresTablero = jTablero
                    juegos[i].pozo = oldPozo
                    juegos[i].pozof = oldPozo

                    socket.broadcast.emit('dominoServer', {
                        actionTodo: "tableroNew",
                        pozo: oldPozo,
                        res: juegos[i].tablero,
                        posibles: juegos[i].posibles
                    })
                    socket.emit('dominoServer', {
                        actionTodo: "tableroNew",
                        pozo: oldPozo,
                        res: juegos[i].tablero,
                        posibles: juegos[i].posibles
                    })
                }
            })

        }
    })
    users.map((keyU, iU) => {
        if (((data.user || data.usuario) === keyU.usuario || (data.user || data.usuario) === keyU.email)) {
            usuariosIn.map((keyUs, iUs) => {
                if ((keyU.usuario === keyUs.usuario) || (keyU.email === keyUs.usuario)) {
                    keyUs.socket.emit('dominoServer', {
                        actionTodo: "playerFichas",
                        sala: data.sala,
                        tusFichas: newFichas
                    })
                    keyUs.socket.broadcast.emit('dominoServer', {
                        actionTodo: "jugadoresTablero",
                        jugadoresTablero: jTablero
                    })
                    keyUs.socket.emit('dominoServer', {
                        actionTodo: "jugadoresTablero",
                        jugadoresTablero: jTablero
                    })

                }
            })

        }
    })
    return true
}
module.exports = FjalaPozo