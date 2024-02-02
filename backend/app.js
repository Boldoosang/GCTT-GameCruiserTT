import express from "express";
import mongoose from "mongoose";
import { MONGO_URI } from "./config/config.js";
import cors from "cors";

const app = express();

const corsOptions = {
  origin: "https://gctt.justinbaldeo.com",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

import userRoutes from "./routes/user.js";
import errorRoutes from "./routes/error.js";

app.use("/user", userRoutes);
app.use(errorRoutes);

mongoose
  .connect(process.env.MONGO_URL || MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(3000, () => console.log("Server running on port 3000"));
  })
  .catch((err) => {
    console.log(err);
  });
