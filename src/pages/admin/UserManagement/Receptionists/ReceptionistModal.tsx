// components/Modal/ReceptionistModal.tsx
import React, { useState, useEffect } from 'react';
import IconX from '../../../../components/Icon/IconX';

export type ModalMode = 'add' | 'edit';

export interface ReceptionistModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: ModalMode;
  receptionistData?: {
    id?: number;
    employeeId: string;
    name: string;
    email: string;
    shift: 'Morning' | 'Afternoon' | 'Evening' | 'Full Day';
    status: 'Active' | 'Inactive' | 'On Leave' | 'Training';
    dob?: string;
    gender?: 'Male' | 'Female' | 'Other';
    department: 'Front Desk' | 'Billing' | 'Admissions';
    joiningDate?: string;
  };
  onSave: (data: any) => void;
}

const ReceptionistModal: React.FC<ReceptionistModalProps> = ({ isOpen, onClose, mode, receptionistData, onSave }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    email: '',
    shift: 'Morning' as 'Morning' | 'Afternoon' | 'Evening' | 'Full Day',
    status: 'Active' as 'Active' | 'Inactive' | 'On Leave' | 'Training',
    dob: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    department: 'Front Desk' as 'Front Desk' | 'Billing' | 'Admissions',
    joiningDate: '',
  });

  useEffect(() => {
    if (mode === 'edit' && receptionistData) {
      setFormData({
        employeeId: receptionistData.employeeId || '',
        name: receptionistData.name || '',
        email: receptionistData.email || '',
        shift: receptionistData.shift || 'Morning',
        status: receptionistData.status || 'Active',
        dob: receptionistData.dob || '',
        gender: receptionistData.gender || 'Male',
        department: receptionistData.department || 'Front Desk',
        joiningDate: receptionistData.joiningDate || '',
      });
    } else if (mode === 'add') {
      setFormData({
        employeeId: '',
        name: '',
        email: '',
        shift: 'Morning',
        status: 'Active',
        dob: '',
        gender: 'Male',
        department: 'Front Desk',
        joiningDate: '',
      });
    }
  }, [mode, receptionistData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-3xl p-6 shadow-2xl border border-gray-200 dark:border-gray-700 transition-all">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {mode === 'add' ? 'Add New Receptionist' : `Edit Receptionist: ${receptionistData?.name}`}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
          >
            <IconX className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { label: 'Employee ID', name: 'employeeId', type: 'text', required: true },
              { label: 'Full Name', name: 'name', type: 'text', required: true },
              { label: 'Email', name: 'email', type: 'email', required: true },
              { label: 'Date of Birth', name: 'dob', type: 'date', required: false },
              { label: 'Joining Date', name: 'joiningDate', type: 'date', required: false },
            ].map(field => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={(formData as any)[field.name]}
                  onChange={handleChange}
                  required={field.required}
                  className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 px-3 py-2 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                />
              </div>
            ))}

            {[
              { label: 'Shift', name: 'shift', options: ['Morning', 'Afternoon', 'Evening', 'Full Day'] },
              { label: 'Status', name: 'status', options: ['Active', 'Inactive', 'On Leave', 'Training'] },
              { label: 'Gender', name: 'gender', options: ['Male', 'Female', 'Other'] },
              { label: 'Department', name: 'department', options: ['Front Desk', 'Billing', 'Admissions'] },
            ].map(select => (
              <div key={select.name}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{select.label}</label>
                <select
                  name={select.name}
                  value={(formData as any)[select.name]}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 px-3 py-2 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                >
                  {select.options.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition shadow"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 transition shadow"
            >
              {mode === 'add' ? 'Add Receptionist' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReceptionistModal;
