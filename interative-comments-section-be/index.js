require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const CurrentUser = require("./models/currentUser");
const Comment = require("./models/comments");

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

// currentUser
app.get("/api/currentUser", (request, response) => {
  CurrentUser.find({}).then((user) => {
    response.json(user);
  });
});

// comments
app.get("/api/comments", (request, response) => {
  Comment.find({}).then((comment) => {
    response.json(comment);
  });
});

app.post("/api/comments", async (request, response) => {
  const body = request.body;

  const comment = new Comment({
    content: body.content,
    createdAt: "today",
    score: 0,
    user: {
      image: "https://i.ibb.co/gwDSSft/image-juliusomo.png",
      username: "juliusomo",
    },
    replies: [],
  });

  await comment.save();
  response.status(201).json(comment);
});

app.delete("/api/comments/:id", async (request, response) => {
  await Comment.findByIdAndDelete(request.params.id);
  return response.status(204).end();
});

app.put("/api/comments/:id", (request, response) => {
  const body = request.body;

  const comment = {
    content: body.content,
    createdAt: body.createdAt,
    score: body.score,
    user: body.user,
    replies: body.replies,
  };

  Comment.findByIdAndUpdate(request.params.id, comment, { new: true }).then(
    (updatesComment) => response.status(204).json(updatesComment)
  );
});

// Replies
app.post("/api/comments/:id/replies", (request, response) => {
  const body = request.body;

  Comment.findById(request.params.id).then((comment) => {
    const reply = {
      content: body.content,
      user: {
        image: "https://i.ibb.co/gwDSSft/image-juliusomo.png",
        username: "juliusomo",
      },
      createdAt: "today",
      score: 0,
      replyingTo: comment.user.username,
    };

    comment.replies.push(reply);
    comment.save();
    response.status(201).json(comment);
  });
});

app.delete("/api/comments/:id/replies/:id", (request, response) => {
  const replyingToCommentId = request.url.slice(14, 38);

  Comment.findById(replyingToCommentId).then((comment) => {
    comment.replies = comment.replies.filter((c) => c.id !== request.params.id);
    comment.save();
    response.status(204).end();
  });
});

app.put("/api/comments/:id/replies/:id", (request, response) => {
  const body = request.body;
  const replyingToCommentId = request.url.slice(14, 38);

  Comment.findById(replyingToCommentId).then((comment) => {
    comment.replies = comment.replies.map((c) => {
      const reply = {
        ...c,
        content: body.content ?? c.content,
        createdAt: body.createdAt ?? c.createdAt,
        score: body.score ?? c.score,
        replyingTo: body.replyingTo ?? c.replyingTo,
        user: body.user ?? c.user,
      };

      if (c.id === request.params.id) return reply;

      return c;
    });

    comment.save();
    response.status(204).end();
  });
});

// Listening to port
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
