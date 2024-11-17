import React, { useState } from "react";
import axios from "axios";
import SignInForm from "./SignInForm";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    pseudo: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    pseudo: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: "",
  });
  const [formSubmit, setFormSubmit] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.pseudo) newErrors.pseudo = "Le pseudo est requis.";
    if (!formData.email) newErrors.email = "L'email est requis.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email invalide.";
    if (!formData.password) newErrors.password = "Le mot de passe est requis.";

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Veuillez confirmer le mot de passe.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
    }
    if (!document.getElementById("terms").checked)
      newErrors.terms = "Veuillez accepter les conditions générales.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}api/user/register`,
        formData,
        { withCredentials: true }
      );

      if (res.data.errors) {
        setErrors(res.data.errors);
      } else {
        setFormSubmit(true);
      }
    } catch (err) {
      console.error("Erreur lors de l'inscription :", err);
    }
  };

  return (
    <>
      {formSubmit ? (
        <>
          <SignInForm />
          <span></span>
          <h4 className="success">
            Inscription réussi, veuillez-vous connecter
          </h4>
        </>
      ) : (
        <form onSubmit={handleRegister} id="sign-in-form">
          <label htmlFor="pseudo">Pseudo</label>
          <br />
          <input
            type="text"
            name="pseudo"
            id="pseudo"
            onChange={handleInputChange}
            value={formData.pseudo}
          />
          {errors.pseudo && <div className="error">{errors.pseudo}</div>}
          <br />

          <label htmlFor="email">Email</label>
          <br />
          <input
            type="email"
            name="email"
            id="email"
            onChange={handleInputChange}
            value={formData.email}
          />
          {errors.email && <div className="error">{errors.email}</div>}
          <br />

          <label htmlFor="password">Mot de passe</label>
          <br />
          <input
            type="password"
            name="password"
            id="password"
            onChange={handleInputChange}
            value={formData.password}
          />
          {errors.password && <div className="error">{errors.password}</div>}
          <br />

          <label htmlFor="confirmPassword">Confirmer mot de passe</label>
          <br />
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            onChange={handleInputChange}
            value={formData.confirmPassword}
          />
          {errors.confirmPassword && (
            <div className="error">{errors.confirmPassword}</div>
          )}
          <br />

          <input type="checkbox" id="terms" />
          <label htmlFor="terms">
            J'accepte les{" "}
            <a href="/" target="_blank" rel="noopener noreferrer">
              conditions générales
            </a>
          </label>
          {errors.terms && <div className="error">{errors.terms}</div>}
          <br />

          <input type="submit" value="Valider l'inscription" />
        </form>
      )}
    </>
  );
};

export default SignUpForm;
