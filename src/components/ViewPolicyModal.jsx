const ViewPolicyModal = ({ policy, onClose, onEdit }) => {
  if (!policy) return null;

  const getCategoryIcon = (category) => {
    const icons = {
      Vacation: '🏖️',
      Sick: '🏥',
      Personal: '🎯',
      Unpaid: '📋',
      'Bonus Days': '🎁',
    };
    return icons[category] || '📋';
  };

  const getCategoryBadgeClass = (category) => {
    return category === 'Unpaid'
      ? 'bg-gray-100 text-gray-700'
      : 'bg-green-100 text-green-700';
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
          className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col animate-modalSlideUp"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-900">
              Policy Details
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

          {/* Modal Body */}
          <div className="px-6 py-4 overflow-y-auto flex-1">
            {/* Policy Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{getCategoryIcon(policy.category)}</span>
                <h3 className="text-xl font-semibold text-gray-900">
                  {policy.name}
                </h3>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Category:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryBadgeClass(policy.category)}`}>
                    {policy.category}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Status:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                    {policy.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Accrual Settings Section */}
            <div className="py-4 border-b border-gray-100">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                Accrual Settings
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Type:</span>
                  <span className="text-sm text-gray-900 font-medium">
                    {policy.accrualRate === 'No accrual' ? 'Manual' : 'Time-based'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Rate:</span>
                  <span className="text-sm text-gray-900 font-medium">
                    {policy.accrualRate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Max Balance:</span>
                  <span className="text-sm text-gray-900 font-medium">No limit</span>
                </div>
              </div>
            </div>

            {/* Eligibility Section */}
            <div className="py-4 border-b border-gray-100">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                Eligibility
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Eligible From:</span>
                  <span className="text-sm text-gray-900 font-medium">After probation</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Advance Notice:</span>
                  <span className="text-sm text-gray-900 font-medium">
                    14 days for requests of 5+ days
                  </span>
                </div>
              </div>
            </div>

            {/* Balance Rules Section */}
            <div className="py-4 border-b border-gray-100">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                Balance Rules
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Negative Balance:</span>
                  <span className="text-sm text-gray-900 font-medium">
                    Allowed (max -5 days)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Carryover:</span>
                  <span className="text-sm text-gray-900 font-medium">
                    50% (max 10 days)
                  </span>
                </div>
              </div>
            </div>

            {/* Usage Section */}
            <div className="py-4">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                Usage
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Assigned to:</span>
                  <span className="text-sm text-gray-900 font-medium">
                    {policy.employees} employees
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Created:</span>
                  <span className="text-sm text-gray-900 font-medium">Jan 15, 2024</span>
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
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(policy);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 hover:scale-105 active:scale-95"
            >
              Edit Policy
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewPolicyModal;
