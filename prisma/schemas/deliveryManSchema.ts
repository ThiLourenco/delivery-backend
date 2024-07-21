import { z } from 'zod';

export const createDeliveryManSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password should be at least 6 characters long'),
  phone: z.string().min(10, 'Phone number should be at least 10 characters long'),
  role: z.enum(['DELIVERY_MAN']),
  address: z.object({
    street: z.string().min(1, 'Street is required'),
    number: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    country: z.string().min(1, 'Country is required'),
    zipCode: z.string().min(1, 'Zip code is required'),
  }).optional(),
});

export const updateDeliveryManSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Name is required').optional(),
  phone: z.string().min(10, 'Phone number should be at least 10 characters long').optional(),
});

export const loginDeliveryManSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password should be at least 6 characters long'),
});

export const updateOrderDeliveryManSchema = z.object({
  deliveryManId: z.string().uuid(),
  orderId: z.string().uuid(),
});
