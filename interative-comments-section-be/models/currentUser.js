const mongoose = require("mongoose");

const currentUserSchema = new mongoose.Schema({
  image: String,
  username: String,
});

currentUserSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("CurrentUser", currentUserSchema);
