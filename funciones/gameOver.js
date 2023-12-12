const FcrearJugadores = require('./crearJugadores.js');
const FliquidarSala = require('./liquiidarSala.js');
const FterminarJuego = require('./terminarJuego.js');

const FgameOver = (variables, user, pos, posU, data, socket, cerrado) => {
    const Variables = require('../models/variables.js');
    const liquidarSala = FliquidarSala
    const terminarJuego=FterminarJuego
    const VariablesC = Variables()
    const crearJugadores = FcrearJugadores
    let { salas = VariablesC.salas, PromosArray = VariablesC.PromosArray, done = VariablesC.done, conection = VariablesC.conection, listenSocket = VariablesC.listenSocket, init = VariablesC.init, conectionCount = VariablesC.conectionCount, juegos = VariablesC.juegos, empresa = VariablesC.empresa, newHistorial = VariablesC.newHistorial, log = VariablesC.log, ecpData = VariablesC.ecpData, chat = VariablesC.chat, users = VariablesC.users, usuarios = VariablesC.usuarios, usuariosIn = VariablesC.usuariosIn } = variables
    let variablesAux = variables
    let recaudoEntrada = 0
    let recaudoJuego = 0
    recaudoEntrada = parseInt((((salas[data.sala].jugadores.length * salas[data.sala].salaInfo.valores.entrada) * .90) / 100) * 100)
    salas[data.sala].salaInfo.balance.jugadores.map((keyC, iC) => {
        keyC.favor.map((keyF, iF) => {
            recaudoJuego = recaudoJuego + keyF.valor
        })
    })
    salas[data.sala].etapa.etapa = 'premiacion'
    recaudoJuego = parseInt((((recaudoJuego) * .90) / 100) * 100)
    let infoEndGame = {
        ganador: { nombre: cerrado ? 'JUEGO CERRADO' : ((user.usuario || user.user)), usuarioFull: juegos[pos].jugadores[posU] },
        jugadores: juegos[pos].jugadores,
        balance: salas[data.sala].salaInfo.balance.jugadores,
        sala: { nombre: salas[data.sala].nombre, recaudoEntrada: recaudoEntrada, recaudoJuego: recaudoJuego, pagado: 0 },
        puntos: [0, 0, 0, 0]
    }
    let premiacion = crearJugadores(variables, infoEndGame)
    premiacion.map((keyP, iP) => {
        juegos.map((keyC, iC) => {
            if (salas[data.sala].id === keyC.id) {
                keyC.jugadores.map((keyF, iF) => {
                    keyF.fichas.map((key, i) => {
                    })
                })

            }
        })
        let puntos = [
            0, 0, 0, 0
        ]
        juegos.map((keyC, iC) => {

            if (salas[data.sala].id === keyC.id) {
                keyC.jugadores.map((keyF, iF) => {
                    let puntosj = 0
                    keyF.fichas.map((key, i) => {
                        puntosj = puntosj + parseInt(key.value.split(':')[0]) + parseInt(key.value.split(':')[1])
                    })
                    puntos[iF] = puntosj
                })

            }
        })
        infoEndGame.puntos = puntos
        if (!cerrado) {
            let totalPagado = keyP.favor
            if (keyP.usuario === (user.usuario || user.user)) {
                totalPagado = keyP.favor + recaudoEntrada
                keyP.favor > 0 && liquidarSala(variables, keyP, totalPagado, socket)

            } else {
                keyP.favor > 0 && liquidarSala(variables, keyP, totalPagado, socket)
            }
            infoEndGame = {
                ...infoEndGame,
                sala: {
                    ...infoEndGame.sala,
                    pagado: keyP.favor > 0 ? infoEndGame.sala.pagado + totalPagado : infoEndGame.sala.pagado
                }
            }
        } else {


        }
        socket.emit('dominoServer', {
            actionTodo: "hayGanador",
            infoEndGame: infoEndGame
        })
        socket.broadcast.emit('dominoServer', {
            actionTodo: "hayGanador",
            infoEndGame: infoEndGame
        })
    })
    socket.emit('dominoServer', {
        actionTodo: "hayGanador",
        infoEndGame: infoEndGame
    })
    socket.broadcast.emit('dominoServer', {
        actionTodo: "hayGanador",
        infoEndGame: infoEndGame
    })
    setTimeout(() => {
        socket.emit('dominoServer', {
            actionTodo: "hayGanador",
            infoEndGame: infoEndGame
        })
        socket.broadcast.emit('dominoServer', {
            actionTodo: "hayGanador",
            infoEndGame: infoEndGame
        })
        socket.broadcast.emit('dominoServer', {
            actionTodo: "newSala",
            salas: salas
        })
        socket.emit('dominoServer', {
            actionTodo: "newSala",
            salas: salas
        })
        terminarJuego(variables,data.sala, socket, 1200)
    }, 1200);
}
module.exports = FgameOver