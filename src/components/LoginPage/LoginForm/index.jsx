import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import InputField from '../../Universal/InputField';
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
    <form onSubmit={handleSubmit} className="flex flex-col flex-1 px-2">
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

      <div className="flex flex-col flex-1 items-center justify-end pb-10 gap-2.5 font-montserrat">
        <button 
          type="submit" 
          className="w-[290px] h-[45px] bg-[#000000b7] text-white border-none rounded-lg cursor-pointer text-base transition-colors duration-300 font-montserrat disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-[#000000b7] hover:disabled:bg-gray-300"
          disabled={!isValid}
        >
          próximo
        </button>
        <a href="/forgotpassword" className="font-montserrat">Esqueci minha senha</a>
      </div>
    </form>
  );
};

export default LoginForm;