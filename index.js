const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;

const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rmwc9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const coffeeCollection = client.db("insertDB").collection("coffee");

    app.get("/Coffee", async (req, res) => {
      const coffee = coffeeCollection.find();
      const results = await coffee.toArray();
      res.send(results);
    });

    app.get("/Coffee/:id", async (req, res) => {
      const id = req.params.id;
      const match = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(match);
      res.send(result);
    });

    app.post("/AddNewCoffee", async (req, res) => {
      const newCoffee = req.body;
      const results = await coffeeCollection.insertOne(newCoffee);
      res.send(results);
    });

    app.put("/UpdateCoffee/:id", async (req, res) => {
      const id = req.params.id;
      const updateInfo = req.body;

      const find = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateCoffee = {
        $set: {
          name: updateInfo.name,
          Chef: updateInfo.Chef,
          Supplier: updateInfo.Supplier,
          Taste: updateInfo.Taste,
          Category: updateInfo.Category,
          Details: updateInfo.Details,
          Photo: updateInfo.Photo,
          Price: updateInfo.Price,
        },
      };
      const result = await coffeeCollection.updateOne(
        find,
        updateCoffee,
        options
      );
      res.send(result);
    });

    app.delete("/Coffee/:id", async (req, res) => {
      const id = req.params.id;
      const find = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(find);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`server running on port: ${port}`);
});
