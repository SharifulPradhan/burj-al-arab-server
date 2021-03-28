const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const admin = require("firebase-admin");
const serviceAccount = require("./service-account-file.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

const uri = "mongodb+srv://arabian:burjAlArab7089@cluster0.zvgp5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("burjAlArab").collection("bookings");
  app.post("/addBooking", (req, res) => {
    const newBooking = req.body;
    collection.insertOne(newBooking)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })

  app.get('/bookings', (req, res) => {
    const bearer = req.headers.authorization
    if (bearer && bearer.startsWith('Bearer ')) {
      const idToken = bearer.split(' ')[1];
      console.log("bearer ID TOKEN:::", idToken);
      admin.auth().verifyIdToken(idToken)
        .then((decodedToken) => {
          const tokenEmail = decodedToken.email;
          const queryEmail = req.query.email;
          console.log(tokenEmail, queryEmail);
          if (tokenEmail == queryEmail) {
            collection.find({ email: req.query.email })
              .toArray((err, documents) => {
                res.status(200).send(documents)
              })
          }
          else{
            res.status(401).send("unathorised ACCESS")
          }
        })
        .catch((error) => {
          res.status(401).send("unathorised ACCESS")
        });

    }
    else{
      res.status(401).send("unathorised ACCESS")
    }
  })
});







app.listen(4200, () => console.log('listening to port 4200'))