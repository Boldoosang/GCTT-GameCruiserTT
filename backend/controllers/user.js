import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { JWT_SECRET } from "../config/config.js";

export function authenticateToken(req, res, next) {
  let token = req.headers.authorization;
  token = token.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Authorization token is missing" });
  }

  jwt.verify(token, process.env.JWT_SECRET || JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(422).json({ message: "Your session has expired." });
    }

    req.user = user;
    next();
  });
}

export const registrationValidator = [
  body("email").isEmail().normalizeEmail().withMessage("Invalid email address"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),

  body("tos")
    .equals("yes")
    .withMessage("You must agree to the terms of service"),
];

export const loginValidator = [
  body("email").isEmail().normalizeEmail().withMessage("Invalid email address"),
  body("password").notEmpty().withMessage("Please enter a password"),
];

export async function signup(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ message: errors.array().map((error) => error.msg + ". ") });
  }

  try {
    const email = req.body.email;
    const password = req.body.password;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = User.create({ email, password: hashedPassword })
      .then(() =>
        res.status(200).json({ message: "Account successfully created!" })
      )
      .catch((err) => res.status(400).json({ message: err.message }));
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function login(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ message: errors.array().map((error) => error.msg + ". ") });
  }

  try {
    const email = req.body.email;
    const password = req.body.password;

    const userExists = await User.findOne({ email });

    if (!userExists) {
      return res.status(400).json({ message: "Invalid username or password." });
    }

    const passwordValidated = await bcrypt.compare(
      password,
      userExists.password
    );

    if (!passwordValidated) {
      return res.status(400).json({ message: "Invalid username or password." });
    }

    const token = jwt.sign(
      {
        email: userExists.email,
        id: userExists._id,
      },
      process.env.JWT_SECRET || JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export function addToWishlist(req, res, next) {
  User.findOne({ email: req.user.email })
    .then((user) => {
      let gameId;
      let gameName;
      try {
        gameId = parseInt(req.body.gameId);
        gameName = req.body.gameName;

        if (!gameId || !gameName)
          return res.status(400).json({ message: "Invalid game details" });

        if (user.wishlist.find((game) => game.gameId === parseInt(gameId))) {
          return res
            .status(400)
            .json({ message: "Game already exists in wishlist" });
        }

        user.wishlist.push({ gameId, gameName });
        user.save().then((user) => {
          res
            .status(201)
            .json({ message: "Game added to wishlist", user: user });
        });
      } catch (err) {
        console.log(err);
        return res
          .status(401)
          .json({ message: "The supplied game details were not valid" });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(404).json({ message: "User not found" });
    });
}

export function removeFromWishlist(req, res, next) {
  User.findOne({ email: req.user.email })
    .then((user) => {
      let gameId;
      try {
        gameId = parseInt(req.body.gameId);

        if (!user.wishlist.find((game) => game.gameId === gameId)) {
          return res.status(400).json({ message: "Game is not in wishlist!" });
        }
        let removedIndex = user.wishlist.findIndex(
          (game) => gameId === game.gameId
        );
        user.wishlist.splice(removedIndex, 1);
        user.save().then((user) => {
          res
            .status(201)
            .json({ message: "Game removed from wishlist", user: user });
        });
      } catch (err) {
        console.log(err);
        return res
          .status(401)
          .json({ message: "The supplied Game ID was not valid" });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(404).json({ message: "User not found" });
    });
}

export function getWishlist(req, res, next) {
  User.findOne({ email: req.user.email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res
        .status(200)
        .json({ userId: user._id, email: user.email, wishlist: user.wishlist });
    })
    .catch((err) => {
      console.log(err);
      return res.status(404).json({ message: "User not found" });
    });
}

export function getWishlistItem(req, res, next) {
  const gameId = req.params.gameId;
  User.findOne({
    email: req.user.email,
    wishlist: {
      $elemMatch: { gameId: gameId },
    },
  })
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .json({ message: "User or wishlist item not found" });
      }

      res.status(200).json({
        wishlistItem: {
          gameId: parseInt(gameId),
          gameName: user.wishlist.find(
            (game) => game.gameId === parseInt(gameId)
          ).gameName,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(404).json({ message: "User not found" });
    });
}
