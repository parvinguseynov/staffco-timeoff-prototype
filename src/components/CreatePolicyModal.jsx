import { useState, useEffect } from 'react';

const CreatePolicyModal = ({ onClose, onCreate, editingPolicy }) => {
  const [formData, setFormData] = useState({
    name: editingPolicy?.name || '',
    category: editingPolicy?.category || 'Paid',
    eligibility: (editingPolicy?.category || 'Paid') === 'Unpaid' ? 'From hire date' : 'After probation period',
    customEligibilityDays: '',
    accrualType: editingPolicy?.accrualRate === 'No accrual' ? 'Manual' : 'Accrual',
    accrualAmount: '',
    accrualPeriod: 'month',
    startAccruing: 'From hire date',
    probationPeriod: '',
    hoursWorkedTarget: '160',
    hoursWorkedEarned: '8',
    hoursWorkedPeriod: 'Monthly',
    hoursWorkedProration: true,
    allowNegativeBalance: false,
    negativeBalanceLimit: '',
    carryover: 'No carryover',
    carryoverAmount: '',
    carryoverUnit: 'days',
    requireDocumentation: false,
    effectiveDate: '',
    balanceHandling: 'keep',
  });

  const [errors, setErrors] = useState({});
  const [isPastDate, setIsPastDate] = useState(false);

  const handleChange = (field, value) => {
    const updates = { [field]: value };

    // Update default eligibility when category changes
    if (field === 'category') {
      updates.eligibility = value === 'Unpaid' ? 'From hire date' : 'After probation period';
    }

    setFormData({ ...formData, ...updates });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }

    // Check if effective date is in the past
    if (field === 'effectiveDate' && value) {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      setIsPastDate(selectedDate < today);
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

                {/* Effective Date (only in edit mode) */}
                {editingPolicy && (
                  <div className="grid grid-cols-3 gap-4 items-start">
                    <label className="text-sm font-medium text-gray-900 pt-2">
                      Effective Date
                    </label>
                    <div className="col-span-2">
                      <input
                        type="date"
                        value={formData.effectiveDate}
                        onChange={(e) => handleChange('effectiveDate', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />

                      {/* Past Date Warning */}
                      {isPastDate && formData.effectiveDate && (
                        <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
                          <p className="text-amber-800 text-sm mb-3">
                            ⚠️ This date is in the past.
                          </p>
                          <p className="text-sm text-gray-700 mb-2">
                            How should existing balances be handled?
                          </p>
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="balanceHandling"
                                value="keep"
                                checked={formData.balanceHandling === 'keep'}
                                onChange={(e) => handleChange('balanceHandling', e.target.value)}
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-900">
                                Keep current balances (apply changes going forward only)
                              </span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="balanceHandling"
                                value="recalculate"
                                checked={formData.balanceHandling === 'recalculate'}
                                onChange={(e) => handleChange('balanceHandling', e.target.value)}
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-900">
                                Recalculate balances retroactively
                              </span>
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

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
                      <option value="Paid">Paid</option>
                      <option value="Unpaid">Unpaid</option>
                    </select>
                  </div>
                </div>

                {/* Eligibility */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label className="text-sm font-medium text-gray-900 pt-2">
                    Eligibility
                  </label>
                  <div className="col-span-2">
                    <label className="text-sm text-gray-600 mb-2 block">
                      When can employees use this policy?
                    </label>
                    <select
                      value={formData.eligibility}
                      onChange={(e) => handleChange('eligibility', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="From hire date">From hire date (available immediately)</option>
                      <option value="After probation period">After probation period</option>
                      <option value="After 6 months">After 6 months of employment</option>
                      <option value="After 1 year">After 1 year of employment</option>
                      <option value="Custom">Custom</option>
                    </select>

                    {/* Custom eligibility days input */}
                    {formData.eligibility === 'Custom' && (
                      <div className="flex gap-2 items-center mt-3">
                        <span className="text-sm text-gray-600">After</span>
                        <input
                          type="number"
                          value={formData.customEligibilityDays}
                          onChange={(e) => handleChange('customEligibilityDays', e.target.value)}
                          className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0"
                          min="1"
                        />
                        <span className="text-sm text-gray-600">days of employment</span>
                      </div>
                    )}

                    {/* Info text */}
                    <div className="flex items-start gap-2 mt-3">
                      <span className="text-blue-600 text-sm">ℹ️</span>
                      <p className="text-xs text-gray-600">
                        Employees who don't meet eligibility requirements won't be able to request this type of time off.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Accrual Type */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label className="text-sm font-medium text-gray-900 pt-2">
                    Accrual Type
                  </label>
                  <div className="col-span-2">
                    <div className="space-y-3">
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="accrualType"
                          value="Accrual"
                          checked={formData.accrualType === 'Accrual'}
                          onChange={(e) => handleChange('accrualType', e.target.value)}
                          className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <div>
                          <span className="text-sm text-gray-900">Accrual (time-based)</span>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Employees earn PTO based on time employed (e.g., 1.67 days per month)
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="accrualType"
                          value="Hours-Worked"
                          checked={formData.accrualType === 'Hours-Worked'}
                          onChange={(e) => handleChange('accrualType', e.target.value)}
                          className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <div>
                          <span className="text-sm text-gray-900">Hours-Worked</span>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Employees earn PTO based on hours tracked in timesheets (e.g., 8 hours PTO per 160 hours worked)
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="accrualType"
                          value="Manual"
                          checked={formData.accrualType === 'Manual'}
                          onChange={(e) => handleChange('accrualType', e.target.value)}
                          className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <div>
                          <span className="text-sm text-gray-900">Manual</span>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Admin manually adds days to employee balances
                          </p>
                        </div>
                      </label>
                    </div>
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

                {/* Hours-Worked Accrual Settings (conditional) */}
                {formData.accrualType === 'Hours-Worked' && (
                  <div className="col-span-3 border-t border-gray-200 pt-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">
                      Hours-Worked Accrual Settings
                    </h4>

                    {/* Hours Worked Formula */}
                    <div className="grid grid-cols-3 gap-4 items-start mb-4">
                      <label className="text-sm font-medium text-gray-900 pt-2">
                        Accrual Formula
                      </label>
                      <div className="col-span-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm text-gray-600">For every</span>
                          <input
                            type="number"
                            value={formData.hoursWorkedTarget}
                            onChange={(e) => handleChange('hoursWorkedTarget', e.target.value)}
                            className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="160"
                            min="1"
                          />
                          <span className="text-sm text-gray-600">hours worked → earn</span>
                          <input
                            type="number"
                            value={formData.hoursWorkedEarned}
                            onChange={(e) => handleChange('hoursWorkedEarned', e.target.value)}
                            className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="8"
                            min="0.01"
                            step="0.01"
                          />
                          <span className="text-sm text-gray-600">hours PTO</span>
                        </div>
                      </div>
                    </div>

                    {/* Calculation Period */}
                    <div className="grid grid-cols-3 gap-4 items-start mb-4">
                      <label className="text-sm font-medium text-gray-900 pt-2">
                        Calculation Period
                      </label>
                      <div className="col-span-2">
                        <select
                          value={formData.hoursWorkedPeriod}
                          onChange={(e) => handleChange('hoursWorkedPeriod', e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="Weekly">Weekly</option>
                          <option value="Bi-weekly">Bi-weekly</option>
                          <option value="Monthly">Monthly</option>
                        </select>
                      </div>
                    </div>

                    {/* Proration */}
                    <div className="grid grid-cols-3 gap-4 items-start mb-4">
                      <label className="text-sm font-medium text-gray-900 pt-2">
                        Proration
                      </label>
                      <div className="col-span-2">
                        <label className="flex items-start gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.hoursWorkedProration}
                            onChange={(e) => handleChange('hoursWorkedProration', e.target.checked)}
                            className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <div>
                            <span className="text-sm text-gray-900">
                              Proportional accrual if fewer hours worked
                            </span>
                            <p className="text-xs text-gray-500 mt-1">
                              Example: 120 hours worked = (120/160) × 8 = 6 hours earned
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Info Note */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                      <span className="text-blue-600 text-sm">ℹ️</span>
                      <p className="text-sm text-blue-900">
                        This option is ideal for contractors and part-time employees whose PTO
                        accrual should be based on actual hours worked.
                      </p>
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
                    <div className="col-span-2 flex gap-2 items-center">
                      <input
                        type="number"
                        value={formData.carryoverAmount}
                        onChange={(e) => handleChange('carryoverAmount', e.target.value)}
                        className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0"
                      />
                      <select
                        value={formData.carryoverUnit}
                        onChange={(e) => handleChange('carryoverUnit', e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="days">days</option>
                        <option value="hours">hours</option>
                      </select>
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
