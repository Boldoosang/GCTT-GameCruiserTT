const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    wishlist: [
      {
        gameId: { type: Number, required: true },
        gameName: { type: String, required: true },
        backgroundImage: { type: String, required: false },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports.User = mongoose.model("Users", userSchema);
