const express = require("express");
const mongoose = require("mongoose");
const { MONGO_URI } = require("./config/config.js");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: "https://gctt.justinbaldeo.com",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors());
app.use(express.json());

const userRoutes = require("./routes/user.js");
const errorRoutes = require("./routes/error.js");

app.use("/user", userRoutes);
app.use(errorRoutes);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(3000, () => console.log("Server running on port 3000"));
  })
  .catch((err) => {
    console.log(err);
  });
