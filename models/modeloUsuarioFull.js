const UserFull = () => {
  return {
    usuario: "",
    password: "",
    email: "",
    actividad: [],
    chats: [],
    info: {
      avatar: {
        state: false,
        imagen: "avatar.png",
      },
      userInfo: {
        datosPersonales: { nombre: "", apellido: "", genero: "", edad: "" },
        direccion: { direccion: "", ciudad: "", departamento: "", telefono: 0 },
        preferencias: { data: "" },
        redes: { facebook: "", x: "", instagram: "", discord: "" },
      },
    },
    contable: {
      saldo: 0,
      transacciones: {
        ingresos: 0,
        egresos: 0,
        recarga: 0,
        retiro: 0,
        historial: [],
      },
      metodosDePago: { metodos: [], predeterminado: "" },
      compras: [],
    },
    juego: {
      puntosNivel: 0,
      nivel: 0,
      logros: [],
      partidas: { jugadas: 0, ganadas: 0 },
    },
    seguridad: {
      token: 0,
      sesion: {
        state: true,
        conectionId: 0,
        endTime: new Date().setTime(
          new Date().getTime() + 1000 * 60 * 60 * 24 * 15
        ),
      },
    },
    social: { amigos: [], bloques: [], siguiendo: [], regalos: [] },
  };
};
module.exports=UserFull