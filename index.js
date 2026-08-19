
const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors =require('cors')
const app = express();

const port = process.env.PORT || 3000;

// MiddleWare
app.use(cors());
app.use(express.json());
// ProductDBUser
// XVpurH9OBzQevvlL
// mongodb datababse 
const uri = "mongodb+srv://ProductDBUser:XVpurH9OBzQevvlL@cluster0.l05lfvs.mongodb.net/?appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() { 
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally {
        
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("smart server running");
})


app.listen(port, () => {
    console.log(`Example app listenning on Posr ${port}`)
})