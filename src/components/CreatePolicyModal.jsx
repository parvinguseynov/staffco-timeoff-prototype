import { useState, useEffect } from 'react';

const CreatePolicyModal = ({ onClose, onCreate, editingPolicy }) => {
  const [formData, setFormData] = useState({
    name: editingPolicy?.name || '',
    category: editingPolicy?.category || 'Vacation',
    accrualType: editingPolicy?.accrualRate === 'Unlimited' ? 'Unlimited' : editingPolicy?.accrualRate === 'No accrual' ? 'Manual' : 'Accrual',
    accrualAmount: '',
    accrualPeriod: 'month',
    startAccruing: 'From hire date',
    probationPeriod: '',
    allowNegativeBalance: false,
    negativeBalanceLimit: '',
    carryover: 'No carryover',
    carryoverAmount: '',
    requireDocumentation: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Policy name is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onCreate(formData);
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
          className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col animate-modalSlideUp"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-900">
              {editingPolicy ? 'Edit Policy' : 'Create Time Off Policy'}
            </h2>
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

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
            {/* Modal Body */}
            <div className="px-6 py-4 overflow-y-auto flex-1">
              <div className="space-y-6">
                {/* Policy Name */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label className="text-sm font-medium text-gray-900 pt-2">
                    Policy Name
                  </label>
                  <div className="col-span-2">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Standard PTO"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                </div>

                {/* Category */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label className="text-sm font-medium text-gray-900 pt-2">
                    Category
                  </label>
                  <div className="col-span-2">
                    <select
                      value={formData.category}
                      onChange={(e) => handleChange('category', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Vacation">Vacation</option>
                      <option value="Sick">Sick</option>
                      <option value="Unpaid">Unpaid</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Accrual Type */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label className="text-sm font-medium text-gray-900 pt-2">
                    Accrual Type
                  </label>
                  <div className="col-span-2 space-y-2">
                    {['Accrual', 'Manual', 'Unlimited'].map((type) => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="accrualType"
                          value={type}
                          checked={formData.accrualType === type}
                          onChange={(e) => handleChange('accrualType', e.target.value)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-900">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Accrual Rate (conditional) */}
                {formData.accrualType === 'Accrual' && (
                  <div className="grid grid-cols-3 gap-4 items-start">
                    <label className="text-sm font-medium text-gray-900 pt-2">
                      Accrual Rate
                    </label>
                    <div className="col-span-2 flex gap-2 items-center">
                      <input
                        type="number"
                        value={formData.accrualAmount}
                        onChange={(e) => handleChange('accrualAmount', e.target.value)}
                        className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0"
                        step="0.01"
                      />
                      <span className="text-sm text-gray-500">days per</span>
                      <select
                        value={formData.accrualPeriod}
                        onChange={(e) => handleChange('accrualPeriod', e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="month">month</option>
                        <option value="year">year</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Start Accruing (conditional) */}
                {formData.accrualType === 'Accrual' && (
                  <div className="grid grid-cols-3 gap-4 items-start">
                    <label className="text-sm font-medium text-gray-900 pt-2">
                      Start Accruing
                    </label>
                    <div className="col-span-2 space-y-2">
                      {['From hire date', 'After probation period'].map((option) => (
                        <label key={option} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="startAccruing"
                            value={option}
                            checked={formData.startAccruing === option}
                            onChange={(e) => handleChange('startAccruing', e.target.value)}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-900">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Probation Period (conditional) */}
                {formData.accrualType === 'Accrual' && formData.startAccruing === 'After probation period' && (
                  <div className="grid grid-cols-3 gap-4 items-start">
                    <label className="text-sm font-medium text-gray-900 pt-2">
                      Probation Period
                    </label>
                    <div className="col-span-2 flex gap-2 items-center">
                      <input
                        type="number"
                        value={formData.probationPeriod}
                        onChange={(e) => handleChange('probationPeriod', e.target.value)}
                        className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0"
                      />
                      <span className="text-sm text-gray-500">days</span>
                    </div>
                  </div>
                )}

                {/* Allow Negative Balance */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label className="text-sm font-medium text-gray-900 pt-2">
                    Allow Negative Balance
                  </label>
                  <div className="col-span-2">
                    <button
                      type="button"
                      onClick={() => handleChange('allowNegativeBalance', !formData.allowNegativeBalance)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ${
                        formData.allowNegativeBalance ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-all duration-200 ${
                          formData.allowNegativeBalance ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                    {formData.allowNegativeBalance && (
                      <div className="flex gap-2 items-center mt-3">
                        <span className="text-sm text-gray-500">Up to</span>
                        <input
                          type="number"
                          value={formData.negativeBalanceLimit}
                          onChange={(e) => handleChange('negativeBalanceLimit', e.target.value)}
                          className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0"
                        />
                        <span className="text-sm text-gray-500">days</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Carryover */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label className="text-sm font-medium text-gray-900 pt-2">
                    Carryover
                  </label>
                  <div className="col-span-2">
                    <select
                      value={formData.carryover}
                      onChange={(e) => handleChange('carryover', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="No carryover">No carryover</option>
                      <option value="Percentage">Percentage</option>
                      <option value="Fixed days">Fixed days</option>
                      <option value="Unlimited">Unlimited</option>
                    </select>
                  </div>
                </div>

                {/* Carryover Amount (conditional) */}
                {(formData.carryover === 'Percentage' || formData.carryover === 'Fixed days') && (
                  <div className="grid grid-cols-3 gap-4 items-start">
                    <label className="text-sm font-medium text-gray-900 pt-2">
                      Carryover Amount
                    </label>
                    <div className="col-span-2">
                      <input
                        type="number"
                        value={formData.carryoverAmount}
                        onChange={(e) => handleChange('carryoverAmount', e.target.value)}
                        className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0"
                      />
                    </div>
                  </div>
                )}

                {/* Require Documentation */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label className="text-sm font-medium text-gray-900 pt-2">
                    Require Documentation
                  </label>
                  <div className="col-span-2">
                    <button
                      type="button"
                      onClick={() => handleChange('requireDocumentation', !formData.requireDocumentation)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ${
                        formData.requireDocumentation ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-all duration-200 ${
                          formData.requireDocumentation ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 hover:scale-105 active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 hover:scale-105 active:scale-95"
              >
                {editingPolicy ? 'Save Changes' : 'Create Policy'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreatePolicyModal;
