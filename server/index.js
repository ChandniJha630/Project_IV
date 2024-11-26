const express = require('express');
const path = require('path');

const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();

// MongoDB Configuration
const uri = "mongodb+srv://u:abc@cluster0.hc9hd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const db = "IOT";
const collection = "data";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

// Middleware for CORS and JSON

app.use(express.json());

// Serve Static HTML File
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../index.html'));
});

// Fetch Data API Endpoint
app.get('/fetchData', async (req, res) => {
    try {
        await client.connect();
        console.log("Connected to MongoDB!");

        const database = client.db(db);
        const col = database.collection(collection);

        const cursor = col.find().sort({ _id: -1 }).limit(500);
        const allData = await cursor.toArray();

        if (allData.length > 0) {
            res.status(200).json(allData);
        } else {
            res.status(404).json({ message: "No data found in the collection." });
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Failed to load table data." });
    }
});

// Start the Server
const PORT = process.env.PORT || 3000; // Default to 3000 if PORT is not set
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
// });

// const server = app.listen(() => {
//     const { address, port } = server.address();

//     // Determine the host dynamically for Codespaces or localhost
//     const host = process.env.CODESPACE_NAME
//         ? `${process.env.CODESPACE_NAME}-${port}.githubpreview.dev`
//         : address === '::' || address === '0.0.0.0' ? 'localhost' : address;

//     console.log(`Server is running on http://${host}:${port}`);
});
