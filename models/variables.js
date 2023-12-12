const EcpData = require("./modeloEcpData");
const Empresa = require("./modeloEmpresa");
const Promos = require("./modeloPromos");
const SalaDef = require("./modeloSala");
const Variables = () => {
  const SalaDE = SalaDef()
  const PromoD = Promos()
  const EmpresaD = Empresa()
  const EcpDF = EcpData()
  return ({
    salas: [SalaDE],
    PromosArray: PromoD,
    done: true,
    conection: true,
    listenSocket: false,
    init: true,
    conectionCount: 1,
    juegos: [],
    empresa: EmpresaD,
    newHistorial: [],
    log: (value) => {
      console.log(value);
    },
    ecpData: EcpDF,
    chat: [],
    users: [],
    usuarios: [],
    usuariosIn: []
  });
};
module.exports = Variables;
