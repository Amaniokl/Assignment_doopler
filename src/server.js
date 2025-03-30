import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import imageRoutes from "./routes/imageRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Server is live!');
  });
// Routes
app.use("/api", imageRoutes);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start the server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch((err) => console.error("MongoDB connection error:", err));
