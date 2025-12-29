import * as yup from 'yup';

export const signupSchema = yup.object().shape({
  name: yup
    .string()
    .required('Nome é obrigatório')
    .min(1, 'Nome deve ter no mínimo 1 caractere')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .matches(/^[^\s]+$/, 'O nome de usuário não pode conter espaços'),

  email: yup
    .string()
    .required('Email é obrigatório')
    .email('Email inválido')
    .matches(/^[^@\s]+@[^@\s]+\.[^@\s]+$/, 'Email inválido')
    .max(255, 'Email deve ter no máximo 255 caracteres'),

  password: yup
    .string()
    .required('Senha é obrigatória')
    .test('password-requirements', function (value) {
      const errors = [];
      if (!value) return this.createError({ message: 'Senha é obrigatória' });

      if (value.length < 6) {
        errors.push('no mínimo 6 caracteres');
      }
      if (!/[A-Z]/.test(value)) {
        errors.push('uma letra maiúscula');
      }
      if (!/\d/.test(value)) {
        errors.push('um número');
      }
      if (!/[\W_]/.test(value)) {
        errors.push('um caractere especial');
      }

      if (errors.length > 0) {
        return this.createError({
          message: `A senha deve conter ${errors.join(', ')}`,
        });
      }

      return true;
    })
    .max(100, 'Senha deve ter no máximo 100 caracteres'),

  confirmPassword: yup
    .string()
    .required('Confirmação de senha é obrigatória')
    .oneOf([yup.ref('password')], 'As senhas devem coincidir')
    .max(100, 'Confirmação deve ter no máximo 100 caracteres'),
});