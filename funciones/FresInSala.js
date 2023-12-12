 const FresInSala = (variables,sala, user, pos) => {

    const Basededatos = require('../db/basededatos.js');
    const DbMod = require('../db/dbMod.js');
    const Variables = require('../models/variables.js');

    const VariablesC = Variables()
    let { salas = VariablesC.salas, PromosArray = VariablesC.PromosArray, done = VariablesC.done, conection = VariablesC.conection, listenSocket = VariablesC.listenSocket, init = VariablesC.init, conectionCount = VariablesC.conectionCount, juegos = VariablesC.juegos, empresa = VariablesC.empresa, newHistorial = VariablesC.newHistorial, log = VariablesC.log, ecpData = VariablesC.ecpData, chat = VariablesC.chat, users = VariablesC.users, usuarios = VariablesC.usuarios, usuariosIn = VariablesC.usuariosIn } = variables
    let variablesAux = variables
    let res = false
    let isCorrecto = false
    salas[sala] && salas[sala].enSala.map((key, i) => {
        if (!isCorrecto && (key.usuario === user)) {
            isCorrecto = true
            res = pos ? i : true
        }
    })
    return res
}
module.exports=FresInSala