const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://eduverseDBusers:ibMy0ZCdxr0oIC3s@simple-crud-server.hfigrlp.mongodb.net/?appName=simple-crud-server";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("eduverse server running");
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const db = client.db("eduverse_db");
    const coursesCollection = db.collection("courses");

    // courses related apis
    app.post("/courses", async (req, res) => {
      const newCourse = req.body;
      const result = await coursesCollection.insertOne(newCourse);
      res.send(result);
    });

    app.get("/courses", async (req, res) => {
      const cursor = coursesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/featured-courses", async (req, res) => {
      try {
        const cursor = coursesCollection
          .find()
          .sort({ createdAt: -1 })
          .limit(6);
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Failed to fetch featured courses" });
      }
    });

    // api for mycourses
    app.get("/mycourses", async (req, res) => {
      const email = req.query.email;
      const query = {};
      if (email) {
        query.email = email;
      }
      const cursor = coursesCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // api for course details
    app.get("/course-details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coursesCollection.findOne(query);
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
  console.log(`Eduverse server running on port: ${port}`);
});
