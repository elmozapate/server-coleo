const { MongoClient, ServerApiVersion } = require('mongodb');
const DbModQr = async (data, extra, usuario) => {
    const listDatabases = async (client) => {
        let databasesList = await client.db().admin().listDatabases();
        let db = databasesList.databases
        let dbRes = []
        databasesList.databases.forEach(db => { dbRes.push(db); });
    }
    if (data && data.value && data.coleccion) {
        try {
            const uri = "mongodb+srv://moet:moetzapata@cluster0.o52gvk2.mongodb.net/?retryWrites=true&w=majority";
            const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
            await client.connect().then(() => console.log('conectado a mongodb dataPut'))
            let db = client.db('coleo')
            let dbUserRes = db.collection(data.coleccion)
            await dbUserRes.updateOne({ "usuario": data.value.usuario },
                    {
                        $set: { "qr": data.value.qr }
                    })
            await listDatabases(client)
            client.close().then(() => console.log('desconectado a mongodb dataPut'))
            return true
        } catch (error) {
            console.log(error, 'mo conectado a mongodb dataPut')
            return false
        }
    } else { return false }
}
module.exports = DbModQr
