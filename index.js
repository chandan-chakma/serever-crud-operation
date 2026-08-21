
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const express = require('express');
const cors =require('cors')
const app = express();
// console.log(process.env)/
const port = process.env.PORT || 3000;

// MiddleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.l05lfvs.mongodb.net/?appName=Cluster0`;
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
        const db = client.db('product_db');
        const productCollection = db.collection("products");
        const bidsCollection = db.collection('bids');
        const userCollection = db.collection('users');
        
        app.get('/users', async (req, res) => {
            
            // const email = req.query.email
            // const query = { email };
            const cursor = userCollection.find();
            const result = await cursor.toArray()
            res.send(result)

        })

        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const email = req.body.email;
            console.log(email)
            const query = { email }
            const existingUser = await userCollection.findOne(query)
            if (existingUser) {
                return res.send({
                    message: 'user already exist',
                    user:existingUser
                })
            }
            else {
                const result = await userCollection.insertOne(newUser);
                res.send(result);
            }
           
        })


        // products

        app.get('/latest-products', async (req, res) => {
            const cursor = productCollection.find().sort({created_at:-1,}).limit(6);
            const result = await cursor.toArray()
            res.send(result)
        })


        app.get('/products', async (req, res) => {
            // console.log(req.query)
            // const email = req.query.email;
            // const query = {};
            // if (email) {
            //     query.email=email
            // }
            // const emailfind = await productCollection.findOne(query)
            const cursor = productCollection.find().sort({price_min:-1});
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/products/:id', async(req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: id }
            console.log(query)
            const result = await productCollection.findOne(query)
            console.log(result)
            res.send(result)
        })



        app.post('/products', async(req, res) => {
            const newProduct = req.body;
            const result = await productCollection.insertOne(newProduct);
            res.send(result)
        })

        app.patch('/products/:id', async (req, res) => {
            const id = req.params.id;
            const upatedProduct = req.body
            const query = { _id: new ObjectId(id) }
            const updateDoc = {
                $set: upatedProduct
            }
            const result = await productCollection.updateOne(query, updateDoc);
            res.send(result)
            
        })



        app.delete('/products/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            
            const result = await productCollection.deleteOne(query);
            res.send(result)

        })

        // bids api
        app.post('/bids', async (req, res) => {
            const newBids = req.body;
            const result = await bidsCollection.insertOne(newBids);
            res.send(result);
        })


        app.get('/bids', async (req, res) => {
            const cursor = bidsCollection.find();
            const result = await cursor.toArray()
            res.send(result)
        })


        app.get('/bids', async (req, res) => {
            // console.log("heleo",req.query.email)
            const email = req.query.email
            // console.log('email',email)
            const query={}
            if (query.email) {
                query.buyer_email = email;
            }
            // const emailFind= await bidsCollection.find(query).toArray()
            const cursor = bidsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/products/bids/:productId', async(req, res)=> {
            const productId = req.params.productId;console.log(productId)
            const query = { product: productId }
            const cursor = bidsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })

        app.delete('/bids/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await bidsCollection.deleteOne(query);
            // console.log(qu)
            res.send(result)
        })


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