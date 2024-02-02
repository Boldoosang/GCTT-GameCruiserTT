import express from "express";

import {
  login,
  signup,
  addToWishlist,
  getWishlist,
  registrationValidator,
  loginValidator,
  removeFromWishlist,
  authenticateToken,
  getWishlistItem,
} from "../controllers/user.js";

const router = express.Router();

router.post("/login", loginValidator, login);
router.post("/signup", registrationValidator, signup);
router.post("/wishlist", authenticateToken, addToWishlist);
router.get("/wishlist/:gameId", authenticateToken, getWishlistItem);
router.get("/wishlist", authenticateToken, getWishlist);
router.delete("/wishlist", authenticateToken, removeFromWishlist);

export default router;
