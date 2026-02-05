import PolicyList from './PolicyList';
import MyTimeOff from './MyTimeOff';
import TimeOffApprovals from './TimeOffApprovals';

const TimeOffContent = ({ currentRole }) => {
  return (
    <div className="p-6 animate-fadeIn">
      {currentRole === 'Admin' ? (
        <PolicyList />
      ) : currentRole === 'Employee' ? (
        <MyTimeOff />
      ) : currentRole === 'Manager' ? (
        <TimeOffApprovals />
      ) : (
        <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
          <div className="text-4xl text-gray-300 mb-3">🚧</div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            {currentRole} View - Coming Soon
          </h2>
          <p className="text-gray-500">This view is under construction</p>
        </div>
      )}
    </div>
  );
};

export default TimeOffContent;
