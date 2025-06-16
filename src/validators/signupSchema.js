import * as yup from 'yup';

const passwordRegex = {
  uppercase: /[A-Z]/,
  number: /\d/,
  specialChar: /[\W_]/,
};

export const signupSchema = yup.object().shape({
  name: yup
    .string()
    .required('Nome é obrigatório')
    .min(1, 'Nome deve ter no mínimo 1 caractere')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),

  email: yup
    .string()
    .required('Email é obrigatório')
    .email('Email inválido')
    .matches(/^[^@]+@[^@]+\.[^@]+$/, 'Email deve conter um domínio válido com ponto')
    .max(255, 'Email deve ter no máximo 255 caracteres'),

  password: yup
    .string()
    .required('Senha é obrigatória')
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .max(100, 'Senha deve ter no máximo 100 caracteres')
    .matches(passwordRegex.uppercase, 'Senha deve conter pelo menos uma letra maiúscula')
    .matches(passwordRegex.number, 'Senha deve conter pelo menos um número')
    .matches(passwordRegex.specialChar, 'Senha deve conter pelo menos um caractere especial'),

  confirmPassword: yup
    .string()
    .required('Confirmação de senha é obrigatória')
    .oneOf([yup.ref('password')], 'As senhas devem coincidir')
    .max(100, 'Confirmação deve ter no máximo 100 caracteres'),
});