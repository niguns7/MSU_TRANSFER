export function CombinedStep4TransferMotivation({ form }: { form: any }) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 4 }, (_, i) => String(currentYear + i));

  return (
    <div className="space-y-6">
      {/* Transfer Destination Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-[#840029]">Transfer Destination & Timing</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-md font-medium mb-2">
              Name of the intended University/College to transfer?
            </label>
            <input
              type="text"
              placeholder="Intended institution"
              className="w-full p-4 mt-2 placeholder:text-gray-400 bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.values.intendedCollege || ''}
              onChange={(e) => form.setFieldValue('intendedCollege', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-md font-medium mb-2">
              Credit hours you are planning to complete by the term you want to transfer <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              placeholder="Enter planned credit hours"
              min="0"
              max="200"
              className="w-full p-4 mt-2 placeholder:text-gray-400 bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.values.plannedCreditHours === 0 ? '' : form.values.plannedCreditHours}
              onChange={(e) => form.setFieldValue('plannedCreditHours', e.target.value ? Number(e.target.value) : 0)}
            />
          </div>

          <div>
            <label className="block text-md font-medium mb-2">
              What is the year of the intended term to transfer? <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full p-4 mt-2 bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.values.termYear}
              onChange={(e) => form.setFieldValue('termYear', e.target.value)}
            >
              <option value="">Select year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-md font-medium mb-2">
              What is your intended term to transfer? <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full p-4 mt-2 bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.values.termSeason}
              onChange={(e) => form.setFieldValue('termSeason', e.target.value)}
            >
              <option value="">Select term</option>
              <option value="Fall">Fall</option>
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Motivation Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-[#840029]">Motivation & Profile Highlights</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-md font-medium mb-2">
              Why are you planning to transfer? <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Explain your reasons for transferring"
              rows={4}
              className="w-full p-4 mt-2 placeholder:text-gray-400 bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              value={form.values.transferReason}
              onChange={(e) => form.setFieldValue('transferReason', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-md font-medium mb-2">
              Why are you choosing this institution for transfer? <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Explain why this institution"
              rows={4}
              className="w-full p-4 mt-2 placeholder:text-gray-400 bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              value={form.values.institutionReason}
              onChange={(e) => form.setFieldValue('institutionReason', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-md font-medium mb-2">
              Do you have any extracurricular activities, volunteer experience, or awards?
            </label>
            <textarea
              placeholder="List your achievements"
              rows={3}
              className="w-full p-4 mt-2 placeholder:text-gray-400 bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              value={form.values.extracurriculars || ''}
              onChange={(e) => form.setFieldValue('extracurriculars', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
