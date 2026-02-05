import { useState } from 'react';

const Header = ({ currentRole, onRoleChange, pendingCount }) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const roles = ['Admin', 'Employee', 'Manager'];

  const notifications = [
    {
      id: 1,
      message: 'Ruhid requested 3 days vacation',
      time: '2 hours ago',
      type: 'approval',
      role: 'Manager',
    },
    {
      id: 2,
      message: 'Farida requested 1 day sick leave',
      time: '5 hours ago',
      type: 'approval',
      role: 'Manager',
    },
    {
      id: 3,
      message: 'Your vacation request was approved',
      time: '1 day ago',
      type: 'info',
      role: 'Employee',
    },
  ];

  const filteredNotifications = notifications.filter(
    (n) => !n.role || n.role === currentRole
  );

  const notificationCount =
    currentRole === 'Manager' ? pendingCount : filteredNotifications.length;

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Left: Role Switcher */}
      <div className="relative">
        <button
          onClick={() => setShowRoleDropdown(!showRoleDropdown)}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <span>Viewing as:</span>
          <span className="font-medium text-gray-900">{currentRole}</span>
          <svg
            className={`w-4 h-4 transition-transform ${
              showRoleDropdown ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {showRoleDropdown && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowRoleDropdown(false)}
            />
            <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg border border-gray-200 shadow-xl z-20">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    onRoleChange(role);
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                    currentRole === role
                      ? 'text-blue-600 font-medium'
                      : 'text-gray-900'
                  }`}
                >
                  {role}
                  {currentRole === role && (
                    <span className="float-right">✓</span>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Invite Button */}
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 hover:scale-105 active:scale-95">
          Invite
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors relative"
          >
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl border border-gray-200 shadow-xl z-20 max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">
                    Notifications
                  </h3>
                </div>
                {filteredNotifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 text-sm">
                    No new notifications
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredNotifications.map((notification) => (
                      <button
                        key={notification.id}
                        className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
                      >
                        <p className="text-sm text-gray-900 mb-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500">
                          {notification.time}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 ml-2">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              Parvin Huseynov
            </div>
            <div className="text-xs text-gray-500">Owner</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center font-medium text-blue-600">
            PH
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
