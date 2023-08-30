const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const userSchema = new Schema({
  Name: {
    type: String,
    required: true,
  },
  Wallet: {
    type: Number,
    required: true,
    default: 0,
  },
  WalletHistory: [String]
});

const User = mongoose.model("User", userSchema);

module.exports = User;
