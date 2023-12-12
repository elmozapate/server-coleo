const FactividadReq = (user, actividad) => {

    let times = new Date().getTime()
    return {
        'fecha': times,
        'usuario': user,
        'actividad': actividad

    }
}
module.exports=FactividadReq