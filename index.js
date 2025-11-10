const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(cors());
app.use(express.json());

// name : homeherodb
//pass : s0HRApv48ShWUJub

const uri = "mongodb+srv://homeherodb:s0HRApv48ShWUJub@project-1.zd08b5r.mongodb.net/?appName=project-1";

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