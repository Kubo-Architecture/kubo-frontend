import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import InputField from '../../Universal/InputField';
import './styles.css';
import { loginSchema } from '../../../validators/loginSchema';

const LoginForm = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  
  const [touched, setTouched] = useState({
    email: false,
    password: false
  });

  const [isValid, setIsValid] = useState(false);

    const validate = async () => {
    try {
      await loginSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      const newErrors = {};
      err.inner.forEach(error => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  useEffect(() => {
    if (touched.email || touched.password) {
      validate().then(valid => setIsValid(valid));
    }
  }, [formData, touched]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isValid) {
      try {
        const apiUrl = `${import.meta.env.VITE_API_URL}/login`
        const response = await axios.post(apiUrl, formData);
        const token = response.data.token;
        const name = response.data.name;
        const idUser = response.data.idUser;
        localStorage.setItem("name", name);
        localStorage.setItem("token", token);
        localStorage.setItem("idUser", idUser);
        navigate(`/profile/${name}`);
      } catch (error) {
        console.error('Erro no login:', error);
        if (error.response?.status === 404) {
          navigate(`/error/404`);
        }
      }
    }
  };

  return (
        <form onSubmit={handleSubmit} className="login-form">
      <InputField
        label="Qual o seu email?"
        type="email"
        name="email"
        placeholder="Seu email"
        value={formData.email}
        onChange={handleChange}
        onBlur={() => handleBlur('email')}
        error={touched.email && errors.email}
      />

      <InputField
        label="Qual a sua senha?"
        type="password"
        name="password"
        placeholder="Sua senha"
        value={formData.password}
        onChange={handleChange}
        onBlur={() => handleBlur('password')}
        error={touched.password && errors.password}
      />

      <div className="button-help-container">
        <button 
            type="submit" 
            className="proximo-btn"
            disabled={!isValid}
        >
            próximo
        </button>
        <a href="/forgotpassword">Esqueci minha senha</a>
      </div>
    </form>
    
  );
};

export default LoginForm;