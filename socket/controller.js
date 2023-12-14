const DbPut = require("../db/dbput.js");
const DbMod = require("../db/dbMod.js");
const Basededatos = require("../db/basededatos.js");

const SocketController = (socket, data,usuariosIn,actUsuarios) => {

    const actionTodo = data.actionTodo ? data.actionTodo : "sin action";
    const user = data.user ? data.user : "sin usuario";
    const usuario =        data.data && data.data.usuario ? data.data.usuario : "sin usuario";
    if (actionTodo === "ipSend") {
        let isOn=false
        let omPos=-1
        usuariosIn.map((key,i)=>{
            if(key.ip===data.ip){
                isOn=true
                omPos=i
            }
        })
        if(isOn){
            usuariosIn[onPos].socket=socket
        }else{
            usuariosIn.push({socket:socket,usuario:{},ip:data.ip})
        }
        actUsuarios(usuariosIn)
    }
    if (actionTodo === "test") {

        socket.emit("coleoServer", {
            actionTodo: "resChat",
        });
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
    if (actionTodo === "sendLogin") {
        let usuariosReq = async () => {
            let usuariosRes = await Basededatos()
            let isReg = false
            if (usuariosRes) {
                usuariosRes.map((key, i) => {
                    if (key.usuario === data.user.usuario) {
                        if (key.password === data.user.password) {
                            usuariosIn.map((keyIp,iIp)=>{
                                if(keyIp.socket.id ===socket.id){
                                    usuariosIn[iIp].usuario=key
                                    actUsuarios(usuariosIn)

                                }
                            })
                            key.admin ? socket.emit("coleoServer", {
                                actionTodo: "admin",
                                user: key,
                                users: usuariosRes
                            }) : socket.emit("coleoServer", {
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
    if (actionTodo === "sendRegister") {
        let randomC = parseInt(Math.random() * 89000 + 10000)
        let randomId = parseInt(Math.random() * 80000000 + 10000000)
        let nuevoUser = {
            ...data.user,
            validate: false,
            ip: 0,
            id: randomId,
            conectado: false,
            admin: false
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
                        if(keyIp.socket.id ===socket.id){
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
