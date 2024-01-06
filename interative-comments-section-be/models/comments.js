const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  content: String,
  createdAt: String,
  score: Number,
  user: {
    image: String,
    username: String,
  },
  replies: [
    {
      content: String,
      createdAt: String,
      score: Number,
      replyingTo: String,
      user: {
        image: String,
        username: String,
      },
    },
  ],
});

commentSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Comment", commentSchema);
