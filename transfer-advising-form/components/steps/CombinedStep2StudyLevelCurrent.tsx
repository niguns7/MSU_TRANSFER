export function CombinedStep2StudyLevelCurrent({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      {/* Study Level Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-[#840029]">Study Level & Prior Education</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-md font-medium mb-2">
              What is your level of study? <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full p-4 mt-2 bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.values.studyLevel}
              onChange={(e) => form.setFieldValue('studyLevel', e.target.value)}
            >
              <option value="">Select study level</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Graduate">Graduate</option>
              <option value="Associate">Associate</option>
              <option value="Certificate">Certificate</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-md font-medium mb-2">
              Name of previous University/College
            </label>
            <input
              type="text"
              placeholder="Previous institution (if any)"
              className="w-full p-4 mt-2 placeholder:text-gray-400 bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.values.previousCollege || ''}
              onChange={(e) => form.setFieldValue('previousCollege', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-md font-medium mb-2">
              Credit hours completed in previous university/college
            </label>
            <input
              type="number"
              placeholder="0"
              min="0"
              max="200"
              className="w-full p-4 mt-2 placeholder:text-gray-400 bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.values.previousCreditHours || ''}
              onChange={(e) => form.setFieldValue('previousCreditHours', e.target.value ? Number(e.target.value) : null)}
            />
          </div>
        </div>
      </div>

      {/* Current Enrollment Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-[#840029]">Current Enrollment</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-md font-medium mb-2">
              What is the current university/college name? <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Current institution"
              className="w-full p-4 mt-2 placeholder:text-gray-400 bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.values.currentCollege}
              onChange={(e) => form.setFieldValue('currentCollege', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-md font-medium mb-2">
              What is the credit hours enrolled in the current university/college? <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              placeholder="Enter credit hours"
              className="w-full p-4 mt-2 placeholder:text-gray-400 bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.values.currentCreditHours === 0 ? '' : form.values.currentCreditHours}
              onChange={(e) => form.setFieldValue('currentCreditHours', e.target.value ? Number(e.target.value) : 0)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
