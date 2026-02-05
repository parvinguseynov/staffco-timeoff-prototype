import { useState } from 'react';

const AVAILABLE_POLICIES = [
  { id: 1, name: 'Standard PTO', category: 'Vacation' },
  { id: 2, name: 'Sick Leave', category: 'Sick' },
  { id: 3, name: 'Unpaid Leave', category: 'Unpaid' },
];

const AVAILABLE_CALENDARS = [
  'Azerbaijan 2025',
  'US Federal 2025',
];

const EmployeeDetailsPanel = ({ employee, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('Time Off');
  const [selectedPolicy, setSelectedPolicy] = useState('');
  const [accrualStartDate, setAccrualStartDate] = useState('');
  const [selectedCalendar, setSelectedCalendar] = useState(employee.holidayCalendar || '');

  const unassignedPolicies = AVAILABLE_POLICIES.filter(
    (policy) => !employee.policies.some((p) => p.id === policy.id)
  );

  const handleAssignPolicy = () => {
    if (!selectedPolicy || !accrualStartDate) return;

    const policyToAssign = AVAILABLE_POLICIES.find(
      (p) => p.id === parseInt(selectedPolicy)
    );

    const newPolicy = {
      id: policyToAssign.id,
      name: policyToAssign.name,
      category: policyToAssign.category,
      accrualStart: accrualStartDate,
      balance: 0,
    };

    onUpdate(employee.id, {
      policies: [...employee.policies, newPolicy],
    });

    setSelectedPolicy('');
    setAccrualStartDate('');
  };

  const handleRemovePolicy = (policyId) => {
    onUpdate(employee.id, {
      policies: employee.policies.filter((p) => p.id !== policyId),
    });
  };

  const handleUpdateCalendar = () => {
    onUpdate(employee.id, {
      holidayCalendar: selectedCalendar,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <div className="w-[400px] bg-card h-full shadow-xl animate-slide-in-right overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-medium text-primary text-lg">
                {employee.initials}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-text-primary">
                  {employee.name}
                </h2>
                <p className="text-sm text-text-secondary">{employee.email}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              <svg
                className="w-6 h-6"
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

          {/* Tabs */}
          <div className="flex gap-4 border-b border-border -mb-6 pb-0">
            {['Details', 'Time Off'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-1 font-medium transition-colors relative ${
                  activeTab === tab
                    ? 'text-primary'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'Details' && (
            <div className="text-center py-12 text-text-secondary">
              Details tab coming soon
            </div>
          )}

          {activeTab === 'Time Off' && (
            <div className="space-y-6">
              {/* Assigned Policies Section */}
              <div>
                <h3 className="text-sm font-semibold text-text-primary mb-4">
                  Assigned Policies
                </h3>

                {employee.policies.length === 0 ? (
                  <div className="bg-gray-50 rounded-card p-6 text-center border border-border">
                    <p className="text-text-secondary text-sm mb-3">
                      No policies assigned
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {employee.policies.map((policy) => (
                      <div
                        key={policy.id}
                        className="border border-border rounded-card p-4"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-text-primary text-sm">
                                {policy.name}
                              </span>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                {policy.category}
                              </span>
                            </div>
                            <p className="text-xs text-text-secondary">
                              Accrual start: {new Date(policy.accrualStart).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-text-primary">
                            Current balance: <span className="font-semibold">{policy.balance} days available</span>
                          </p>
                        </div>
                        <div className="flex gap-3 mt-3 pt-3 border-t border-border">
                          <button className="text-xs text-primary hover:underline">
                            Edit
                          </button>
                          <button
                            onClick={() => handleRemovePolicy(policy.id)}
                            className="text-xs text-error hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Assign New Policy Section */}
              {unassignedPolicies.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-text-primary mb-4">
                    Assign New Policy
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-text-secondary mb-1">
                        Select Policy
                      </label>
                      <select
                        value={selectedPolicy}
                        onChange={(e) => setSelectedPolicy(e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <option value="">Choose a policy...</option>
                        {unassignedPolicies.map((policy) => (
                          <option key={policy.id} value={policy.id}>
                            {policy.name} ({policy.category})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-text-secondary mb-1">
                        Accrual Start Date
                      </label>
                      <input
                        type="date"
                        value={accrualStartDate}
                        onChange={(e) => setAccrualStartDate(e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <button
                      onClick={handleAssignPolicy}
                      disabled={!selectedPolicy || !accrualStartDate}
                      className="w-full bg-primary text-white px-4 py-2 rounded-button text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Assign Policy
                    </button>
                  </div>
                </div>
              )}

              {/* Holiday Calendar Section */}
              <div>
                <h3 className="text-sm font-semibold text-text-primary mb-4">
                  Holiday Calendar
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-text-secondary mb-1">
                      Select Calendar
                    </label>
                    <select
                      value={selectedCalendar}
                      onChange={(e) => setSelectedCalendar(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">No calendar</option>
                      {AVAILABLE_CALENDARS.map((calendar) => (
                        <option key={calendar} value={calendar}>
                          {calendar}
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedCalendar !== employee.holidayCalendar && (
                    <button
                      onClick={handleUpdateCalendar}
                      className="w-full bg-primary text-white px-4 py-2 rounded-button text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      Update Calendar
                    </button>
                  )}
                  {employee.holidayCalendar && selectedCalendar === employee.holidayCalendar && (
                    <div className="flex items-center gap-2 text-success text-sm">
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Currently assigned
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailsPanel;
