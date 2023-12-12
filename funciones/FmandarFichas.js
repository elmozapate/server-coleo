const FdevolverLgoUsuario = require('./devolverAlgoUsuario.js');
const FenviarTiempo = require('./enviarTiempo.js');

const FmandarFichas = (variables, res, sala, aSocket, newTimeIN) => {

    const Variables = require('../models/variables.js');
    const enviarTiempo = FenviarTiempo
    const devolverLgoUsuario = FdevolverLgoUsuario
    const VariablesC = Variables()
    let { salas = VariablesC.salas, PromosArray = VariablesC.PromosArray, done = VariablesC.done, conection = VariablesC.conection, listenSocket = VariablesC.listenSocket, init = VariablesC.init, conectionCount = VariablesC.conectionCount, juegos = VariablesC.juegos, empresa = VariablesC.empresa, newHistorial = VariablesC.newHistorial, log = VariablesC.log, ecpData = VariablesC.ecpData, chat = VariablesC.chat, users = VariablesC.users, usuarios = VariablesC.usuarios, usuariosIn = VariablesC.usuariosIn } = variables
    let variablesAux = variables
    let jugadoresTablero = []
    let gameId = salas[sala].id

    let fichasJugadores = []
    let iinitPos = -1

    let fichas = res.fichas
    let index = 1
    let fichasDraft = res.fichasDraft
    let jugadores = []
    let numJugadores = salas[sala].cantidadDeJugadores
    let fichasReadyDraft = res.fichasReadyDraft
    let enJuego = false
    let start = true
    let salaInfo = salas[sala].salaInfo
    let doubles = [27,
        25,
        22,
        18,
        13,
        7,
        0]
    let founded = false
    let turno = -1
    let restantes = [7,
        7,
        7,
        7,
        7,
        7,
        7]
    let tablero = []
    let pozo = []
    let pozof = []
    let sale = {
        usuario: "",
        ficha: "",
        pos: -1
    }
    let posibles = {
        a: 0,
        b: 0
    }

    const crearGameData = () => {

        salas[sala].jugadores.map((key, i) => {
            let fichasJug = []
            let playerData = {
                player: i + 1,
                usuario: key.usuario,
                fichas: [],
                saldo: devolverLgoUsuario(variables, key.usuario, 'contable').saldo - salaInfo.valores.entrada
            }
            salaInfo.recaudo.push({
                valor: salaInfo.valores.entrada,
                task: "ingreso"
            })
            salaInfo.historial.push({
                task: "ingreso Sala",
                usuario: key.usuario,
                fecha: new Date().getTime()
            })
            jugadores.push(playerData)

        })
        const setFichas = () => {
            const element = parseInt(Math.random() * fichasReadyDraft.length)
            let res = false
            if (!fichasReadyDraft[element].selected) {
                fichasReadyDraft[element].selected = true
                res = (fichasReadyDraft[element])

            } else {
                res = setFichas()
            }
            return res

        }
        salas[sala].jugadores.map((key, i) => {
            let fichasJug = []
            for (let index = 0; index < 7; index++) {
                fichasJug.push(setFichas())
            }
            jugadores[i].fichas = fichasJug
        })
        const verSale = () => {
            founded = false
            sale = {
                usuario: "",
                ficha: "",
                pos: -1
            }
            turno = -1
            doubles.map((keyD) => {
                if (!founded) {
                    jugadores.map((key, i) => {
                        key.fichas.map((keyF, iF) => {
                            if (fichasDraft[keyF.pos].id === keyD && !founded) {
                                founded = true
                                sale.usuario = key.usuario
                                sale.ficha = fichas[fichasDraft[keyF.pos].id].value
                                turno = i
                                sale.pos = i
                                posibles.a = parseInt(fichasDraft[keyF.pos].value.split(':')[0])
                                posibles.b = parseInt(fichasDraft[keyF.pos].value.split(':')[1])
                                //fichaPos = iF
                            }
                        })
                    })
                }
            })
        }
        verSale()
        jugadores.map((keyJu, iJu) => {
            if (keyJu.usuario === sale.usuario) {
                iinitPos = iJu
                jugadoresTablero.push({
                    nombre: keyJu.usuario,
                    fichas: keyJu.fichas.length
                })
            }
        })
        jugadores.map((keyJu, iJu) => {
            if (iinitPos !== iJu) {
                jugadoresTablero.push({
                    nombre: keyJu.usuario,
                    fichas: keyJu.fichas.length
                })
            }
        })
        const llenarPozo = () => {
            restantes = [7, 7, 7, 7, 7, 7, 7]
            tablero = []
            pozo = []
            pozof = []
            let ficjadUse = []
            jugadores.map((key, i) => {
                key.fichas.map((keyF,
                    iF) => {
                    ficjadUse.push(keyF.id + 1)
                })
            })
            fichas.map((keyPr, iPr) => {
                let used = false
                ficjadUse.map((keyComp,
                    iCpmp) => {
                    if (keyComp === keyPr.id) {
                        used = true
                    }
                })
                !used && pozo.push(keyPr)
            })
            pozo.map((ketp,
                igf) => {
                pozof.push(false)
            })
            const randomp = () => {
                let randomN = parseInt(Math.random() * pozo.length)
                if (!pozof[randomN]) {
                    console.log
                } else {
                    randomN = randomp()
                }

                return randomN
            }
            for (let ipozo = 0; ipozo < pozo.length; ipozo++) {
                let num = randomp()
                pozof[num] = pozo[ipozo]
            }
        }
        llenarPozo()


        usuariosIn.map((keyUs, iUs) => {
            if (keyUs.usuario === sale.usuario) {
                keyUs.socket.emit('dominoServer', {
                    actionTodo: "tuSales",
                    sala: sala,
                    saleFicha: sale.ficha
                })
                keyUs.socket.broadcast.emit('dominoServer', {
                    actionTodo: "quienSale",
                    sala: sala,
                    saleFicha: sale.ficha
                })
                salas[sala].salaInfo.primeraFicha = { a: sale.ficha.values[0], b: sale.ficha.values[1] }
            }
        })

        jugadores.map((key, i) => {
            let susFichas = []
            key.fichas.map((keyD, iD) => {
                susFichas.push(keyD)
            })
            fichasJugadores.push(susFichas)
        })


        juegos.push({
            id: gameId,
            fichas: fichas,
            index: index,
            fichasDraft: fichasDraft,
            jugadores: jugadores,
            numJugadores: numJugadores,
            fichasReadyDraft: fichasReadyDraft,
            enJuego: enJuego,
            start: start,
            salaInfo: {
                ...salaInfo,
                turno: iinitPos
            },
            doubles: doubles,
            founded: founded,
            turno: turno,
            restantes: restantes,
            tablero: tablero,
            pozo: pozo,
            pozof: pozof,
            sale: sale,
            posibles: posibles,
            fichasJugadores: fichasJugadores,
            jugadoresTablero: jugadoresTablero
        })

        salas[sala].salaInfo.turno = iinitPos
        salas[sala].etapa.etapa = 'jugando'

        aSocket.broadcast.emit('dominoServer', {
            actionTodo: "newSala",
            salas: salas
        })

        aSocket.emit('dominoServer', {
            actionTodo: "newSala",
            salas: salas
        })
        aSocket.broadcast.emit('dominoServer', {
            actionTodo: "jugadoresTablero",
            jugadoresTablero: jugadoresTablero
        })

        aSocket.emit('dominoServer', {
            actionTodo: "jugadoresTablero",
            jugadoresTablero: jugadoresTablero
        })

        aSocket.broadcast.emit('dominoServer', {
            actionTodo: "tableroNew",
            pozo: pozo,
            res: [],
            posibles: posibles
        })
        aSocket.emit('dominoServer', {
            actionTodo: "tableroNew",
            pozo: pozo,
            res: [],
            posibles: posibles
        })

        let tusFichas = []

        jugadores.map((keyComp, iComp) => {
            tusFichas = []
            let newFichas = []
            keyComp.fichas.map((ketTuF, iTuF) => {
                newFichas.push(ketTuF.value)
            })
            tusFichas = newFichas
            usuarios.map((keyU, iU) => {
                if ((keyComp.usuario === keyU.usuario || keyComp.usuario === keyU.email)) {
                    usuariosIn.map((keyUs, iUs) => {
                        if ((keyU.usuario === keyUs.usuario) || (keyU.email === keyUs.usuario)) {
                            keyUs.socket.emit('dominoServer', {
                                actionTodo: "playerFichas",
                                sala: sala,
                                tusFichas: tusFichas
                            })
                            keyUs.socket.emit('dominoServer', {
                                actionTodo: "tableroNew",
                                pozo: pozo,
                                res: [],
                                posibles: posibles
                            })
                        }
                    })

                }
            })
        })

    }
    crearGameData()
    enviarTiempo(variables, sala, aSocket)





}
module.exports = FmandarFichas