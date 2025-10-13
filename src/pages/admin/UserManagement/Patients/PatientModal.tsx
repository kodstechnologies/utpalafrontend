import React, { useState, useEffect } from 'react';
import IconX from '../../../../components/Icon/IconX';

export type ModalMode = 'add' | 'edit';

export interface PatientModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: ModalMode;
    patientData?: {
        id?: number;
        patientId: string;
        name: string;
        phone: string;
        dob: string;
        gender: 'Male' | 'Female' | 'Other';
        bodyType: 'Vata' | 'Pitta' | 'Kapha' | 'Tridosha';
        status: 'Active' | 'Discharged' | 'Pending Admission' | 'Follow-up';
        primaryDoctor?: string;
        admissionDate?: string;
    };
    onSave: (data: any) => void;
}

const PatientsModal: React.FC<PatientModalProps> = ({ isOpen, onClose, mode, patientData, onSave }) => {

    const [formData, setFormData] = useState({
        patientId: '',
        name: '',
        phone: '',
        dob: '',
        gender: 'Male' as 'Male' | 'Female' | 'Other',
        bodyType: 'Vata' as 'Vata' | 'Pitta' | 'Kapha' | 'Tridosha',
        status: 'Active' as 'Active' | 'Discharged' | 'Pending Admission' | 'Follow-up',
        primaryDoctor: '',
        admissionDate: '',
    });

    useEffect(() => {
        if (mode === 'edit' && patientData) {
            setFormData({
                patientId: patientData.patientId || '',
                name: patientData.name || '',
                phone: patientData.phone || '',
                dob: patientData.dob || '',
                gender: patientData.gender || 'Male',
                bodyType: patientData.bodyType || 'Vata',
                status: patientData.status || 'Active',
                primaryDoctor: patientData.primaryDoctor || '',
                admissionDate: patientData.admissionDate || '',
            });
        } else if (mode === 'add') {
            setFormData({
                patientId: '',
                name: '',
                phone: '',
                dob: '',
                gender: 'Male',
                bodyType: 'Vata',
                status: 'Active',
                primaryDoctor: '',
                admissionDate: '',
            });
        }
    }, [mode, patientData, isOpen]);

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
                        {mode === 'add' ? 'Add New Patient' : `Edit Patient: ${patientData?.name}`}
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
                            { label: 'Patient ID', name: 'patientId', type: 'text', required: true },
                            { label: 'Full Name', name: 'name', type: 'text', required: true },
                            { label: 'Phone', name: 'phone', type: 'text', required: true },
                            { label: 'Date of Birth', name: 'dob', type: 'date', required: true },
                            { label: 'Primary Doctor', name: 'primaryDoctor', type: 'text', required: false },
                            { label: 'Admission Date', name: 'admissionDate', type: 'date', required: false },
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

                        {/* Select Fields */}
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
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Body Type (Dosha)</label>
                            <select
                                name="bodyType"
                                value={formData.bodyType}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                            >
                                <option value="Vata">Vata</option>
                                <option value="Pitta">Pitta</option>
                                <option value="Kapha">Kapha</option>
                                <option value="Tridosha">Tridosha</option>
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
                                <option value="Discharged">Discharged</option>
                                <option value="Pending Admission">Pending Admission</option>
                                <option value="Follow-up">Follow-up</option>
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
                            {mode === 'add' ? 'Add Patient' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PatientsModal;
