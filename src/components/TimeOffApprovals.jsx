import { useState } from 'react';
import DenyRequestModal from './DenyRequestModal';
import Toast from './Toast';

const TimeOffApprovals = () => {
  const [activeTab, setActiveTab] = useState('Pending');
  const [expandedCard, setExpandedCard] = useState(null);
  const [showDenyModal, setShowDenyModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [requests, setRequests] = useState([
    {
      id: 1,
      employee: {
        initials: 'RS',
        name: 'Ruhid Shukurlu',
        department: 'Engineering',
      },
      dateRange: 'Apr 10-14, 2025',
      type: 'Vacation',
      duration: '3 days',
      note: 'Family vacation',
      requestedDate: 'Feb 15, 2025',
      status: 'Pending',
      currentBalance: 12.5,
      futureBalance: 9.5,
      teamConflicts: 'Marat also out Apr 11-12',
      approvalChain: '1. Manager (You) → 2. HR Admin',
    },
    {
      id: 2,
      employee: {
        initials: 'FA',
        name: 'Farida Aghayeva',
        department: 'Design',
      },
      dateRange: 'Apr 20, 2025',
      type: 'Sick',
      duration: '1 day',
      note: 'Doctor appointment',
      requestedDate: 'Feb 18, 2025',
      status: 'Pending',
      currentBalance: 8,
      futureBalance: 7,
      teamConflicts: null,
      approvalChain: '1. Manager (You) → 2. HR Admin',
    },
    {
      id: 3,
      employee: {
        initials: 'EO',
        name: 'Enver Orujov',
        department: 'Engineering',
      },
      dateRange: 'May 1-5, 2025',
      type: 'Vacation',
      duration: '3 days',
      note: 'Wedding trip',
      requestedDate: 'Feb 20, 2025',
      status: 'Pending',
      currentBalance: 0,
      futureBalance: 0,
      teamConflicts: null,
      approvalChain: '1. Manager (You) → 2. HR Admin',
    },
  ]);

  const getTypeColor = (type) => {
    switch (type) {
      case 'Vacation':
        return 'bg-blue-50 text-blue-700';
      case 'Sick':
        return 'bg-emerald-50 text-emerald-700';
      default:
        return 'bg-gray-100 text-gray-500';
    }
  };

  const handleApprove = (request) => {
    setRequests(
      requests.map((r) =>
        r.id === request.id
          ? {
              ...r,
              status: 'Approved',
              approvedBy: 'You',
              approvedDate: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              }),
            }
          : r
      )
    );
    setToastMessage(`${request.employee.name}'s request approved`);
    setShowToast(true);
  };

  const handleDenyClick = (request) => {
    setSelectedRequest(request);
    setShowDenyModal(true);
  };

  const handleDenySubmit = (reason) => {
    setRequests(
      requests.map((r) =>
        r.id === selectedRequest.id
          ? {
              ...r,
              status: 'Denied',
              deniedBy: 'You',
              deniedDate: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              }),
              denialReason: reason,
            }
          : r
      )
    );
    setShowDenyModal(false);
    setSelectedRequest(null);
    setToastMessage(`${selectedRequest.employee.name}'s request denied`);
    setShowToast(true);
  };

  const toggleCardExpansion = (requestId) => {
    setExpandedCard(expandedCard === requestId ? null : requestId);
  };

  const filteredRequests = requests.filter((r) => r.status === activeTab);
  const pendingCount = requests.filter((r) => r.status === 'Pending').length;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Time Off Approvals
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Review and approve your team's time off requests
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-1">
          {['Pending', 'Approved', 'Denied'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'Pending' ? `${tab} (${pendingCount})` : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Request Cards */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            {activeTab === 'Pending' ? (
              <>
                <div className="text-6xl mb-4">✅</div>
                <p className="text-gray-900 font-medium mb-2">
                  All caught up!
                </p>
                <p className="text-gray-500">No pending requests.</p>
              </>
            ) : (
              <p className="text-gray-500">
                No {activeTab.toLowerCase()} requests
              </p>
            )}
          </div>
        ) : (
          filteredRequests.map((request, index) => (
            <div
              key={request.id}
              className={`bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-200 ease-out overflow-hidden animate-stagger-${Math.min(index + 1, 3)}`}
            >
              {/* Card Header */}
              <div
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleCardExpansion(request.id)}
              >
                <div className="flex items-start justify-between gap-6">
                  {/* Left: Employee Info */}
                  <div className="flex items-center gap-3 min-w-[200px]">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center font-medium text-blue-700">
                      {request.employee.initials}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {request.employee.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {request.employee.department}
                      </div>
                    </div>
                  </div>

                  {/* Center: Request Details */}
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-2">
                      {request.dateRange}
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
                          request.type
                        )}`}
                      >
                        {request.type}
                      </span>
                      <span className="text-sm text-gray-500">
                        {request.duration}
                      </span>
                    </div>
                    {request.note && (
                      <p className="text-sm text-gray-500">
                        "{request.note}"
                      </p>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="text-right min-w-[200px]">
                    <div className="text-xs text-gray-500 mb-3">
                      Requested: {request.requestedDate}
                    </div>

                    {request.status === 'Pending' && (
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDenyClick(request);
                          }}
                          className="px-4 py-2 bg-white border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-all duration-150 hover:scale-105 active:scale-95 min-w-[80px]"
                        >
                          Deny
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApprove(request);
                          }}
                          className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-all duration-150 hover:scale-105 active:scale-95 min-w-[80px]"
                        >
                          Approve
                        </button>
                      </div>
                    )}

                    {request.status === 'Approved' && (
                      <div className="text-sm text-gray-500">
                        Approved by {request.approvedBy} on {request.approvedDate}
                      </div>
                    )}

                    {request.status === 'Denied' && (
                      <div className="text-sm text-gray-500">
                        Denied by {request.deniedBy} on {request.deniedDate}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedCard === request.id && (
                <div className="border-t border-gray-200 bg-gray-50 p-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">
                        Balance Impact
                      </h4>
                      <div className="text-sm text-gray-500 space-y-1">
                        <div>Current balance: {request.currentBalance} days</div>
                        <div>Balance after: {request.futureBalance} days</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">
                        Team Conflicts
                      </h4>
                      <div className="text-sm">
                        {request.teamConflicts ? (
                          <div className="flex items-start gap-2 text-amber-600">
                            <span>⚠️</span>
                            <span>{request.teamConflicts}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-emerald-600">
                            <span>✓</span>
                            <span>No team conflicts</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {request.status === 'Denied' && request.denialReason && (
                      <div className="col-span-2">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">
                          Denial Reason
                        </h4>
                        <p className="text-sm text-gray-500">
                          {request.denialReason}
                        </p>
                      </div>
                    )}

                    <div className="col-span-2">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">
                        Approval Chain
                      </h4>
                      <p className="text-sm text-gray-500">
                        {request.approvalChain}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Deny Modal */}
      {showDenyModal && selectedRequest && (
        <DenyRequestModal
          request={selectedRequest}
          onClose={() => {
            setShowDenyModal(false);
            setSelectedRequest(null);
          }}
          onSubmit={handleDenySubmit}
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

export default TimeOffApprovals;
