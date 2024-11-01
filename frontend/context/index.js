// index.js (Backend)
const express = require("express");
const cors = require("cors");
const axios = require("axios");

// Initialize express app
const app = express();

// Enable CORS
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send({
    message: "Hello, world!",
  });
});

// POST route to handle the user query and forward it to the Python backend
app.post("/ask", async (req, res) => {
  const { userQuery } = req.body; // Get the user query from the body

  if (!userQuery) {
    return res.status(400).json({
      success: false,
      message: "Query is required",
    });
  }

  try {
    // Send a GET request to the Python backend endpoint with the userQuery
    const response = await axios.get(
      `https://pdh-school-backend.onrender.com/ask?userQuery=${encodeURIComponent(userQuery)}`
    );

    const data = response.data;
    const answer = data || "No response"; // Assume the response is plain text

    // Send the AI response back to the frontend
    res.status(200).json({
      success: true,
      data: answer.trim(), // Plain text response
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
});

// Listen on port 5500
app.listen(5500, () => console.log("Server is running on port 5500"));