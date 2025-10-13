import React, { useState, useEffect } from 'react';
import IconX from '../../../../components/Icon/IconX';

export type ModalMode = 'add' | 'edit';

export interface TherapistModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: ModalMode;
    therapistData?: {
        id?: number;
        employeeId: string;
        name: string;
        email: string;
        specialty: 'Physiotherapist' | 'Occupational Therapist' | 'Speech Therapist' | 'Psychotherapist';
        schedule: 'Full-time' | 'Part-time' | 'Contract';
        status: 'Active' | 'Inactive' | 'On Leave' | 'Training';
        licenseId: string;
        joiningDate?: string;
    };
    onSave: (data: any) => void;
}

const TherapistModal: React.FC<TherapistModalProps> = ({ isOpen, onClose, mode, therapistData, onSave }) => {
    const [formData, setFormData] = useState({
        employeeId: '',
        name: '',
        email: '',
        specialty: 'Physiotherapist' as 'Physiotherapist' | 'Occupational Therapist' | 'Speech Therapist' | 'Psychotherapist',
        schedule: 'Full-time' as 'Full-time' | 'Part-time' | 'Contract',
        status: 'Active' as 'Active' | 'Inactive' | 'On Leave' | 'Training',
        licenseId: '',
        joiningDate: '',
    });

    useEffect(() => {
        if (mode === 'edit' && therapistData) {
            setFormData({
                employeeId: therapistData.employeeId || '',
                name: therapistData.name || '',
                email: therapistData.email || '',
                specialty: therapistData.specialty || 'Physiotherapist',
                schedule: therapistData.schedule || 'Full-time',
                status: therapistData.status || 'Active',
                licenseId: therapistData.licenseId || '',
                joiningDate: therapistData.joiningDate || '',
            });
        } else if (mode === 'add') {
            setFormData({
                employeeId: '',
                name: '',
                email: '',
                specialty: 'Physiotherapist',
                schedule: 'Full-time',
                status: 'Active',
                licenseId: '',
                joiningDate: '',
            });
        }
    }, [mode, therapistData, isOpen]);

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
                        {mode === 'add' ? 'Add New Therapist' : `Edit Therapist: ${therapistData?.name}`}
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
                            { label: 'License ID', name: 'licenseId', type: 'text', required: false },
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
                            { label: 'Specialty', name: 'specialty', options: ['Physiotherapist', 'Occupational Therapist', 'Speech Therapist', 'Psychotherapist'] },
                            { label: 'Schedule', name: 'schedule', options: ['Full-time', 'Part-time', 'Contract'] },
                            { label: 'Status', name: 'status', options: ['Active', 'Inactive', 'On Leave', 'Training'] },
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
                            {mode === 'add' ? 'Add Therapist' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TherapistModal;
