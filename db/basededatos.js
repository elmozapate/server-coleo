const { MongoClient, ServerApiVersion } = require('mongodb');
const Basededatos = async (task) => {
let usuarios =[]
try {
        const uri = "mongodb+srv://moet:moetzapata@cluster0.o52gvk2.mongodb.net/?retryWrites=true&w=majority";
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
        await client.connect().then(() => console.log('conectado a mongodb dataReq'))
        let db = client.db('dominoDb')
        
        const usuariosF = async () => {
            let dbUserRes = db.collection(task)
            let result = dbUserRes.find({}).project({})
            let usuariosAux = await result.toArray()
            usuarios = usuariosAux

        }
        await usuariosF()        
                client.close().then(() => { console.log('desconectado de mongodb get')
                })
                      if(task){
                              return usuarios
                      }else{
                              return true 
                      }

   }catch(error){
       console.log(error,'mo conectado a mongodb dataReq')
       return true
   }
}
module.exports=Basededatos
