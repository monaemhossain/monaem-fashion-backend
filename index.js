const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xt3dv3d.mongodb.net/?retryWrites=true&w=majority`;

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
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const productsDatabase = client.db('productsDB').collection('products');
        const userDatabase = client.db('userDB').collection('users');
        const userCartDatabase = client.db('userCartDB').collection('cart');

        // Read products
        app.get('/products', async (req, res) => {
            const cursor = productsDatabase.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // write products api
        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            // console.log(newProduct);
            const result = await productsDatabase.insertOne(newProduct);
            res.send(result);
        })

        // get single product by id
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await productsDatabase.findOne(query);
            res.send(result);
        })

        // update product
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedProduct = req.body;
            // photo, productName, brandName, productType, productPrice, productDescription
            const product = {
                $set: {
                    photo: updatedProduct.photo,
                    productName: updatedProduct.productName,
                    brandName: updatedProduct.brandName,
                    productType: updatedProduct.productType,
                    productPrice: updatedProduct.productPrice,
                    productDescription: updatedProduct.productDescription,
                }
            }

            const result = await productsDatabase.updateOne(filter, product, options);
            res.send(result);
        })








        // read user api
        app.get('/users', async (req, res) => {
            const cursor = userDatabase.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // Write user
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            // console.log(newUser);
            const result = await userDatabase.insertOne(newUser);
            res.send(result);
        })







        // read user api
        app.get('/user-cart', async (req, res) => {
            const cursor = userCartDatabase.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        // get single user cart item by id
        app.get('/user-cart/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            console.log(query);
            const result = await userCartDatabase.findOne(query);

            res.send(result);
        })
        // Write user cart data
        app.post('/user-cart', async (req, res) => {
            const newItem = req.body;
            const result = await userCartDatabase.insertOne(newItem);
            res.send(result);
        })
        // delete cart item
        app.delete('/user-cart/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await userCartDatabase.deleteOne(query)
            res.send(result)
        })




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('server running')
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})
