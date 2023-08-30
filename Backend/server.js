const express = require("express");
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const port = process.env.PORT || "8000";

const MongoURL = process.env.MONGO_URL
mongoose.connect(MongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => console.log("MongoDB is now connected"))
  .catch(err => console.log(err));

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});