const FdevolverLgoUsuario = require('./devolverAlgoUsuario.js');
const FresUser = require('./resUser.js');

const FdbRes = async (variables, socket, data) => {

    const Basededatos = require('../db/basededatos.js');
    const Variables = require('../models/variables.js');
    const resUser = FresUser
    let variablesAux = variables
    const devolverLgoUsuario = FdevolverLgoUsuario
    let res = await Basededatos('usuarios')
    let resE = await Basededatos('empresa')
    if (res) {
        variablesAux.users = res
        variablesAux.empresa = resE[0]
        if (socket && data) {
            let userPos = resUser(variablesAux, data.user || data.usuario,false,false,false,true)
            socket.emit('dominoServer', {
                actionTodo: "correctLogin",
                empresa: variablesAux.empresa,
                usuarios: variablesAux.usuarios,
                salas: variablesAux.salas,
                juegos: variablesAux.juegos,
                chat: variablesAux.chat,
                conectionId: variablesAux.conectionCount,
                user: { ...variablesAux.users[userPos], saldo: devolverLgoUsuario(variablesAux, variablesAux.users[userPos].usuario, 'contable').saldo }
            })
        }
        return variablesAux
    }
}
module.exports = FdbRes
