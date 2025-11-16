const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 4000;

//console.log(process.env);

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@project-1.zd08b5r.mongodb.net/?appName=project-1`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/', (req, res) => {
    res.send('home hero server is running')
})


async function run () {
    try{
        await client.connect();
        const db = client.db('homehero_db')
        const serviceCollection = db.collection('services');
        const bookingCollection = db.collection('booking')
        const usersCollection = db.collection('users')
      
        // users  
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const email = req.body.email;
            const query = { email: email }
            const existingUser = await usersCollection.findOne(query);

            if (existingUser) {
                res.send({ message: 'user already added. not need to insart again' })
            }
            else {
                const result = await usersCollection.insertOne(newUser);
                res.send(result);
            }
        })

        // all services get
        app.get('/services', async (req, res) => {
          
          console.log(req.query);
          const email = req.query.email;
          const query = {}
          if(email) {
            query.email = email;
          }

          const cursor = serviceCollection.find(query);
          const result = await cursor.toArray();
          res.send(result)
        })
        
           // home six service
        app.get('/services-home', async (req, res) => {
          
          console.log(req.query);
          const email = req.query.email;
          const query = {}
          if(email) {
            query.email = email;
          }

          const cursor = serviceCollection.find(query).limit(6);
          const result = await cursor.toArray();
          res.send(result)
        })

        // single service get
        app.get('/services/:id', async (req, res)=>{
          const id = req.params.id;
          const query = { _id: new ObjectId(id)}
          const result = await serviceCollection.findOne(query);
          res.send(result)
        })

        // update service 
        app.get("/services/:id", async (req, res) => {
        const id = req.params.id;
        const result = await serviceCollection.findOne({ _id: new ObjectId(id) });
        res.send(result);
        });

        app.put("/services/:id", async (req, res) => {
        const id = req.params.id;
        const body = req.body;

        const filter = { _id: new ObjectId(id) };
         const update = {
         $set: body,
         };

        const result = await serviceCollection.updateOne(filter, update);
         res.send(result);
          });



        // service add 
        app.post('/services', async(req,res) => {
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            res.send(result);
        })

        //update service
        app.patch('/services/:id' , async(req,res) => {
          const id = req.params.id;
          const updateService = req.body;
          const query = { _id: new ObjectId(id)}
          const update = {
            $set: updateService
          }
          const result = await serviceCollection.updateOne(query, update);
          res.send(result);
        })

        //delete service
        app.delete('/services/:id', async(req,res) => {
          const id = req.params.id;
          const query = { _id: new ObjectId(id)}
          const result = await serviceCollection.deleteOne(query);
          res.send(result);
        })
        

         // booking section
         app.post('/bookings', async (req, res) => {
         const booking = req.body;
         const result = await bookingCollection.insertOne(booking);
         res.send(result);
        });

        app.get('/bookings', async (req, res) => {
            const email = req.query.email;
           // const query = {};
            // if (email) {
            //     query.email = email;
            //     if(email !== req.token_email){
            //         return res.status(403).send({message: 'forbiden access'})
            //     }
            // }

            const cursor = bookingCollection.find({userEmail: email})
            const result = await cursor.toArray();
            res.send(result);
        })

        app.delete('/bookings/:id', async (req, res) => {
        const id = req.params.id;
        const result = await bookingCollection.deleteOne({ _id: new ObjectId(id) });
        res.send(result);
        });



        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally{
        
    }
}
run().catch(console.dir)


app.listen(port , () => {
    console.log(`home hero server is running on port : ${port}`);
    
})