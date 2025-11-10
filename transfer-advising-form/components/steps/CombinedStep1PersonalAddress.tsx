import { DateInput, DatePickerInput } from '@mantine/dates';

export function CombinedStep1PersonalAddress({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      {/* Personal Information Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-[#840029]">Personal Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-md font-medium mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter your name as in I-20/passport"
              className="w-full p-4 mt-2 placeholder:text-gray-400 bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none"
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
              placeholder="your.email@example.com"
              className="w-full p-4 mt-2 placeholder:text-gray-400 bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none"
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
              placeholder="+1 234 567 8900"
              className="w-full p-4 mt-2 placeholder:text-gray-400 bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.values.phone}
              onChange={(e) => form.setFieldValue('phone', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-md font-medium mb-2">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <DatePickerInput
              placeholder="Select date"
              maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 15))}
              value={form.values.dateOfBirth}
              onChange={(value) => form.setFieldValue('dateOfBirth', value)}
              classNames={{
                input: 'p-4 bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none',
              }}
            />
          </div>
        </div>
      </div>

      {/* Address Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-[#840029]">Address</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-md font-medium mb-2">
              Complete Address <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Street, City, State, Zip Code"
              rows={4}
              className="w-full p-4 mt-2 placeholder:text-gray-400 bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              value={form.values.address}
              onChange={(e) => form.setFieldValue('address', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
