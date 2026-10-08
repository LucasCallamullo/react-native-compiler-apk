// src/features/auth/utils/validateUserForm.ts
import type { UpdateUserRequest } from '../types/userTypes';

export interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  dni?: string;
  phone?: string;
}

export function validateUserForm(form: UpdateUserRequest): FormErrors {
  const errors: FormErrors = {};

  // First name: 2-100
  if (!form.firstName.trim()) {
    errors.firstName = 'El nombre es obligatorio.';
  } else if (form.firstName.trim().length < 2 || form.firstName.trim().length > 100) {
    errors.firstName = 'Debe tener entre 2 y 100 caracteres.';
  }

  // Last name: 2-100
  if (!form.lastName.trim()) {
    errors.lastName = 'El apellido es obligatorio.';
  } else if (form.lastName.trim().length < 2 || form.lastName.trim().length > 100) {
    errors.lastName = 'Debe tener entre 2 y 100 caracteres.';
  }

  // Email
  if (!form.email.trim()) {
    errors.email = 'El email es obligatorio.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Formato de email inválido.';
  } else if (form.email.trim().length > 100) {
    errors.email = 'Debe tener menos de 100 caracteres.';
  }

  // DNI: 8-12 dígitos
  if (!form.dni.trim()) {
    errors.dni = 'El DNI es obligatorio.';
  } else if (!/^[0-9]{8,12}$/.test(form.dni.trim())) {
    errors.dni = 'Debe tener entre 8 y 12 dígitos.';
  }

  // Phone: opcional, pero si viene, 7-15 dígitos
  if (form.phone && form.phone.trim()) {
    if (!/^[0-9]{7,15}$/.test(form.phone.trim())) {
      errors.phone = 'Debe tener entre 7 y 15 dígitos.';
    }
  }

  return errors;
}

export function hasErrors(errors: FormErrors): boolean {
  return Object.keys(errors).length > 0;
}