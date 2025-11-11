export function CombinedStep5ImmigrationContact({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      {/* Immigration Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-[#840029]">Immigration & Special Circumstances</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-md font-medium mb-2">
              Immigration status <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="F-1, J-1, H-4, PR, Citizen, etc."
              className="w-full p-4 mt-2 placeholder:text-gray-400 bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.values.immigrationStatus}
              onChange={(e) => form.setFieldValue('immigrationStatus', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-md font-medium mb-2">
              Do you have any special circumstances to mention? <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Enter 'None' if not applicable"
              rows={4}
              className="w-full p-4 mt-2 placeholder:text-gray-400 bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              value={form.values.specialCircumstances}
              onChange={(e) => form.setFieldValue('specialCircumstances', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Communication Preferences Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-[#840029]">Referral & Communication Preferences</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-md font-medium mb-2">
              Are you referred by someone?
            </label>
            <input
              type="text"
              placeholder="Referrer name (optional)"
              className="w-full p-4 mt-2 placeholder:text-gray-400 bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.values.referredBy || ''}
              onChange={(e) => form.setFieldValue('referredBy', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-md font-medium mb-2">
              How did you know about us?
            </label>
            <input
              type="text"
              placeholder="Optional"
              className="w-full p-4 mt-2 placeholder:text-gray-400 bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.values.howDidYouKnow || ''}
              onChange={(e) => form.setFieldValue('howDidYouKnow', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-md font-medium mb-2">
              Please provide the link for your preferred channel <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="https://facebook.com/yourprofile"
              className="w-full p-4 mt-2 placeholder:text-gray-400 bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.values.preferredChannelLink}
              onChange={(e) => form.setFieldValue('preferredChannelLink', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-md font-medium mb-2">
              What communication channel do you prefer? <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full p-4 mt-2 bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.values.preferredChannel}
              onChange={(e) => form.setFieldValue('preferredChannel', e.target.value)}
            >
              <option value="">Select channel</option>
              <option value="Facebook">Facebook</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Whatsapp">Whatsapp</option>
              <option value="Instagram">Instagram</option>
              <option value="Twitter">Twitter</option>
              <option value="Email">Email</option>
              <option value="Phone">Phone</option>
            </select>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-gray-100 rounded">
            <input
              type="checkbox"
              id="consent"
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              checked={form.values.consent}
              onChange={(e) => form.setFieldValue('consent', e.target.checked)}
            />
            <label htmlFor="consent" className="text-md font-medium cursor-pointer">
              I consent to be contacted regarding my transfer application
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
