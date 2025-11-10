export function CombinedStep3MajorAcademics({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      {/* Major Plan Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-[#840029]">Major Plan</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-md font-medium mb-2">
              What is your major? <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Your major"
              className="w-full p-4 mt-2 placeholder:text-gray-400 bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.values.major}
              onChange={(e) => form.setFieldValue('major', e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-3 p-4 bg-gray-100 rounded">
            <input
              type="checkbox"
              id="switchingMajor"
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              checked={form.values.switchingMajor}
              onChange={(e) => form.setFieldValue('switchingMajor', e.target.checked)}
            />
            <label htmlFor="switchingMajor" className="text-md font-medium cursor-pointer">
              Are you planning to switch major?
            </label>
          </div>

          {form.values.switchingMajor && (
            <div>
              <label className="block text-md font-medium mb-2">
                If you are planning to switch, what will be that major and why? <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Explain your reasons for switching major"
                rows={3}
                className="w-full p-4 mt-2 placeholder:text-gray-400 bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                value={form.values.switchMajorDetails}
                onChange={(e) => form.setFieldValue('switchMajorDetails', e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Academics Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-[#840029]">Academics, GPA & Tuition</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-md font-medium mb-2">
              What is your GPA in the previous university/college? <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              placeholder="Enter GPA (e.g., 3.50)"
              min="0"
              max="4.0"
              step="0.01"
              className="w-full p-4 mt-2 placeholder:text-gray-400 bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.values.previousGPA === 0 ? '' : form.values.previousGPA}
              onChange={(e) => form.setFieldValue('previousGPA', e.target.value ? Number(e.target.value) : 0)}
            />
          </div>

          <div>
            <label className="block text-md font-medium mb-2">
              What GPA are you expecting to get by the end of this term? <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              placeholder="Enter expected GPA (e.g., 3.75)"
              min="0"
              max="4.0"
              step="0.01"
              className="w-full p-4 mt-2 placeholder:text-gray-400 bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.values.expectedGPA === 0 ? '' : form.values.expectedGPA}
              onChange={(e) => form.setFieldValue('expectedGPA', e.target.value ? Number(e.target.value) : 0)}
            />
          </div>

          <div>
            <label className="block text-md font-medium mb-2">
              What is the tuition fee of previous University/College?
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-medium">$</span>
              <input
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full p-4 pl-8 mt-2 placeholder:text-gray-400 bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none"
                value={form.values.previousTuition || ''}
                onChange={(e) => form.setFieldValue('previousTuition', e.target.value ? Number(e.target.value) : null)}
              />
            </div>
          </div>

          <div>
            <label className="block text-md font-medium mb-2">
              What is the tuition fee of the current university/College? <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-medium">$</span>
              <input
                type="number"
                placeholder="Enter tuition fee"
                min="0"
                step="0.01"
                className="w-full p-4 pl-8 mt-2 placeholder:text-gray-400 bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none"
                value={form.values.currentTuition === 0 ? '' : form.values.currentTuition}
                onChange={(e) => form.setFieldValue('currentTuition', e.target.value ? Number(e.target.value) : 0)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-gray-100 rounded">
            <input
              type="checkbox"
              id="hasScholarship"
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              checked={form.values.hasScholarship}
              onChange={(e) => form.setFieldValue('hasScholarship', e.target.checked)}
            />
            <label htmlFor="hasScholarship" className="text-md font-medium cursor-pointer">
              Do you have scholarships?
            </label>
          </div>

          {form.values.hasScholarship && (
            <div>
              <label className="block text-md font-medium mb-2">
                Scholarship amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-medium">$</span>
                <input
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full p-4 pl-8 mt-2 placeholder:text-gray-400 bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none"
                  value={form.values.scholarshipAmount || ''}
                  onChange={(e) => form.setFieldValue('scholarshipAmount', e.target.value ? Number(e.target.value) : null)}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-md font-medium mb-2">
              How much you are paying per semester? <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-medium">$</span>
              <input
                type="number"
                placeholder="Enter amount per semester"
                min="0"
                step="0.01"
                className="w-full p-4 pl-8 mt-2 placeholder:text-gray-400 bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-500 outline-none"
                value={form.values.payingPerSemester === 0 ? '' : form.values.payingPerSemester}
                onChange={(e) => form.setFieldValue('payingPerSemester', e.target.value ? Number(e.target.value) : 0)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
