const DbPut = require("../db/dbput.js");
const DbMod = require("../db/dbMod.js");
const DbModDos = require("../db/dbModDos.js");
const DbModQr = require("../db/dbModQr.js");

const Basededatos = require("../db/basededatos.js");

const SocketController = (socket, data,usuariosIn,actUsuarios) => {

    const actionTodo = data.actionTodo ? data.actionTodo : "sin action";
    const user = data.user ? data.user : "sin usuario";
    const usuario =        data.data && data.data.usuario ? data.data.usuario : "sin usuario";
     if (actionTodo === "freeTime") {
                     console.log('free entra')

        let isO=false
        let onP=-1
        usuariosIn.map((key,i)=>{
            if(key.socket&&key.socket.id&&key.socket.id===socket.id){
                isO=true
                onP=i
            }
        })
        if(isO){
            usuariosIn[onP].freeTime = usuariosIn[onP].freeTime - 5
             actUsuarios(usuariosIn)
            console.log('free', usuariosIn[onP].freeTime)
        }
    }
    if (actionTodo === "ipSend") {
        let isOn=false
        let onPos=-1
        let oldU=false
        usuariosIn.map((key,i)=>{
            if(key.ip&&key.ip===data.ip){
                isOn=true
                onPos=i
                oldU=key
            }
        })
        if(isOn){
            if(oldU){
                usuariosIn[onPos]={...oldU,socket:socket}
                console.log(usuariosIn[onPos])
                  socket.emit("coleoServer", {
                      actionTodo: "oldUser",
                      data:{...oldU,socket:false}
                  })
            }
        }else{
            let newObj={res:0,usuario:{},ip:0,freeTime:40}
            newObj.res=data.res
            newObj.ip=data.ip
            usuariosIn.push(newObj)
        }
         socket.emit("coleoServer", {
            actionTodo: "resIp",
            ip:data.ip
        });
        actUsuarios(usuariosIn)
    }
       if (actionTodo === "resSend") {
        
           let isOnr=false
           let onPosr=-1
           let iP=-1
        usuariosIn.map((key,i)=>{
            if(key.res===data.res){
                isOnr=true
                onPosr=i
                iP=key.ip
            }
        })
        if(isOnr){
            usuariosIn[onPosr].socket=socket
             socket.emit("coleoServer", {
            actionTodo: "resRes",
            ip:iP
        });
        actUsuarios(usuariosIn)
        }
        
    }
    if (actionTodo === "test") {

       
        socket.broadcast.emit("coleoServer", {
            actionTodo: "resChat",
        });
    }
    if (actionTodo === "comprobarUsuario") {


        const mandarUsu = async () => {
            const resMAndarU = await DbMod({ coleccion: 'usuarios', value: data.user })
            if (resMAndarU) {
                let usuariosReqR = async () => {
                    let usuariosResR = await Basededatos()
                    if (usuariosResR) {
                        socket.emit("coleoServer", {
                            actionTodo: "adminUpdate",
                            users: usuariosResR
                        })
                     }
                }
                usuariosReqR()

            }
        }
        mandarUsu()
    }
        if (actionTodo === "comprobarUsuario") {


        const mandarUsud = async () => {
            const resMAndarUd = await DbModDos({ coleccion: 'usuarios', value: data.user })
            if (resMAndarUd) {
                let usuariosReqRd = async () => {
                    let usuariosResRd = await Basededatos()
                    if (usuariosResRd) {
                        socket.emit("coleoServer", {
                            actionTodo: "adminUpdate",
                            users: usuariosResRd
                        })
                     }
                }
                usuariosReqRd()

            }
        }
        mandarUsud()
    }
    if (actionTodo === "sendLogin") {
        let usuariosReq = async () => {
            let usuariosRes = await Basededatos()
            let isReg = false
            let doublel=false
            if (usuariosRes) {
                usuariosRes.map((key, i) => {
                    if (key.usuario === data.user.usuario) {
                        if (key.password === data.user.password) {
                            usuariosIn.map((keyIp,iIp)=>{
                                if(keyIp.socket&&keyIp.socket.id&&keyIp.socket.id ===socket.id){
                                    usuariosIn.map((keyIps,iIps)=>{
                                        if(keyIps.usuario.usuario ===data.usuario&& keyIps.socket&&keyIps.socket.id&& keyIps.socket&& keyIps.socket.id !== socket.id){
                                            doublel= true
                                        }
                                    })
                                    usuariosIn[iIp].usuario= !doublel?key:usuariosIn[iIp].usuario;
                                    !doublel &&  actUsuarios(usuariosIn)
                                    doublel && socket.emit("coleoServer", {
                                        actionTodo: "correctLoginDouble",
                                        user: key
                                    });
                                }
                            })
                            key.admin ? socket.emit("coleoServer", {
                                actionTodo: "admin",
                                user: key,
                                users: usuariosRes
                            }) : !doublel && socket.emit("coleoServer", {
                                actionTodo: "correctLogin",
                                user: key
                            });
                        } else {
                            socket.emit("coleoServer", {
                                actionTodo: "inCorrectLoginData",
                            });
                        }
                        isReg = true
                    }
                })
                !isReg && socket.emit("coleoServer", {
                    actionTodo: "inCorrectLogin",
                });
            }
        }
        usuariosReq()
    }
     
    if (actionTodo === "sendQr") {
        let usuariosReqQr = async () => {
            let usuariosResQr = await Basededatos()
            if (usuariosResQr) {
                let isIN = false
                let laPos= -1
                let elUser={}
                usuariosResQr.map((key, i) => {
                    if (key.usuario === data.user.usuario) {
                        isIN = true
                        laPos=i
                        elUser=key
                    }
                })
                if(isIN){
                 const resMAndarQr = await DbModQr({ coleccion: 'usuarios', value: data.user })
                    if(resMAndarQr){
                         let usuariosResQrRes = await Basededatos()
                         if(usuariosResQrRes){
                             socket.emit('dominoServer',{
                                 actionTodo:'resQr'
                             })
                          socket.broadcast.emit('dominoServer',{
                                 actionTodo: "adminUpdate",
                                 users: usuariosResQrRes          
                             })
                         }
                    }
                }
            }
        }
        usuariosReqQr()
    }
    if (actionTodo === "sendRegister") {
        let randomC = parseInt(Math.random() * 89000 + 10000)
        let randomId = parseInt(Math.random() * 80000000 + 10000000)
        let nuevoUser = {
            ...data.user,
            validate: false,
            contactado: false,
            ip: 0,
            id: randomId,
            conectado: false,
            admin: false,
            dias:{
            jueves:false,
            viernes:false,
            sabado:false,
            domingo:false
            },
            conecciones:1,
            pago:false
        }
        let usuariosReqR = async () => {
            let usuariosResR = await Basededatos()
            if (usuariosResR) {
                let isIN = false
                usuariosResR.map((key, i) => {
                    if (key.usuario === data.user.usuario) {
                        isIN = true
                    }
                })
                if (isIN) {
                    const darRandom = (nombre) => {
                        let isINr = false
                        let randomN = parseInt(Math.random() * 89 + 10)
                        let randomNombre = `${nombre}${randomN}`
                        usuariosResR.map((key, i) => {
                            if (key.usuario === randomNombre) {
                                isINr = true
                            }
                        })
                        if (isINr) {
                            randomNombre = darRandom(nombre)
                        }
                        return randomNombre
                    }
                    let nuevoNombre = darRandom(data.user.usuario)
                    nuevoUser.usuario = nuevoNombre
                }
                let usuariosEnd = async () => {
                    await DbPut({ coleccion: 'usuarios', value: nuevoUser })
                    usuariosIn.map((keyIp,iIp)=>{
                        if(keyIp&&keyIp.socket&&keyIp.socket.id&&keyIp.socket.id ===socket.id){
                            usuariosIn[iIp].usuario=nuevoUser
                            actUsuarios(usuariosIn)
                        }
                    })
                    socket.emit("coleoServer", {
                        actionTodo: "correctRegister",
                        user: nuevoUser
                    })
                    socket.emit("coleoServer", {
                        actionTodo: "correctLogin",
                        user: nuevoUser
                    });
                }
                usuariosEnd()
            }
        }
        usuariosReqR()
    }
};
module.exports = SocketController;
