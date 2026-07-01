import express from "express";
import dotenv from "dotenv";
import prisma from "./src/config/prisma.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Welcome to the Student Management API");
});    

import routes from "./src/routes/index.js";
app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});