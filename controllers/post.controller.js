const UserModel = require("../models/user.model");
const PostModel = require("../models/post.model");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports.readPost = async (req, res) => {
  try {
    const posts = await PostModel.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
    console.log(posts.id);
  } catch (err) {
    console.error(`Error to get data :  ${err}`);
    res.status(500).json(`Error to get data :  ${err}`);
  }
};

module.exports.createPost = async (req, res) => {
  const newPost = new PostModel({
    posterId: req.body.posterId,
    message: req.body.message,
    video: req.body.video,
    likers: [],
    comments: [],
  });
  try {
    const post = await newPost.save();
    return res.status(201).json(post);
  } catch (err) {
    return res.status(400).json(err);
  }
};
module.exports.updatePost = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).send(`ID unknown : ${req.params.id}`);
  }
  const updateRecord = {
    message: req.body.message,
  };

  try {
    const updatePost = await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: updateRecord,
      },
      { new: true }
    );
    if (!updatePost) {
      return res.status(500).send("post not update");
    }
    res.status(200).send(updatePost);
  } catch (err) {
    console.error(`Error update user: ${err}`);
    res.status(500).json(`Error update user: ${err}`);
  }
};
module.exports.deletePost = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).send(`ID unknown : ${req.params.id}`);
  }
  try {
    await PostModel.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: `Successfully deleted ${req.params.id}` });
  } catch (err) {
    console.error(`Error deleted post: ${err}`);
    res.status(500).json(`Error delete post: ${err}`);
  }
};

module.exports.likePost = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).send(`ID unknown : ${req.params.id}`);
  }
  try {
    const likePost = await PostModel.findByIdAndUpdate(
      req.params.id,

      {
        $addToSet: {
          likers: req.body.id,
        },
      },
      { new: true }
    );

    if (!likePost) {
      return res.status(400).json("post not patching the like");
    }
    res.status(201).json(likePost);

    const likeUser = await UserModel.findByIdAndUpdate(
      req.body.id,

      {
        $addToSet: {
          likes: req.params.id,
        },
      },
      { new: true, upsert: true }
    );
    if (!likeUser) {
      return res.status(400).json("User not patching the like");
    }
  } catch (error) {
    console.error(`User or Post not patching the likes: ${error}`);
    res.status(500).json(`User or Post not patching the likes: ${error}`);
  }
};

module.exports.unlikePost = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).send(`ID unknown : ${req.params.id}`);
  }
  try {
    const unlikePost = await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          likers: req.body.id,
        },
      },
      { new: true }
    );
    if (!unlikePost) {
      return res.status(400).json("Post not patching the unlike");
    }
    res.status(201).json(unlikePost);

    const unlikeUser = await UserModel.findByIdAndUpdate(
      req.body.id,
      {
        $pull: {
          likes: req.params.id,
        },
      },
      { new: true }
    );
    if (!unlikeUser) {
      return res.status(400).json("User not patching the unlike");
    }
  } catch (error) {
    console.error(`User or Post not patching the unlikes: ${error}`);
    res.status(500).json(`User or Post not patching the unlikes: ${error}`);
  }
};

module.exports.commentPost = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).send(`ID unknown : ${req.params.id}`);
  }
  const updateComment = {
    commenterId: req.body.commenterId,
    commenterPseudo: req.body.commenterPseudo,
    text: req.body.text,
    timestamp: new Date().toISOString(),
  };

  try {
    const updatePost = await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: updateComment,
        },
      },
      { new: true }
    );
    if (!updatePost) {
      return res.status(500).send("comment not insert");
    }
    res.status(200).send(updatePost);
  } catch (err) {
    console.error(`Error insert comment: ${err}`);
    res.status(500).json(`Error insert comment: ${err}`);
  }
};

module.exports.editCommentPost = async (req, res) => {
  const postId = req.params.id;
  const commentId = req.body.commentId;
  const newText = req.body.text;

  if (!ObjectId.isValid(postId) || !ObjectId.isValid(commentId)) {
    return res.status(400).send(`Invalid ID(s): ${postId}, ${commentId}`);
  }

  try {
    const updatedPost = await PostModel.findOneAndUpdate(
      { _id: postId, "comments._id": commentId },
      { $set: { "comments.$.text": newText } },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).send("Comment not found");
    }

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error(`Error updating comment: ${err}`);
    res.status(500).json(`Error updating comment: ${err}`);
  }
};

module.exports.deleteCommentPost = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).send(`ID unknown : ${req.params.id}`);
  }

  try {
    await PostModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { comments: { _id: req.body.commentId } } },
      { new: true }
    );

    res.status(200).send("Comment deleted successfully");
  } catch (err) {
    console.error(`Error delete comment: ${err}`);
    res.status(500).json(`Error delte comment: ${err}`);
  }
};
