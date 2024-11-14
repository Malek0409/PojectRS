const fs = require("fs");
const path = require("path");
const PostModel = require("../models/post.model");

module.exports.uploadPostPicture = async (req, res) => {
  try {
    if (!req.file) {
      console.error({
        error:
          "Aucun fichier reçu. Veuillez sélectionner un fichier et réessayer.",
      });
      return res.status(400).json({
        error:
          "Aucun fichier reçu. Veuillez sélectionner un fichier et réessayer.",
      });
    }

    const validMimeTypes = ["image/jpg", "image/png", "image/jpeg"];
    if (!validMimeTypes.includes(req.file.mimetype)) {
      console.error({
        error:
          "Le type de fichier est invalide. Veuillez télécharger une image au format JPG, PNG ou JPEG.",
      });
      return res.status(400).json({
        error:
          "Le type de fichier est invalide. Veuillez télécharger une image au format JPG, PNG ou JPEG.",
      });
    }

    if (req.file.size > 500000) {
      console.error({
        error:
          "Le fichier est trop volumineux. La taille maximale autorisée est de 500 Ko.",
      });
      return res.status(400).json({
        error:
          "Le fichier est trop volumineux. La taille maximale autorisée est de 500 Ko.",
      });
    }

    const fileName = req.body.posterId + Date.now() + ".jpg";
    const uploadPostPath = path.join(
      __dirname,
      "../client/public/uploads/posts/",
      fileName
    );

    const dir = path.dirname(uploadPostPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    await fs.promises.writeFile(uploadPostPath, req.file.buffer);

    const updatePost = await PostModel.findByIdAndUpdate(
      req.body.postId,
      { $set: { picture: `./uploads/posts/${fileName}` } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.json(updatePost);
  } catch (err) {
    console.error(`Internal server error ${err}`);
    return res.status(500).json(`Internal server error ${err}`);
  }
};
