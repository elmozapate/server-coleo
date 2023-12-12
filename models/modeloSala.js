const SalaDef = () => {
   return (
    { id: 0,
        nombre: 'amateur',
        cantidadDeJugadores: 2,
        jugadores: [],
        enSala: [],
        creado: "domino app",
        etapa: {
            etapa: "inicio",
            state: false
        },
        salaInfo: {
            reglas: {
                jalar: false,
                pasar: false,
                subastaPuesto: false,
                seleccionarFichas: false,
                fichasSobrantes: false
            },
            playTime: [30, 30, 30, 30],
            turno: -1,
            id: 0,
            drag: [],
            jugadores: [],
            ultimoPut: 0,
            fichasPozo: 0,
            fichasTablero: 0,
            valores: {
                entrada: 1000,
                pasar: 1000,
                puntosRestantes: 500
            },
            historial: [],
            primeraFicha: { a: 0, b: 0 },
            recaudo: [],
            balance: {
                jugadores: [{
                    favor: [],
                    deuda: [],
                    historial: []
                },
                {
                    favor: [],
                    deuda: [],
                    historial: []
                },
                {
                    favor: [],
                    deuda: [],
                    historial: []
                },
                {
                    favor: [],
                    deuda: [],
                    historial: []
                }]
            },
            chat: []
        },
        usuarios: []}
   )
}
module.exports=SalaDef