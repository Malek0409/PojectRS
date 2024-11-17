module.exports.signUpErrors = (err) => {
  console.log("*******************", err);

  let errors = { pseudo: "", email: "", password: "" };

  if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("email"))
    errors.email = "Cet email est déjà enregistré";

  if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("pseudo"))
    errors.pseudo = "Cet pseudo est déjà pris";

  if (err.message.includes("password"))
    errors.password =
      "Le Mot de passe doit avoir 8-16 caractères, majuscule, minuscule, chiffre, spécial.";
  return errors;
};

module.exports.signInErrors = (err) => {
  let errors = { email: "", password: "" };

  if (err.message.includes("email"))
    errors.email = "Adresse e-mail inconnue. Veuillez vérifier votre saisie.";

  if (err.message.includes("password"))
    errors.password = "Le mot de passe est incorrect. Veuillez réessayer.";

  return errors;
};
