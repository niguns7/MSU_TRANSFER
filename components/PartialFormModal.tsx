'use client';

import { useRouter } from 'next/navigation';
import { Modal, TextInput, Stack, Button, Checkbox } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';

interface Props {
  opened: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PartialFormModal({ opened, onClose, onSuccess }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    validateInputOnBlur: true,
    initialValues: {
      formMode: 'partial' as const,
      fullName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      address: '',
      studyLevel: '',
      previousCollege: '',
      termSeason: '',
      major: '',
      countryOfBirth: '',
      formDate: new Date(),
      consent: false,
    },
  });

  const handleSubmit = async (values: any) => {
    console.log('PartialForm - handleSubmit called with values:', values);
    setLoading(true);

    try {
      // Convert dateOfBirth string to Date object if present
      const submissionData = {
        ...values,
        dateOfBirth: values.dateOfBirth ? new Date(values.dateOfBirth) : null,
      };
      
      console.log('PartialForm - Sending POST request with data:', submissionData);
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();
      console.log('PartialForm - Response:', data);

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
      
      // Redirect to success page
      router.push('/success');
    } catch (error: any) {
      console.error('PartialForm - Submission error:', error);
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


      <div className="space-y-4">
        <div>
          <label className="block text-md font-medium mb-2">
            Enter Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter Name"
            className="w-full p-4 mt-2 placeholder:text-black bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none"
            value={form.values.fullName}
            onChange={(e) => form.setFieldValue('fullName', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-md font-medium mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="Enter email"
            className="w-full p-4 mt-2 placeholder:text-black bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none"
            value={form.values.email}
            onChange={(e) => form.setFieldValue('email', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-md font-medium mb-2">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            placeholder="Enter Phone"
            className="w-full p-4 mt-2 placeholder:text-black bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none"
            value={form.values.phone}
            onChange={(e) => form.setFieldValue('phone', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-md font-medium mb-2">
            Date Of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            placeholder="Enter DOB"
            className="w-full p-4 mt-2 placeholder:text-black bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none"
            value={form.values.dateOfBirth || ''}
            onChange={(e) => form.setFieldValue('dateOfBirth', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-md font-medium mb-2">
            Complete address (Street, Zip code, State) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter address"
            className="w-full p-4 mt-2 placeholder:text-black bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none"
            value={form.values.address}
            onChange={(e) => form.setFieldValue('address', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-md font-medium mb-2">
            Study Level <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full p-4 mt-2 bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none"
            value={form.values.studyLevel}
            onChange={(e) => form.setFieldValue('studyLevel', e.target.value)}
          >
            <option value="">Select Study Level</option>
            <option value="Freshman">Freshman</option>
            <option value="Undergraduate">Undergraduate</option>
            <option value="Graduate">Graduate</option>
            <option value="InternationalTransfer">International Transfer</option>
          </select>
        </div>

        <div>
          <label className="block text-md font-medium mb-2">
            Previous College <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter Previous College"
            className="w-full p-4 mt-2 placeholder:text-black bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none"
            value={form.values.previousCollege}
            onChange={(e) => form.setFieldValue('previousCollege', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-md font-medium mb-2">
            What is your intended term for transfer? <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full p-4 mt-2 bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none"
            value={form.values.termSeason}
            onChange={(e) => form.setFieldValue('termSeason', e.target.value)}
          >
            <option value="">Select Term</option>
            <option value="Fall">Fall</option>
            <option value="Spring">Spring</option>
          </select>
        </div>

        <div>
          <label className="block text-md font-medium mb-2">
            Major <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter your Major"
            className="w-full p-4 mt-2 placeholder:text-black bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none"
            value={form.values.major}
            onChange={(e) => form.setFieldValue('major', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-md font-medium mb-2">
            Country Of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter your Birth Country"
            className="w-full p-4 mt-2 placeholder:text-black bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none"
            value={form.values.countryOfBirth}
            onChange={(e) => form.setFieldValue('countryOfBirth', e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-between items-center mt-8 pt-6 border-t">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 font-bold text-white rounded-lg transition-all cursor-pointer"
          style={{
            background: '#840029',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Submitting...' : 'Check Your Eligibility'}
        </button>
        
        <label
          onClick={() => form.reset()}
          className="text-md text-red-800"
        >
          Clear Form
        </label>
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
