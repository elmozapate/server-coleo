const FrandomChoose = (variables,drag, max) => {

    const Variables = require('../models/variables.js');
    const VariablesC = Variables()
    let { salas = VariablesC.salas, PromosArray = VariablesC.PromosArray, done = VariablesC.done, conection = VariablesC.conection, listenSocket = VariablesC.listenSocket, init = VariablesC.init, conectionCount = VariablesC.conectionCount, juegos = VariablesC.juegos, empresa = VariablesC.empresa, newHistorial = VariablesC.newHistorial, log = VariablesC.log, ecpData = VariablesC.ecpData, chat = VariablesC.chat, users = VariablesC.users, usuarios = VariablesC.usuarios, usuariosIn = VariablesC.usuariosIn } = variables
    let variablesAux = variables
    let randOmR = parseInt(Math.random() * max)
    let used = false
    drag.map((key, i) => {
        if (key === randOmR) {
            used = true
        }
    })
    if (used) {
        randOmR = FrandomChoose(variables.drag, max)
    }
    return randOmR
}
module.exports = FrandomChoose