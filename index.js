//import express
const express = require('express')
//mongodb import
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
//import cors
const cors = require('cors');
//dotenv config
require('dotenv').config();

// express call from app
const app = express();
const port = process.env.PORT || 7000;
//  

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i3fcr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('travel_booking');
        const tourOfferCollection = database.collection('tourOffers');
        //for user order
        const userOrderCollection = database.collection('orders');

        //Get API
        app.get('/tourOffers', async (req, res) => {
            const cursor = await tourOfferCollection.find({});
            const tourOffers = await cursor.toArray();
            res.send(tourOffers);
        });
        //Get Single Item load
        app.get('/tourOffers/:id', async (req, res) => {
            const id = req.params?.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const tourOffer = await tourOfferCollection.findOne(query);
            console.log(tourOffer);
            res.json(tourOffer);
        });


        // POST API
        app.post('/tourOffers', async (req, res) => {
            const tourOffer = await req.body;
            console.log('hit the post', tourOffer);
            const result = await tourOfferCollection.insertOne(tourOffer);
            console.log(result)
            res.json(result)
        });
        //GET 
        app.get('/orders', async (req, res) => {
            const cursor = userOrderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders)
        });

        // POST for user Order
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await userOrderCollection.insertOne(order)
            res.json(result)
        });

        // DELETE API
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userOrderCollection.deleteOne(query);
            console.log('deleting user order', result);
            res.json(result);
        });
        //UPDATE
        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await userOrderCollection.findOne(query);
            console.log('Load user id', id);
            res.send(user)
        })


        //GET API for order
        app.get('/orders', async (req, res) => {
            const result = await userOrderCollection.findOne({}).toArray();
            res.json(result);
            console.log(result);
        })
    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir);


//===================
app.get('/', (req, res) => {
    res.send('Travel explore server Running')
})

app.listen(port, () => {
    console.log('Running server port', port)
})