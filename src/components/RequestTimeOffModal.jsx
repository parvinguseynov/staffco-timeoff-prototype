import { useState, useEffect } from 'react';

const RequestTimeOffModal = ({ onClose, onSubmit, balances }) => {
  const [formData, setFormData] = useState({
    category: 'Vacation',
    startDate: '',
    endDate: '',
    note: '',
  });

  const [workingDays, setWorkingDays] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [futureBalance, setFutureBalance] = useState(null);
  const [hasNegativeBalance, setHasNegativeBalance] = useState(false);
  const [advanceNoticeWarning, setAdvanceNoticeWarning] = useState(null);
  const [startIsPartial, setStartIsPartial] = useState(false);
  const [endIsPartial, setEndIsPartial] = useState(false);
  const [startPartialHours, setStartPartialHours] = useState(4);
  const [endPartialHours, setEndPartialHours] = useState(4);

  // Hours per work day (from Company Settings)
  const hoursPerWorkDay = 8;

  // Mock advance notice rules (in real app, would come from company settings)
  const advanceNoticeRules = [
    { from: 1, to: 3, notice: 14 },
    { from: 4, to: 5, notice: 28 },
    { from: 6, to: null, notice: 60 }, // null means "more than"
  ];
  const sickLeaveExempt = true;

  const categories = [
    { id: 'Vacation', name: 'Vacation', icon: '🏖️' },
    { id: 'Sick Leave', name: 'Sick Leave', icon: '🏥' },
    { id: 'Personal Leave', name: 'Personal Leave', icon: '📋' },
  ];

  const selectedBalance = balances.find((b) => b.type === formData.category);

  // Calculate working days between two dates (excluding weekends)
  const calculateWorkingDays = (start, end) => {
    if (!start || !end) return 0;

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (startDate > endDate) return 0;

    let count = 0;
    const current = new Date(startDate);

    while (current <= endDate) {
      const dayOfWeek = current.getDay();
      // 0 = Sunday, 6 = Saturday
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }

    return count;
  };

  // Calculate total hours accounting for partial days
  const calculateTotalHours = (start, end, startPartial, endPartial, startHours, endHours) => {
    if (!start || !end) return 0;

    const startDate = new Date(start);
    const endDate = new Date(end);
    const isSameDay = startDate.getTime() === endDate.getTime();

    if (isSameDay) {
      // Single day request
      return startPartial ? startHours : hoursPerWorkDay;
    }

    // Multi-day request
    const fullDays = calculateWorkingDays(start, end);
    let totalHours = fullDays * hoursPerWorkDay;

    // Adjust for partial start day
    if (startPartial) {
      totalHours = totalHours - hoursPerWorkDay + startHours;
    }

    // Adjust for partial end day
    if (endPartial && !isSameDay) {
      totalHours = totalHours - hoursPerWorkDay + endHours;
    }

    return totalHours;
  };

  // Effect to calculate working days and future balance
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const hours = calculateTotalHours(
        formData.startDate,
        formData.endDate,
        startIsPartial,
        endIsPartial,
        startPartialHours,
        endPartialHours
      );
      const days = hours / hoursPerWorkDay;

      setTotalHours(hours);
      setWorkingDays(days);

      // Calculate future balance
      if (selectedBalance && typeof selectedBalance.available === 'number') {
        const future = selectedBalance.available - days;
        setFutureBalance(future);
        setHasNegativeBalance(future < 0);
      } else {
        setFutureBalance(null);
        setHasNegativeBalance(false);
      }

      // Check advance notice requirements
      if (formData.category === 'Sick Leave' && sickLeaveExempt) {
        setAdvanceNoticeWarning(null);
      } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(formData.startDate);
        startDate.setHours(0, 0, 0, 0);

        const daysBetween = Math.ceil((startDate - today) / (1000 * 60 * 60 * 24));

        // Find matching rule
        let matchingRule = null;
        for (const rule of advanceNoticeRules) {
          if (rule.to === null && days >= rule.from) {
            matchingRule = rule;
            break;
          } else if (days >= rule.from && days <= rule.to) {
            matchingRule = rule;
            break;
          }
        }

        if (matchingRule && daysBetween < matchingRule.notice) {
          const durationText = matchingRule.to === null
            ? `${matchingRule.from}+ day requests`
            : `${matchingRule.from}-${matchingRule.to} day requests`;

          setAdvanceNoticeWarning({
            required: matchingRule.notice,
            actual: daysBetween,
            durationText,
          });
        } else {
          setAdvanceNoticeWarning(null);
        }
      }
    } else {
      setWorkingDays(0);
      setTotalHours(0);
      setFutureBalance(null);
      setHasNegativeBalance(false);
      setAdvanceNoticeWarning(null);
    }
  }, [formData.startDate, formData.endDate, formData.category, selectedBalance, startIsPartial, endIsPartial, startPartialHours, endPartialHours]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const request = {
      id: Date.now(),
      dateRequested: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      type: formData.category,
      dates:
        formData.startDate === formData.endDate
          ? new Date(formData.startDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          : `${new Date(formData.startDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })} - ${new Date(formData.endDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}`,
      duration: totalHours === hoursPerWorkDay ? '1 day' : `${workingDays} day${workingDays !== 1 ? 's' : ''} (${totalHours} hours)`,
      status: 'Pending',
      note: formData.note,
    };

    onSubmit(request);
  };

  const isFormValid =
    formData.category &&
    formData.startDate &&
    formData.endDate &&
    workingDays > 0;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-modalBackdrop"
        onClick={onClose}
      >
        {/* Modal Container */}
        <div
          className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col animate-modalSlideUp"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-900">
              Request Time Off
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
              <div className="space-y-5">
                {/* Time Off Type */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Time Off Type
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                  {selectedBalance && (
                    <p className="text-sm text-gray-500 mt-1">
                      {typeof selectedBalance.available === 'number'
                        ? `Available: ${selectedBalance.available} days`
                        : '(Unpaid)'}
                    </p>
                  )}
                </div>

                {/* Start Date */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />

                  {/* Start Date Type Toggle */}
                  <div className="mt-3 space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="startDayType"
                        checked={!startIsPartial}
                        onChange={() => setStartIsPartial(false)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Full day</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="startDayType"
                        checked={startIsPartial}
                        onChange={() => setStartIsPartial(true)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Partial day</span>
                    </label>

                    {/* Partial Hours Input */}
                    {startIsPartial && (
                      <div className="ml-6 flex items-center gap-2 mt-2">
                        <span className="text-sm text-gray-600">Hours:</span>
                        <input
                          type="number"
                          value={startPartialHours}
                          onChange={(e) => setStartPartialHours(Math.min(hoursPerWorkDay, Math.max(0.5, parseFloat(e.target.value) || 0)))}
                          className="w-20 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="0.5"
                          max={hoursPerWorkDay}
                          step="0.5"
                        />
                        <span className="text-sm text-gray-600">hours (out of {hoursPerWorkDay})</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* End Date */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleChange('endDate', e.target.value)}
                    min={formData.startDate}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />

                  {/* End Date Type Toggle (only show if different from start date) */}
                  {formData.startDate && formData.endDate && formData.startDate !== formData.endDate && (
                    <div className="mt-3 space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="endDayType"
                          checked={!endIsPartial}
                          onChange={() => setEndIsPartial(false)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Full day</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="endDayType"
                          checked={endIsPartial}
                          onChange={() => setEndIsPartial(true)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Partial day</span>
                      </label>

                      {/* Partial Hours Input */}
                      {endIsPartial && (
                        <div className="ml-6 flex items-center gap-2 mt-2">
                          <span className="text-sm text-gray-600">Hours:</span>
                          <input
                            type="number"
                            value={endPartialHours}
                            onChange={(e) => setEndPartialHours(Math.min(hoursPerWorkDay, Math.max(0.5, parseFloat(e.target.value) || 0)))}
                            className="w-20 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min="0.5"
                            max={hoursPerWorkDay}
                            step="0.5"
                          />
                          <span className="text-sm text-gray-600">hours</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Advance Notice Warning */}
                {advanceNoticeWarning && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <span className="text-amber-600 text-lg">⚠️</span>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-amber-800 mb-2">
                          Advance Notice Warning
                        </h4>
                        <p className="text-sm text-amber-800 mb-2">
                          Your company requires {advanceNoticeWarning.required} days notice for{' '}
                          {advanceNoticeWarning.durationText}. You are submitting with only{' '}
                          {advanceNoticeWarning.actual} days notice.
                        </p>
                        <p className="text-sm text-amber-800">
                          You can still submit, but your manager will be notified of the policy
                          exception.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Summary Card */}
                {workingDays > 0 && futureBalance !== null && (
                  <div className="bg-gray-50 rounded-lg p-4 mt-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-700">Duration:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {workingDays} working day{workingDays !== 1 ? 's' : ''} ({totalHours} hours)
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">Balance after:</span>
                      <span className={`text-sm font-medium ${futureBalance >= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {futureBalance.toFixed(1)} days
                      </span>
                    </div>
                  </div>
                )}

                {/* Note */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Note (optional)
                  </label>
                  <textarea
                    value={formData.note}
                    onChange={(e) => handleChange('note', e.target.value)}
                    placeholder="Add a note for your manager..."
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Warning State */}
            {hasNegativeBalance && futureBalance !== null && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mx-6 mb-4">
                <p className="text-amber-800 text-sm">
                  ⚠️ This will put your balance at {futureBalance} days
                </p>
              </div>
            )}

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
                disabled={!isFormValid}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {advanceNoticeWarning ? 'Submit Anyway' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RequestTimeOffModal;
