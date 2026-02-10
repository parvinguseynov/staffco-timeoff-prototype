import { useState } from 'react';
import RequestTimeOffModal from './RequestTimeOffModal';
import RequestDetailsModal from './RequestDetailsModal';
import Toast from './Toast';

const MyTimeOff = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const balances = [
    {
      id: 1,
      type: 'Vacation',
      available: 12.5,
      category: 'Paid',
      accrued: 15,
      used: 2.5,
    },
    {
      id: 2,
      type: 'Sick Leave',
      available: 8,
      category: 'Paid',
      accrued: 10,
      used: 2,
    },
    {
      id: 3,
      type: 'Personal Leave',
      available: null,
      category: 'Unpaid',
      accrued: null,
      used: null,
    },
  ];

  const upcomingTimeOff = [
    {
      id: 1,
      dateRange: 'Apr 10-14, 2025',
      type: 'Vacation',
      duration: '3 days',
      status: 'Approved',
    },
  ];

  const [requestHistory, setRequestHistory] = useState([
    {
      id: 1,
      dateRequested: 'Feb 15, 2025',
      type: 'Vacation',
      dates: 'Mar 1-2',
      duration: '2 days',
      status: 'Approved',
      balanceChange: -2,
    },
    {
      id: 2,
      dateRequested: 'Feb 1, 2025',
      type: 'Accrual',
      dates: '—',
      duration: '—',
      status: null,
      balanceChange: 1.67,
    },
    {
      id: 3,
      dateRequested: 'Jan 20, 2025',
      type: 'Sick',
      dates: 'Jan 22',
      duration: '0.5 day',
      status: 'Approved',
      balanceChange: -0.5,
    },
    {
      id: 4,
      dateRequested: 'Jan 1, 2025',
      type: 'Accrual',
      dates: '—',
      duration: '—',
      status: null,
      balanceChange: 1.67,
    },
    {
      id: 5,
      dateRequested: 'Dec 15, 2024',
      type: 'Adjustment',
      dates: '—',
      duration: '—',
      status: 'Manual add',
      balanceChange: 3,
    },
  ]);

  const handleRequestSubmit = (request) => {
    // Add new request to the top of history
    setRequestHistory([request, ...requestHistory]);
    setShowModal(false);
    setToastMessage('Request submitted for approval');
    setShowToast(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-50 text-emerald-700';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 animate-pulse-soft';
      case 'Denied':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-100 text-gray-500';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Vacation':
        return 'bg-blue-50 text-blue-700';
      case 'Sick':
        return 'bg-emerald-50 text-emerald-700';
      case 'Accrual':
        return 'bg-gray-100 text-gray-500';
      case 'Adjustment':
        return 'bg-purple-50 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            My Time Off
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            View your balances and request time off
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all duration-150 hover:scale-105 active:scale-95"
        >
          Request Time Off
        </button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {balances.map((balance, index) => (
          <div
            key={balance.id}
            className={`bg-white rounded-xl border border-gray-200 p-5 transition-all duration-200 ease-out hover:shadow-lg hover:scale-[1.02] cursor-pointer animate-stagger-${index + 1}`}
          >
            <h3 className="text-sm font-medium text-gray-600 mb-1">{balance.type}</h3>

            <div className="text-3xl font-bold text-gray-900 mb-1">
              {balance.available !== null ? `${balance.available} days` : 'Available'}
            </div>

            <div className="text-sm text-gray-500 mb-3">
              {balance.available !== null ? 'available' : 'as needed'}
            </div>

            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                balance.category === 'Paid'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {balance.category}
            </span>

            {balance.accrued && (
              <>
                {/* Progress Bar */}
                <div className="mt-4 mb-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${((balance.accrued - balance.available) / balance.accrued) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="text-xs text-gray-400 mt-2">
                  {balance.accrued} accrued · {balance.used} used
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Upcoming Time Off */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Upcoming Time Off
        </h2>

        {upcomingTimeOff.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="text-4xl text-gray-300 mb-3">📅</div>
            <p className="text-gray-500">No upcoming time off scheduled</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingTimeOff.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center justify-between transition-all duration-200 ease-out hover:shadow-lg hover:scale-[1.02] cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="text-sm font-medium text-gray-900">
                    {item.dateRange}
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
                      item.type
                    )}`}
                  >
                    {item.type}
                  </span>
                  <div className="text-sm text-gray-500">{item.duration}</div>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Time Off History */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Time Off History
        </h2>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="text-left px-4 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="text-left px-4 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="text-left px-4 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="text-left px-4 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-4 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance Change
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {requestHistory.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {request.dateRequested}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
                        request.type
                      )}`}
                    >
                      {request.type}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {request.dates}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {request.duration}
                  </td>
                  <td className="px-4 py-4">
                    {request.status ? (
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {request.status}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`text-sm font-medium ${
                        request.balanceChange > 0
                          ? 'text-emerald-600'
                          : 'text-red-600'
                      }`}
                    >
                      {request.balanceChange > 0 ? '+' : ''}
                      {request.balanceChange} days
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Time Off Modal */}
      {showModal && (
        <RequestTimeOffModal
          onClose={() => setShowModal(false)}
          onSubmit={handleRequestSubmit}
          balances={balances}
        />
      )}

      {/* Request Details Modal */}
      {showDetailsModal && selectedRequest && (
        <RequestDetailsModal
          request={selectedRequest}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedRequest(null);
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

export default MyTimeOff;
