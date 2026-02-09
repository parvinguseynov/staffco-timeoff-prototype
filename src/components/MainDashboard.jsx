import { useState } from 'react';
import RequestTimeOffModal from './RequestTimeOffModal';

const MainDashboard = ({ currentRole }) => {
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Mock data for time off balances
  const balances = [
    { id: 1, type: 'Vacation', available: 12.5, used: 7.5, total: 20 },
    { id: 2, type: 'Sick Leave', available: 8, used: 2, total: 10 },
    { id: 3, type: 'Unpaid', available: 'Unlimited', used: 0, total: 'Unlimited' },
  ];

  // Mock upcoming time off
  const upcomingTimeOff = {
    startDate: 'Mar 10',
    endDate: 'Mar 12',
    duration: '3 days',
    type: 'vacation',
  };

  const handleRequestSubmit = (request) => {
    console.log('Time off request submitted:', request);
    setShowRequestModal(false);
    // In real app, would update the state/backend
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Main Dashboard</h1>

      {/* Employee View: Show Time Off Widget */}
      {currentRole === 'Employee' && (
        <div className="mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
              <span className="text-xl">🏖️</span>
              <h2 className="text-lg font-semibold text-gray-900">Time Off</h2>
            </div>

            {/* Balances */}
            <div className="grid grid-cols-3 gap-6 mb-4">
              {balances.map((balance) => (
                <div key={balance.id}>
                  <div className="text-sm text-gray-500 mb-1">{balance.type}</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {typeof balance.available === 'number'
                      ? `${balance.available} days`
                      : balance.available}
                  </div>
                  <div className="text-sm text-gray-500">available</div>
                </div>
              ))}
            </div>

            {/* Upcoming Time Off */}
            <div className="mb-4 py-3 border-t border-gray-200">
              {upcomingTimeOff ? (
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Upcoming:</span> {upcomingTimeOff.startDate}-
                  {upcomingTimeOff.endDate} ({upcomingTimeOff.duration} {upcomingTimeOff.type})
                </p>
              ) : (
                <p className="text-sm text-gray-500">No upcoming time off scheduled</p>
              )}
            </div>

            {/* Request Button */}
            <button
              onClick={() => setShowRequestModal(true)}
              className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Request Time Off
            </button>
          </div>
        </div>
      )}

      {/* Other dashboard content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Widget 1</h3>
          <p className="text-2xl font-bold text-gray-900">Content</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Widget 2</h3>
          <p className="text-2xl font-bold text-gray-900">Content</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Widget 3</h3>
          <p className="text-2xl font-bold text-gray-900">Content</p>
        </div>
      </div>

      {/* Request Time Off Modal */}
      {showRequestModal && (
        <RequestTimeOffModal
          onClose={() => setShowRequestModal(false)}
          onSubmit={handleRequestSubmit}
          balances={balances}
        />
      )}
    </div>
  );
};

export default MainDashboard;
