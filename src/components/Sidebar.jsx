const Sidebar = ({ onMenuClick, activeItem, currentRole, pendingCount }) => {
  const menuItems = [
    { name: 'Main Dashboard', icon: '📊', isParent: true },
    { name: 'Time Entries', icon: '⏰', isParent: true },
    { name: 'Projects', icon: '📁', isParent: true },
    { name: 'Reporting', icon: '📈', isParent: true },
    { name: 'People', icon: '👥', isParent: true },
    { name: 'Time Off', icon: '🏖️', isParent: false, indent: true },
    { name: 'Employment Info', icon: '👤', isParent: false, indent: true },
    { name: 'Calendar', icon: '📅', isParent: true },
    { name: 'Settings', icon: '⚙️', isParent: true },
    { name: 'Logs', icon: '📝', isParent: true },
  ];

  const handleItemClick = (item) => {
    onMenuClick(item.name);
  };

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">StaffCo</h1>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.name}>
              <button
                onClick={() => handleItemClick(item)}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left text-sm transition-colors ${
                  item.indent ? 'pl-6' : ''
                } ${
                  activeItem === item.name
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 font-medium'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.name}</span>
                {item.name === 'Time Off' &&
                  currentRole === 'Manager' &&
                  pendingCount > 0 && (
                    <span className="ml-auto w-5 h-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                      {pendingCount}
                    </span>
                  )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
