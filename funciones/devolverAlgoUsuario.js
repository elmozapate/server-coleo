const FdevolverLgoUsuario = (variablesA, user, task, all) => {

    const Variables = require('../models/variables.js');

    const VariablesC = Variables()
    let { salas = VariablesC.salas, PromosArray = VariablesC.PromosArray, done = VariablesC.done, conection = VariablesC.conection, listenSocket = VariablesC.listenSocket, init = VariablesC.init, conectionCount = VariablesC.conectionCount, juegos = VariablesC.juegos, empresa = VariablesC.empresa, newHistorial = VariablesC.newHistorial, log = VariablesC.log, ecpData = VariablesC.ecpData, chat = VariablesC.chat, users = VariablesC.users, usuarios = VariablesC.usuarios, usuariosIn = VariablesC.usuariosIn } = variablesA
    let variablesAux = variablesA
    variablesAux.users = users
    let res = false
    variablesA.users.map((key, i) => {
        if (((key.usuario || key.user) === user) || (key.email === user)) {
            res = all ? key : key[task]
        }
    })
    return res
}
module.exports = FdevolverLgoUsuario