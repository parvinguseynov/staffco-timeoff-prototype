import { useState } from 'react';
import { Eye } from 'lucide-react';
import CreatePolicyModal from './CreatePolicyModal';
import AddHolidayCalendarModal from './AddHolidayCalendarModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import DeletePolicyModal from './DeletePolicyModal';
import ViewPolicyModal from './ViewPolicyModal';
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
  const [showViewPolicyModal, setShowViewPolicyModal] = useState(false);
  const [viewingPolicy, setViewingPolicy] = useState(null);

  // Assignments tab state
  const [assignmentsView, setAssignmentsView] = useState('By Policy');
  const [selectedPolicyForAssignment, setSelectedPolicyForAssignment] = useState(1);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showUnassignModal, setShowUnassignModal] = useState(false);
  const [employeesToUnassign, setEmployeesToUnassign] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [policies, setPolicies] = useState([
    {
      id: 1,
      policyType: 'Vacation / PTO',
      name: 'Vacation',
      category: 'Paid',
      accrualRate: '1.67 days/month',
      accrualType: 'Accrual',
      employees: 12,
      status: 'Active',
    },
    {
      id: 2,
      policyType: 'Sick Leave',
      name: 'Sick Leave',
      category: 'Paid',
      accrualRate: '10 days/year',
      accrualType: 'Accrual',
      employees: 12,
      status: 'Active',
    },
    {
      id: 3,
      policyType: 'Personal Leave',
      name: 'Personal Leave',
      category: 'Unpaid',
      trackBalance: false,
      accrualRate: 'Unlimited',
      accrualType: 'Unlimited',
      employees: 12,
      status: 'Active',
    },
    {
      id: 4,
      policyType: 'Other',
      name: 'Bonus Days',
      category: 'Paid',
      accrualRate: 'Manual',
      accrualType: 'Manual',
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
      isDefault: true,
    },
    {
      id: 2,
      name: 'US Federal 2025',
      country: 'United States',
      holidayCount: 11,
      employees: 5,
      isDefault: false,
    },
  ]);

  // Mock employee data for assignments
  const [employees, setEmployees] = useState([
    { id: 1, name: 'Ruhid Shukurlu', email: 'ruhid@staffco.com', department: 'Engineering', assignedPolicies: [1, 2, 4] },
    { id: 2, name: 'Farida Aghayeva', email: 'farida@staffco.com', department: 'Design', assignedPolicies: [1, 2, 3] },
    { id: 3, name: 'Enver Orujov', email: 'enver@staffco.com', department: 'Engineering', assignedPolicies: [] },
    { id: 4, name: 'Marat Kochnev', email: 'marat@staffco.com', department: 'Marketing', assignedPolicies: [1, 3] },
    { id: 5, name: 'Anna Smith', email: 'anna@staffco.com', department: 'HR', assignedPolicies: [1, 2] },
    { id: 6, name: 'John Doe', email: 'john@staffco.com', department: 'Engineering', assignedPolicies: [1, 2] },
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

  const handleViewPolicy = (policy) => {
    setViewingPolicy(policy);
    setShowViewPolicyModal(true);
  };

  const handleViewAssignments = (policy) => {
    setActiveTab('Assignments');
    setAssignmentsView('By Policy');
    setSelectedPolicyForAssignment(policy.id);
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
              isDefault: calendarData.isDefault,
            }
          : calendarData.isDefault ? { ...c, isDefault: false } : c
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
        isDefault: calendarData.isDefault,
      };
      // If new calendar is set as default, remove default from all others
      if (calendarData.isDefault) {
        setCalendars([...calendars.map(c => ({ ...c, isDefault: false })), newCalendar]);
      } else {
        setCalendars([...calendars, newCalendar]);
      }
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
        {activeTab !== 'Assignments' && (
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
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-1">
          {['Policies', 'Holiday Calendars', 'Assignments'].map((tab) => (
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
                      <td className="px-4 py-4 text-sm font-medium">
                        <button
                          onClick={() => handleViewPolicy(policy)}
                          className="hover:underline cursor-pointer text-left text-blue-600"
                        >
                          {policy.name}
                        </button>
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
                            onClick={() => handleViewPolicy(policy)}
                            className="p-1 hover:bg-gray-100 rounded transition-all duration-150 hover:scale-110"
                            title="View policy"
                          >
                            <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                          </button>
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
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-2xl">🗓️</span>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {calendar.name}
                        </h3>
                        {calendar.isDefault && (
                          <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded">
                            Default
                          </span>
                        )}
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

      {/* Assignments Tab */}
      {activeTab === 'Assignments' && (
        <div className="space-y-6">
          {/* View Toggle */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex gap-2">
              {['By Policy', 'By Employee'].map((view) => (
                <button
                  key={view}
                  onClick={() => setAssignmentsView(view)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    assignmentsView === view
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>

          {/* By Policy View */}
          {assignmentsView === 'By Policy' && (
            <div className="space-y-6">
              {/* Policy Selector */}
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <label className="text-sm font-medium text-gray-900 mb-2 block">Select Policy:</label>
                <select
                  value={selectedPolicyForAssignment}
                  onChange={(e) => setSelectedPolicyForAssignment(parseInt(e.target.value))}
                  className="w-full max-w-md border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {policies.map((policy) => (
                    <option key={policy.id} value={policy.id}>
                      {policy.name} ({policy.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Assigned Employees */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Assigned Employees ({employees.filter(e => e.assignedPolicies.includes(selectedPolicyForAssignment)).length})
                  </h3>
                  {selectedEmployees.filter(id => employees.find(e => e.id === id)?.assignedPolicies.includes(selectedPolicyForAssignment)).length > 0 && (
                    <button
                      onClick={() => {
                        const assignedSelected = selectedEmployees.filter(id =>
                          employees.find(e => e.id === id)?.assignedPolicies.includes(selectedPolicyForAssignment)
                        );
                        setEmployeesToUnassign(assignedSelected);
                        setShowUnassignModal(true);
                      }}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Unassign Selected ({selectedEmployees.filter(id => employees.find(e => e.id === id)?.assignedPolicies.includes(selectedPolicyForAssignment)).length})
                    </button>
                  )}
                </div>
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            const assignedIds = employees.filter(e => e.assignedPolicies.includes(selectedPolicyForAssignment)).map(e => e.id);
                            if (e.target.checked) {
                              setSelectedEmployees([...new Set([...selectedEmployees, ...assignedIds])]);
                            } else {
                              setSelectedEmployees(selectedEmployees.filter(id => !assignedIds.includes(id)));
                            }
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {employees.filter(e => e.assignedPolicies.includes(selectedPolicyForAssignment)).length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                          No employees assigned to this policy
                        </td>
                      </tr>
                    ) : (
                      employees.filter(e => e.assignedPolicies.includes(selectedPolicyForAssignment)).map((emp) => (
                        <tr key={emp.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedEmployees.includes(emp.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedEmployees([...selectedEmployees, emp.id]);
                                } else {
                                  setSelectedEmployees(selectedEmployees.filter(id => id !== emp.id));
                                }
                              }}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{emp.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{emp.email}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{emp.department}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Not Assigned Employees */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Not Assigned ({employees.filter(e => !e.assignedPolicies.includes(selectedPolicyForAssignment)).length})
                  </h3>
                  {selectedEmployees.filter(id => !employees.find(e => e.id === id)?.assignedPolicies.includes(selectedPolicyForAssignment)).length > 0 && (
                    <button
                      onClick={() => setShowAssignModal(true)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Assign Selected ({selectedEmployees.filter(id => !employees.find(e => e.id === id)?.assignedPolicies.includes(selectedPolicyForAssignment)).length})
                    </button>
                  )}
                </div>
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            const unassignedIds = employees.filter(e => !e.assignedPolicies.includes(selectedPolicyForAssignment)).map(e => e.id);
                            if (e.target.checked) {
                              setSelectedEmployees([...new Set([...selectedEmployees, ...unassignedIds])]);
                            } else {
                              setSelectedEmployees(selectedEmployees.filter(id => !unassignedIds.includes(id)));
                            }
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {employees.filter(e => !e.assignedPolicies.includes(selectedPolicyForAssignment)).map((emp) => (
                      <tr key={emp.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedEmployees.includes(emp.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedEmployees([...selectedEmployees, emp.id]);
                              } else {
                                setSelectedEmployees(selectedEmployees.filter(id => id !== emp.id));
                              }
                            }}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{emp.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{emp.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{emp.department}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* By Employee View */}
          {assignmentsView === 'By Employee' && (
            <div className="space-y-6">
              {/* Search and Filter */}
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Search employees..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <svg
                      className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="All">All Departments</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="HR">HR</option>
                  </select>
                </div>
              </div>

              {/* Employees Table */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Policies</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {employees
                      .filter(e =>
                        (searchQuery === '' || e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
                        (departmentFilter === 'All' || e.department === departmentFilter)
                      )
                      .map((emp) => (
                        <tr key={emp.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-900">{emp.name}</span>
                              {emp.assignedPolicies.length === 0 && (
                                <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{emp.email}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{emp.department}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {emp.assignedPolicies.length === 0 ? (
                              <span className="text-amber-600 font-medium">No policies assigned</span>
                            ) : (
                              <div className="flex flex-wrap gap-1">
                                {emp.assignedPolicies.map(policyId => {
                                  const policy = policies.find(p => p.id === policyId);
                                  return policy ? (
                                    <span key={policyId} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                      {policy.name}
                                    </span>
                                  ) : null;
                                })}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
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

      {/* View Policy Modal */}
      {showViewPolicyModal && viewingPolicy && (
        <ViewPolicyModal
          policy={viewingPolicy}
          onClose={() => {
            setShowViewPolicyModal(false);
            setViewingPolicy(null);
          }}
          onEdit={handleEditPolicy}
          onViewAssignments={handleViewAssignments}
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
          isFirstCalendar={calendars.length === 0}
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

      {/* Assign Policy Modal */}
      {showAssignModal && (
        <AssignPolicyModal
          policy={policies.find(p => p.id === selectedPolicyForAssignment)}
          selectedEmployees={selectedEmployees.filter(id => !employees.find(e => e.id === id)?.assignedPolicies.includes(selectedPolicyForAssignment))}
          employees={employees}
          onClose={() => {
            setShowAssignModal(false);
            setSelectedEmployees([]);
          }}
          onAssign={(assignmentData) => {
            // Update employee assignments
            setEmployees(employees.map(emp =>
              assignmentData.employeeIds.includes(emp.id)
                ? { ...emp, assignedPolicies: [...emp.assignedPolicies, selectedPolicyForAssignment] }
                : emp
            ));
            setShowAssignModal(false);
            setSelectedEmployees([]);
            setToastMessage(`Policy assigned to ${assignmentData.employeeIds.length} employee(s)`);
            setShowToast(true);
          }}
        />
      )}

      {/* Unassign Policy Modal */}
      {showUnassignModal && (
        <UnassignPolicyModal
          policy={policies.find(p => p.id === selectedPolicyForAssignment)}
          employeeCount={employeesToUnassign.length}
          onClose={() => {
            setShowUnassignModal(false);
            setEmployeesToUnassign([]);
            setSelectedEmployees([]);
          }}
          onUnassign={(unassignData) => {
            // Update employee assignments
            setEmployees(employees.map(emp =>
              employeesToUnassign.includes(emp.id)
                ? { ...emp, assignedPolicies: emp.assignedPolicies.filter(id => id !== selectedPolicyForAssignment) }
                : emp
            ));
            setShowUnassignModal(false);
            setEmployeesToUnassign([]);
            setSelectedEmployees([]);
            setToastMessage(`Policy unassigned from ${employeesToUnassign.length} employee(s)`);
            setShowToast(true);
          }}
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

// Assign Policy Modal Component
const AssignPolicyModal = ({ policy, selectedEmployees, employees, onClose, onAssign }) => {
  const [startingBalance, setStartingBalance] = useState('0');
  const [customBalance, setCustomBalance] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');

  const selectedEmpsData = employees.filter(e => selectedEmployees.includes(e.id));

  const handleAssign = () => {
    onAssign({
      employeeIds: selectedEmployees,
      startingBalance,
      customBalance: startingBalance === 'custom' ? customBalance : null,
      effectiveDate,
    });
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-900">Assign Policy</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-4 overflow-y-auto flex-1">
            <div className="space-y-4">
              {/* Policy Info */}
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">Policy: {policy?.name}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Assigning to {selectedEmployees.length} employee(s)
                </p>
              </div>

              {/* Selected Employees */}
              <div>
                <label className="text-sm font-medium text-gray-900 mb-2 block">Selected Employees:</label>
                <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3 space-y-1">
                  {selectedEmpsData.map(emp => (
                    <div key={emp.id} className="text-sm text-gray-700">
                      • {emp.name} ({emp.department})
                    </div>
                  ))}
                </div>
              </div>

              {/* Starting Balance */}
              {policy?.trackBalance !== false && (
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-2 block">Starting Balance:</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="startingBalance"
                        value="0"
                        checked={startingBalance === '0'}
                        onChange={(e) => setStartingBalance(e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-900">0 days - starts from zero</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="startingBalance"
                        value="prorate"
                        checked={startingBalance === 'prorate'}
                        onChange={(e) => setStartingBalance(e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-900">Prorate based on hire date</span>
                    </label>
                    <label className="flex items-start gap-2">
                      <input
                        type="radio"
                        name="startingBalance"
                        value="custom"
                        checked={startingBalance === 'custom'}
                        onChange={(e) => setStartingBalance(e.target.value)}
                        className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <span className="text-sm text-gray-900">Custom amount</span>
                        {startingBalance === 'custom' && (
                          <div className="flex gap-2 items-center mt-2">
                            <input
                              type="number"
                              value={customBalance}
                              onChange={(e) => setCustomBalance(e.target.value)}
                              className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="0"
                              min="0"
                            />
                            <span className="text-sm text-gray-600">days</span>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Effective Date */}
              <div>
                <label className="text-sm font-medium text-gray-900 mb-2 block">Effective Date:</label>
                <input
                  type="date"
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 flex-shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Assign Policy
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Unassign Policy Modal Component
const UnassignPolicyModal = ({ policy, employeeCount, onClose, onUnassign }) => {
  const [balanceHandling, setBalanceHandling] = useState('forfeit');

  const handleUnassign = () => {
    onUnassign({
      balanceHandling,
    });
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-xl shadow-xl w-full max-w-lg flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-900">Unassign Policy</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-4">
            <div className="space-y-4">
              {/* Warning */}
              <div className="flex gap-3 p-3 bg-amber-50 rounded-lg">
                <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="text-sm text-amber-900">
                  <p className="font-medium">You are about to unassign {policy?.name} from {employeeCount} employee(s).</p>
                  <p className="mt-1">What should happen to their current balance?</p>
                </div>
              </div>

              {/* Balance Handling Options */}
              {policy?.trackBalance !== false && (
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-2 block">Balance Handling:</label>
                  <div className="space-y-2">
                    <label className="flex items-start gap-2">
                      <input
                        type="radio"
                        name="balanceHandling"
                        value="forfeit"
                        checked={balanceHandling === 'forfeit'}
                        onChange={(e) => setBalanceHandling(e.target.value)}
                        className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <div>
                        <span className="text-sm text-gray-900 font-medium">Forfeit</span>
                        <p className="text-xs text-gray-500 mt-0.5">Balance will be lost immediately</p>
                      </div>
                    </label>
                    <label className="flex items-start gap-2">
                      <input
                        type="radio"
                        name="balanceHandling"
                        value="keep"
                        checked={balanceHandling === 'keep'}
                        onChange={(e) => setBalanceHandling(e.target.value)}
                        className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <div>
                        <span className="text-sm text-gray-900 font-medium">Keep (frozen)</span>
                        <p className="text-xs text-gray-500 mt-0.5">Balance kept but frozen - no accrual, can be used</p>
                      </div>
                    </label>
                    <label className="flex items-start gap-2">
                      <input
                        type="radio"
                        name="balanceHandling"
                        value="transfer"
                        checked={balanceHandling === 'transfer'}
                        onChange={(e) => setBalanceHandling(e.target.value)}
                        className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <div>
                        <span className="text-sm text-gray-900 font-medium">Transfer to another policy</span>
                        <p className="text-xs text-gray-500 mt-0.5">Move balance to a different policy</p>
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 flex-shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUnassign}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Unassign Policy
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PolicyList;
