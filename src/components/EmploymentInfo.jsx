import { useState } from 'react';
import EmployeeDetailsPage from './EmployeeDetailsPage';

const EmploymentInfo = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([
    {
      id: 1,
      initials: 'RS',
      name: 'Ruhid Shukurlu',
      email: 'ruhid@staffco.com',
      department: 'Engineering',
      status: 'Active',
      policies: [
        {
          id: 1,
          name: 'Standard PTO',
          category: 'Vacation',
          accrualStart: '2024-01-15',
          balance: 12.5,
          accrualType: 'Accrual',
          accrualRate: '1.67 days/month',
          adjustmentHistory: [
            { id: 1, date: 'Feb 1, 2025', type: 'Accrual', amount: 1.67, balance: 12.5, by: 'System', reason: 'Monthly accrual' },
            { id: 2, date: 'Jan 15, 2025', type: 'Used', amount: -2, balance: 10.83, by: 'Ruhid Shukurlu', reason: 'PTO request' },
            { id: 3, date: 'Jan 1, 2025', type: 'Accrual', amount: 1.67, balance: 12.83, by: 'System', reason: 'Monthly accrual' },
            { id: 4, date: 'Dec 1, 2024', type: 'Accrual', amount: 1.67, balance: 11.16, by: 'System', reason: 'Monthly accrual' },
          ],
        },
        {
          id: 2,
          name: 'Sick Leave',
          category: 'Sick',
          accrualStart: '2024-01-15',
          balance: 8,
          accrualType: 'Accrual',
          accrualRate: '10 days/year',
          adjustmentHistory: [
            { id: 1, date: 'Jan 1, 2025', type: 'Accrual', amount: 10, balance: 10, by: 'System', reason: 'Annual accrual' },
            { id: 2, date: 'Feb 5, 2025', type: 'Used', amount: -2, balance: 8, by: 'Ruhid Shukurlu', reason: 'Sick leave' },
          ],
        },
        {
          id: 4,
          name: 'Bonus Days',
          category: 'Other',
          accrualStart: '2025-01-01',
          balance: 3,
          accrualType: 'Manual',
          icon: '🎁',
          addedThisYear: 5,
          lastAdjusted: 'Feb 15, 2025',
          lastAdjustedBy: 'HR Anna',
          adjustmentHistory: [
            { id: 1, date: 'Feb 15, 2025', action: 'Added', amount: 3, balance: 5, by: 'HR Anna', reason: '5-year anniversary bonus' },
            { id: 2, date: 'Jan 10, 2025', action: 'Added', amount: 2, balance: 2, by: 'HR Anna', reason: 'Welcome bonus' },
            { id: 3, date: 'Jan 1, 2025', action: 'Initial', amount: 0, balance: 0, by: 'System', reason: 'Policy created' },
          ],
        },
      ],
      holidayCalendar: 'Azerbaijan 2025',
    },
    {
      id: 2,
      initials: 'FA',
      name: 'Farida Aghayeva',
      email: 'farida@staffco.com',
      department: 'Design',
      status: 'Active',
      policies: [
        {
          id: 1,
          name: 'Standard PTO',
          category: 'Vacation',
          accrualStart: '2024-03-01',
          balance: 10,
        },
        {
          id: 2,
          name: 'Sick Leave',
          category: 'Sick',
          accrualStart: '2024-03-01',
          balance: 10,
        },
      ],
      holidayCalendar: 'Azerbaijan 2025',
    },
    {
      id: 3,
      initials: 'EO',
      name: 'Enver Orujov',
      email: 'enver@staffco.com',
      department: 'Engineering',
      status: 'Active',
      policies: [],
      holidayCalendar: null,
    },
    {
      id: 4,
      initials: 'MK',
      name: 'Marat Kochnev',
      email: 'marat@staffco.com',
      department: 'Marketing',
      status: 'On Leave',
      policies: [
        {
          id: 1,
          name: 'Standard PTO',
          category: 'Vacation',
          accrualStart: '2024-02-10',
          balance: 5.5,
        },
        {
          id: 3,
          name: 'Unpaid Leave',
          category: 'Unpaid',
          accrualStart: '2024-02-10',
          balance: 0,
        },
      ],
      holidayCalendar: 'US Federal 2025',
    },
  ]);

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpdateEmployee = (employeeId, updates) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === employeeId ? { ...emp, ...updates } : emp
      )
    );
  };

  // If employee is selected, show full page view
  if (selectedEmployee) {
    return (
      <EmployeeDetailsPage
        employee={selectedEmployee}
        onBack={() => setSelectedEmployee(null)}
        onUpdate={handleUpdateEmployee}
      />
    );
  }

  return (
    <div className="p-6 animate-fadeIn">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Employment Info
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Review and manage employment information for your team members
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
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
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th className="text-left px-4 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="text-left px-4 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="text-left px-4 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-4 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time Off Policies
              </th>
              <th className="text-left px-4 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredEmployees.map((employee) => (
              <tr
                key={employee.id}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setSelectedEmployee(employee)}
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center font-medium text-blue-700">
                      {employee.initials}
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {employee.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {employee.email}
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {employee.department}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      employee.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {employee.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  {employee.policies.length > 0 ? (
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      {employee.policies.length} policies
                    </button>
                  ) : (
                    <span className="text-sm text-gray-500">No policies</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEmployee(employee);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default EmploymentInfo;
