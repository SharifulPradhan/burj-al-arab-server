const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const admin = require("firebase-admin");
const serviceAccount = require("service-account-file.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

import uri from "./mongoDBURI"

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("burjAlArab").collection("bookings");
  app.post("/addBooking", (req, res) => {
    const newBooking = req.body;
    collection.insertOne(newBooking)
    .then(result =>{
      res.send(result.insertedCount > 0);
    })
  })

  app.get('/bookings', (req, res) => {
    console.log(req.headers.authorization);



    // collection.find({email: req.query.email})
    // .toArray((err, documents) => {
    //   res.send(documents)
    // })
  })
});







app.listen(4200, () => console.log('listening to port 4200'))