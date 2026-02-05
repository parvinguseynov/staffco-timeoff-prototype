const RequestDetailsModal = ({ request, onClose }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Denied':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

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

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-modalBackdrop"
        onClick={onClose}
      >
        {/* Modal Container */}
        <div
          className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col animate-modalSlideUp"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-900">Request Details</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Modal Body */}
          <div className="px-6 py-4 overflow-y-auto flex-1">
            <div className="space-y-6">
              {/* Status Badge */}
              <div>
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border ${getStatusColor(
                    request.status
                  )}`}
                >
                  {request.status}
                </span>
              </div>

              {/* Request Information */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">Request Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-gray-500">Type</span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
                        request.type
                      )}`}
                    >
                      {request.type}
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-gray-500">Dates</span>
                    <span className="text-sm font-medium text-gray-900">{request.dates}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-gray-500">Duration</span>
                    <span className="text-sm font-medium text-gray-900">{request.duration}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-gray-500">Date Requested</span>
                    <span className="text-sm font-medium text-gray-900">{request.dateRequested}</span>
                  </div>
                </div>
              </div>

              {/* Note */}
              {request.note && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Note</h3>
                  <p className="text-sm text-gray-900 bg-gray-50 rounded-lg p-3">{request.note}</p>
                </div>
              )}

              {/* Approval Timeline */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">Approval Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Request Submitted</p>
                      <p className="text-xs text-gray-500">{request.dateRequested}</p>
                    </div>
                  </div>

                  {request.status === 'Approved' && request.approvedBy && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Approved</p>
                        <p className="text-xs text-gray-500">
                          By {request.approvedBy} on {request.approvedDate}
                        </p>
                      </div>
                    </div>
                  )}

                  {request.status === 'Denied' && request.deniedBy && (
                    <>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-600 mt-1.5"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Denied</p>
                          <p className="text-xs text-gray-500">
                            By {request.deniedBy} on {request.deniedDate}
                          </p>
                        </div>
                      </div>
                      {request.denialReason && (
                        <div className="ml-5 bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-sm font-medium text-red-900 mb-1">Reason</p>
                          <p className="text-sm text-red-700">{request.denialReason}</p>
                        </div>
                      )}
                    </>
                  )}

                  {request.status === 'Pending' && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-amber-600 mt-1.5"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Pending Review</p>
                        <p className="text-xs text-gray-500">Awaiting manager approval</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 flex-shrink-0">
            <button
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 hover:scale-105 active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RequestDetailsModal;
