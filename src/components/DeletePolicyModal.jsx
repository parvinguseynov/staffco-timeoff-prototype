import { useState } from 'react';

const DeletePolicyModal = ({ policy, policies, onClose, onConfirm }) => {
  const [balanceHandling, setBalanceHandling] = useState('transfer');
  const [transferPolicyId, setTransferPolicyId] = useState('');
  const [pendingRequestHandling, setPendingRequestHandling] = useState('keep');

  const hasEmployees = policy.employees > 0;

  // Filter policies of the same category, excluding the current policy
  const transferablePolicies = policies.filter(
    (p) => p.id !== policy.id && p.category === policy.category
  );

  const handleDelete = () => {
    const deleteData = {
      policy,
      balanceHandling: hasEmployees ? balanceHandling : null,
      transferPolicyId: balanceHandling === 'transfer' ? transferPolicyId : null,
      pendingRequestHandling: hasEmployees ? pendingRequestHandling : null,
    };
    onConfirm(deleteData);
  };

  const isDeleteDisabled = hasEmployees && balanceHandling === 'transfer' && !transferPolicyId;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-modalBackdrop"
        onClick={onClose}
      >
        {/* Modal Container */}
        <div
          className="bg-white rounded-xl shadow-xl w-full max-w-lg animate-modalSlideUp"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Delete Policy</h2>
          </div>

          {/* Modal Body */}
          <div className="px-6 py-4">
            {hasEmployees ? (
              <div className="space-y-5">
                {/* Warning */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-amber-800 text-sm">
                    ⚠️ <strong>Warning:</strong> This policy is assigned to {policy.employees}{' '}
                    {policy.employees === 1 ? 'employee' : 'employees'}.
                  </p>
                </div>

                {/* Balance Handling */}
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-3">
                    What should happen to their balances?
                  </p>
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="balanceHandling"
                        value="transfer"
                        checked={balanceHandling === 'transfer'}
                        onChange={(e) => setBalanceHandling(e.target.value)}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          Transfer to another policy
                        </div>
                        {balanceHandling === 'transfer' && (
                          <select
                            value={transferPolicyId}
                            onChange={(e) => setTransferPolicyId(e.target.value)}
                            className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select policy</option>
                            {transferablePolicies.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="balanceHandling"
                        value="payout"
                        checked={balanceHandling === 'payout'}
                        onChange={(e) => setBalanceHandling(e.target.value)}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          Pay out remaining balance
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Balances will be marked for payout in next payroll.
                        </div>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="balanceHandling"
                        value="delete"
                        checked={balanceHandling === 'delete'}
                        onChange={(e) => setBalanceHandling(e.target.value)}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">Delete balances</div>
                        <div className="text-sm text-gray-600 mt-1">
                          Employees will lose their accumulated days. This cannot be undone.
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Pending Requests Handling */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-900 mb-3">
                    What about pending requests?
                  </p>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="pendingRequestHandling"
                        value="keep"
                        checked={pendingRequestHandling === 'keep'}
                        onChange={(e) => setPendingRequestHandling(e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-900">
                        Keep pending requests (will use transferred policy)
                      </span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="pendingRequestHandling"
                        value="cancel"
                        checked={pendingRequestHandling === 'cancel'}
                        onChange={(e) => setPendingRequestHandling(e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-900">Cancel all pending requests</span>
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-600">
                  Are you sure you want to delete "<strong className="text-gray-900">{policy.name}</strong>"?
                </p>
                <p className="text-gray-600 mt-2">This action cannot be undone.</p>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 hover:scale-105 active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleteDisabled}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Delete Policy
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeletePolicyModal;
