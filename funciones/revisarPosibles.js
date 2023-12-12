 const Frevisarposibles = (variables,sala, escogio, double, check) => {
    const Variables = require('../models/variables.js');
    console.log(' revisar posible');

    const VariablesC = Variables()
    let { salas = VariablesC.salas, PromosArray = VariablesC.PromosArray, done = VariablesC.done, conection = VariablesC.conection, listenSocket = VariablesC.listenSocket, init = VariablesC.init, conectionCount = VariablesC.conectionCount, juegos = VariablesC.juegos, empresa = VariablesC.empresa, newHistorial = VariablesC.newHistorial, log = VariablesC.log, ecpData = VariablesC.ecpData, chat = VariablesC.chat, users = VariablesC.users, usuarios = VariablesC.usuarios, usuariosIn = VariablesC.usuariosIn } = variables
    let variablesAux = variables
    let fichas = []
    let jugadores = []
    let posibles = { a: 0, b: 0 }
    let oldPosibles = { a: 0, b: 0 }
    let turno = 0
    let restantes = []
    let tablero = []
    juegos.map((key, i) => {
        if (key.id === salas[sala].id) {
            console.log(' revisar encontro juego');

            fichas = key.fichas
            posibles = key.posibles
            oldPosibles = key.posibles
            turno = key.turno
            jugadores = key.jugadores
            restantes = key.restantes
            tablero = key.tablero
        }
    })
    if (double && !check) {
        console.log(' revisar posible  doble nocheck');

        let res = {
            posibles: oldPosibles,
            doubleSide: false,
            posible: true,
            choose: {
                req: double === "b" ? ((fichas[jugadores[turno].fichas[escogio].pos].value.values[0] === posibles[double] ? 0 : 1)) : (fichas[jugadores[turno].fichas[escogio].pos].value.values[0] === posibles[double] ? 1 : 0),
                side: double
            }
        }
        return res
    } else {
        console.log(' revisar posible no doble');

        if (!double && ((fichas[jugadores[turno].fichas[escogio].pos].value.values[0] === posibles.a) || (fichas[jugadores[turno].fichas[escogio].pos].value.values[0] === posibles.b) || (fichas[jugadores[turno].fichas[escogio].pos].value.values[1] === posibles.a) || (fichas[jugadores[turno].fichas[escogio].pos].value.values[1] === posibles.b))) {
            console.log(' revisar posible no doble');

            let res = {
                posibles: posibles,
                doubleSide: false,
                posible: false,
                choose: {
                    side: "sinChooose",
                    req: 0
                }
            }
            let puted = false
            if (!double && !check) {
                if (restantes[fichas[jugadores[turno].fichas[escogio].pos].value.values[0]] !== restantes[fichas[jugadores[turno].fichas[escogio].pos].value.values[1]]) {
                    restantes[fichas[jugadores[turno].fichas[escogio].pos].value.values[0]] = restantes[fichas[jugadores[turno].fichas[escogio].pos].value.values[0]] - 1
                    restantes[fichas[jugadores[turno].fichas[escogio].pos].value.values[1]] = restantes[fichas[jugadores[turno].fichas[escogio].pos].value.values[1]] - 1
                } else {
                    restantes[fichas[jugadores[turno].fichas[escogio].pos].value.values[0]] = restantes[fichas[jugadores[turno].fichas[escogio].pos].value.values[0]] - 1
                }
            }
            let doublePosibility = []
            if ((!puted && fichas[jugadores[turno].fichas[escogio].pos].value.values[0] === posibles.a)) {
                if (!check) {
                    res.choose.side = "a"
                    res.choose.req = 0
                }
                res.posible = true
                doublePosibility.push({
                    res: res,
                    side: "a",
                    ficha: fichas[jugadores[turno].fichas[escogio].pos],
                    value: 0
                })
            }
            if ((!puted && fichas[jugadores[turno].fichas[escogio].pos].value.values[0] === posibles.b)) {
                if (!check) {
                    res.choose.side = "b"
                    res.choose.req = 0
                    res.posible = true
                }
                res.posible = true
                doublePosibility.push({
                    res: res, side: "b",
                    ficha: fichas[jugadores[turno].fichas[escogio].pos],
                    value: 0
                })
            }
            if ((!puted && fichas[jugadores[turno].fichas[escogio].pos].value.values[1] === posibles.a)) {
                if (!check) {
                    res.choose.side = "a"
                    res.choose.req = 1
                    res.posible = true
                }
                res.posible = true
                doublePosibility.push({
                    res: res, side: "a",
                    ficha: fichas[jugadores[turno].fichas[escogio].pos],
                    value: 1
                })
            }
            if ((!puted && fichas[jugadores[turno].fichas[escogio].pos].value.values[1] === posibles.b)) {
                if (!check) {
                    res.choose.side = "b"
                    res.choose.req = 1
                    res.posible = true
                }
                res.posible = true
                doublePosibility.push({
                    res: res, side: "b",
                    ficha: fichas[jugadores[turno].fichas[escogio].pos],
                    value: 1
                })
            }
            let doubleReq = {
                a: false,
                b: false
            }
            doublePosibility.map((keyD, iD) => {
                doubleReq[`${keyD.side}`] = true
            })
            if (doubleReq.a && doubleReq.b && !double && tablero.length > 0) {
                res.doubleSide = true
            } else {
                if (!check) {
                    if (double) {
                        res.posibles[double] = fichas[jugadores[turno].fichas[escogio].pos].value.values[0] === posibles[double] ? fichas[jugadores[turno].fichas[escogio].pos].value.values[0] : fichas[jugadores[turno].fichas[escogio].pos].value.values[1]
                    } else {
                        res.posibles[res.choose.side] = res.choose.req === 1 ? fichas[jugadores[turno].fichas[escogio].pos].value.values[0] : fichas[jugadores[turno].fichas[escogio].pos].value.values[1]
                    }
                }
            }
            return res
        } else {
            return {
                posibles: false,
                posible: false,
                doubleSide: false,
                choose: false
            }
        }
    }

}
module.exports=Frevisarposibles