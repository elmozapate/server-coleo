const FmezclarFichas = async (variables) => {

    const Variables = require('../models/variables.js');
    const VariablesC = Variables()
    let { salas = VariablesC.salas, PromosArray = VariablesC.PromosArray, done = VariablesC.done, conection = VariablesC.conection, listenSocket = VariablesC.listenSocket, init = VariablesC.init, conectionCount = VariablesC.conectionCount, juegos = VariablesC.juegos, empresa = VariablesC.empresa, newHistorial = VariablesC.newHistorial, log = VariablesC.log, ecpData = VariablesC.ecpData, chat = VariablesC.chat, users = VariablesC.users, usuarios = VariablesC.usuarios, usuariosIn = VariablesC.usuariosIn } = variables
    let variablesAux = variables
    let fichas = []
    let index = 1
    let fichasDraft = []
    let jugadores = []
    let numJugadores = 0
    let fichasReadyDraft = []
    let enJuego = false
    let start = true
    let salaInfo = {
        ultimoPut: 0,
        fichasPozo: 0,
        fichasTablero: 0,
        valores: {
            entrada: 1000,
            pasar: 1000,
            puntosRestantes: 500
        },
        historial: [],
        recaudo: [],
        balance: {
            jugadores: [{
                favor: [],
                deuda: [],
                historial: []
            },
            {
                favor: [],
                deuda: [],
                historial: []
            },
            {
                favor: [],
                deuda: [],
                historial: []
            },
            {
                favor: [],
                deuda: [],
                historial: []
            }]
        }
    }
    const doubles = [27,
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


    const mezclarLasFichas = async () => {
        fichas = []
        index = 1
        fichasDraft = []
        fichasReadyDraft = []
        founded = false
        turno = -1
        restantes = [7,
            7,
            7,
            7,
            7,
            7,
            7]
        tablero = []

        pozo = []
        pozof = []
        sale = {
            usuario: "",
            ficha: "",
            pos: -1
        }
        const getRandom = () => {
            let pos = parseInt(Math.random() * 30)
            if (fichasDraft[pos] && fichasDraft[pos].pos === false) {
                return pos
            } else {
                pos = getRandom()
            }
            return pos
        }
        let posibles = {
            a: 0,
            b: 0
        }
        for (let i = 0; i < 7; i++) {
            for (let b = i; b < 7; b++) {
                let value = ""
                value = {
                    string: `${i} : ${b}`,
                    values: [i, b]

                }
                let ficha = {
                    id: index,
                    value: value,
                    data: {
                        pos: 0,
                        sel: false,
                        player: 0,
                        play: false,
                        playPos: 0,
                        oriented: "a"
                    }
                }
                index++
                fichas.push(ficha)
            }
        }
        fichas.map((key, i) => {
            fichasDraft.push({
                id: i,
                pos: false,
                value: key.value.string,
                selected: false
            })
        })
        fichasDraft.map((key, i) => {
            let pos = getRandom()
            fichasReadyDraft.push(fichasDraft[pos])
            fichasDraft[pos].pos = pos
        })
        return { fichas: fichas, fichasDraft: fichasDraft, fichasReadyDraft: fichasReadyDraft }
    }
    let resF = async () => {
        let res = await mezclarLasFichas()

        return res
    }
    let res = resF()
    if (res) {
        return res
    }
}
module.exports=FmezclarFichas