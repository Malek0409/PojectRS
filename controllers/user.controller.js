const UserModel = require("../models/user.model");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select("-password");
  res.status(200).json(users);
};

module.exports.userInfo = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).send(`ID unknown : ${req.params.id}`);
  }

  try {
    const user = await UserModel.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).send(user);
  } catch (error) {
    console.error(`Error finding user: ${error}`);
    res.status(500).json(`Error finding user: ${error}`);
  }
};

module.exports.updateUser = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).send(`ID unknown : ${req.params.id}`);
  }
  try {
    const updateUser = await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          bio: req.body.bio,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    if (!updateUser) {
      return res.status(500).send("User not update");
    }
    res.status(200).send(updateUser);
  } catch (error) {
    console.error(`Error update user: ${error}`);
    res.status(500).json(`Error update user: ${error}`);
  }
};

module.exports.deleteUser = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).send(`ID unknown : ${req.params.id}`);
  }
  try {
    await UserModel.findOneAndDelete({ _id: req.params.id });

    res.status(200).json({ message: `Successfully deleted ${req.params.id}` });
  } catch (error) {
    console.error(`Error deleted user: ${error}`);
    res.status(500).json(`Error delete user: ${error}`);
  }
};

module.exports.follow = async (req, res) => {
  if (
    !ObjectId.isValid(req.params.id) ||
    !ObjectId.isValid(req.body.idToFollow)
  ) {
    return res.status(400).send(`ID unknown : ${req.params.id}`);
  }
  try {
    const following = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: {
          following: req.body.idToFollow,
        },
      },
      { new: true, upsert: true }
    );

    if (!following) {
      return res.status(400).json("User not patching the following");
    }
    res.status(201).json(following);

    const followers = await UserModel.findByIdAndUpdate(
      req.body.idToFollow,
      {
        $addToSet: {
          followers: req.params.id,
        },
      },
      { new: true, upsert: true }
    );
    if (!followers) {
      return res.status(400).json("User not patching the followers");
    }
  } catch (error) {
    console.error(`User not patching the follows: ${error}`);
    res.status(500).json(`User not patching the follows: ${error}`);
  }
};

module.exports.unfollow = async (req, res) => {
  if (
    !ObjectId.isValid(req.params.id) ||
    !ObjectId.isValid(req.body.idToUnfollow)
  ) {
    return res.status(400).send(`ID unknown : ${req.params.id}`);
  }
  try {
    const following = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          following: req.body.idToUnfollow,
        },
      },
      { new: true, upsert: true }
    );
    if (!following) {
      return res.status(400).json("User not patching the unfollowing");
    }
    res.status(201).json(following);

    const followers = await UserModel.findByIdAndUpdate(
      req.body.idToUnfollow,
      {
        $pull: {
          followers: req.params.id,
        },
      },
      { new: true, upsert: true }
    );
    if (!followers) {
      return res.status(400).json("User not patching the unfollowers");
    }
  } catch (error) {
    console.error(`User not patching the unfollows: ${error}`);
    res.status(500).json(`User not patching the unfollows: ${error}`);
  }
};
