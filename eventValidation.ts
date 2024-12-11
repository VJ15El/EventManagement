import { z } from 'zod';

export const eventValidationSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  date: z.string().refine((date) => new Date(date) > new Date(), {
    message: 'Event date must be in the future',
  }),
  time: z.string(),
  location: z.string().min(5, 'Location must be at least 5 characters'),
  price: z.coerce.number({
    required_error: "Price is required",
    invalid_type_error: "Price must be a number"
  }).min(0, 'Price must be 0 or greater').max(1000000, 'Price cannot exceed ₹10,00,000'),
  category: z.string().min(1, 'Please select a category'),
  imageUrl: z.string().url('Please enter a valid image URL'),
  capacity: z.coerce.number({
    required_error: "Capacity is required",
    invalid_type_error: "Capacity must be a number"
  }).int('Capacity must be a whole number').min(1, 'Capacity must be at least 1').max(100000, 'Capacity cannot exceed 100,000'),
});