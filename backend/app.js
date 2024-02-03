const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: ["https://gctt.justinbaldeo.com", "http://localhost:5173"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

const userRoutes = require("./routes/user.js");
const errorRoutes = require("./routes/error.js");

app.use("/user", userRoutes);
app.use(errorRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(3000, () => console.log("Server running on port 3000"));
  })
  .catch((err) => {
    console.log(err);
  });
