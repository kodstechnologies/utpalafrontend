import React, { useState, useEffect } from 'react';

export type ModalMode = 'create' | 'edit';

export interface DoctorData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dob: string;
    gender: 'Male' | 'Female' | 'Other';
    specialization: string;
    licenseNumber: string;
    department: 'Cardiology' | 'Neurology' | 'Orthopedics' | 'Pediatrics' | 'General Surgery';
    joiningDate: string;
}

export interface DoctorModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: ModalMode;
    doctorData?: DoctorData;
    onSave: (data: DoctorData) => void;
}

const DoctorModal: React.FC<DoctorModalProps> = ({ isOpen, onClose, mode, doctorData, onSave }) => {
    const [formData, setFormData] = useState<DoctorData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dob: '',
        gender: 'Male',
        specialization: '',
        licenseNumber: '',
        department: 'Cardiology',
        joiningDate: '',
    });

    useEffect(() => {
        if (mode === 'edit' && doctorData) {
            setFormData(doctorData);
        } else if (mode === 'create') {
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                dob: '',
                gender: 'Male',
                specialization: '',
                licenseNumber: '',
                department: 'Cardiology',
                joiningDate: '',
            });
        }
    }, [mode, doctorData, isOpen]);

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
            <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-3xl p-6 shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {mode === 'create' ? 'Add New Doctor' : `Edit Doctor: ${doctorData?.firstName} ${doctorData?.lastName}`}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5 max-h-[75vh] overflow-y-auto pr-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {['firstName', 'lastName', 'email', 'phone', 'dob', 'gender', 'specialization', 'licenseNumber', 'department', 'joiningDate'].map((field) => {
                            const isSelect = field === 'gender' || field === 'department';
                            const label = field
                                .replace(/([A-Z])/g, ' $1')
                                .replace(/^./, str => str.toUpperCase());
                            const value = (formData as any)[field];
                            return (
                                <div key={field}>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
                                    {isSelect ? (
                                        <select
                                            name={field}
                                            value={value}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 shadow-sm px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                                        >
                                            {field === 'gender' && (
                                                <>
                                                    <option>Male</option>
                                                    <option>Female</option>
                                                    <option>Other</option>
                                                </>
                                            )}
                                            {field === 'department' && (
                                                <>
                                                    <option>Cardiology</option>
                                                    <option>Neurology</option>
                                                    <option>Orthopedics</option>
                                                    <option>Pediatrics</option>
                                                    <option>General Surgery</option>
                                                </>
                                            )}
                                        </select>
                                    ) : (
                                        <input
                                            type={field === 'dob' || field === 'joiningDate' ? 'date' : field === 'email' ? 'email' : 'text'}
                                            name={field}
                                            value={value}
                                            onChange={handleChange}
                                            disabled={field === 'licenseNumber' && mode === 'edit'}
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 shadow-sm px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                                            required={field !== 'phone'}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg shadow-md transition font-medium"
                        >
                            {mode === 'create' ? 'Add Doctor' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DoctorModal;
