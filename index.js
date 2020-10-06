const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tdo9r.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(bodyParser.json());
app.use(cors());
const port = 3001

app.get('/', (req, res) => {
  res.send('Hello Volunteer Network World!')
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const networkCollection = client.db(process.env.DB_NAME).collection("networks");
    // perform actions on the collection object
    
    // Insert data into networks collection of volunteerStore DB of MongoDB
    app.post('/addNetwork', (req, res) => {
        const network = req.body;
        // console.log(network);
        // networkCollection.insertMany(network)
        networkCollection.insertOne(network)//It's from admin panel
        .then(result => {
            res.send(result);
        })
    });
    
    // Dynamically upload all data object into server after reading data from MongoDB
    app.get('/network', (req, res) => {
        networkCollection.find({})
        .toArray( (err, documents) => {
            res.send(documents);
        })
    })
    
    // Dynamically upload a data object by (Email) into server after reading data from MongoDB
    app.get('/network/:id', (req, res) =>{
        const id = req.params.id;
        // console.log(req.params.id);
        networkCollection.findOne({_id: ObjectId(id)})
        .then(document => {
            res.send(document);
        })
    })

    const userCollection = client.db(process.env.DB_NAME).collection("users");
    //Insert a particular user to MongoDB
    app.post('/addUser', (req, res) => {
        const user = req.body;
        userCollection.insertOne(user)
        .then(result => {
            // console.log(result);
            if(result.insertedCount > 0){
                res.send(result.ops[0]);
            }
        })
    });

    // Find user By queryEmail from MongoDB
    app.get('/tasks', (req, res) =>{
        const queryEmail = req.query.email;
        // userCollection.find({})
        userCollection.find({email: queryEmail})
        .toArray( (err, documents) => {
            res.send(documents);//Back End er server e save kore...
        })
    })

    // Find all user for volunteer list
    app.get('/events', (req, res) => {
        userCollection.find({})
        .toArray( (err, documents) => {
            res.send(documents);
        })
    })

    // Delete a user from MongoDB by id using (params)...
    app.get('/delete/:id', (req, res) =>{
        const id = req.params.id;
        userCollection.deleteOne({_id: ObjectId(id)})
        .then(document => {
            // console.log(document);
            res.send(document);
        })
    })
    // There is no update works for MongoDB...

});
app.listen(process.env.PORT || port)