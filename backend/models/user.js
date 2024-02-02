import mongoose from "mongoose";
const { Schema, Types } = mongoose;

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    wishlist: [
      {
        gameId: { type: Number, required: true },
        gameName: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("Users", userSchema);
