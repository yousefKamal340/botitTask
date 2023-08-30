const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const passport = require('passport');
const bcrypt = require('bcrypt');
const session = require('express-session');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'DKER9g3HJU', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(cors());
dotenv.config();

const port = process.env.PORT || "8000";

const MongoURL = process.env.MONGO_URL;

const User = require("./Model/Users");

app.post("/createNewUser", async (req, res) => {
  const userNew = new User({
    Name: req.body.Name,
    Wallet: req.body.Wallet,
    WalletHistory: req.body.WalletHistory,
  });
  await userNew
    .save()
    .then((savedUser) => {
      console.log("User saved:", savedUser);
    })
    .catch((error) => {
      console.error("Error saving user:", error);
    });
});

app.get("/getAllUsersInfo", async (req, res) => {
  await User.find({})
    .then((users) => {
      console.log("All users:", users);
    })
    .catch((error) => {
      console.error("Error retrieving users:", error);
    });
});

app.patch("/updatewallet/:id", async (req, res) => {
  const userId = req.params.id;
  const updateValue = req.body.value; // Value to be added or subtracted

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const walletChange = updateValue; // Change to be made to the wallet

    // Update wallet balance and create history entry
    user.Wallet += walletChange;
    const historyEntry = `Wallet ${
      walletChange >= 0 ? "added" : "deducted"
    }: ${Math.abs(walletChange)}`;
    user.WalletHistory.push(historyEntry);

    const updatedUser = await user.save();

    res
      .status(200)
      .json({ message: "Wallet updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating wallet:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the wallet" });
  }
});



mongoose
  .connect(MongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => console.log("MongoDB is now connected"))
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
