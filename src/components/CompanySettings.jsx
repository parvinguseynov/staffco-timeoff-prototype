import { useState } from 'react';
import Toast from './Toast';

const CompanySettings = () => {
  const [activeTab, setActiveTab] = useState('Time Off');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Time Off Settings State
  const [workWeek, setWorkWeek] = useState({
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
    Saturday: false,
    Sunday: false,
  });
  const [workWeekPreset, setWorkWeekPreset] = useState('Standard (Mon-Fri)');
  const [hoursPerDay, setHoursPerDay] = useState('8');
  const [accrualSchedule, setAccrualSchedule] = useState('proration');

  // Advance Notice Requirements State
  const [requireAdvanceNotice, setRequireAdvanceNotice] = useState(true);
  const [noticeRules, setNoticeRules] = useState([
    { id: 1, from: 1, to: 3, notice: 14, isDefault: true },
    { id: 2, from: 4, to: 5, notice: 28, isDefault: true },
    { id: 3, from: 6, to: null, notice: 60, isDefault: true }, // null means "more than"
  ]);
  const [sickLeaveExempt, setSickLeaveExempt] = useState(true);
  const [managerOverride, setManagerOverride] = useState(true);
  const [nextRuleId, setNextRuleId] = useState(4);

  const tabs = [
    'Company Profile',
    'Access Delegation',
    'Company-Wide Defaults',
    'Company Activity Log',
    'Time Off',
  ];

  const handleDayToggle = (day) => {
    setWorkWeek({ ...workWeek, [day]: !workWeek[day] });
    setWorkWeekPreset('Custom');
  };

  const handlePresetChange = (preset) => {
    setWorkWeekPreset(preset);
    if (preset === 'Standard (Mon-Fri)') {
      setWorkWeek({
        Monday: true,
        Tuesday: true,
        Wednesday: true,
        Thursday: true,
        Friday: true,
        Saturday: false,
        Sunday: false,
      });
    } else if (preset === 'Sun-Thu (Middle East)') {
      setWorkWeek({
        Monday: true,
        Tuesday: true,
        Wednesday: true,
        Thursday: true,
        Friday: false,
        Saturday: false,
        Sunday: true,
      });
    }
  };

  const handleSaveSettings = () => {
    setToastMessage('Time Off settings saved successfully');
    setShowToast(true);
  };

  const handleAddRule = () => {
    const newRule = {
      id: nextRuleId,
      from: 6,
      to: 10,
      notice: 45,
      isDefault: false,
    };
    setNoticeRules([...noticeRules, newRule]);
    setNextRuleId(nextRuleId + 1);
  };

  const handleDeleteRule = (ruleId) => {
    if (noticeRules.length === 1) {
      setToastMessage('At least one rule must remain');
      setShowToast(true);
      return;
    }
    setNoticeRules(noticeRules.filter((r) => r.id !== ruleId));
  };

  const handleUpdateRule = (ruleId, field, value) => {
    const updatedRules = noticeRules.map((r) =>
      r.id === ruleId ? { ...r, [field]: value === '' ? null : parseInt(value) || 0 } : r
    );
    setNoticeRules(updatedRules);
  };

  const formatRuleDuration = (rule) => {
    if (rule.isDefault) {
      if (rule.to === null) return 'More than 5 days';
      return `${rule.from}-${rule.to} working days`;
    }
    return null; // Will show inputs for custom rules
  };

  const renderTimeOffSettings = () => (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">Time Off Settings</h2>
        <p className="text-sm text-gray-600 mt-1">Configure company-wide time off defaults</p>
      </div>

      {/* Section 1: Work Week */}
      <div className="mb-8 pb-8 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Week</h3>
        <p className="text-sm text-gray-600 mb-4">
          Select which days are working days for your company:
        </p>

        <div className="flex gap-3 mb-4">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
            (day) => (
              <button
                key={day}
                onClick={() => handleDayToggle(day)}
                className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-150 ${
                  workWeek[day]
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {workWeek[day] && '✓ '}
                {day.substring(0, 3)}
              </button>
            )
          )}
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Preset:</label>
          <select
            value={workWeekPreset}
            onChange={(e) => handlePresetChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Standard (Mon-Fri)">Standard (Mon-Fri)</option>
            <option value="Sun-Thu (Middle East)">Sun-Thu (Middle East)</option>
            <option value="Custom">Custom</option>
          </select>
        </div>
      </div>

      {/* Section 2: Work Day */}
      <div className="mb-8 pb-8 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Day</h3>

        <div className="flex items-center gap-2 mb-3">
          <label className="text-sm font-medium text-gray-700">Hours per work day:</label>
          <input
            type="number"
            value={hoursPerDay}
            onChange={(e) => setHoursPerDay(e.target.value)}
            className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="1"
            max="24"
          />
          <span className="text-sm text-gray-700">hours</span>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
          <span className="text-blue-600 text-sm">ℹ️</span>
          <div className="text-sm text-blue-900">
            <p>This setting applies to ALL employees company-wide and cannot be overridden per employee.</p>
            <p className="mt-1">Individual working days can be customized in each employee's Employment Info.</p>
          </div>
        </div>
      </div>

      {/* Section 3: Accrual Schedule */}
      <div className="mb-8 pb-8 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Accrual Schedule</h3>
        <p className="text-sm text-gray-600 mb-4">When should time off be accrued?</p>

        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="accrualSchedule"
              value="proration"
              checked={accrualSchedule === 'proration'}
              onChange={(e) => setAccrualSchedule(e.target.value)}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <div>
              <div className="text-sm font-medium text-gray-900">
                First of each month (with proration)
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Employees hired mid-month receive proportional accrual for their first month.
              </div>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="accrualSchedule"
              value="no-proration"
              checked={accrualSchedule === 'no-proration'}
              onChange={(e) => setAccrualSchedule(e.target.value)}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <div>
              <div className="text-sm font-medium text-gray-900">
                First of each month (no proration)
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Employees must work a full month before receiving accrual.
              </div>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="accrualSchedule"
              value="hire-date"
              checked={accrualSchedule === 'hire-date'}
              onChange={(e) => setAccrualSchedule(e.target.value)}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <div>
              <div className="text-sm font-medium text-gray-900">
                On employee's hire date each month
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Accrual happens on the anniversary of each employee's hire date.
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Section 4: Advance Notice Requirements */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Advance Notice Requirements</h3>

        {/* Toggle */}
        <div className="flex items-center gap-3 mb-4">
          <button
            type="button"
            onClick={() => setRequireAdvanceNotice(!requireAdvanceNotice)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ${
              requireAdvanceNotice ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-all duration-200 ${
                requireAdvanceNotice ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
          <span className="text-sm font-medium text-gray-900">
            Require advance notice for time off requests
          </span>
        </div>

        {requireAdvanceNotice ? (
          <div className="space-y-4">
            {/* Rules Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Request Duration
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Minimum Notice Required
                    </th>
                    <th className="w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {noticeRules.map((rule) => {
                    const durationText = formatRuleDuration(rule);
                    return (
                      <tr key={rule.id}>
                        <td className="px-4 py-3">
                          {durationText ? (
                            <span className="text-sm text-gray-900">{durationText}</span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={rule.from || ''}
                                onChange={(e) => handleUpdateRule(rule.id, 'from', e.target.value)}
                                placeholder="From"
                                className="w-16 border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                min="1"
                              />
                              <span className="text-sm text-gray-600">to</span>
                              <input
                                type="number"
                                value={rule.to || ''}
                                onChange={(e) => handleUpdateRule(rule.id, 'to', e.target.value)}
                                placeholder="To"
                                className="w-16 border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                min="1"
                              />
                              <span className="text-sm text-gray-600">days</span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={rule.notice}
                              onChange={(e) => handleUpdateRule(rule.id, 'notice', e.target.value)}
                              className="w-20 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              min="0"
                            />
                            <span className="text-sm text-gray-600">days before</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => handleDeleteRule(rule.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete rule"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <button
              type="button"
              onClick={handleAddRule}
              className="text-blue-600 text-sm font-medium hover:text-blue-700"
            >
              + Add Rule
            </button>

            {/* Exceptions */}
            <div className="pt-4">
              <p className="text-sm font-medium text-gray-900 mb-3">Exceptions:</p>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sickLeaveExempt}
                    onChange={(e) => setSickLeaveExempt(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-900">
                    Sick leave exempt from notice requirements
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={managerOverride}
                    onChange={(e) => setManagerOverride(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-900">
                    Allow manager to override notice requirements
                  </span>
                </label>
              </div>
            </div>

            {/* Info Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
              <span className="text-blue-600 text-sm">ℹ️</span>
              <p className="text-sm text-blue-900">
                Requests that don't meet notice requirements will show a warning but can still be
                submitted for manager approval.
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-600">
            Employees can submit requests at any time without advance notice requirements.
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button
          onClick={handleSaveSettings}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-150 hover:scale-105 active:scale-95"
        >
          Save Changes
        </button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Time Off':
        return renderTimeOffSettings();
      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-500">Content for {activeTab} coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex gap-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">{renderTabContent()}</div>
      </div>

      {/* Toast */}
      {showToast && (
        <Toast message={toastMessage} onClose={() => setShowToast(false)} />
      )}
    </div>
  );
};

export default CompanySettings;
