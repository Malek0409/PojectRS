import React, { useState } from "react";
import axios from "axios";

const SignInForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "L'email est requis.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email invalide.";
    if (!formData.password) newErrors.password = "Le mot de passe est requis.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}api/user/login`,
        formData,
        { withCredentials: true }
      );

      if (res.data.errors) {
        setErrors(res.data.errors);
      } else {
        window.location = "/";
      }
    } catch (err) {
      console.error("Erreur lors de connection :", err);
    }
  };

  return (
    <form onSubmit={handleLogin} id="sign-in-form">
      <label htmlFor="email">Email</label>
      <br />
      <input
        type="text"
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
      <input type="submit" value="Se connecter" />
    </form>
  );
};

export default SignInForm;
