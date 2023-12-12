 const FValidarPromo = (variables,promo) => {

    const Variables = require('../models/variables.js');

    const VariablesC = Variables()
    let { salas = VariablesC.salas, PromosArray = VariablesC.PromosArray, done = VariablesC.done, conection = VariablesC.conection, listenSocket = VariablesC.listenSocket, init = VariablesC.init, conectionCount = VariablesC.conectionCount, juegos = VariablesC.juegos, empresa = VariablesC.empresa, newHistorial = VariablesC.newHistorial, log = VariablesC.log, ecpData = VariablesC.ecpData, chat = VariablesC.chat, users = VariablesC.users, usuarios = VariablesC.usuarios, usuariosIn = VariablesC.usuariosIn } = variables
    let variablesAux = variables
    let res = {
        valido: false,
        valor: 0
    }
    PromosArray.map((key, i) => {
        if (key.promo === promo) {
            res = {
                valido: true,
                valor: key.valor
            }
        }
    })
    return res

}
module.exports=FValidarPromo