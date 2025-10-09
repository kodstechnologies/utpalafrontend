import React, { useState } from 'react';

interface DoctorData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dob: string;
    gender: string;
    specialization: string;
    licenseNumber: string;
    department: string;
    joiningDate: string;
}

interface DoctorModalProps {
    isOpen: boolean;
    onClose: () => void;
    doctorData?: DoctorData | null;
    mode: 'create' | 'edit';
}

const getInitialState = (data: DoctorData | null | undefined): DoctorData => ({
    firstName: data?.firstName || '',
    lastName: data?.lastName || '',
    email: data?.email || '',
    phone: data?.phone || '',
    dob: data?.dob || '',
    gender: data?.gender || 'Male',
    specialization: data?.specialization || '',
    licenseNumber: data?.licenseNumber || '',
    department: data?.department || 'Cardiology',
    joiningDate: data?.joiningDate || '',
});

const DoctorModal: React.FC<DoctorModalProps> = ({ isOpen, onClose, doctorData, mode }) => {
    const [formData, setFormData] = useState<DoctorData>(getInitialState(doctorData));

    const isEditMode = mode === 'edit';
    const title = isEditMode ? 'Edit Doctor Details' : 'Add New Doctor';
    const buttonText = isEditMode ? 'Save Changes' : 'Add Doctor';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'file') {
            const fileInput = e.target as HTMLInputElement;
            setFormData((prev) => ({
                ...prev,
                [name]: fileInput.files ? fileInput.files[0] : null
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditMode) {
            console.log('Update Data Submitted:', formData, 'for Doctor ID:', doctorData?.licenseNumber);
        } else {
            console.log('New Doctor Data Submitted:', formData);
        }

        onClose();
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl m-4">
                <div className="p-6 border-b dark:border-gray-700">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div className="space-y-2">
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                                <input type="text" name="firstName" id="firstName" value={formData.firstName} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" required />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                                <input type="text" name="lastName" id="lastName" value={formData.lastName} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" required />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                                    required
                                    disabled={isEditMode}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                                <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="dob" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date of Birth</label>
                                <input type="date" name="dob" id="dob" value={formData.dob} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gender</label>
                                <select name="gender" id="gender" value={formData.gender} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Specialization</label>
                                <input type="text" name="specialization" id="specialization" value={formData.specialization} placeholder="e.g., Cardiology" onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" required />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Medical License Number</label>
                                <input
                                    type="text"
                                    name="licenseNumber"
                                    id="licenseNumber"
                                    value={formData.licenseNumber}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                                    required
                                    disabled={isEditMode}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
                                <select name="department" id="department" value={formData.department} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                                    <option>Cardiology</option>
                                    <option>Neurology</option>
                                    <option>Orthopedics</option>
                                    <option>Pediatrics</option>
                                    <option>General Surgery</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="joiningDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Joining Date</label>
                                <input type="date" name="joiningDate" id="joiningDate" value={formData.joiningDate} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                            </div>

                        </div>
                    </div>
                    <div className="flex items-center justify-end p-6 border-t dark:border-gray-700 rounded-b">
                        <button type="button" onClick={onClose} className="text-gray-500 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600">
                            Cancel
                        </button>
                        <button type="submit" className="ml-3 text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                            {buttonText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DoctorModal;