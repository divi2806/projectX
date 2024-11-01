// backend/index.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const axios = require("axios");
const Message = require("./models/Message"); // Import the message model

// Initialize express app
const app = express();

// Enable CORS
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(
  "mongodb+srv://divyansh242805:qVRCll30j8FiV31c@cluster0.oc4hk.mongodb.net/ChatDB?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.status(200).send({ message: "Hello, world!" });
});

// POST route to handle the user query and store the conversation
app.post("/ask", async (req, res) => {
  const { userQuery } = req.body;

  if (!userQuery) {
    return res.status(400).json({ success: false, message: "Query is required" });
  }

  try {
    // Send the query to the Python backend
    const response = await axios.get(
      `https://pdh-school-backend.onrender.com/ask?userQuery=${encodeURIComponent(userQuery)}`
    );

    const aiResponse = response.data || "No response";

    // Save the conversation in MongoDB
    const newMessage = new Message({
      userQuery,
      aiResponse
    });

    await newMessage.save();

    res.status(200).json({ success: true, data: aiResponse.trim() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || "Something went wrong" });
  }
});

// Listen on port 5500
app.listen(5500, () => console.log("Server is running on port 5500"));
app.get("/history", async (req, res) => {
  try {
    const messages = await Message.find();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch messages" });
  }
});
