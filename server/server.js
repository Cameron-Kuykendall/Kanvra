import express from "express";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";
import ticketRoutes from "./routes/ticketRoutes.js";

const app = express();

connectDB();

// middleware
app.use(cors());
app.use(express.json());


// routes
app.use("/tickets", ticketRoutes);

// server start
const PORT = 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
