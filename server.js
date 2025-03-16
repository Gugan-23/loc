const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb+srv://vgugan16:gugan2004@cluster0.qyh1fuo.mongodb.net/dL?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// Define Schema and Model
const obstacleSchema = new mongoose.Schema({
    latitude: Number,
    longitude: Number,
    timestamp: { type: Date, default: Date.now }
});

const Obstacle = mongoose.model('Obstacle', obstacleSchema);

// Endpoint to store user's current location
app.post('/api/obstacles', async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        if (!latitude || !longitude) {
            return res.status(400).json({ error: "Latitude and longitude are required" });
        }

        const newObstacle = new Obstacle({ latitude, longitude });
        await newObstacle.save();
        res.status(201).json({ message: "Location stored as an obstacle", obstacle: newObstacle });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Endpoint to get stored obstacles
app.get('/api/obstacles', async (req, res) => {
    try {
        const obstacles = await Obstacle.find();
        res.status(200).json(obstacles);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
