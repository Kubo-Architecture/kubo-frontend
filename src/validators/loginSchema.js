import * as yup from 'yup';

export const loginSchema = yup.object().shape({
    email: yup
    .string()
    .required('Email é obrigatório')
    .email('Email inválido') 
    .matches(/^[^@\s]+@[^@\s]+\.[^@\s]+$/, 'Email inválido')
    .max(255, 'Email deve ter no máximo 255 caracteres'),

  password: yup
    .string()
    .required('Senha é obrigatória')
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .max(100, 'Senha deve ter no máximo 100 caracteres'),
});
