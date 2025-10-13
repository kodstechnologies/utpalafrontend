import React, { useState, useEffect } from 'react';
import IconX from '../../../../components/Icon/IconX';

export type ModalMode = 'add' | 'edit';

export interface PharmacistModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: ModalMode;
    pharmacistData?: {
        id?: number;
        name: string;
        email: string;
        role: 'Head Pharmacist' | 'Senior' | 'Junior' | 'Trainee';
        status: 'Active' | 'Inactive' | 'On Leave' | 'Pending';
        licenseNumber: string;
        dob?: string;
        gender?: string;
        section: 'Dispensing' | 'Compounding' | 'Inventory' | 'Clinical';
        joiningDate?: string;
    };
    onSave: (data: any) => void;
}

const PharmacistModal: React.FC<PharmacistModalProps> = ({ isOpen, onClose, mode, pharmacistData, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'Junior' as 'Head Pharmacist' | 'Senior' | 'Junior' | 'Trainee',
        status: 'Active' as 'Active' | 'Inactive' | 'On Leave' | 'Pending',
        licenseNumber: '',
        dob: '',
        gender: 'Male' as 'Male' | 'Female' | 'Other',
        section: 'Dispensing' as 'Dispensing' | 'Compounding' | 'Inventory' | 'Clinical',
        joiningDate: '',
    });

    useEffect(() => {
        if (mode === 'edit' && pharmacistData) {
            setFormData({
                name: pharmacistData.name || '',
                email: pharmacistData.email || '',
                role: pharmacistData.role || 'Junior',
                status: pharmacistData.status || 'Active',
                licenseNumber: pharmacistData.licenseNumber || '',
                dob: pharmacistData.dob || '',
                gender: (pharmacistData.gender === 'Male' || pharmacistData.gender === 'Female' || pharmacistData.gender === 'Other')
                    ? pharmacistData.gender
                    : 'Male',
                section: pharmacistData.section || 'Dispensing',
                joiningDate: pharmacistData.joiningDate || '',
            });
        } else if (mode === 'add') {
            setFormData({
                name: '',
                email: '',
                role: 'Junior',
                status: 'Active',
                licenseNumber: '',
                dob: '',
                gender: 'Male',
                section: 'Dispensing',
                joiningDate: '',
            });
        }
    }, [mode, pharmacistData, isOpen]);

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-3xl p-6 md:p-8 relative shadow-2xl animate-fade-in">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {mode === 'add' ? 'Add New Pharmacist' : `Edit Pharmacist: ${pharmacistData?.name}`}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all"
                    >
                        <IconX className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { label: 'Full Name', name: 'name', type: 'text', required: true },
                            { label: 'Email', name: 'email', type: 'email', required: true },
                            { label: 'License Number', name: 'licenseNumber', type: 'text', required: true },
                            { label: 'DOB', name: 'dob', type: 'date', required: false },
                            { label: 'Joining Date', name: 'joiningDate', type: 'date', required: false },
                        ].map(field => (
                            <div key={field.name}>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{field.label}</label>
                                <input
                                    type={field.type}
                                    name={field.name}
                                    value={formData[field.name as keyof typeof formData]}
                                    onChange={handleChange}
                                    required={field.required}
                                    className="mt-1 block w-full rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                />
                            </div>
                        ))}

                        {/* Select fields */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Role</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                            >
                                <option value="Head Pharmacist">Head Pharmacist</option>
                                <option value="Senior">Senior</option>
                                <option value="Junior">Junior</option>
                                <option value="Trainee">Trainee</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Section</label>
                            <select
                                name="section"
                                value={formData.section}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                            >
                                <option value="Dispensing">Dispensing</option>
                                <option value="Compounding">Compounding</option>
                                <option value="Inventory">Inventory</option>
                                <option value="Clinical">Clinical</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="On Leave">On Leave</option>
                                <option value="Pending">Pending</option>
                            </select>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-100 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-500 transition-all font-semibold shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 transition-all font-semibold shadow-md"
                        >
                            {mode === 'add' ? 'Add Pharmacist' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PharmacistModal;
