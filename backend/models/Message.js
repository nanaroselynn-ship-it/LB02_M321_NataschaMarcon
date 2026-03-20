const mongoose = require("mongoose");  // import mongoose 

const messageSchema = new mongoose.Schema({  // define the schema structure for a message
  username: {
    type: String,  // name of the user who sent the message 
    required: true,   // must always be provided
    default: "Anonym"   // default value if no username is given
  },
  text: {
    type: String,   // the message content 
    required: true    // message text is required
  }
}, {
  timestamps: true    // auto add createdAt and updatedAt fields
});

module.exports = mongoose.model("Message", messageSchema); // export the model to use in other files 