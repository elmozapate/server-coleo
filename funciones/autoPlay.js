const FjalaPozo = require('./jalarPozo.js');
const FsiguienteJugada = require('./siguienteJugada.js');

const FautoPlay = (variables, sala, jugador, socket) => {

    const Variables = require('../models/variables.js');
    const siguienteJugada = FsiguienteJugada
    const jalaPozo = FjalaPozo
    const VariablesC = Variables()
    let { salas = VariablesC.salas, PromosArray = VariablesC.PromosArray, done = VariablesC.done, conection = VariablesC.conection, listenSocket = VariablesC.listenSocket, init = VariablesC.init, conectionCount = VariablesC.conectionCount, juegos = VariablesC.juegos, empresa = VariablesC.empresa, newHistorial = VariablesC.newHistorial, log = VariablesC.log, ecpData = VariablesC.ecpData, chat = VariablesC.chat, users = VariablesC.users, usuarios = VariablesC.usuarios, usuariosIn = VariablesC.usuariosIn } = variables
    let variablesAux = variables
    juegos.map((key, i) => {
        if (key.id === salas[sala].id) {
            key.jugadores.map((keyJ, iJ) => {
                if (keyJ.usuario === jugador.usuario) {
                    let isPosible = {
                        state: false,
                        value: -1
                    }
                    keyJ.fichas.map((keyF, iF) => {
                        if (!isPosible.state) {
                            let valA = parseInt(keyF.value.split(':')[0])
                            let valB = parseInt(keyF.value.split(':')[1])

                            if ((valA === key.posibles.a || valA === key.posibles.b) || (valB === key.posibles.a || valB === key.posibles.b)) {
                                isPosible = {
                                    state: true,
                                    value: iF
                                }
                            }

                        }

                    })
                    if (isPosible.state) {
                        siguienteJugada(variables, { sala: sala, ...jugador, ...keyJ, user: keyJ.usuario, data: isPosible.value }, socket, false, false, false, true)
                    } else {

                        if (key.pozo.length > 0) {
                            let res = jalaPozo(variables, { sala: sala, ...jugador, user: keyJ.usuario, }, socket)
                            res && siguienteJugada(variables, { sala: sala, ...jugador, user: keyJ.usuario, }, socket, false, false, true, true)
                        } else {
                            siguienteJugada(variables, { sala: sala, ...jugador, user: keyJ.usuario, }, socket, false, true, false, true)
                        }
                    }
                }
            })
        }
    })
    /*     
     */
}
module.exports = FautoPlay