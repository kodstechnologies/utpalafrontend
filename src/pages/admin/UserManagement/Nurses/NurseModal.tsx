import React, { useState, useEffect } from 'react';
import IconX from '../../../../components/Icon/IconX';

interface NurseData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dob: string;
    gender: 'Male' | 'Female' | 'Other';
    specialization: string;
    licenseNumber: string;
    department: 'Ayurveda' | 'Panchakarma' | 'General' | 'Other';
    joiningDate: string;
    status: 'Active' | 'Inactive' | 'On Leave' | 'Pending';
}

interface NurseModalProps {
    isOpen: boolean;
    onClose: () => void;
    nurseData?: NurseData | null;
    mode: 'create' | 'edit';
}

const getInitialState = (data: NurseData | null | undefined): NurseData => ({
    firstName: data?.firstName || '',
    lastName: data?.lastName || '',
    email: data?.email || '',
    phone: data?.phone || '',
    dob: data?.dob || '',
    gender: data?.gender || 'Female',
    specialization: data?.specialization || '',
    licenseNumber: data?.licenseNumber || '',
    department: data?.department || 'Panchakarma',
    joiningDate: data?.joiningDate || '',
    status: data?.status || 'Pending',
});

const NurseModal: React.FC<NurseModalProps> = ({ isOpen, onClose, nurseData, mode }) => {
    const [formData, setFormData] = useState<NurseData>(getInitialState(nurseData));

    useEffect(() => {
        setFormData(getInitialState(nurseData));
    }, [nurseData, mode]);

    const isEditMode = mode === 'edit';
    const title = isEditMode ? 'Edit Nurse Details' : 'Add New Nurse';
    const buttonText = isEditMode ? 'Save Changes' : 'Add Nurse';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditMode) {
            console.log('Update Nurse Data Submitted:', formData, 'for Nurse:', nurseData?.licenseNumber);
        } else {
            console.log('New Nurse Data Submitted:', formData);
        }

        onClose();
    };

    if (!isOpen) {
        return null;
    }

    const statusOptions: NurseData['status'][] = ['Active', 'Inactive', 'On Leave', 'Pending'];

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 transition-opacity duration-300"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl transform transition-transform duration-300 scale-100"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-red-500 transition-all"
                        title="Close"
                    >
                        <IconX className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput
                                id="firstName"
                                label="First Name"
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                            <FormInput
                                id="lastName"
                                label="Last Name"
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />

                            <FormInput
                                id="email"
                                label="Email Address"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={isEditMode}
                            />
                            <FormInput
                                id="phone"
                                label="Phone Number"
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                            <FormInput
                                id="dob"
                                label="Date of Birth"
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                            />

                            <FormSelect
                                id="gender"
                                label="Gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                options={['Male', 'Female', 'Other']}
                            />
                            <FormInput
                                id="licenseNumber"
                                label="Registration Number"
                                type="text"
                                name="licenseNumber"
                                value={formData.licenseNumber}
                                onChange={handleChange}
                                required
                                disabled={isEditMode}
                            />

                            <FormInput
                                id="specialization"
                                label="Panchakarma Expertise"
                                type="text"
                                name="specialization"
                                value={formData.specialization}
                                placeholder="e.g., Abhyanga Specialist"
                                onChange={handleChange}
                                required
                            />
                            <FormSelect
                                id="department"
                                label="Department"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                options={['Ayurveda', 'Panchakarma', 'General', 'Other']}
                            />

                            <FormInput
                                id="joiningDate"
                                label="Joining Date"
                                type="date"
                                name="joiningDate"
                                value={formData.joiningDate}
                                onChange={handleChange}
                            />
                            <FormSelect
                                id="status"
                                label="Employment Status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                options={statusOptions}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end p-6 border-t dark:border-gray-700 rounded-b space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {buttonText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NurseModal;



interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const FormInput: React.FC<InputProps> = ({ id, label, className = '', ...rest }) => (
    <div className="space-y-2">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <input
            id={id}
            className={`w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500 ${className}`}
            {...rest}
        />
    </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    options: string[];
}

const FormSelect: React.FC<SelectProps> = ({ id, label, options, className = '', ...rest }) => (
    <div className="space-y-2">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <select
            id={id}
            className={`w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500 ${className}`}
            {...rest}
        >
            {options.map(option => (
                <option key={option} value={option}>{option}</option>
            ))}
        </select>
    </div>
);
