const FactividadReq = require('./FactividadReq.js');
const FgetArandom = require('./FgetArandom.js');

const FreqUser = (count, data, create) => {

    const getArandom = FgetArandom
    const actividadReq=FactividadReq
   
    let token = getArandom(1000000, 8000000)
    let act = []
    if (create) {
        act.push(actividadReq(data.data.usuario, true))
    }
    return {
        "usuario": data.data.usuario, "password": data.data.password, "email": data.data.email,
        "actividad": act,
        'chats': [],
        "info": {
            "avatar": {
                "state": false, "imagen": "avatar.png"
            },
            'userInfo': {
                'datosPersonales': { 'nombre': '', 'apellido': '', 'genero': '', 'edad': '', },
                'direccion': { 'direccion': '', 'ciudad': '', 'departamento': '', 'telefono': 0 },
                'preferencias': { 'data': '' },
                'redes': { 'facebook': '', 'x': '', 'instagram': '', 'discord': '' }
            },
        },
        "contable": {
            "saldo": 0,
            "transacciones": { 'ingresos': 0, 'egresos': 0, 'recarga': 0, 'retiro': 0, 'historial': [] },
            'metodosDePago': { 'metodos': [], 'predeterminado': '' },
            'compras': []
        },
        'juego': {
            'puntosNivel': 0, 'nivel': 0, 'logros': [], 'partidas': { 'jugadas': 0, 'ganadas': 0 }
        },
        'seguridad': { 'token': token, 'sesion': { 'state': true, 'conectionId': count, 'endTime': (new Date().setTime(((new Date().getTime()) + (1000 * 60 * 60 * 24 * 15)))) } },
        'social': { 'amigos': [], 'bloques': [], 'siguiendo': [], 'regalos': [] }
    }
}
module.exports = FreqUser