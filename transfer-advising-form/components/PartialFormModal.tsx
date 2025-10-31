'use client';

import { Modal, TextInput, Stack, Button, Checkbox } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { partialFormSchema } from '@/lib/validations';

interface Props {
  opened: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PartialFormModal({ opened, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    mode: 'uncontrolled',
    validate: zodResolver(partialFormSchema),
    initialValues: {
      formMode: 'partial' as const,
      fullName: '',
      email: '',
      phone: '',
      dateOfBirth: null,
      address: '',
      studyLevel: '',
      previousCollege: '',
      termYear: '',
      major: '',
      countryOfBirth: '',
      formDate: new Date(),
      consent: false,
    },
  });

  const handleSubmit = async (values: any) => {
    setLoading(true);

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit form');
      }

      notifications.show({
        title: 'Success!',
        message: 'Thank you! We will contact you soon.',
        color: 'green',
      });

      form.reset();
      onSuccess();
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to submit form. Please try again.',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-6">
      <div className="mb-4">
        <p className="text-lg font-medium" style={{ color: '#840029' }}>
          Please provide your name as in I-20/passport. <span className="text-red-500">*</span>
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Enter Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="..."
            className="w-full px-4 py-3 bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none"
            {...form.getInputProps('fullName')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="Enter email"
            className="w-full px-4 py-3 bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none"
            {...form.getInputProps('email')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            placeholder="Enter Name"
            className="w-full px-4 py-3 bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none"
            {...form.getInputProps('phone')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Date Of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            placeholder="Enter DOB"
            className="w-full px-4 py-3 bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none"
            {...form.getInputProps('dateOfBirth')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Complete address (Street, Zip code, State) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter address"
            className="w-full px-4 py-3 bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none"
            {...form.getInputProps('address')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Study Level <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter study Level"
            className="w-full px-4 py-3 bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none"
            {...form.getInputProps('studyLevel')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Previous College <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter study Level"
            className="w-full px-4 py-3 bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none"
            {...form.getInputProps('previousCollege')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Term <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter study Level"
            className="w-full px-4 py-3 bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none"
            {...form.getInputProps('termYear')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Major <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter your Major"
            className="w-full px-4 py-3 bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none"
            {...form.getInputProps('major')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Country Of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter your Birth Country"
            className="w-full px-4 py-3 bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none"
            {...form.getInputProps('countryOfBirth')}
          />
        </div>
      </div>

      <div className="flex justify-between items-center mt-8 pt-6 border-t">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 font-bold text-white rounded-lg transition-all"
          style={{
            background: '#840029',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
        
        <button
          type="button"
          onClick={() => form.reset()}
          className="px-8 py-3 font-medium text-blue-600 hover:text-blue-800 transition-all"
        >
          Clear Form
        </button>
      </div>
    </form>
  );

  // If opened as modal, wrap in Modal component
  if (opened) {
    return (
      <div className="w-full">
        {formContent}
      </div>
    );
  }

  return null;
}
