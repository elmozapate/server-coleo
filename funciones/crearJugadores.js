const FcrearJugadores = (variables,premiacionData) => {

    const Variables = require('../models/variables.js');

    const VariablesC = Variables()
    let { salas = VariablesC.salas, PromosArray = VariablesC.PromosArray, done = VariablesC.done, conection = VariablesC.conection, listenSocket = VariablesC.listenSocket, init = VariablesC.init, conectionCount = VariablesC.conectionCount, juegos = VariablesC.juegos, empresa = VariablesC.empresa, newHistorial = VariablesC.newHistorial, log = VariablesC.log, ecpData = VariablesC.ecpData, chat = VariablesC.chat, users = VariablesC.users, usuarios = VariablesC.usuarios, usuariosIn = VariablesC.usuariosIn } = variables
    let variablesAux = variables
    let newJugadores = []
    let aFavor = 0
    let enDeuda = 0
    let lasRecogidas = 0
    let lasRecogidasFav = 0
    let lasPasadasFav = 0
    let lasPasadas = 0
    for (let index = 0; index < premiacionData.jugadores.length; index++) {
        aFavor = 0
        enDeuda = 0
        lasRecogidas = 0
        lasRecogidasFav = 0
        lasPasadas = 0
        lasPasadasFav = 0
        premiacionData.balance[index].deuda.map((keyC, iC) => {
            enDeuda = enDeuda + keyC.valor

        })
        premiacionData.balance[index].favor.map((keyC, iC) => {
            aFavor = aFavor + keyC.valor
        })
        premiacionData.balance[index].historial.map((keyC, iC) => {
            if (keyC.evento && keyC.evento === 'jalar') {
                keyC.tipo === 'favor' ? lasRecogidasFav++ : lasRecogidas++
            }
            if (keyC.evento && keyC.evento === 'pasar') {
                keyC.tipo === 'favor' ? lasPasadasFav++ : lasPasadas++
            }
        })
        let favListo = ((aFavor * .90) / 100) * 100
        let conListo = ((enDeuda * .90) / 100) * 100
        let totListo = favListo - conListo
        let element = {
            usuario: premiacionData.jugadores[index].usuario || premiacionData.jugadores[index].user,
            favor: favListo,
            deuda: conListo,
            total: totListo,
            fichasRecogidas: lasRecogidas,
            fichasRecogidasFav: lasRecogidasFav,
            pasar: lasPasadas,
            pasarFav: lasPasadasFav,
            puesto: 0
        }
        newJugadores.push(element)
    }
    return newJugadores
}
module.exports = FcrearJugadores