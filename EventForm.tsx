import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventValidationSchema } from '../../utils/validations/eventValidation';
import { Event } from '../../types/event';
import { Calendar, Clock, MapPin, IndianRupee, Users, Tag } from 'lucide-react';
import { eventCategories } from './EventCategories';

interface EventFormProps {
  onSubmit: (data: Partial<Event>) => void;
  initialData?: Partial<Event>;
  isEditing?: boolean;
}

export const EventForm: React.FC<EventFormProps> = ({
  onSubmit,
  initialData,
  isEditing = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(eventValidationSchema),
    defaultValues: initialData,
  });

  const price = watch('price');
  const capacity = watch('capacity');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Event Title</label>
        <input
          type="text"
          {...register('title')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          {...register('description')}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <div className="mt-1 relative">
            <Calendar className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="date"
              {...register('date')}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Time</label>
          <div className="mt-1 relative">
            <Clock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="time"
              {...register('time')}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          {errors.time && (
            <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Location</label>
        <div className="mt-1 relative">
          <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            {...register('location')}
            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        {errors.location && (
          <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
          <div className="mt-1 relative">
            <IndianRupee className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="number"
              step="0.01"
              min="0"
              {...register('price')}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
          {price && !errors.price && (
            <p className="mt-1 text-sm text-gray-500">
              ₹{Number(price).toLocaleString('en-IN')}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Capacity</label>
          <div className="mt-1 relative">
            <Users className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="number"
              min="1"
              step="1"
              {...register('capacity')}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          {errors.capacity && (
            <p className="mt-1 text-sm text-red-600">{errors.capacity.message}</p>
          )}
          {capacity && !errors.capacity && (
            <p className="mt-1 text-sm text-gray-500">
              {Number(capacity).toLocaleString('en-IN')} attendees
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <div className="mt-1 relative">
            <Tag className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <select
              {...register('category')}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              {eventCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Image URL</label>
        <input
          type="url"
          {...register('imageUrl')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="https://example.com/image.jpg"
        />
        {errors.imageUrl && (
          <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {isEditing ? 'Update Event' : 'Create Event'}
      </button>
    </form>
  );
};