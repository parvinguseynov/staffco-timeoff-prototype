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

  // Hours mode: 'full', 'partial-edges', 'partial-same'
  const [hoursMode, setHoursMode] = useState('full');
  const [firstDayHours, setFirstDayHours] = useState(4);
  const [lastDayHours, setLastDayHours] = useState(4);
  const [sameHoursPerDay, setSameHoursPerDay] = useState(4);
  const [dayBreakdown, setDayBreakdown] = useState([]);

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

  // Generate day-by-day breakdown
  const generateDayBreakdown = (start, end, mode, firstHours, lastHours, sameHours) => {
    if (!start || !end) return [];

    const breakdown = [];
    const startDate = new Date(start);
    const endDate = new Date(end);
    const current = new Date(startDate);
    let workingDayIndex = 0;
    const totalWorkingDays = calculateWorkingDays(start, end);

    while (current <= endDate) {
      const dayOfWeek = current.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      const dayName = current.toLocaleDateString('en-US', { weekday: 'short' });
      const dateStr = current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      if (isWeekend) {
        breakdown.push({
          date: `${dayName} ${dateStr}`,
          hours: 0,
          isWeekend: true,
        });
      } else {
        let hours = hoursPerWorkDay;

        if (mode === 'full') {
          hours = hoursPerWorkDay;
        } else if (mode === 'partial-edges') {
          const isSameDay = start === end;
          if (isSameDay) {
            hours = firstHours;
          } else if (workingDayIndex === 0) {
            hours = firstHours;
          } else if (workingDayIndex === totalWorkingDays - 1) {
            hours = lastHours;
          } else {
            hours = hoursPerWorkDay;
          }
        } else if (mode === 'partial-same') {
          hours = sameHours;
        }

        breakdown.push({
          date: `${dayName} ${dateStr}`,
          hours,
          isWeekend: false,
        });

        workingDayIndex++;
      }

      current.setDate(current.getDate() + 1);
    }

    return breakdown;
  };

  // Calculate duration based on mode
  const calculateDuration = (start, end, mode, firstHours, lastHours, sameHours) => {
    if (!start || !end) return { days: 0, hours: 0, breakdown: [] };

    const breakdown = generateDayBreakdown(start, end, mode, firstHours, lastHours, sameHours);
    const totalHours = breakdown.reduce((sum, day) => sum + (day.isWeekend ? 0 : day.hours), 0);
    const days = totalHours / hoursPerWorkDay;

    return { days, hours: totalHours, breakdown };
  };

  // Effect to calculate working days and future balance
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const { days, hours, breakdown } = calculateDuration(
        formData.startDate,
        formData.endDate,
        hoursMode,
        firstDayHours,
        lastDayHours,
        sameHoursPerDay
      );

      setTotalHours(hours);
      setWorkingDays(days);
      setDayBreakdown(breakdown);

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
      setDayBreakdown([]);
      setFutureBalance(null);
      setHasNegativeBalance(false);
      setAdvanceNoticeWarning(null);
    }
  }, [formData.startDate, formData.endDate, formData.category, selectedBalance, hoursMode, firstDayHours, lastDayHours, sameHoursPerDay]);

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
      duration: workingDays === 1 ? '1 day' : `${workingDays.toFixed(1)} day${workingDays !== 1 ? 's' : ''} (${totalHours} hours)`,
      status: 'Pending',
      note: formData.note,
    };

    onSubmit(request);
  };

  const isFormValid =
    formData.category &&
    formData.startDate &&
    formData.endDate &&
    totalHours > 0;

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

                {/* Date Range */}
                <div className="grid grid-cols-2 gap-4">
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
                  </div>
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
                  </div>
                </div>

                {/* Hours per day */}
                {formData.startDate && formData.endDate && (
                  <div className="border-t border-gray-200 pt-4">
                    <label className="text-sm font-medium text-gray-900 mb-3 block">
                      Hours per day:
                    </label>

                    <div className="space-y-3">
                      {/* Mode 1: Full days */}
                      <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border-2 border-transparent hover:border-blue-100 hover:bg-blue-50/50 transition-colors">
                        <input
                          type="radio"
                          name="hoursMode"
                          value="full"
                          checked={hoursMode === 'full'}
                          onChange={(e) => setHoursMode(e.target.value)}
                          className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">Full days</div>
                          <div className="text-xs text-gray-500 mt-0.5">{hoursPerWorkDay} hours each day</div>
                        </div>
                      </label>

                      {/* Mode 2: Partial - first and last day only */}
                      <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border-2 border-transparent hover:border-blue-100 hover:bg-blue-50/50 transition-colors">
                        <input
                          type="radio"
                          name="hoursMode"
                          value="partial-edges"
                          checked={hoursMode === 'partial-edges'}
                          onChange={(e) => setHoursMode(e.target.value)}
                          className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">Partial - first and last day only</div>
                          <div className="text-xs text-gray-500 mt-0.5">Full days in between, partial on edges</div>
                          {hoursMode === 'partial-edges' && (
                            <div className="mt-3 grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs text-gray-600 mb-1 block">First day:</label>
                                <div className="flex items-center gap-1">
                                  <input
                                    type="number"
                                    value={firstDayHours}
                                    onChange={(e) => setFirstDayHours(Math.min(hoursPerWorkDay, Math.max(0.5, parseFloat(e.target.value) || 0)))}
                                    className="w-16 border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    min="0.5"
                                    max={hoursPerWorkDay}
                                    step="0.5"
                                  />
                                  <span className="text-xs text-gray-500">hours</span>
                                </div>
                              </div>
                              <div>
                                <label className="text-xs text-gray-600 mb-1 block">Last day:</label>
                                <div className="flex items-center gap-1">
                                  <input
                                    type="number"
                                    value={lastDayHours}
                                    onChange={(e) => setLastDayHours(Math.min(hoursPerWorkDay, Math.max(0.5, parseFloat(e.target.value) || 0)))}
                                    className="w-16 border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    min="0.5"
                                    max={hoursPerWorkDay}
                                    step="0.5"
                                  />
                                  <span className="text-xs text-gray-500">hours</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </label>

                      {/* Mode 3: Partial - same hours every day */}
                      <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border-2 border-transparent hover:border-blue-100 hover:bg-blue-50/50 transition-colors">
                        <input
                          type="radio"
                          name="hoursMode"
                          value="partial-same"
                          checked={hoursMode === 'partial-same'}
                          onChange={(e) => setHoursMode(e.target.value)}
                          className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">Partial - same hours every day</div>
                          <div className="text-xs text-gray-500 mt-0.5">Apply same hours to all days in range</div>
                          {hoursMode === 'partial-same' && (
                            <div className="mt-3">
                              <label className="text-xs text-gray-600 mb-1 block">Hours per day:</label>
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  value={sameHoursPerDay}
                                  onChange={(e) => setSameHoursPerDay(Math.min(hoursPerWorkDay, Math.max(0.5, parseFloat(e.target.value) || 0)))}
                                  className="w-16 border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  min="0.5"
                                  max={hoursPerWorkDay}
                                  step="0.5"
                                />
                                <span className="text-xs text-gray-500">hours</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {/* Day Breakdown Summary */}
                {dayBreakdown.length > 0 && (
                  <div className="border-t border-gray-200 pt-4">
                    <label className="text-sm font-medium text-gray-900 mb-2 block">
                      Summary
                    </label>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="space-y-1 text-sm mb-3">
                        {dayBreakdown.map((day, index) => (
                          <div key={index} className="flex justify-between">
                            <span className={day.isWeekend ? 'text-gray-400' : 'text-gray-700'}>
                              {day.date}:
                            </span>
                            <span className={day.isWeekend ? 'text-gray-400 italic' : 'text-gray-900'}>
                              {day.isWeekend ? '(weekend - not counted)' : `${day.hours} hours`}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-3 border-t border-gray-300">
                        <div className="flex justify-between text-sm font-medium mb-2">
                          <span className="text-gray-700">Total:</span>
                          <span className="text-gray-900">{workingDays.toFixed(1)} working day{workingDays !== 1 ? 's' : ''} ({totalHours} hours)</span>
                        </div>
                      </div>
                    </div>

                    {/* Duration and Balance */}
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Duration:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {workingDays.toFixed(1)} working day{workingDays !== 1 ? 's' : ''} ({totalHours} hours)
                        </span>
                      </div>
                      {futureBalance !== null && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-700">Balance after:</span>
                          <span className={`text-sm font-medium ${futureBalance >= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {futureBalance.toFixed(1)} days
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

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
