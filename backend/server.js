import express from "express";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import exerciseRoutes from "./routes/exercise-routes.js";

const envFile = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: envFile });

const port = process.env.PORT || 9000;
connectDB();

const app = express();

// console.log("PORT:", process.env.PORT, "ENV:", process.env.NODE_ENV);
app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.use("/api/exercises", exerciseRoutes);

app.listen(port, () => console.log(`Server is running on port ${port}`));
