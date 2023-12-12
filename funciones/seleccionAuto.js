const FempezarJuego = require('./empezarJuego.js');
const FrandomChoose = require('./randomChoose.js');

const FseleccionAuto = (variables, data, socket) => {

    const Variables = require('../models/variables.js');
    const empezarJuego = FempezarJuego
    const randomChoose = FrandomChoose
    const VariablesC = Variables()
    let { salas = VariablesC.salas, PromosArray = VariablesC.PromosArray, done = VariablesC.done, conection = VariablesC.conection, listenSocket = VariablesC.listenSocket, init = VariablesC.init, conectionCount = VariablesC.conectionCount, juegos = VariablesC.juegos, empresa = VariablesC.empresa, newHistorial = VariablesC.newHistorial, log = VariablesC.log, ecpData = VariablesC.ecpData, chat = VariablesC.chat, users = VariablesC.users, usuarios = VariablesC.usuarios, usuariosIn = VariablesC.usuariosIn } = variables
    let variablesAux = variables
    let allReady = false
    let selectedDrag = []
    salas[parseInt(data.sala)].etapa.etapa === 'jugando' && salas[parseInt(data.sala)].drag && salas[parseInt(data.sala)].jugadores.map((key, i) => {
        for (let index = 0; index < 7; index++) {
            const element = randomChoose(variables, selectedDrag, salas[parseInt(data.sala)].drag.length);
            selectedDrag.push(element)
            salas[parseInt(data.sala)].jugadores[i].drag.push(salas[parseInt(data.sala)].drag[element])
        }


    })
    allReady = true


    if (allReady) {
        socket.emit('dominoServer', {
            actionTodo: "dragReady",
            salas: salas
        })
        socket.broadcast.emit('dominoServer', {
            actionTodo: "dragReady",
            salas: salas
        })
        salas[parseInt(data.sala)].etapa.etapa = 'esperandoSalida'
        socket.emit('dominoServer', {
            actionTodo: "allready",
            salas: salas
        })
        socket.broadcast.emit('dominoServer', {
            actionTodo: "allready",
            salas: salas
        })
        socket.broadcast.emit('dominoServer', {
            actionTodo: "newSala",
            salas: salas
        })
        socket.emit('dominoServer', {
            actionTodo: "newSala",
            salas: salas
        })
        empezarJuego(variables, parseInt(data.sala), socket, 5)
    }
}
module.exports = FseleccionAuto