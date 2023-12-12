const Empresa = () => {
   return (
    {
        id: Number(),
        balance: {
            saldo: 0,
            saldoBonos: 0,
            dias: [{
                dia: new Date(),
                ingresos: [],
                egresos: [],
                transacciones: [],
                bonos: []
            }]
        }
    }
   )
} 
module.exports=Empresa