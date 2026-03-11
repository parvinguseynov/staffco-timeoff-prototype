import { useState, useRef, useEffect } from 'react';

const ViewPolicyModal = ({ policy, onClose, onEdit, employees = [] }) => {
  const [showEmployeePopover, setShowEmployeePopover] = useState(false);
  const popoverRef = useRef(null);

  if (!policy) return null;

  // Mock employee data - in real app, this would be filtered from props
  const assignedEmployees = employees.length > 0 ? employees : [
    { id: 1, name: 'Ruhid Shukurlu', department: 'Engineering', initials: 'RS' },
    { id: 2, name: 'Farida Aghayeva', department: 'Design', initials: 'FA' },
    { id: 3, name: 'Enver Orujov', department: 'Engineering', initials: 'EO' },
    { id: 4, name: 'Marat Kochnev', department: 'Marketing', initials: 'MK' },
    { id: 5, name: 'Anna Smith', department: 'HR', initials: 'AS' },
    { id: 6, name: 'John Doe', department: 'Engineering', initials: 'JD' },
  ];

  const displayedEmployees = assignedEmployees.slice(0, 5);
  const totalEmployees = policy.employees || assignedEmployees.length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setShowEmployeePopover(false);
      }
    };

    if (showEmployeePopover) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmployeePopover]);

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
      ? 'bg-gray-100 text-gray-800'
      : 'bg-green-100 text-green-800';
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
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {policy.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Accrual Settings Section */}
            <div className="py-4 border-b border-gray-100">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
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
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Eligibility
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Eligible From:</span>
                  <span className="text-sm text-gray-900 font-medium">After probation period</span>
                </div>
              </div>
            </div>

            {/* Balance Rules Section */}
            <div className="py-4 border-b border-gray-100">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
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

            {/* Assigned Employees Section */}
            <div className="py-4 relative">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Assigned Employees
              </h4>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setShowEmployeePopover(!showEmployeePopover)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
                >
                  {totalEmployees} employees
                </button>
                <button
                  onClick={() => setShowEmployeePopover(!showEmployeePopover)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View List
                </button>
              </div>

              {/* Employee Popover */}
              {showEmployeePopover && (
                <div
                  ref={popoverRef}
                  className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 w-80 z-10"
                >
                  <div className="px-4 py-3 border-b border-gray-200">
                    <h5 className="text-sm font-semibold text-gray-900">Assigned Employees</h5>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {displayedEmployees.map((emp) => (
                      <div key={emp.id} className="px-4 py-2 hover:bg-gray-50 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-medium">
                          {emp.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{emp.name}</p>
                        </div>
                        <span className="text-xs text-gray-500">{emp.department}</span>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                    <p className="text-xs text-gray-500 mb-2">
                      Showing {Math.min(5, totalEmployees)} of {totalEmployees}
                    </p>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline">
                      View All in Employment Info
                    </button>
                  </div>
                </div>
              )}
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
