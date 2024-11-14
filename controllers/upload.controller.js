const fs = require("fs");
const path = require("path");
const UserModel = require("../models/user.model");

module.exports.uploadProfil = async (req, res) => {
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

    const fileName = (req.body.name || "default") + ".jpg";
    const uploadPath = path.join(
      __dirname,
      "../client/public/uploads/profil/",
      fileName
    );

    const dir = path.dirname(uploadPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    await fs.promises.writeFile(uploadPath, req.file.buffer);

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.body.userId,
      { $set: { picture: `./uploads/profil/${fileName}` } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.json(updatedUser);
  } catch (err) {
    console.error(`Internal server error ${err}`);
    return res.status(500).json(`Internal server error ${err}`);
  }
};
