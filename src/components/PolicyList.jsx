import { useState } from 'react';
import CreatePolicyModal from './CreatePolicyModal';
import AddHolidayCalendarModal from './AddHolidayCalendarModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import DeletePolicyModal from './DeletePolicyModal';
import Toast from './Toast';

const PolicyList = () => {
  const [activeTab, setActiveTab] = useState('Policies');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [editingCalendar, setEditingCalendar] = useState(null);
  const [showDeletePolicyModal, setShowDeletePolicyModal] = useState(false);
  const [policyToDelete, setPolicyToDelete] = useState(null);
  const [showDeleteCalendarModal, setShowDeleteCalendarModal] = useState(false);
  const [calendarToDelete, setCalendarToDelete] = useState(null);
  const [policies, setPolicies] = useState([
    {
      id: 1,
      policyType: 'Vacation / PTO',
      name: 'Vacation',
      category: 'Paid',
      accrualRate: '1.67 days/month',
      employees: 12,
      status: 'Active',
    },
    {
      id: 2,
      policyType: 'Sick Leave',
      name: 'Sick Leave',
      category: 'Paid',
      accrualRate: '10 days/year',
      employees: 12,
      status: 'Active',
    },
    {
      id: 3,
      policyType: 'Personal Leave',
      name: 'Personal Leave',
      category: 'Unpaid',
      accrualRate: 'No accrual',
      employees: 12,
      status: 'Active',
    },
  ]);
  const [calendars, setCalendars] = useState([
    {
      id: 1,
      name: 'Azerbaijan 2025',
      country: 'Azerbaijan',
      holidayCount: 15,
      employees: 20,
    },
    {
      id: 2,
      name: 'US Federal 2025',
      country: 'United States',
      holidayCount: 11,
      employees: 5,
    },
  ]);

  const handleCreatePolicy = (policyData) => {
    if (editingPolicy) {
      // Update existing policy
      setPolicies(policies.map(p =>
        p.id === editingPolicy.id
          ? {
              ...p,
              name: policyData.name,
              category: policyData.category,
              accrualRate:
                policyData.accrualType === 'Manual'
                  ? 'No accrual'
                  : `${policyData.accrualAmount} days/${policyData.accrualPeriod}`,
            }
          : p
      ));
      setEditingPolicy(null);
      setShowCreateModal(false);
      setToastMessage('Policy updated successfully');
      setShowToast(true);
    } else {
      // Create new policy
      const newPolicy = {
        id: policies.length + 1,
        name: policyData.name,
        category: policyData.category,
        accrualRate:
          policyData.accrualType === 'Manual'
            ? 'No accrual'
            : `${policyData.accrualAmount} days/${policyData.accrualPeriod}`,
        employees: 0,
        status: 'Active',
      };
      setPolicies([...policies, newPolicy]);
      setShowCreateModal(false);
      setToastMessage('Policy created successfully');
      setShowToast(true);
    }
  };

  const handleEditPolicy = (policy) => {
    setEditingPolicy(policy);
    setShowCreateModal(true);
  };

  const handleDeletePolicyClick = (policy) => {
    setPolicyToDelete(policy);
    setShowDeletePolicyModal(true);
  };

  const handleConfirmDeletePolicy = (deleteData) => {
    // Handle policy deletion with the provided data
    setPolicies(policies.filter(p => p.id !== deleteData.policy.id));
    setShowDeletePolicyModal(false);
    setPolicyToDelete(null);
    setToastMessage('Policy deleted successfully');
    setShowToast(true);
  };

  const handleDeleteCalendarClick = (calendar) => {
    setCalendarToDelete(calendar);
    setShowDeleteCalendarModal(true);
  };

  const handleConfirmDeleteCalendar = () => {
    setCalendars(calendars.filter(c => c.id !== calendarToDelete.id));
    setShowDeleteCalendarModal(false);
    setCalendarToDelete(null);
    setToastMessage('Calendar deleted successfully');
    setShowToast(true);
  };

  const handleAddCalendar = (calendarData) => {
    if (editingCalendar) {
      // Update existing calendar
      setCalendars(calendars.map(c =>
        c.id === editingCalendar.id
          ? {
              ...c,
              name: calendarData.name,
              country: calendarData.country,
              holidayCount: calendarData.holidays.length,
            }
          : c
      ));
      setEditingCalendar(null);
      setShowCalendarModal(false);
      setToastMessage('Calendar updated successfully');
      setShowToast(true);
    } else {
      // Create new calendar
      const newCalendar = {
        id: calendars.length + 1,
        name: calendarData.name,
        country: calendarData.country,
        holidayCount: calendarData.holidays.length,
        employees: 0,
      };
      setCalendars([...calendars, newCalendar]);
      setShowCalendarModal(false);
      setToastMessage('Calendar created successfully');
      setShowToast(true);
    }
  };

  const handleEditCalendar = (calendar) => {
    setEditingCalendar(calendar);
    setShowCalendarModal(true);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Time Off Policies
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your company's time off policies
          </p>
        </div>
        <button
          onClick={() =>
            activeTab === 'Policies'
              ? setShowCreateModal(true)
              : setShowCalendarModal(true)
          }
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-150 hover:scale-105 active:scale-95"
        >
          + {activeTab === 'Policies' ? 'Create Policy' : 'Add Holiday Calendar'}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-1">
          {['Policies', 'Holiday Calendars'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'Policies' && (
        <>
          {policies.length === 0 ? (
            // Empty State
            <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
              <div className="text-4xl text-gray-300 mb-3">📋</div>
              <p className="text-gray-500">
                No policies yet. Create your first time off policy.
              </p>
            </div>
          ) : (
            // Policy Table
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Policy Name
                    </th>
                    <th className="text-left px-4 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="text-left px-4 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Accrual Rate
                    </th>
                    <th className="text-left px-4 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employees
                    </th>
                    <th className="text-left px-4 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-4 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {policies.map((policy) => (
                    <tr key={policy.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">
                        {policy.name}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {policy.category}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {policy.accrualRate}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {policy.employees} employees
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                          {policy.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditPolicy(policy)}
                            className="p-1 hover:bg-gray-100 rounded transition-all duration-150 hover:scale-110"
                            title="Edit policy"
                          >
                            <svg
                              className="w-5 h-5 text-gray-500 hover:text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeletePolicyClick(policy)}
                            className="p-1 hover:bg-gray-100 rounded transition-all duration-150 hover:scale-110"
                            title="Delete policy"
                          >
                            <svg
                              className="w-5 h-5 text-gray-500 hover:text-red-600"
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {activeTab === 'Holiday Calendars' && (
        <>
          {calendars.length === 0 ? (
            // Empty State
            <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
              <div className="text-4xl text-gray-300 mb-3">📅</div>
              <p className="text-gray-500">
                No holiday calendars yet. Add a calendar to track company holidays.
              </p>
            </div>
          ) : (
            // Calendar Cards Grid
            <div className="grid grid-cols-2 gap-6">
              {calendars.map((calendar, index) => (
                <div
                  key={calendar.id}
                  className={`bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-lg hover:scale-[1.01] transition-all duration-200 ease-out animate-stagger-${index + 1}`}
                >
                  <div className="flex flex-col h-full">
                    {/* Card Header with icons */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🗓️</span>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {calendar.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditCalendar(calendar)}
                          className="p-1.5 hover:bg-gray-100 rounded transition-all duration-150 hover:scale-110"
                          title="Edit calendar"
                        >
                          <svg
                            className="w-4 h-4 text-gray-400 hover:text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteCalendarClick(calendar)}
                          className="p-1.5 hover:bg-gray-100 rounded transition-all duration-150 hover:scale-110"
                          title="Delete calendar"
                        >
                          <svg
                            className="w-4 h-4 text-gray-400 hover:text-red-600"
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
                    </div>

                    {/* Card Body */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>📍</span>
                        <span>{calendar.country}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>📅</span>
                        <span>{calendar.holidayCount} holidays</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>👥</span>
                        <span>Assigned to {calendar.employees} employees</span>
                      </div>

                      {/* Preview */}
                      <div className="pt-3 mt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                          Preview: New Year, Novruz, Victory Day...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Create/Edit Policy Modal */}
      {showCreateModal && (
        <CreatePolicyModal
          onClose={() => {
            setShowCreateModal(false);
            setEditingPolicy(null);
          }}
          onCreate={handleCreatePolicy}
          editingPolicy={editingPolicy}
        />
      )}

      {/* Add/Edit Holiday Calendar Modal */}
      {showCalendarModal && (
        <AddHolidayCalendarModal
          onClose={() => {
            setShowCalendarModal(false);
            setEditingCalendar(null);
          }}
          onSave={handleAddCalendar}
          editingCalendar={editingCalendar}
        />
      )}

      {/* Delete Policy Modal */}
      {showDeletePolicyModal && policyToDelete && (
        <DeletePolicyModal
          policy={policyToDelete}
          policies={policies}
          onClose={() => {
            setShowDeletePolicyModal(false);
            setPolicyToDelete(null);
          }}
          onConfirm={handleConfirmDeletePolicy}
        />
      )}

      {/* Delete Calendar Confirmation Modal */}
      {showDeleteCalendarModal && calendarToDelete && (
        <DeleteConfirmationModal
          title="Delete Calendar"
          message={`Are you sure you want to delete ${calendarToDelete.name}? This will unassign it from all employees.`}
          itemName={calendarToDelete.name}
          onClose={() => {
            setShowDeleteCalendarModal(false);
            setCalendarToDelete(null);
          }}
          onConfirm={handleConfirmDeleteCalendar}
        />
      )}

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default PolicyList;
