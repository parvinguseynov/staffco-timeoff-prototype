import { useState, useEffect } from 'react';

const RequestTimeOffModal = ({ onClose, onSubmit, balances }) => {
  const [formData, setFormData] = useState({
    category: 'Vacation',
    startDate: '',
    endDate: '',
    note: '',
  });

  const [workingDays, setWorkingDays] = useState(0);
  const [futureBalance, setFutureBalance] = useState(null);
  const [hasNegativeBalance, setHasNegativeBalance] = useState(false);

  const categories = [
    { id: 'Vacation', name: 'Vacation', icon: '🏖️' },
    { id: 'Sick Leave', name: 'Sick Leave', icon: '🏥' },
    { id: 'Unpaid', name: 'Unpaid', icon: '📋' },
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

  // Effect to calculate working days and future balance
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const days = calculateWorkingDays(formData.startDate, formData.endDate);
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
    } else {
      setWorkingDays(0);
      setFutureBalance(null);
      setHasNegativeBalance(false);
    }
  }, [formData.startDate, formData.endDate, formData.category, selectedBalance]);

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
      duration: `${workingDays} day${workingDays !== 1 ? 's' : ''}`,
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
                  {selectedBalance && typeof selectedBalance.available === 'number' && (
                    <p className="text-sm text-gray-500 mt-1">
                      Available: {selectedBalance.available} days
                    </p>
                  )}
                  {selectedBalance && selectedBalance.available === 'Unlimited' && (
                    <p className="text-sm text-gray-500 mt-1">Available: Unlimited</p>
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
                </div>

                {/* Summary Card */}
                {workingDays > 0 && futureBalance !== null && (
                  <div className="bg-gray-50 rounded-lg p-4 mt-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-700">Duration:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {workingDays} working day{workingDays !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">Balance after:</span>
                      <span className={`text-sm font-medium ${futureBalance >= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {futureBalance} days
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
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RequestTimeOffModal;
