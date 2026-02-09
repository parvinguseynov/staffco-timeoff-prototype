import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TimeOffContent from './components/TimeOffContent';
import EmploymentInfo from './components/EmploymentInfo';
import CompanySettings from './components/CompanySettings';
import MainDashboard from './components/MainDashboard';
import DemoReset from './components/DemoReset';

function App() {
  const [currentRole, setCurrentRole] = useState('Admin');
  const [currentView, setCurrentView] = useState('Time Off');
  const [pendingCount, setPendingCount] = useState(3);

  // Auto-navigate based on role
  useEffect(() => {
    if (currentView === 'Time Off') {
      // Keep on Time Off when switching roles
      return;
    }
    // If on other views, stay there
  }, [currentRole]);

  const handleMenuClick = (menuItem) => {
    setCurrentView(menuItem);
  };

  const handleRoleChange = (role) => {
    setCurrentRole(role);
    // Auto-navigate to Time Off when switching roles
    if (currentView === 'Employment Info' && role !== 'Admin') {
      setCurrentView('Time Off');
    }
  };

  const handleReset = () => {
    setCurrentRole('Admin');
    setCurrentView('Time Off');
    setPendingCount(3);
    window.location.reload(); // Simple reset by reloading
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        onMenuClick={handleMenuClick}
        activeItem={currentView}
        currentRole={currentRole}
        pendingCount={pendingCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          currentRole={currentRole}
          onRoleChange={handleRoleChange}
          pendingCount={pendingCount}
        />

        {/* Content */}
        <main className="flex-1 overflow-auto">
          {currentView === 'Main Dashboard' ? (
            <MainDashboard currentRole={currentRole} />
          ) : currentView === 'Time Off' ? (
            <TimeOffContent currentRole={currentRole} />
          ) : currentView === 'Employment Info' ? (
            <EmploymentInfo />
          ) : currentView === 'Settings' ? (
            <CompanySettings />
          ) : (
            <div className="p-6">
              <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {currentView}
                </h2>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Demo Reset */}
      <DemoReset onReset={handleReset} />
    </div>
  );
}

export default App;
