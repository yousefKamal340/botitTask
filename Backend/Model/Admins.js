const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var passportLocalMongoose = require('passport-local-mongoose');

const adminSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  }
});

adminSchema.plugin(passportLocalMongoose);

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
