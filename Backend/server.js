const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
app.use(cors());
const dotenv = require("dotenv");
const passport = require("passport");
const bcrypt = require("bcrypt");
const session = require("express-session");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({ secret: "DKER9g3HJU", resave: true, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());
const LocalStrategy = require("passport-local").Strategy;

const User = require("./Model/Users");
const Admin = require("./Model/Admins");

passport.use(Admin.createStrategy());
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

dotenv.config();

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await Admin.findOne({ username: username });

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }

      const result = await bcrypt.compare(password, user.password);

      if (!result) {
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  Admin.findById(id, (err, user) => {
    done(err, user);
  });
});

const port = process.env.PORT || "8000";

const MongoURL = process.env.MONGO_URL;

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
      res.send(users)
      console.log(users)
    })
    .catch((error) => {
      console.error("Error retrieving users:", error);
    });
});

app.patch("/updatewallet/:id", async (req, res) => {
  const userId = req.params.id;
  const updateValue = parseInt(Object.keys(req.body)[0]); // Value to be added or subtracted

  console.log("-----------------")
  console.log(Object.keys(req.body)[0])
  console.log("-----------------")

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
      .json({ error: "An error occurred while updating the wallet", error });
  }
});

// Registration route
app.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new Admin({
      username: req.body.username,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).send("User registered successfully");
  } catch (error) {
    res.status(500).send("Error registering user" + error);
  }
});

app.post("/login", async (req, res, next) => {
  await passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error("Error in authentication:", err);
    }
    if (!user) {
      console.log("User not found or password incorrect");
    }
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        console.log("Successfully Authenticated");
        res.send(user)
      })
    }
  })(req, res, next);
});

mongoose
  .connect(MongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => console.log("MongoDB is now connected"))
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
