import { useState } from 'react';

const AVAILABLE_POLICIES = [
  { id: 1, name: 'Standard PTO', category: 'Vacation', accrualRate: '1.67 days/month' },
  { id: 2, name: 'Sick Leave', category: 'Sick', accrualRate: '10 days/year' },
  { id: 3, name: 'Unpaid Leave', category: 'Unpaid', accrualRate: 'No accrual' },
];

const AVAILABLE_CALENDARS = [
  'Azerbaijan 2025',
  'US Federal 2025',
];

const EmployeeDetailsPage = ({ employee, onBack, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('Time Off');
  const [selectedPolicy, setSelectedPolicy] = useState('');
  const [accrualStartDate, setAccrualStartDate] = useState('');
  const [selectedCalendar, setSelectedCalendar] = useState(employee.holidayCalendar || '');

  const tabs = [
    'Employment Details',
    'Team & Project Assignment',
    'Compensation & Payroll',
    'Schedule & Availability',
    'Time Off',
    'Access & Compliance',
    'Internal Comments & History',
  ];

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
      balance: policyToAssign.id === 1 ? 12.5 : policyToAssign.id === 2 ? 8 : 0,
      accrualRate: policyToAssign.accrualRate,
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

  const getPolicyIcon = (category) => {
    switch (category) {
      case 'Vacation':
        return '🏖️';
      case 'Sick':
        return '🏥';
      case 'Unpaid':
        return '📋';
      default:
        return '📄';
    }
  };

  // Mock data for upcoming time off and request history
  const upcomingTimeOff = employee.id === 1 ? [
    {
      id: 1,
      dateRange: 'Apr 10-14, 2025',
      type: 'Vacation',
      duration: '3 days',
      status: 'Approved',
    },
  ] : [];

  const requestHistory = employee.id === 1 ? [
    {
      id: 1,
      dateRequested: 'Feb 15, 2025',
      type: 'Vacation',
      dates: 'Mar 1-2, 2025',
      duration: '2 days',
      status: 'Approved',
    },
    {
      id: 2,
      dateRequested: 'Jan 20, 2025',
      type: 'Sick',
      dates: 'Jan 22, 2025',
      duration: '0.5 days',
      status: 'Approved',
    },
  ] : [];

  const getTypeColor = (type) => {
    switch (type) {
      case 'Vacation':
        return 'bg-blue-50 text-blue-700';
      case 'Sick':
        return 'bg-emerald-50 text-emerald-700';
      default:
        return 'bg-gray-100 text-gray-500';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-50 text-emerald-700';
      case 'Pending':
        return 'bg-amber-50 text-amber-700';
      case 'Denied':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <div className="min-h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* Breadcrumb */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Employment Info</span>
          </button>

          {/* Employee Card */}
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center font-semibold text-blue-700 text-2xl">
              {employee.initials}
            </div>
            <div className="flex-1 grid grid-cols-4 gap-6">
              <div>
                <h1 className="text-xl font-semibold text-gray-900 mb-1">
                  {employee.name}
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  Not defined
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Email</p>
                <p className="text-sm text-gray-900">{employee.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    employee.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {employee.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">User ID</p>
                <p className="text-sm text-gray-900">#{employee.id.toString().padStart(4, '0')}</p>
                <p className="text-xs text-gray-500 mt-2">Created: Jan 15, 2024</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                disabled={tab !== 'Employment Details' && tab !== 'Time Off'}
                className={`px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : tab === 'Employment Details' || tab === 'Time Off'
                    ? 'text-gray-500 hover:text-gray-700'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === 'Employment Details' && (
          <div className="bg-white rounded-xl p-12 text-center">
            <div className="text-4xl text-gray-300 mb-3">📄</div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Employment Details</h2>
            <p className="text-gray-500">This section is under development</p>
          </div>
        )}

        {activeTab === 'Time Off' && (
          <div className="space-y-6">
            {/* Assigned Policies Section */}
            <div className="bg-white rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Assigned Policies</h2>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>

              {employee.policies.length === 0 ? (
                <div className="border border-gray-200 rounded-lg p-12 text-center">
                  <div className="text-4xl text-gray-300 mb-3">📋</div>
                  <p className="text-gray-500">No policies assigned</p>
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  {employee.policies.map((policy, index) => (
                    <div
                      key={policy.id}
                      className={`border border-gray-200 rounded-lg p-5 transition-all duration-200 ease-out hover:shadow-lg hover:scale-[1.01] animate-stagger-${Math.min(index + 1, 3)}`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getPolicyIcon(policy.category)}</span>
                          <div>
                            <h3 className="font-semibold text-gray-900">{policy.name}</h3>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                              {policy.category}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-6 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Balance</p>
                          <p className="text-lg font-semibold text-gray-900">{policy.balance} days</p>
                          <p className="text-xs text-gray-500">available</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Accrual Rate</p>
                          <p className="text-sm text-gray-900">{policy.accrualRate || 'Not set'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Accrual Start</p>
                          <p className="text-sm text-gray-900">
                            {new Date(policy.accrualStart).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                          Change Policy
                        </button>
                        <button
                          onClick={() => handleRemovePolicy(policy.id)}
                          className="text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Assign New Policy */}
              {unassignedPolicies.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      const firstUnassigned = unassignedPolicies[0];
                      setSelectedPolicy(firstUnassigned.id.toString());
                      setAccrualStartDate(new Date().toISOString().split('T')[0]);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    + Assign Policy
                  </button>

                  {selectedPolicy && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                          Select Policy
                        </label>
                        <select
                          value={selectedPolicy}
                          onChange={(e) => setSelectedPolicy(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {unassignedPolicies.map((policy) => (
                            <option key={policy.id} value={policy.id}>
                              {policy.name} ({policy.category})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                          Accrual Start Date
                        </label>
                        <input
                          type="date"
                          value={accrualStartDate}
                          onChange={(e) => setAccrualStartDate(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleAssignPolicy}
                          disabled={!selectedPolicy || !accrualStartDate}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-150 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                          Assign Policy
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPolicy('');
                            setAccrualStartDate('');
                          }}
                          className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Holiday Calendar Section */}
            <div className="bg-white rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Holiday Calendar</h2>
              <div className="max-w-md">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Assigned Calendar
                </label>
                <select
                  value={selectedCalendar}
                  onChange={(e) => setSelectedCalendar(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">No calendar</option>
                  {AVAILABLE_CALENDARS.map((calendar) => (
                    <option key={calendar} value={calendar}>
                      {calendar}
                    </option>
                  ))}
                </select>
                {selectedCalendar !== employee.holidayCalendar && (
                  <button
                    onClick={handleUpdateCalendar}
                    className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-150 hover:scale-105 active:scale-95"
                  >
                    Update Calendar
                  </button>
                )}
              </div>
            </div>

            {/* Upcoming Time Off Section */}
            <div className="bg-white rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Time Off</h2>
              {upcomingTimeOff.length === 0 ? (
                <div className="border border-gray-200 rounded-lg p-12 text-center">
                  <div className="text-4xl text-gray-300 mb-3">📅</div>
                  <p className="text-gray-500">No upcoming time off scheduled</p>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dates
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Duration
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {upcomingTimeOff.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4 text-sm text-gray-900">{item.dateRange}</td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                              {item.type}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500">{item.duration}</td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Request History Section */}
            <div className="bg-white rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Request History</h2>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View All
                </button>
              </div>
              {requestHistory.length === 0 ? (
                <div className="border border-gray-200 rounded-lg p-12 text-center">
                  <div className="text-4xl text-gray-300 mb-3">📋</div>
                  <p className="text-gray-500">No request history</p>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Requested
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dates
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Duration
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {requestHistory.map((request) => (
                        <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4 text-sm text-gray-500">{request.dateRequested}</td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(request.type)}`}>
                              {request.type}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500">{request.dates}</td>
                          <td className="px-4 py-4 text-sm text-gray-500">{request.duration}</td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                              {request.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {!['Employment Details', 'Time Off'].includes(activeTab) && (
          <div className="bg-white rounded-xl p-12 text-center">
            <div className="text-4xl text-gray-300 mb-3">🚧</div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{activeTab}</h2>
            <p className="text-gray-500">This section is under development</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetailsPage;
