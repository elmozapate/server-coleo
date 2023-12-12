const FresUser = require('./resUser.js');

const FterminarJuego = (variables,sala, Socket, time) => {
const resUser=FresUser
    const Variables = require('../models/variables.js');

    const VariablesC = Variables()
    let { salas = VariablesC.salas, PromosArray = VariablesC.PromosArray, done = VariablesC.done, conection = VariablesC.conection, listenSocket = VariablesC.listenSocket, init = VariablesC.init, conectionCount = VariablesC.conectionCount, juegos = VariablesC.juegos, empresa = VariablesC.empresa, newHistorial = VariablesC.newHistorial, log = VariablesC.log, ecpData = VariablesC.ecpData, chat = VariablesC.chat, users = VariablesC.users, usuarios = VariablesC.usuarios, usuariosIn = VariablesC.usuariosIn } = variables
    let variablesAux = variables
    let newTime = time - 1
    Socket.broadcast.emit('dominoServer', {
        actionTodo: "salaEndTime",
        sala: sala,
        time: newTime
    })
    Socket.emit('dominoServer', {
        actionTodo: "salaEndTime",
        sala: sala,
        time: newTime
    })
    setTimeout(() => {
        let aSocket = Socket
        let newTimeIN = newTime
        if (newTimeIN >= 0) {
            FterminarJuego(variables, sala, aSocket, newTimeIN)
        } else {
            let laPos = -1
            juegos.map((key, i) => {
                if (salas[sala].id === key.id) {
                    laPos = i
                }

            })

            if (laPos !== -1) {
                let newJuegos = []

                let checking = false
                !checking && juegos[laPos].jugadores.map((keyJ, iJ) => {
                    const userPosz = resUser(variables,keyJ.usuario)
                    usuarios[userPosz] = {
                        ...usuarios[userPosz],
                        inSala: {
                            ...usuarios[userPosz].inSala,
                            playing: false
                        },
                    }

                    const nEwSala = salaDef
                    salas[sala] = {
                        ...salas[sala],
                        jugadores: [],
                        etapa: { state: true, etapa: 'inscripcion' },
                        salaInfo: nEwSala.salaInfo
                    }
                    aSocket.emit('dominoServer', {
                        actionTodo: "endGame",
                    })
                    aSocket.broadcast.emit('dominoServer', {
                        actionTodo: "endGame",
                    })

                    aSocket.broadcast.emit('dominoServer', {
                        actionTodo: "newSala",
                        salas: salas
                    })

                    aSocket.emit('dominoServer', {
                        actionTodo: "newSala",
                        salas: salas
                    })
                })
                juegos.map((key, i) => {
                    if (i !== laPos) {
                        newJuegos.push(key)
                    }
                })
                juegos = newJuegos
                /* */
                /* 
  
                */
            }

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
module.exports = FterminarJuego