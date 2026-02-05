import { useState } from 'react';

const COUNTRY_HOLIDAYS = {
  Azerbaijan: [
    { date: '2025-01-01', name: 'New Year' },
    { date: '2025-01-02', name: 'New Year Holiday' },
    { date: '2025-03-08', name: "International Women's Day" },
    { date: '2025-03-20', name: 'Novruz Holiday' },
    { date: '2025-03-21', name: 'Novruz Holiday' },
    { date: '2025-03-22', name: 'Novruz Holiday' },
    { date: '2025-03-23', name: 'Novruz Holiday' },
    { date: '2025-03-24', name: 'Novruz Holiday' },
    { date: '2025-05-09', name: 'Victory Day' },
    { date: '2025-05-28', name: 'Republic Day' },
    { date: '2025-06-15', name: 'National Salvation Day' },
    { date: '2025-06-26', name: 'Armed Forces Day' },
    { date: '2025-11-09', name: 'Flag Day' },
    { date: '2025-12-31', name: 'Solidarity Day' },
  ],
  'United States': [
    { date: '2025-01-01', name: "New Year's Day" },
    { date: '2025-01-20', name: 'Martin Luther King Jr. Day' },
    { date: '2025-02-17', name: "Presidents' Day" },
    { date: '2025-05-26', name: 'Memorial Day' },
    { date: '2025-07-04', name: 'Independence Day' },
    { date: '2025-09-01', name: 'Labor Day' },
    { date: '2025-10-13', name: 'Columbus Day' },
    { date: '2025-11-11', name: 'Veterans Day' },
    { date: '2025-11-27', name: 'Thanksgiving Day' },
    { date: '2025-12-25', name: 'Christmas Day' },
  ],
  'United Kingdom': [
    { date: '2025-01-01', name: "New Year's Day" },
    { date: '2025-04-18', name: 'Good Friday' },
    { date: '2025-04-21', name: 'Easter Monday' },
    { date: '2025-05-05', name: 'Early May Bank Holiday' },
    { date: '2025-05-26', name: 'Spring Bank Holiday' },
    { date: '2025-08-25', name: 'Summer Bank Holiday' },
    { date: '2025-12-25', name: 'Christmas Day' },
    { date: '2025-12-26', name: 'Boxing Day' },
  ],
  Germany: [
    { date: '2025-01-01', name: "New Year's Day" },
    { date: '2025-04-18', name: 'Good Friday' },
    { date: '2025-04-21', name: 'Easter Monday' },
    { date: '2025-05-01', name: 'Labour Day' },
    { date: '2025-05-29', name: 'Ascension Day' },
    { date: '2025-06-09', name: 'Whit Monday' },
    { date: '2025-10-03', name: 'German Unity Day' },
    { date: '2025-12-25', name: 'Christmas Day' },
    { date: '2025-12-26', name: 'Boxing Day' },
  ],
};

const AddHolidayCalendarModal = ({ onClose, onSave, editingCalendar }) => {
  const [formData, setFormData] = useState({
    name: editingCalendar?.name || '',
    country: editingCalendar?.country || 'Azerbaijan',
    year: '2025',
  });
  const [holidays, setHolidays] = useState(
    editingCalendar ? [...COUNTRY_HOLIDAYS[editingCalendar.country] || []] : [...COUNTRY_HOLIDAYS.Azerbaijan]
  );
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });

    // Update holidays when country changes
    if (field === 'country' && COUNTRY_HOLIDAYS[value]) {
      setHolidays([...COUNTRY_HOLIDAYS[value]]);
    } else if (field === 'country' && value === 'Other') {
      setHolidays([]);
    }

    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const handleHolidayChange = (index, field, value) => {
    const newHolidays = [...holidays];
    newHolidays[index] = { ...newHolidays[index], [field]: value };
    setHolidays(newHolidays);
  };

  const handleAddHoliday = () => {
    setHolidays([...holidays, { date: '', name: '' }]);
  };

  const handleDeleteHoliday = (index) => {
    setHolidays(holidays.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Calendar name is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      ...formData,
      holidays: holidays.filter((h) => h.date && h.name),
    });
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-modalBackdrop"
        onClick={onClose}
      >
        {/* Modal Container */}
        <div
          className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col animate-modalSlideUp"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-900">
              {editingCalendar ? 'Edit Holiday Calendar' : 'Add Holiday Calendar'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
            {/* Modal Body */}
            <div className="px-6 py-4 overflow-y-auto flex-1">
              <div className="space-y-6">
                {/* Calendar Name */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label className="text-sm font-medium text-gray-900 pt-2">
                    Calendar Name
                  </label>
                  <div className="col-span-2">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Azerbaijan 2025"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                </div>

                {/* Country/Region */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label className="text-sm font-medium text-gray-900 pt-2">
                    Country/Region
                  </label>
                  <div className="col-span-2">
                    <select
                      value={formData.country}
                      onChange={(e) => handleChange('country', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Azerbaijan">Azerbaijan</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Germany">Germany</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Year */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label className="text-sm font-medium text-gray-900 pt-2">
                    Year
                  </label>
                  <div className="col-span-2">
                    <select
                      value={formData.year}
                      onChange={(e) => handleChange('year', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="2024">2024</option>
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                    </select>
                  </div>
                </div>

                {/* Holidays Section */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-900">Holidays</h3>
                    <button
                      type="button"
                      onClick={handleAddHoliday}
                      className="text-blue-600 text-sm font-medium hover:text-blue-700"
                    >
                      + Add Holiday
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {holidays.map((holiday, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <input
                          type="date"
                          value={holiday.date}
                          onChange={(e) =>
                            handleHolidayChange(index, 'date', e.target.value)
                          }
                          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="text"
                          value={holiday.name}
                          onChange={(e) =>
                            handleHolidayChange(index, 'name', e.target.value)
                          }
                          placeholder="Holiday name"
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteHoliday(index)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <svg
                            className="w-5 h-5 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}

                    {holidays.length === 0 && (
                      <p className="text-gray-500 text-sm text-center py-4">
                        No holidays added yet. Click "+ Add Holiday" to add one.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 hover:scale-105 active:scale-95"
              >
                {editingCalendar ? 'Save Changes' : 'Save Calendar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddHolidayCalendarModal;
