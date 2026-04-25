export const validators = {
    // Validar email
    validateEmail: (email) => {
      if (!email.includes('@')) {
        return 'El email debe contener @';
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return 'Email inválido';
      }
      return null;
    },
  
    // Validar contraseña
    validatePassword: (password) => {
      if (password.length < 8) {
        return 'La contraseña debe tener al menos 8 caracteres';
      }
      if (!/[A-Z]/.test(password)) {
        return 'La contraseña debe tener al menos una mayúscula';
      }
      if (!/[a-z]/.test(password)) {
        return 'La contraseña debe tener al menos una minúscula';
      }
      if (!/[0-9]/.test(password)) {
        return 'La contraseña debe tener al menos un número';
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return 'La contraseña debe tener al menos un carácter especial';
      }
      return null;
    },
  
    // Validar que las contraseñas coincidan
    validatePasswordMatch: (password, confirmPassword) => {
      if (password !== confirmPassword) {
        return 'Las contraseñas no coinciden';
      }
      return null;
    },
  
    // Validar campo requerido
    validateRequired: (value, fieldName) => {
      if (!value || value.trim() === '') {
        return `${fieldName} es requerido`;
      }
      return null;
    }
  };