const FdbRes = require('./FdbRes.js');
const FdevolverLgoUsuario = require('./devolverAlgoUsuario.js');

const FliquidarSala = (variables, data, valor, socket) => {
    const dbRes = FdbRes
    const DbMod = require('../db/dbMod.js');
    const Variables = require('../models/variables.js');
const devolverLgoUsuario=FdevolverLgoUsuario
    const VariablesC = Variables()
    let { salas = VariablesC.salas, PromosArray = VariablesC.PromosArray, done = VariablesC.done, conection = VariablesC.conection, listenSocket = VariablesC.listenSocket, init = VariablesC.init, conectionCount = VariablesC.conectionCount, juegos = VariablesC.juegos, empresa = VariablesC.empresa, newHistorial = VariablesC.newHistorial, log = VariablesC.log, ecpData = VariablesC.ecpData, chat = VariablesC.chat, users = VariablesC.users, usuarios = VariablesC.usuarios, usuariosIn = VariablesC.usuariosIn } = variables
    let variablesAux = variables
    let res = devolverLgoUsuario(variables,data.usuario, 'contable')
    res.saldo = res.saldo + valor
    let dbReq = async () => {
        let req = await DbMod({ coleccion: "usuarios", value: res }, 'contable', data.usuario)
        if (req) {
            dbRes(variables, socket, data)
        }
    }
    dbReq()
}
module.exports = FliquidarSala