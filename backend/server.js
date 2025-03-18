import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import { errorHandler, notFound } from "./middleware/error-middleware.js";
import exerciseRoutes from "./routes/exercise-routes.js";
import userRoutes from "./routes/user-routes.js";

const envFile = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: envFile });

const port = process.env.PORT || 9000;
connectDB();

const app = express();

// body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie parser middleware
app.use(cookieParser());

// console.log("PORT:", process.env.PORT, "ENV:", process.env.NODE_ENV);
app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.use("/api/exercises", exerciseRoutes);
app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server is running on port ${port}`));
