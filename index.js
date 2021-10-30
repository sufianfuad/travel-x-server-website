//import express
const express = require('express')
//mongodb import
const { MongoClient } = require('mongodb');
//import cors
const cors = require('cors');
//dotenv config
require('dotenv').config();

// express call from app
const app = express();
const port = 7000;
// process.env.PORT || 

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

        //Get API
        app.get('/tourOffers', async (req, res) => {
            const cursor = await tourOfferCollection.find({});
            const tourOffers = await cursor.toArray();
            res.send(tourOffers);
        });

        // POST API
        app.post('/tourOffers', async (req, res) => {
            const tourOffer = await req.body;

            console.log('hit the post', tourOffer);

            const result = await tourOfferCollection.insertOne(tourOffer);

            console.log(result)
            res.json(result)
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