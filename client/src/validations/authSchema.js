import { z } from 'zod';


const nameField = z
  .string()
  .trim()
  .min(1, 'Name is required')
  .min(3, 'Name must be at least 3 characters')
  .max(50, 'Name cannot exceed 50 characters')
  .regex(/^[A-Za-z\s]+$/, 'Name can only contain letters and spaces');


const emailField = z
  .string()
  .trim()
  .min(1, 'Email is required')
  .email('Invalid email');

  
const passwordField = z
  .string()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters')
  .max(32, 'Password cannot exceed 32 characters')
// .regex(
//   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
//   'Password must contain uppercase, lowercase, number and special character'
// ),


export const loginSchema = z.object({
  email: emailField,
  password: passwordField,
});

export const registerSchema = z.object({
  name: nameField,
  email: emailField,
  password: passwordField,
});