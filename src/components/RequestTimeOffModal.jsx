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
  const [validationState, setValidationState] = useState('normal');
  const [validationMessage, setValidationMessage] = useState('');

  const categories = [
    { id: 'Vacation', name: 'Vacation (PTO)' },
    { id: 'Sick Leave', name: 'Sick Leave' },
    { id: 'Unpaid', name: 'Unpaid Leave' },
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

        // Determine validation state
        if (future >= 0) {
          setValidationState('normal');
          setValidationMessage('');
        } else if (future >= -5) {
          // Negative but within limit
          setValidationState('warning');
          setValidationMessage(
            `⚠️ This request will put your balance at ${future} days. Negative balances may be deducted from final pay.`
          );
        } else {
          // Exceeds negative limit
          setValidationState('error');
          setValidationMessage(
            `❌ This exceeds your negative balance limit of -5 days.`
          );
        }
      } else {
        setFutureBalance(null);
        setValidationState('normal');
        setValidationMessage('');
      }
    } else {
      setWorkingDays(0);
      setFutureBalance(null);
      setValidationState('normal');
      setValidationMessage('');
    }
  }, [formData.startDate, formData.endDate, formData.category, selectedBalance]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validationState === 'error') return;

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
    workingDays > 0 &&
    validationState !== 'error';

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-[1000] animate-modalBackdrop"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl z-[1001] w-full max-w-[500px] animate-modalSlideUp"
        style={{ maxHeight: '85vh', overflowY: 'auto' }}
      >
        <form onSubmit={handleSubmit}>
          {/* Modal Header */}
          <div className="px-6 py-5 border-b border-border flex items-center justify-between sticky top-0 bg-white z-10">
            <h2 className="text-lg font-semibold text-text-primary">
              Request Time Off
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6" style={{ overflow: 'visible', paddingBottom: '80px' }}>
          <div className="space-y-5">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-button focus:outline-none focus:ring-2 focus:ring-primary/50"
                style={{ minHeight: '36px' }}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {selectedBalance && typeof selectedBalance.available === 'number' && (
                <p className="text-sm text-text-secondary mt-1">
                  {selectedBalance.available} days available
                </p>
              )}
              {selectedBalance && selectedBalance.available === 'Unlimited' && (
                <p className="text-sm text-text-secondary mt-1">Unlimited days</p>
              )}
            </div>

            {/* Date Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-button focus:outline-none focus:ring-2 focus:ring-primary/50"
                  style={{ minHeight: '36px' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                  min={formData.startDate}
                  className="w-full px-3 py-2 border border-border rounded-button focus:outline-none focus:ring-2 focus:ring-primary/50"
                  style={{ minHeight: '36px' }}
                />
              </div>
            </div>

            {/* Calculated Duration */}
            {workingDays > 0 && (
              <div className="bg-gray-50 rounded-button p-4 border border-border">
                <div className="text-sm font-medium text-text-primary mb-1">
                  Calculated Duration
                </div>
                <div className="text-lg font-semibold text-text-primary">
                  {workingDays} working day{workingDays !== 1 ? 's' : ''}
                </div>
                <div className="text-xs text-text-secondary mt-1">
                  Weekends and holidays not counted
                </div>
              </div>
            )}

            {/* Future Balance */}
            {futureBalance !== null && (
              <div className="bg-gray-50 rounded-button p-4 border border-border">
                <div className="text-sm font-medium text-text-primary mb-1">
                  Future Balance
                </div>
                <div className="text-lg font-semibold text-text-primary">
                  Your balance after approval: {futureBalance} days
                </div>
              </div>
            )}

            {/* Validation Message */}
            {validationMessage && (
              <div
                className={`rounded-button p-4 border ${
                  validationState === 'warning'
                    ? 'bg-warning/10 border-warning text-warning'
                    : 'bg-error/10 border-error text-error'
                }`}
              >
                <p className="text-sm">{validationMessage}</p>
              </div>
            )}

            {/* Note */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Note
              </label>
              <textarea
                value={formData.note}
                onChange={(e) => handleChange('note', e.target.value)}
                placeholder="Add a note for your manager (optional)"
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-button focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                style={{ minHeight: '80px' }}
              />
            </div>

            {/* Attachment */}
            <div>
              <button
                type="button"
                className="text-primary text-sm hover:underline"
              >
                + Attach documentation
              </button>
              <p className="text-xs text-text-secondary mt-1">
                Required for sick leave over 3 days
              </p>
            </div>
          </div>

          </div>

          {/* Modal Footer */}
          <div
            className="px-6 border-t flex justify-end gap-3 sticky bottom-0 bg-white"
            style={{
              paddingTop: '16px',
              paddingBottom: '16px',
              borderTop: '1px solid #E2E8F0',
              zIndex: 20,
            }}
          >
            <button
              type="button"
              onClick={onClose}
              className="transition-all duration-150 hover:scale-105 active:scale-95"
              style={{
                padding: '8px 16px',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                background: 'white',
                color: '#1E293B',
                cursor: 'pointer',
                fontSize: '14px',
                minHeight: '36px',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid}
              className="transition-all duration-150 hover:scale-105 active:scale-95"
              style={{
                padding: '8px 16px',
                background: '#2E5BFF',
                color: 'white',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                minHeight: '36px',
                opacity: isFormValid ? 1 : 0.5,
              }}
            >
              {validationState === 'warning' ? 'Submit Anyway' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default RequestTimeOffModal;
