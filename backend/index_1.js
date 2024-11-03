const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const axios = require("axios");
const Message = require("./Models/Message");
const User = require("./Models/User");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(
  "mongodb+srv://divyansh242805:qVRCll30j8FiV31c@cluster0.oc4hk.mongodb.net/messages?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Update or create user
app.post("/users", async (req, res) => {
  const { uid, name, email, role } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { uid },
      { name, email, role, lastActive: new Date() },
      { upsert: true, new: true }
    );
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all students
app.get("/students", async (req, res) => {
  try {
    const students = await User.find({ role: 'student' });
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Handle AI chat and teacher messages
app.post("/ask", async (req, res) => {
  const { userQuery, userId } = req.body;

  if (!userQuery || !userId) {
    return res.status(400).json({ success: false, message: "Query and userId are required" });
  }

  try {
    // Save user message
    await new Message({
      from: 'human',
      text: userQuery,
      userId
    }).save();

    // Get AI response
    const response = await axios.get(
      `https://pdh-school-backend.onrender.com/ask?userQuery=${encodeURIComponent(userQuery)}`
    );

    const aiResponse = response.data || "No response";

    // Save AI response
    await new Message({
      from: 'ai',
      text: aiResponse.trim(),
      userId,
      status: 'pending'
    }).save();

    res.status(200).json({ success: true, data: aiResponse.trim() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Send teacher message
app.post("/teacher-message", async (req, res) => {
  const { text, studentId } = req.body;
  try {
    const message = await new Message({
      from: 'teacher',
      text,
      userId: studentId,
      status: 'approved'
    }).save();
    res.status(200).json(message);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update message status
app.put("/messages/:messageId", async (req, res) => {
  const { status } = req.body;
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.messageId,
      { status },
      { new: true }
    );
    res.status(200).json(message);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get messages for a user
app.get("/messages/:userId", async (req, res) => {
  try {
    const messages = await Message.find({ userId: req.params.userId })
      .sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(5500, () => console.log("Server is running on port 5500"));