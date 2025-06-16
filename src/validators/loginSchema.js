import * as yup from 'yup';

export const loginSchema = yup.object().shape({
    email: yup
    .string()
    .required('Email é obrigatório')
    .email('Email inválido')
    .max(255, 'Email deve ter no máximo 255 caracteres'),

  password: yup
    .string()
    .required('Senha é obrigatória')
    .max(100, 'Senha deve ter no máximo 100 caracteres'),
});
