const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    await client.connect();

    const db = client.db("wanderlust");
    const destinationCollection = db.collection("destination");

    const bookingsCollection = db.collection("bookings");

    app.get("/destination", async (req, res) => {
      const result = await destinationCollection.find().toArray();
      res.json(result);
    });

    app.get("/destination/:id", async (req, res) => {
      const { id } = req.params;
      const result = await destinationCollection.findOne({
        _id: new ObjectId(id),
      });
      res.json(result);
    });

    app.post("/destination", async (req, res) => {
      const destinationData = req.body;
      // console.log(destinationData);
      const result = await destinationCollection.insertOne(destinationData);

      res.json(result);
    });

    app.post("/bookings", async (req, res) => {
      const bookingData = req.body;
      const result = await bookingsCollection.insertOne(bookingData);

      res.json(result);
    });

    app.get("/bookings/:userId", async (req, res) => {
      const { userId } = req.params;

      const result = await bookingsCollection
        .find({ userId: userId })
        .toArray();

      res.json(result);
    });

    app.delete("/bookings/:bookingId", async (req, res) => {
      const { bookingId } = req.params;
      const result = await bookingsCollection.deleteOne({
        _id: new ObjectId(bookingId),
      });

      res.json(result);
    });

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

app.get("/", (req, res) => {
  res.send("Server is running fine!");
});

app.listen(PORT, () => {
  console.log(`Sever is running on ${PORT}`);
});
