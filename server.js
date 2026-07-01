import express from "express";
import dotenv from "dotenv";
import prisma from "./src/config/prisma.js";
import path from "path";
import { fileURLToPath } from "url";
import { errorHandler } from "./src/middleware/error.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Serve static files from public folder
app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("Welcome to the Student Management API");
});    

import routes from "./src/routes/index.js";
app.use("/api", routes);

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});