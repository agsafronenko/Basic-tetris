// mongodb.js - Backend API for managing Tetris scores database
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors()); // Enable cross-origin requests
app.use(bodyParser.json()); // Parse JSON request bodies

// MongoDB connection
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
let db;

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    db = client.db("tetris");

    // Index for efficient leaderboard sorting
    await db.collection("scores").createIndex({ score: -1 });

    return db;
  } catch (error) {
    console.error("Could not connect to MongoDB", error);
    process.exit(1);
  }
}

// Check server status
app.get("/", (req, res) => {
  res.json({ message: "Tetris Scoreboard API is running" });
});

// Get all scores (sorted)
app.get("/api/scores", async (req, res) => {
  try {
    const scores = await db.collection("scores").find({}).sort({ score: -1 }).toArray();

    res.status(200).json(scores);
  } catch (error) {
    console.error("Error fetching scores:", error);
    res.status(500).json({ error: "Failed to fetch scores" });
  }
});

// Add new score
app.post("/api/scores", async (req, res) => {
  try {
    const { name, score, level, date } = req.body;

    if (!name || score === undefined || level === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await db.collection("scores").insertOne({
      name,
      score: Number(score),
      level: Number(level),
      date: date ? new Date(date) : new Date(),
    });

    const newScore = await db.collection("scores").findOne({ _id: result.insertedId });
    res.status(201).json(newScore);
  } catch (error) {
    console.error("Error adding score:", error);
    res.status(500).json({ error: "Failed to add score" });
  }
});

// Update player name for a specific score by ID
app.put("/api/scores/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const result = await db.collection("scores").updateOne({ _id: new ObjectId(id) }, { $set: { name } });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Score not found" });
    }

    res.status(200).json({ message: "Name updated successfully" });
  } catch (error) {
    console.error("Error updating name:", error);
    res.status(500).json({ error: "Failed to update name" });
  }
});

// Start the server
async function startServer() {
  await connectToDatabase();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Handle shutdown
process.on("SIGINT", async () => {
  await client.close();
  console.log("MongoDB connection closed");
  process.exit(0);
});

startServer().catch(console.error);

// module.exports = { app, connectToDatabase };
