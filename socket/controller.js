const DbPut = require("../db/dbput.js");
const DbMod = require("../db/dbMod.js");
const Variables = require("../models/variables");
const Fencrypt_data = require("../funciones/Fencrypt_data.js");
const FreqUser = require("../funciones/FreqUser.js");
const FdbRes = require("../funciones/FdbRes.js");
const FresInSala = require("../funciones/FresInSala.js");
const FrevisarEmail = require("../funciones/FrevisarEmail.js");
const FrevisarUser = require("../funciones/FrevisarUser.js");
const FjalaPozo = require("../funciones/jalarPozo.js");
const FgameOver = require("../funciones/gameOver.js");
const FsiguienteJugada = require("../funciones/siguienteJugada.js");
const FmodificarAlgo = require("../funciones/modificarAlgo.js");
const FValidarPromo = require("../funciones/validarPromo.js");
const FseleccionAuto = require("../funciones/seleccionAuto.js");
const FempezarJuego = require("../funciones/empezarJuego.js");
const FdevolverLgoUsuario = require("../funciones/devolverAlgoUsuario.js");
const FresUser = require("../funciones/resUser.js");
const SalaDef = require("../models/modeloSala.js");
const UserFull = require("../models/modeloUsuarioFull.js");
const FactividadReq = require("../funciones/FactividadReq.js");
const FgetArandom = require("../funciones/FgetArandom.js");

const getArandom = FgetArandom;
const encrypt_data = Fencrypt_data,
  reqUser = FreqUser,
  dbRes = FdbRes,
  resInSala = FresInSala,
  revisarEmail = FrevisarEmail,
  revisarUser = FrevisarUser,
  jalaPozo = FjalaPozo,
  gameOver = FgameOver,
  siguienteJugada = FsiguienteJugada,
  modificarAlgo = FmodificarAlgo,
  ValidarPromo = FValidarPromo,
  seleccionAuto = FseleccionAuto,
  empezarJuego = FempezarJuego,
  devolverLgoUsuario = FdevolverLgoUsuario,
  resUser = FresUser;
const salaDef = SalaDef();

const SocketController = (socket, variables, data) => {
  const VariablesC = Variables();
  let {
    salas = VariablesC.salas,
    PromosArray = VariablesC.PromosArray,
    done = VariablesC.done,
    conection = VariablesC.conection,
    listenSocket = VariablesC.listenSocket,
    init = VariablesC.init,
    conectionCount = VariablesC.conectionCount,
    juegos = VariablesC.juegos,
    empresa = VariablesC.empresa,
    newHistorial = VariablesC.newHistorial,
    log = VariablesC.log,
    ecpData = VariablesC.ecpData,
    chat = VariablesC.chat,
    users = VariablesC.users,
    usuarios = VariablesC.usuarios,
    usuariosIn = VariablesC.usuariosIn,
  } = variables;
  let variablesAux = variables;
  const actionTodo = data.actionTodo ? data.actionTodo : "sin action";
  const user = data.user ? data.user : "sin usuario";
  const usuario =
    data.data && data.data.usuario ? data.data.usuario : "sin usuario";
  const mario = data.mario || "sindato";
  const testing = true;
  if (actionTodo === "registro") {
    let isCorrecto = false;
    let user = {};
    let loginData = { usuario: false, password: false };
    users.map((key, i) => {
      if (
        key.usuario === data.data.usuario ||
        key.email === data.data.usuario
      ) {
        loginData.usuario = true;
        if (
          !isCorrecto &&
          (key.usuario === data.data.usuario ||
            key.email === data.data.usuario) &&
          (data.cookie
            ? key.seguridad.token === data.token
            : key.password === data.data.password)
        ) {
          isCorrecto = true;
          user = key;
        }
      }
    });
    if (isCorrecto) {
      let isLog = resUser(variables, data.data.usuario);
      if (isLog === -1) {
        usuarios.push({
          inSala: { state: false, sala: -1, playing: false },
          usuario: user.usuario,
          email: user.email,
          conectionId: conectionCount,
          saldo: devolverLgoUsuario(variables, data.data.usuario, "contable")
            .saldo,
        });
        let sek = devolverLgoUsuario(variables, data.data.usuario, "seguridad");
        let token = sek.token;
        let resM = encrypt_data({
          ...data.data,
          token: token,
          conectionId: conectionCount,
        });
        usuariosIn.push({
          ...data.data,
          socket: socket,
          conectionId: conectionCount,
        });
        socket.emit("dominoServer", {
          actionTodo: "usuarios",
          usuarios: usuarios,
          salas: salas,
          chat: chat,
          conectionId: conectionCount,
        });
        socket.emit("dominoServer", {
          actionTodo: "miUsuario",
          usuario: user,
        });
        socket.emit("dominoServer", {
          actionTodo: "correctLogin",
          empresa: empresa,
          usuarios: usuarios,
          salas: salas,
          chat: chat,
          conectionId: conectionCount,
          user: {
            inSala: { state: false, sala: -1, playing: false },
            usuario: user.usuario,
            password: user.password,
            email: user.email,
            conectionId: conectionCount,
            saldo: devolverLgoUsuario(variables, user.usuario, "contable")
              .saldo,
          },
          token: resM,
        });
        socket.broadcast.emit("dominoServer", {
          actionTodo: "usuarios",
          usuarios: usuarios,
          salas: salas,
          chat: chat,
        });
        juegos.map((key, i) => {
          key.jugadores.map((keyJ, iJ) => {
            if (keyJ.usuario === user.usuario) {
              socket.emit("dominoServer", {
                actionTodo: "retomSala",
                juego: keyJ,
              });
            }
          });
        });
      } else {
        socket.emit("dominoServer", {
          actionTodo: "correctLoginDouble",
          usuarios: usuarios,
          salas: salas,
          chat: chat,
          conectionId: conectionCount,
          user: {
            inSala: { state: false, sala: -1, playing: false },
            usuario: user.usuario,
            email: user.email,
            conectionId: conectionCount,
            saldo: devolverLgoUsuario(variables, user.usuario, "contable")
              .saldo,
          },
        });
      }
    } else {
      socket.emit("dominoServer", {
        actionTodo: "inCorrectLogin",
        loginData: loginData,
      });
    }
  }
  if (actionTodo === "loginGoogle" && data.data.email) {
    console.log(data.data);
    let isCorrecto = false;
    let user = {};
    let loginData = { usuario: false, password: false };
    users.map((key, i) => {
      if (key.email === data.data.email) {
        loginData.usuario = true;
        isCorrecto = true;
        user = key;
      }
    });
    if (isCorrecto) {
      let isLog = resUser(variables, data.data.usuario);
      if (isLog === -1) {
        usuarios.push({
          inSala: { state: false, sala: -1, playing: false },
          usuario: user.usuario,
          email: user.email,
          conectionId: conectionCount,
          saldo: devolverLgoUsuario(variables, data.data.usuario, "contable")
            .saldo,
        });
        let sek = devolverLgoUsuario(variables, data.data.usuario, "seguridad");
        let token = sek.token;
        let resM = encrypt_data({
          ...data.data,
          token: token,
          conectionId: conectionCount,
        });
        usuariosIn.push({
          ...data.data,
          socket: socket,
          conectionId: conectionCount,
        });
        socket.emit("dominoServer", {
          actionTodo: "miUsuario",
          usuario: user,
        });
        socket.emit("dominoServer", {
          actionTodo: "usuarios",
          usuarios: usuarios,
          salas: salas,
          chat: chat,
          conectionId: conectionCount,
        });
        socket.emit("dominoServer", {
          actionTodo: "correctLogin",
          empresa: empresa,
          usuarios: usuarios,
          salas: salas,
          chat: chat,
          conectionId: conectionCount,
          user: {
            inSala: { state: false, sala: -1, playing: false },
            usuario: user.usuario || user.user,
            password: user.password,
            email: user.email,
            conectionId: conectionCount,
            saldo:
              devolverLgoUsuario(
                variables,
                user.usuario || user.user,
                "contable"
              ) &&
              devolverLgoUsuario(
                variables,
                user.usuario || user.user,
                "contable"
              ).saldo
                ? devolverLgoUsuario(
                    variables,
                    user.usuario || user.user,
                    "contable"
                  ).saldo
                : 0,
          },
          token: resM,
        });
        socket.broadcast.emit("dominoServer", {
          actionTodo: "usuarios",
          usuarios: usuarios,
          salas: salas,
          chat: chat,
        });
        juegos.map((key, i) => {
          key.jugadores.map((keyJ, iJ) => {
            if (keyJ.usuario === (user.usuario || user.user)) {
              socket.emit("dominoServer", {
                actionTodo: "retomSala",
                juego: keyJ,
              });
            }
          });
        });
      } else {
        socket.emit("dominoServer", {
          actionTodo: "correctLoginDouble",
          usuarios: usuarios,
          salas: salas,
          chat: chat,
          conectionId: conectionCount,
          user: {
            inSala: { state: false, sala: -1, playing: false },
            usuario: user.usuario || user.user,
            email: user.email,
            conectionId: conectionCount,
            saldo: devolverLgoUsuario(
              variables,
              user.usuario || user.user,
              "contable"
            ).saldo,
          },
        });
      }
    } else {
      const dbPutRes = async () => {
        let nuevoUsuario = UserFull();
        const actividadReq = FactividadReq;
        let act = [];
        act.push(actividadReq(data.data.nickname, true));
        let token = getArandom(1000000, 8000000);
        nuevoUsuario.actividad = act;
        nuevoUsuario.seguridad = {
          token: token,
          sesion: {
            state: true,
            conectionId: conectionCount,
            endTime: new Date().setTime(
              new Date().getTime() + 1000 * 60 * 60 * 24 * 15
            ),
          },
        };
        nuevoUsuario.usuario = data.data.nickname;
        nuevoUsuario.email = data.data.email;
        nuevoUsuario.info.avatar = {
          ...nuevoUsuario.info.avatar,
          state: data.data.picture && data.data.picture !== "" ? true : false,
          imagen:
            data.data.picture && data.data.picture !== ""
              ? data.data.picture
              : nuevoUsuario.info.avatar.imagen,
        };
        nuevoUsuario.info.userInfo.datosPersonales = {
          ...nuevoUsuario.info.userInfo.datosPersonales,
          apellido:
            data.data.family_name && data.data.family_name !== ""
              ? data.data.family_name
              : "",
          nombre:
            data.data.given_name && data.data.given_name !== ""
              ? data.data.given_name
              : "",
        };
        let resM = encrypt_data({
          usuario: nuevoUsuario.usuario,
          email: nuevoUsuario.email,
          token: token,
          conectionId: conectionCount,
        });
        let res = await DbPut({ coleccion: "usuarios", value: nuevoUsuario });
        if (res) {
          usuarios.push({
            ...nuevoUsuario,
            inSala: { state: false, sala: -1, playing: false },
            conectionId: conectionCount,
            saldo: 0,
          });
          usuariosIn.push({
            ...nuevoUsuario,
            socket: socket,
            conectionId: conectionCount,
          });
          socket.emit("dominoServer", {
            actionTodo: "miUsuario",
            usuario: user,
          });
          socket.emit("dominoServer", {
            actionTodo: "correctLogin",
            empresa: empresa,

            usuarios: usuarios,
            salas: salas,
            chat: chat,
            conectionId: conectionCount,
            user: {
              inSala: { state: false, sala: -1, playing: false },
              usuario: nuevoUsuario.usuario,
              email: nuevoUsuario.email,
              conectionId: conectionCount,
              saldo: devolverLgoUsuario(
                variables,
                nuevoUsuario.usuario,
                "contable"
              ).saldo,
            },
            token: resM,
          });
          dbRes();
        }
      };
      dbPutRes();
      console.log(data.data, "new user");
    }
  }

  if (actionTodo === "sendPing") {
    usuariosIn[data.pos].socket.emit("dominoServer", {
      actionTodo: "resPing",
    });
  }

  if (actionTodo === "logOut") {
    let userPos = resUser(variables, data.user);
    if (userPos !== -1) {
      usuariosIn.splice(userPos, 1);
      ((user.inSala && user.inSala.state && !user.inSala.playing) ||
        !user.inSala ||
        !user.inSala.state) &&
        usuarios.splice(userPos, 1);
      socket.broadcast.emit("dominoServer", {
        actionTodo: "usuarios",
        usuarios: usuarios,
        salas: salas,
        chat: chat,
      });
    }
  }
  if (actionTodo === "newLog") {
    const userPosi = resUser(variables, data.user);

    if (userPosi !== -1) {
      if (resUser(variables, data.user, false, false, true)) {
        usuariosIn[
          resUser(variables, data.user, false, false, true)
        ].socket.emit("dominoServer", {
          actionTodo: "cerrarLog",
        });
        usuariosIn[resUser(variables, data.user, false, false, true)].socket =
          socket;
        usuariosIn[
          resUser(variables, data.user, false, false, true)
        ].conectionId = conectionCount;
        usuarios[userPosi].conectionId = conectionCount;
      } else {
        let newUser = devolverLgoUsuario(variables, data.user, false, true);
        usuariosIn.push({
          ...newUser,
          ...usuarios[userPosi],
          socket: socket,
          conectionId: conectionCount,
        });
      }

      socket.emit("dominoServer", {
        actionTodo: "correctLogin",
        usuarios: usuarios,
        empresa: empresa,
        salas: salas,
        chat: chat,
        conectionId: conectionCount,
        user: {
          ...usuarios[userPosi],
          saldo: devolverLgoUsuario(
            variables,
            usuarios[userPosi].usuario,
            "contable"
          ).saldo,
        },
      });
      socket.broadcast.emit("dominoServer", {
        actionTodo: "usuarios",
        usuarios: usuarios,
        salas: salas,
        chat: chat,
      });
    }
  }
    if (actionTodo === "confirmPassword") {
      let resU={
        existe:false,
        password:false
      }
      variables.users.map((key,i)=>{
        if(key.usuario===data.data.user){
        resU.existe=true
         if(key.password===data.data.password){
        resU.password=true
        }  
        }
      })
    socket.emit("dominoServer", {
      actionTodo: "passwordRes",
      data:resU
    });
  }
  if (actionTodo === "oldLog") {
    socket.emit("dominoServer", {
      actionTodo: "unLog",
    });
  }
  if (actionTodo === "entraDomino") {
    let isCorrecto = false;
    let user = {};
    let loginData = { usuario: false, password: false };
    console.log(data);
    users.map((key, i) => {
      if (
        key.usuario === (data.usuario || (data.data.usuario || data.data.user || "sc")) ||
        key.email === (data.usuario || (data.data.usuario || data.data.user || "asc"))
      ) {
        loginData.usuario = true;
        isCorrecto = true;
        user = key;
      }
    });
    if (isCorrecto) {
      let isLog = resUser(variables, (data.usuario || data.data.usuario));
      if (isLog === -1) {
        socket.emit("dominoServer", {
          actionTodo: "usuarios",
          usuarios: usuarios,
          salas: salas,
          chat: chat,
          conectionId: conectionCount,
        });
        socket.emit("dominoServer", {
          actionTodo: "correctLogin",
          empresa: empresa,
          usuarios: usuarios,
          salas: salas,
          chat: chat,
          conectionId: conectionCount,
          user: {
            inSala: { state: false, sala: -1, playing: false },
            usuario: user.usuario || user.user,
            password: user.password,
            email: user.email,
            conectionId: conectionCount,
            saldo: devolverLgoUsuario(
              variables,
              user.usuario || user.user,
              "contable"
            ).saldo,
          },
          token: resM,
        });
        socket.broadcast.emit("dominoServer", {
          actionTodo: "usuarios",
          usuarios: usuarios,
          salas: salas,
          chat: chat,
        });
        juegos.map((key, i) => {
          key.jugadores.map((keyJ, iJ) => {
            if (keyJ.usuario === user.usuario) {
              socket.emit("dominoServer", {
                actionTodo: "retomSala",
                juego: keyJ,
              });
            }
          });
        });
      }
    }
  }
  if (actionTodo === "ingresoSaldo") {
    if (data.transactionId) {
      let res = devolverLgoUsuario(variables, data.usuario, "contable");
      res.saldo = res.saldo + data.valor;
      let dbReq = async () => {
        let req = await DbMod(
          { coleccion: "usuarios", value: res },
          "contable",
          data.usuario
        );
        if (req) {
          dbRes(variables, socket, data);
        }
      };
      dbReq();
    }
  }
  if (actionTodo === "entraSala") {
    let newSala = salas[parseInt(data.sala)];
    if (newSala) {
      let isIn = resInSala(variables, parseInt(data.sala), data.user);

      let userPos = resUser(variables, data.user);
      if (!isIn) {
        usuarios[userPos] = {
          ...usuarios[userPos],
          inSala: {
            state: true,
            sala: data.sala,
            playing: false,
          },
        };
        newSala.enSala.push({ usuario: data.user || "no user" });
        salas[parseInt(data.sala)] = newSala;
      } else {
        if (userPos !== -1) {
          usuarios[userPos] = {
            ...usuarios[userPos],
            inSala: {
              state: true,
              sala: data.sala,
              playing: false,
            },
          };
        }
      }
      socket.emit("dominoServer", {
        actionTodo: "correctLogin",
        empresa: empresa,
        usuarios: usuarios,
        salas: salas,
        juegos: juegos,
        chat: chat,
        conectionId: conectionCount,
        user: {
          ...usuarios[userPos],
          saldo: devolverLgoUsuario(
            variables,
            usuarios[userPos].usuario,
            "contable"
          ).saldo,
        },
      });
      socket.broadcast.emit("dominoServer", {
        actionTodo: "newSala",
        salas: salas,
      });
      socket.emit("dominoServer", {
        actionTodo: "newSala",
        salas: salas,
      });
      socket.emit("dominoServer", {
        actionTodo: "newSalaId",
        sala: data.sala,
        salaId: newSala.id,
      });
      juegos.map((keyJ, iJ) => {
        if (keyJ.id === parseInt(salas[data.sala])) {
          socket.emit("dominoServer", {
            actionTodo: "jugadoresTablero",
            jugadoresTablero: keyJ.jugadoresTablero,
          });

          socket.emit("dominoServer", {
            actionTodo: "tableroNew",
            pozo: keyJ,
            pozo,
            res: keyJ.tablero,
            posibles: keyJ.posibles,
          });
          keyJ.jugadores.map((keyJM, iJm) => {
            if (
              usuarios[userPos].usuario === keyJM.usuario ||
              usuarios[userPos].email === keyJM.usuario
            ) {
              let newFichas = [];
              keyJM.fichas.map((ketTuF, iTuF) => {
                newFichas.push(ketTuF.value);
              });
              keyUs.socket.emit("dominoServer", {
                actionTodo: "playerFichas",
                sala: parseInt(salas[data.sala]),
                tusFichas: tusFichas,
              });
            }
          });
        }
      });
    }
  }
  if (actionTodo === "inscripcion") {
    let newSalaI = salas[parseInt(data.sala)];
    if (newSalaI) {
      newSalaI.etapa = {
        etapa: "inscripcion",
        state: true,
      };
      salas[parseInt(data.sala)] = newSalaI;

      socket.broadcast.emit("dominoServer", {
        actionTodo: "newSala",
        salas: salas,
      });
      socket.emit("dominoServer", {
        actionTodo: "newSala",
        salas: salas,
      });
    }
  }
  if (actionTodo === "retomaMesa") {
    juegos.map((key, i) => {
      if (true) {
        key.jugadores.map((keyJ, iJ) => {
          if (keyJ.usuario === data.user) {
            let newFichas = [];
            keyJ.fichas.map((ketTuF, iTuF) => {
              newFichas.push(ketTuF.value);
            });
            socket.emit("dominoServer", {
              actionTodo: "retomSala",
              jugadoresTablero: key.jugadoresTablero,
              pozo: key.pozo,
              res: key.tablero,
              posibles: key.posibles,
              tusFichas: newFichas,
            });
          }
        });
      }
    });
  }
  if (actionTodo === "entraMesa") {
    if (salas[data.sala]) {
      let isInS = resInSala(variables, parseInt(data.sala), data.user, true);
      if (isInS) {
        let res = devolverLgoUsuario(variables, data.user, "contable");
        res.saldo = res.saldo - salas[data.sala].salaInfo.valores.entrada;
        modificarAlgo(variables, {
          valor: salas[data.sala].salaInfo.valores.entrada,
          usuario: data.user,
          tipo: "ingreso",
          socket: socket,
        });
        const userPosz = resUser(variables, data.user);
        usuarios[userPosz] = {
          ...usuarios[userPosz],
          inSala: {
            ...usuarios[userPosz].inSala,
            playing: true,
          },
          saldo: res.saldo,
        };
        let dbReq = async () => {
          let req = await DbMod(
            { coleccion: "usuarios", value: res },
            "contable",
            data.user
          );
          if (req) {
            dbRes(variables, socket, data);
          }
        };
        dbReq();
        salas[parseInt(data.sala)].jugadores.push({
          usuario: data.user,
          drag: [],
          saldo: res.saldo,
        });
        socket.emit("dominoServer", {
          actionTodo: "correctLogin",
          empresa: empresa,
          usuarios: usuarios,
          salas: salas,
          chat: chat,
          conectionId: conectionCount,
          user: {
            ...usuarios[userPosz],
            saldo: devolverLgoUsuario(variables, data.user, "contable").saldo,
          },
        });
      }
      if (
        salas[parseInt(data.sala)].cantidadDeJugadores ===
        salas[parseInt(data.sala)].jugadores.length
      ) {
        let newDrag = [];
        for (let ind = 0; ind < 28; ind++) {
          newDrag.push(ind + 1);
        }
        salas[parseInt(data.sala)].etapa.etapa = "escoger";
        salas[parseInt(data.sala)].drag = newDrag;
      }
      if (
        salas[parseInt(data.sala)].cantidadDeJugadores ===
          salas[parseInt(data.sala)].jugadores.length &&
        !salas[parseInt(data.sala)].salaInfo.reglas.seleccionarFichas
      ) {
        seleccionAuto(variables, data, socket);
      } else {
        socket.broadcast.emit("dominoServer", {
          actionTodo: "newSala",
          salas: salas,
        });
        socket.emit("dominoServer", {
          actionTodo: "newSala",
          salas: salas,
        });
      }
    }
  }
  if (actionTodo === "seleccionDrag") {
    let isPlayer = false;
    let allReady = false;
    let haveMore = true;
    let readyCount = 0;
    if (salas[parseInt(data.sala)]) {
      salas[parseInt(data.sala)].jugadores.map((key, i) => {
        if (key.usuario === data.user) {
          isPlayer = true;
          if (salas[parseInt(data.sala)].jugadores[i].drag.length < 7) {
            salas[parseInt(data.sala)].jugadores[i].drag.push(
              salas[parseInt(data.sala)].drag[data.choose]
            );
            allReady = false;
          } else {
            haveMore = false;
          }
        }
        if (salas[parseInt(data.sala)].jugadores[i].drag.length === 7) {
          readyCount++;
        }
      });
      if (readyCount === salas[parseInt(data.sala)].jugadores.length) {
        allReady = true;
      }
      if (isPlayer && haveMore) {
        salas[parseInt(data.sala)].drag.splice(parseInt(data.choose), 1);
        socket.broadcast.emit("dominoServer", {
          actionTodo: "newSala",
          salas: salas,
        });
        socket.emit("dominoServer", {
          actionTodo: "newSala",
          salas: salas,
        });
        socket.broadcast.emit("dominoServer", {
          actionTodo: "newDrag",
          drag: salas[parseInt(data.sala)].drag,
        });
        socket.emit("dominoServer", {
          actionTodo: "newDrag",
          drag: salas[parseInt(data.sala)].drag,
        });
      }
      if (isPlayer && allReady) {
        socket.emit("dominoServer", {
          actionTodo: "dragReady",
          salas: salas,
        });
        socket.broadcast.emit("dominoServer", {
          actionTodo: "dragReady",
          salas: salas,
        });
        salas[parseInt(data.sala)].etapa.etapa = "esperandoSalida";
        socket.emit("dominoServer", {
          actionTodo: "allready",
          salas: salas,
        });
        socket.broadcast.emit("dominoServer", {
          actionTodo: "allready",
          salas: salas,
        });
        socket.broadcast.emit("dominoServer", {
          actionTodo: "newSala",
          salas: salas,
        });
        socket.emit("dominoServer", {
          actionTodo: "newSala",
          salas: salas,
        });
        empezarJuego(variables, parseInt(data.sala), socket, 5);
      }
    }
  }
if(actionTodo==='cambiaMiData'){
    let resU = devolverLgoUsuario(variables, data.user, false,true);
resU[data.change]=data.value
 let dbReq = async () => {
        let req = await DbMod(
          { coleccion: "usuarios", value: resU[data.change] },
          data.change,
          data.user
        );
        if (req) {
          dbRes(variables, socket, data);
          socket.emit("dominoServer", {
          actionTodo: "miUsuario",
          usuario: devolverLgoUsuario(variables, data.user, "all",true)
        });
          socket.emit("dominoServer", {
          actionTodo: "miUsuarioTrue"
        });
        }
      };
      dbReq();
}
  
  if (actionTodo === "codigoPromocional") {
    let res = devolverLgoUsuario(variables, data.user, "contable");
    let resPromo = ValidarPromo(variables, data.code);

    if (resPromo.valido) {
      res.saldo = res.saldo + resPromo.valor;
      let dbReq = async () => {
        let req = await DbMod(
          { coleccion: "usuarios", value: res },
          "contable",
          data.user
        );
        if (req) {
          dbRes(variables, socket, data);
          socket.emit("dominoServer", {
          actionTodo: "miUsuario",
          usuario: devolverLgoUsuario(variables, data.user, "all",true)
        });
        }
      };
      dbReq();
    } else {
      socket.emit("dominoServer", {
        actionTodo: "invalidCode",
      });
    }
  }
  if (actionTodo === "gameOver") {
    /*             let newSala = salas[parseInt(data.sala)]
        
         */
    salas[data.sala] &&
      juegos.map((key, i) => {
        if (key.id === salas[data.sala].id) {
          key.jugadores.map((keyW, iW) => {
            gameOver(variables, keyW, i, iW, data, socket);
          });
        }
      });
  }

  if (actionTodo === "saleSala") {
    let newSala = salas[parseInt(data.sala)];
    if (salas[parseInt(data.sala)]) {
      let isIny = resInSala(variables, parseInt(data.sala), data.user, true);
      if (isIny) {
        const userPosy = resUser(variables, data.user);
        usuarios[userPosy] = usuarios[userPosy].inSala.playing
          ? usuarios[userPosy]
          : {
              ...usuarios[userPosy],
              inSala: {
                state: false,
                sala: -1,
                playing: false,
              },
            };
        salas[parseInt(data.sala)] = newSala;
        socket.emit("dominoServer", {
          actionTodo: "correctLogin",
          empresa: empresa,
          usuarios: usuarios,
          salas: salas,
          chat: chat,
          conectionId: conectionCount,
          user: {
            ...usuarios[userPosy],
            saldo: devolverLgoUsuario(variables, data.user, "contable").saldo,
          },
        });
      }
      socket.broadcast.emit("dominoServer", {
        actionTodo: "newSala",
        salas: salas,
      });
      socket.emit("dominoServer", {
        actionTodo: "newSala",
        salas: salas,
      });
    }
  }
  if (actionTodo === "sendSala") {
    const nEwSala = salaDef;
    let userPos = resUser(variables, data.user);
    let newSala = nEwSala;
    let res = devolverLgoUsuario(variables, data.user, "contable");
    res.saldo = res.saldo - data.data.salaInfo.valores.entrada;
    modificarAlgo(variables, {
      valor: data.data.salaInfo.valores.entrada,
      usuario: data.user,
      tipo: "ingreso",
      socket: socket,
    });
    let dbReq = async () => {
      let req = await DbMod(
        { coleccion: "usuarios", value: res },
        "contable",
        data.user
      );
      if (req) {
        dbRes(variables, socket, data);
      }
    };
    dbReq();
    let oldjug = [{ usuario: data.user, drag: [], saldo: res.saldo }];
    usuarios[userPos] = {
      ...usuarios[userPos],
      inSala: {
        state: true,
        sala: salas.length - 1,
        playing: true,
      },
      saldo: res.saldo,
    };
    newSala = {
      ...newSala,
      id: parseInt(Math.random() * 8888888 + 1000000),
      nombre: data.data.nombre,
      cantidadDeJugadores: data.data.cantidadDeJugadores,
      jugadores: oldjug,
      etapa: {
        etapa: "inscripcion",
        state: true,
      },
      salaInfo: {
        ...newSala.salaInfo,
        reglas: {
          ...data.data.salaInfo.reglas,
        },
        valores: {
          ...newSala.salaInfo.valores,
          ...data.data.salaInfo.valores,
        },
      },
      enSala: [{ nombre: data.user }],
      inSala: [{ nombre: data.user }],
      creado: data.user,
    };

    salas.push(newSala);
    socket.emit("dominoServer", {
      actionTodo: "correctLogin",
      empresa: empresa,
      usuarios: usuarios,
      salas: salas,
      chat: chat,
      conectionId: conectionCount,
      user: {
        ...usuarios[userPos],
        saldo: devolverLgoUsuario(variables, data.user, "contable").saldo,
      },
    });
    socket.broadcast.emit("dominoServer", {
      actionTodo: "newSala",
      salas: salas,
    });
    socket.emit("dominoServer", {
      actionTodo: "newSala",
      salas: salas,
    });
    socket.emit("dominoServer", {
      actionTodo: "newSalaCreated",
      res: salas.length - 1,
    });
  }

  if (actionTodo === "revisarEmail") {
    let res = revisarEmail(variables, data.email, true);
    if (res) {
      socket.emit("dominoServer", {
        actionTodo: "emailDisponible",
        res: {
          email: data.email,
          res: res,
        },
      });
    }
  }

  if (actionTodo === "siguiente") {
    let res = siguienteJugada(variables, data, socket);
    if (res) {
      enviado = false;
      /* setTimeout(() => {
                enviado = true
                enviarTiempo(data.sala, socket)
            }, 2000); */
      socket.emit("dominoServer", {
        actionTodo: "fichaRecibida",
      });
    }
  }
  if (actionTodo === "pasar") {
    let res = siguienteJugada(variables, data, socket, false, true);
    if (res) {
      enviado = false;
      /* setTimeout(() => {
                enviado = true
                enviarTiempo(data.sala, socket)
            }, 2000); */
      socket.emit("dominoServer", {
        actionTodo: "fichaRecibida",
      });
    }
  }
  if (actionTodo === "siguienteDoubleChoose") {
    let res = siguienteJugada(variables, data, socket, data.double);
    if (res) {
      enviado = false;
      /* setTimeout(() => {
                enviado = true
                enviarTiempo(data.sala, socket)
            }, 2000); */
      socket.emit("dominoServer", {
        actionTodo: "fichaRecibida",
      });
    }
  }
  if (actionTodo === "jalaPozo") {
    let res = jalaPozo(variables, data, socket);
    if (res) {
      let req = siguienteJugada(variables, data, socket, false, false, true);
      if (req) {
        enviado = false;
        setTimeout(() => {
          enviado = true;
          /*                         enviarTiempo(data.sala, socket)
           */
        }, 2000);
        socket.emit("dominoServer", {
          actionTodo: "fichaRecibida",
        });
      }
    }
  }
  if (actionTodo === "revisarUser") {
    let res = revisarUser(variables, data.user);
    if (res) {
      socket.emit("dominoServer", {
        actionTodo: "usuarioDisponible",
        res: {
          usuario: data.usuario,
          res: res,
        },
      });
    }
  }
  if (actionTodo === "sendRegister") {
    const dbPutRes = async () => {
      let newUser = reqUser(conectionCount, data, true);
      let token = newUser.seguridad.token;
      let resM = encrypt_data({
        ...data.data,
        token: token,
        conectionId: conectionCount,
      });
      let res = await DbPut({ coleccion: "usuarios", value: newUser });
      if (res) {
        usuarios.push({
          ...newUser,
          inSala: { state: false, sala: -1, playing: false },
          conectionId: conectionCount,
          saldo: 0,
        });
        usuariosIn.push({
          ...newUser,
          socket: socket,
          conectionId: conectionCount,
        });
        socket.emit("dominoServer", {
          actionTodo: "correctLogin",
          empresa: empresa,

          usuarios: usuarios,
          salas: salas,
          chat: chat,
          conectionId: conectionCount,
          user: {
            inSala: { state: false, sala: -1, playing: false },
            usuario: newUser.usuario,
            email: newUser.email,
            conectionId: conectionCount,
            saldo: devolverLgoUsuario(variables, newUser.usuario, "contable")
              .saldo,
          },
          token: resM,
        });
        dbRes();
      }
    };
    dbPutRes();
  }
  if (actionTodo === "sendChat") {
    variables.chat.push({
      time: new Date().toLocaleString(),
      msg: data.data.msg,
      usuario: data.data.usuario,
    });
    socket.emit("dominoServer", {
      actionTodo: "resChat",
      chat: chat,
    });
    socket.broadcast.emit("dominoServer", {
      actionTodo: "resChat",
      chat: chat,
    });
  }
  if (actionTodo === "misDatos") {
    socket.emit("dominoServer", {
      actionTodo: "tusDatos",
      data: devolverLgoUsuario(variables, data.user, false, true),
    });
  }
  if (actionTodo === "sendChatSala") {
    if (data.data && data.data.sala && salas[parseInt(data.data.sala)]) {
      let oldChat = salas[parseInt(data.data.sala)].salaInfo.chat;
      oldChat.push({
        time: new Date().toLocaleString(),
        msg: data.data.msg,
        usuario: data.data.usuario,
      });
      salas[parseInt(data.data.sala)].salaInfo.chat = oldChat;
      socket.emit("dominoServer", {
        actionTodo: "resSalaChat",
        chat: oldChat,
      });
      socket.broadcast.emit("dominoServer", {
        actionTodo: "resSalaChat",
        chat: oldChat,
      });
    }
  }
  if (actionTodo === "sendChatPriv") {
    chat.push({
      time: new Date().toLocaleString(),
      msg: data.data.msg,
      usuario: data.data.usuario,
    });
    socket.emit("dominoServer", {
      actionTodo: "resChat",
      chat: chat,
    });
    socket.broadcast.emit("dominoServer", {
      actionTodo: "resChat",
      chat: chat,
    });
  }
};
module.exports = SocketController;
