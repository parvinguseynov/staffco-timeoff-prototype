const Sidebar = ({ onMenuClick, activeItem, currentRole, pendingCount }) => {
  const menuItems = [
    { name: 'Main Dashboard', icon: '📊', isParent: true },
    { name: 'People', icon: '👥', isParent: true, hasChildren: true },
    { name: 'Time Off', icon: '🏖️', isParent: false, indent: true },
    { name: 'Employment Info', icon: '📋', isParent: false, indent: true },
    { name: 'Calendar', icon: '📅', isParent: true, badge: 'New' },
    { name: 'Company Settings', icon: '⚙️', isParent: true },
  ];

  const handleItemClick = (item) => {
    // Don't navigate when clicking parent items with children
    if (item.hasChildren) return;
    onMenuClick(item.name);
  };

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">StaffCo</h1>
      </div>

      {/* Company Switcher */}
      <div className="px-4 py-4 border-b border-gray-200">
        <div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">
          You're working in
        </div>
        <button className="w-full bg-gray-50 hover:bg-gray-100 rounded-lg px-3 py-2.5 text-left transition-colors border border-gray-200">
          <div className="text-sm font-semibold text-gray-900">StaffCo LLC</div>
          <div className="text-xs text-gray-500 mt-0.5">Tap to switch company</div>
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.name}>
              <button
                onClick={() => handleItemClick(item)}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left text-sm transition-colors ${
                  item.indent ? 'pl-10' : ''
                } ${
                  activeItem === item.name
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : item.hasChildren
                    ? 'text-gray-600 font-medium cursor-default'
                    : 'text-gray-600 hover:bg-gray-50 font-medium'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span className="flex-1">{item.name}</span>

                {/* Badges and indicators */}
                {item.hasChildren && (
                  <span className="text-gray-400 text-xs">▶</span>
                )}
                {item.badge && (
                  <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded">
                    {item.badge}
                  </span>
                )}
                {item.name === 'Time Off' &&
                  currentRole === 'Manager' &&
                  pendingCount > 0 && (
                    <span className="w-5 h-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
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
