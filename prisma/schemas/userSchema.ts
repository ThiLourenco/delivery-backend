import { z } from 'zod';

export const createUserSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number should be at least 10 characters long'),
  password: z.string().min(6, 'Password should be at least 6 characters long'),
  role: z.enum(['ADMIN','CLIENT','DELIVERY_MAN']),
  address: z.object({
    street: z.string().min(1, 'Street is required'),
    number: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    country: z.string().min(1, 'Country is required'),
    zipCode: z.string().min(5, 'Zip code should be at least 5 characters long'),
  }).optional(),
})

export const updateUserSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(1, 'Username is required'),
  name: z.string().min(1, 'Username is required'),
  phone: z.string().min(1, 'Phone number should be at least 10 characters long'),
});

export const loginUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password should be at least 6 characters long'),
});