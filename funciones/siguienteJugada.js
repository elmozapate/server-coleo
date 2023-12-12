const FdbRes = require('./FdbRes.js');
const FdevolverLgoUsuario = require('./devolverAlgoUsuario.js');
const FgameOver = require('./gameOver.js');
const FmodificarAlgo = require('./modificarAlgo.js');
const Frevisarposibles = require('./revisarPosibles.js');

const FsiguienteJugada = (variables, data, socket, double, pasar, jaloPozo, autoPlay) => {
    const gameOver = FgameOver
    const dbRes = FdbRes
    const modificarAlgo = FmodificarAlgo
    const devolverAlgoUsuario = FdevolverLgoUsuario
    const DbMod = require('../db/dbMod.js');
    const Variables = require('../models/variables.js');
    const revisarposibles = Frevisarposibles
    const VariablesC = Variables()
    let { salas = VariablesC.salas, PromosArray = VariablesC.PromosArray, done = VariablesC.done, conection = VariablesC.conection, listenSocket = VariablesC.listenSocket, init = VariablesC.init, conectionCount = VariablesC.conectionCount, juegos = VariablesC.juegos, empresa = VariablesC.empresa, newHistorial = VariablesC.newHistorial, log = VariablesC.log, ecpData = VariablesC.ecpData, chat = VariablesC.chat, users = VariablesC.users, usuarios = VariablesC.usuarios, usuariosIn = VariablesC.usuariosIn } = variables
    let variablesAux = variables
    salas[data.sala].salaInfo.playTime[salas[data.sala].salaInfo.turno] = 30
    console.log(data, double, pasar, jaloPozo, autoPlay)
    let oldTablero = false
    let oldPozo = []
    let restantes = []
    let fichas = []
    let jugadores = []
    let oldTurno = -1
    let posibles = { a: 0, b: 0 }
    console.log('siguiente entro');

    const revP = (sala, laData, elDoble) => {
        if (elDoble) {
            console.log('siguiente doble entro');
            juegos.map((key, i) => {
                if (key.id === salas[sala].id) {
                    console.log('siguiente doble entro sala');

                    if ((juegos[i].fichas[juegos[i].jugadores[juegos[i].turno].fichas[laData].pos].value.values[0]) !== (juegos[i].fichas[juegos[i].jugadores[juegos[i].turno].fichas[laData].pos].value.values[1])) {
                        juegos[i].restantes[(juegos[i].fichas[juegos[i].jugadores[juegos[i].turno].fichas[laData].pos].value.values[0])] = juegos[i].restantes[(juegos[i].fichas[juegos[i].jugadores[juegos[i].turno].fichas[laData].pos].value.values[0])] - 1
                        juegos[i].restantes[(juegos[i].fichas[juegos[i].jugadores[juegos[i].turno].fichas[laData].pos].value.values[1])] = juegos[i].restantes[(juegos[i].fichas[juegos[i].jugadores[juegos[i].turno].fichas[laData].pos].value.values[1])] - 1

                    } else {
                        juegos[i].restantes[(juegos[i].fichas[juegos[i].jugadores[juegos[i].turno].fichas[laData].pos].value.values[0])] = juegos[i].restantes[(juegos[i].fichas[juegos[i].jugadores[juegos[i].turno].fichas[laData].pos].value.values[0])] - 1

                    }
                }
            })
            return revisarposibles(variables, sala, laData, elDoble)
        } else {
            console.log('siguiente no doble check');

            let req = revisarposibles(variables, sala, laData, false, true)
            if (req.doubleSide && req.posible) {
                console.log('siguiente dobleside posible');

                let randomA = parseInt(Math.random() * 10)

                if (autoPlay) {
                    console.log('siguiente dobleside posible autpplay');

                    setTimeout(() => {
                        const suRandom = randomA
                        const laSala = sala
                        const laData = data
                        FsiguienteJugada(variables, { sala: laSala, ...laData }, socket, suRandom > 5 ? 'b' : 'a')
                    }, 1000);
                    return { posible: false, posibles: false, doubleSide: false, choose: false }

                } else {
                    console.log('siguiente dobleside posible no autoplay');

                    socket.emit('dominoServer', {
                        actionTodo: "doubleSide",
                        data: data
                    })
                    return { posible: true, posibles: true, doubleSide: true, choose: false }

                }
            } else {
                console.log('siguiente no doble ');

                return revisarposibles(variables, sala, laData, elDoble)
            }
        }

    }
    let posi = (pasar || jaloPozo) ? { posible: true, posibles: true, doubleSide: false, choose: false } : revP(data.sala, data.data, double)
    let escogio = data.data
    if ((posi.posible || pasar) && !posi.doubleSide) {

        juegos.map((key, i) => {
            if (i === 0) {
                oldTablero = []
            }
            let outSocket = socket
            autoPlay && usuariosIn.map((keyUiN, IiN) => {
                if (keyUiN.usuario === data.user) {
                    outSocket = keyUiN.socket
                }
            })
            let losposibles = { a: 0, b: 0 }
            let newAr = []
            if (key.id === salas[data.sala].id) {
                oldTurno = key.turno
                oldPozo = key.pozo
                fichas = key.fichas
                jugadores = key.jugadores
                posibles = key.posibles
                const lposibles = key.posibles
                oldTablero = key.tablero
                restantes = key.restantes
                let isDone = false;
                const cobrar = (task) => {
                    jugadores[oldTurno].saldo = jugadores[oldTurno].saldo - salas[data.sala].salaInfo.valores.pasar
                    salas[data.sala].salaInfo.balance.jugadores[oldTurno].deuda.push({
                        valor: salas[data.sala].salaInfo.valores.pasar,
                        para: salas[data.sala].salaInfo.ultimoPut
                    })
                    salas[data.sala].salaInfo.recaudo.push({
                        valor: salas[data.sala].salaInfo.valores.pasar,
                        task: task
                    })
                    salas[data.sala].salaInfo.balance.jugadores[salas[data.sala].salaInfo.ultimoPut].favor.push({
                        valor: salas[data.sala].salaInfo.valores.pasar,
                        deudor: oldTurno
                    })
                    salas[data.sala].salaInfo.balance.jugadores[oldTurno].historial.push({
                        valor: salas[data.sala].salaInfo.valores.pasar,
                        evento: task,
                        tipo: 'contra'
                    })
                    salas[data.sala].salaInfo.balance.jugadores[salas[data.sala].salaInfo.ultimoPut].historial.push({
                        valor: salas[data.sala].salaInfo.valores.pasar,
                        tipo: 'favor',
                        evento: task
                    })
                    salas[data.sala].jugadores[oldTurno].saldo = jugadores[oldTurno].saldo
                    let res = devolverAlgoUsuario(variables, (data.user || data.usuario), 'contable')
                    res.saldo = res.saldo - salas[data.sala].salaInfo.valores.pasar
                    modificarAlgo(variables, { valor: salas[data.sala].salaInfo.valores.pasar, usuario: (data.user || data.usuario), tipo: 'ingreso', socket: (autoPlay ? outSocket : socket) })
                    let dbReq = async () => {
                        let req = await DbMod({ coleccion: "usuarios", value: res }, 'contable', (data.user || data.usuario))
                        if (req) {
                            dbRes(variables, (autoPlay ? outSocket : socket), data)
                        }
                    }
                    dbReq()
                    /*    let resPromo = { valido: true, valor: salas[data.sala].salaInfo.valores.pasar }
   
                       if (resPromo.valido) {
                           let tuser = resUser(jugadores[oldTurno].usuario)
                           let resP = devolverAlgoUsuario(variables,(usuarios[tuser].usuario), 'contable')
   
                           resP.saldo = resP.saldo + parseInt(parseInt(parseInt(resPromo.valor * .85) / 100) * 100)
                           let dbReq = async () => {
                               let req = await DbMod({ coleccion: "usuarios", value: resP }, 'contable', (usuarios[tuser].usuario))
                               if (req) {
                                   dbRes(socket, data)
                               }
                           }
                           dbReq()
                       } */
                }
                (!pasar && !jaloPozo) ? key.jugadores.map((keyJ, iJ) => {
                    let newARRRR = []
                    let posiAux = { a: 0, b: 0 }
                    if (!isDone && (keyJ.usuario === data.user || keyJ.usuario === data.usuario)) {
                        jugadores[oldTurno] && jugadores[oldTurno].fichas && fichas[jugadores[oldTurno].fichas[data.data]] && fichas[jugadores[oldTurno].fichas[data.data]] && fichas[jugadores[oldTurno].fichas[data.data].pos] && salas[data.sala].salaInfo.balance.jugadores[oldTurno].historial.push({
                            ficha: fichas[jugadores[oldTurno].fichas[data.data].pos].value,
                            tipo: 'jugar ficha'
                        })
                        posiAux = lposibles
                        if (double && jugadores[oldTurno] && jugadores[oldTurno].fichas && fichas[jugadores[oldTurno].fichas[data.data]] && fichas[jugadores[oldTurno].fichas[data.data]] && fichas[jugadores[oldTurno].fichas[data.data].pos]) {
                            posiAux = lposibles
                            const laficha = fichas[jugadores[oldTurno].fichas[data.data].pos].value.values
                            if (double === 'a') {
                                let elvalor = -1
                                if (laficha[0] === lposibles.a) {
                                    elvalor = laficha[1]
                                } else {
                                    if (laficha[1] === lposibles.a) {
                                        elvalor = laficha[0]
                                    }
                                }
                                posiAux.a = elvalor
                                posiAux.b = lposibles.b
                            }
                            if (double === 'b') {
                                let elvalor = -1
                                if (laficha[0] === lposibles.b) {
                                    elvalor = laficha[1]
                                } else {
                                    if (laficha[1] === lposibles.b) {
                                        elvalor = laficha[0]
                                    }
                                }
                                posiAux.b = elvalor
                                posiAux.a = lposibles.a

                            }
                            if (double === 'b') {
                                newARRRR = oldTablero
                                newARRRR.push({ ...juegos[i].jugadores[iJ].fichas[data.data], id: newARRRR.length, oriented: { ...posi.choose } })
                            }
                            if (double === 'a') {
                                newARRRR.push({
                                    ...juegos[i].jugadores[iJ].fichas[data.data], id: oldTablero.length, oriented: {
                                        ...posi.choose,
                                        req: posi.choose.req === 0 ? 1 : 0
                                    }
                                })
                                key.tablero.map((keyOt, iOt) => {
                                    newARRRR.push(keyOt)
                                })
                            }
                        } else {
                            if (posi.choose.side === 'b' && !double) {
                                newARRRR = oldTablero
                                newARRRR.push({ ...juegos[i].jugadores[iJ].fichas[data.data], id: newARRRR.length, oriented: { ...posi.choose } })
                            }
                            if (posi.choose.side === 'a' && !double) {
                                newARRRR.push({ ...juegos[i].jugadores[iJ].fichas[data.data], id: oldTablero.length, oriented: { ...posi.choose } })
                                key.tablero.map((keyOt, iOt) => {
                                    newARRRR.push(keyOt)
                                })
                            }
                            if (!double) {
                                posiAux = posi.posibles

                            }

                        }
                        losposibles = posiAux
                        juegos[i].jugadores[iJ].fichas.splice(data.data, 1)
                        let newFichas = []
                        juegos[i].jugadores[iJ].fichas.map((ketTuF, iTuF) => {
                            newFichas.push(ketTuF.value)
                        });
                        autoPlay && outSocket.emit('dominoServer', {
                            actionTodo: "playerFichas",
                            sala: data.sala,
                            tusFichas: newFichas
                        })
                        !autoPlay && socket.emit('dominoServer', {
                            actionTodo: "playerFichas",
                            sala: data.sala,
                            tusFichas: newFichas
                        })
                        isDone = true
                        newAr = newARRRR
                    }
                    salas[data.sala].salaInfo.ultimoPut = oldTurno
                }) : cobrar(pasar ? 'pasar' : 'jalar')

                if (!pasar && !jaloPozo) {
                    posibles = losposibles
                    oldTablero = newAr

                }
                if (juegos[i].jugadores.length > 0) {
                    juegos[i].jugadores.map((keyW, iW) => {
                        if (keyW.fichas.length > 0) {

                        } else {
                            gameOver(variables, keyW, i, iW, data, socket)

                        }
                    })

                }
                if (!jaloPozo) {
                    if (oldTurno < key.jugadores.length - 1) {
                        oldTurno++
                    } else {
                        oldTurno = 0
                    }

                    let jTablero = juegos[i].jugadoresTablero
                    !pasar && juegos[i].jugadoresTablero.map((ketT, iT) => {
                        if (ketT.nombre === data.user) {
                            jTablero[iT].fichas = jTablero[iT].fichas - 1

                        }
                    })
                    juegos[i].jugadoresTablero = jTablero
                    salas[data.sala].salaInfo.turno = oldTurno
                    juegos[i].turno = oldTurno;
                    autoPlay && outSocket.broadcast.emit('dominoServer', {
                        actionTodo: "jugadoresTablero",
                        jugadoresTablero: jTablero
                    });
                    socket.broadcast.emit('dominoServer', {
                        actionTodo: "jugadoresTablero",
                        jugadoresTablero: jTablero
                    });
                    autoPlay && outSocket.emit('dominoServer', {
                        actionTodo: "jugadoresTablero",
                        jugadoresTablero: jTablero
                    });
                    socket.emit('dominoServer', {
                        actionTodo: "jugadoresTablero",
                        jugadoresTablero: jTablero
                    });
                    double && socket.emit('dominoServer', {
                        actionTodo: "doubleSelected"
                    })
                    double && autoPlay && outSocket.emit('dominoServer', {
                        actionTodo: "doubleSelected"
                    })
                    juegos[i].posibles = pasar ? juegos[i].posibles : losposibles
                    juegos[i].tablero = pasar ? juegos[i].tablero : newAr
                    socket.broadcast.emit('dominoServer', {
                        actionTodo: "tableroNew",
                        pozo: oldPozo,
                        res: oldTablero,
                        posibles: juegos[i].posibles
                    });
                    socket.emit('dominoServer', {
                        actionTodo: "tableroNew",
                        pozo: oldPozo,
                        res: oldTablero,
                        posibles: juegos[i].posibles
                    })
                    autoPlay && outSocket.emit('dominoServer', {
                        actionTodo: "tableroNew",
                        pozo: oldPozo,
                        res: oldTablero,
                        posibles: juegos[i].posibles
                    })
                }
                if (!pasar && !jaloPozo) {
                    /*                     restantes[fichas[jugadores[oldTurno].fichas[escogio].pos].value.values[0]] = restantes[fichas[jugadores[oldTurno].fichas[escogio].pos].value.values[0]] - 1
                                        restantes[fichas[jugadores[oldTurno].fichas[escogio].pos].value.values[1]] = restantes[fichas[jugadores[oldTurno].fichas[escogio].pos].value.values[1]] - 1
                                        juegos[i].restantes = restantes */

                }
                socket.broadcast.emit('dominoServer', {
                    actionTodo: "newSala",
                    salas: salas
                })
                socket.emit('dominoServer', {
                    actionTodo: "newSala",
                    salas: salas
                })
                autoPlay && outSocket.emit('dominoServer', {
                    actionTodo: "newSala",
                    salas: salas
                })
            }


        })



    }
    let newR = [7, 7, 7, 7, 7, 7, 7]
    juegos.map((key, i) => {
        if (key.id === salas[data.sala].id) {
            key.tablero.map((keyT, iT) => {
                let valA = parseInt(keyT.value.split(':')[0])
                let valB = parseInt(keyT.value.split(':')[1])
                if (valA !== valB) {
                    newR[valA] = newR[valA] - 1
                }
                newR[valB] = newR[valB] - 1
            })
            if (key.posibles) {
                let posiA = key.posibles.a
                let posiB = key.posibles.b
                let posiABollean = false
                let posiBBollean = false
                if (newR[posiA] > 0) {
                    posiABollean = true
                }
                if (newR[posiB] > 0) {
                    posiBBollean = true
                }
                if (!posiABollean && !posiBBollean) {
                    key.jugadores.map((keyJ, iJ) => {

                        iJ === 0 && gameOver(variables, keyJ, i, iJ, data, socket, true)
                    })

                }
                console.log(key.posibles, 'posi');

            }
        }
    })
    console.log(oldTablero, 'oldTablero');

    return oldTablero


}
module.exports = FsiguienteJugada