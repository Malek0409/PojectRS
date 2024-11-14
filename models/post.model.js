const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    posterId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
      mawlength: 500,
    },
    video: {
      type: String,
    },
    picture: {
      type: String,
    },
    likers: {
      type: [String],
      required: true,
    },
    comments: {
      type: [
        {
          commenterId: String,
          commenterPseudo: String,
          text: String,
          timestamp: String,
        },
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const PostModel = mongoose.model("posts", postSchema);
module.exports = PostModel;
