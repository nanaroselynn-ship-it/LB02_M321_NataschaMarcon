const mongoose = require("mongoose"); //import mongoose mongodb

const userSchema = new mongoose.Schema({  // define the schema sctructure for a user
  username: {
    type: String,  // username must be a string
    required: true,  // field is required cannot be empty
    unique: true,  // each username must be unique in the database
  },
  createdAt: {
    type: Date,  // stored data and time
    default: Date.now,   // auto set to current time when created
  },
});

module.exports = mongoose.model("User", userSchema);  // export the model so it can be used in other files