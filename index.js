const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config()
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000

const ObjectId = require('mongodb').ObjectID;


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5ryo5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {

        await client.connect();
        const database = client.db('dassland');

        const usersCollection = database.collection('users');

        const productsCollection = database.collection('products');
        const ordersCollection = database.collection('orders');
        const reviewCollection = database.collection('review');





        //get all products form databse
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        })



        //get single product collection
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.findOne(query);
            res.send(result);

        })

        // //for users post
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
            console.log(result);
        })


        // //for users put
        // app.put('/users', async (req, res) => {
        //     const user = req.body;

        //     const filter = { email: user.email };
        //     const option = { upsert: true };
        //     const updateDoc = { $set: user.data };
        //     const result = usersCollection.updateOne(filter, updateDoc, option);
        //     res.json(result);
        // })



        // //for appointments post
        // app.post('/appointments', async (req, res) => {
        //     const appointment = req.body;
        //     const result = await appointmentCollection.insertOne(appointment);

        //     res.json(result)
        // })

        // //for appointments get
        // app.get('/appointments', async (req, res) => {
        //     const email = req.query.email;
        //     const date = req.query.date;

        //     const query = { email: email, data: date }
        //     console.log(query)
        //     const cursor = appointmentCollection.find(query);
        //     const appointments = await cursor.toArray();
        //     res.json(appointments);
        // })




        // post order info to orders collection
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            console.log(result)
            res.json(result);
        })

        //get users orders from database
        app.get('/orders', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const cursor = ordersCollection.find(query);
            const orders = await cursor.toArray();
            res.json(orders);
        })
        // dleted user for my order review page btn 
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            console.log('deleted id', result);
            res.json(result);
        })

        // dleted user for my order review page btn 
        app.delete('/orders/:email', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            console.log('deleted id', result);
            res.json(result);
        })


        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            console.log('put', user)
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc)
            res.json(result);
        }
        )



        //post review data

        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            console.log(result)
            res.json(result);
        })


    } finally {
        //await client.close();
    }

}

run().catch(console.error);

app.get('/', (req, res) => {
    res.send('dassland watch store')
})

app.listen(port, () => {
    console.log(`listening port: ${port}`)
})