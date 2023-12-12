const FdbRes = require('./FdbRes.js');

 const FmodificarAlgo = async (variables,data) => {

    const DbMod = require('../db/dbMod.js');
    const Variables = require('../models/variables.js');
const dbRes=FdbRes
    const VariablesC = Variables()
    let { salas = VariablesC.salas, PromosArray = VariablesC.PromosArray, done = VariablesC.done, conection = VariablesC.conection, listenSocket = VariablesC.listenSocket, init = VariablesC.init, conectionCount = VariablesC.conectionCount, juegos = VariablesC.juegos, empresa = VariablesC.empresa, newHistorial = VariablesC.newHistorial, log = VariablesC.log, ecpData = VariablesC.ecpData, chat = VariablesC.chat, users = VariablesC.users, usuarios = VariablesC.usuarios, usuariosIn = VariablesC.usuariosIn } = variables
    let variablesAux = variables
    let oldV = empresa.balance
    if (data.tipo === 'ingreso') {
        oldV.saldo = oldV.saldo + data.valor
        oldV.dias[oldV.dias.length - 1].ingresos.push({ usuario: data.usuario, valor: data.valor })

    } else {
        if (data.tipo === 'egreso') {
            oldV.saldo = empresa.balance.saldo - data.valor
            oldV.dias[empresa.balance.dias.length - 1].egresos.push({ usuario: data.usuario, valor: data.valor })

        }
    }
    oldV.dias[oldV.dias.length - 1].transacciones.push({ usuario: data.usuario, valor: data.valor, tipo: data.tipo })
    let res = await DbMod({ coleccion: "empresa", value: oldV, tipo: data.tipo }, 'bussines', data.usuario)
    if (res) {
        dbRes(variables,data.socket, { user: data.usuario, usuario: data.usuario })
    }
}
module.exports=FmodificarAlgo