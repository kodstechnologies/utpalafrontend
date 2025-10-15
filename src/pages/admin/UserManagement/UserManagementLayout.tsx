import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import IconPlus from '../../../components/Icon/IconPlus';
import UserTabs from './components/UserTabs';
import GlobalModal, { FieldConfig } from '../../../components/Modal/GlobalModal';
const UserManagementLayout = ({ children }: { children: React.ReactNode }) => {
    const { userType } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const userTypes = ['Doctors', 'Nurses', 'Receptionists', 'Pharmacists', 'Therapists', 'Patients'];
    const activeTab = userTypes.find(t => t.toLowerCase() === userType) || 'Doctors';

    const getSingularType = (type: string) => type.endsWith('s') ? type.slice(0, -1) : type;

    // Fields for each user type
    const fieldsMap: Record<string, FieldConfig[]> = {
        Doctors: [
            { name: 'firstName', label: 'First Name', type: 'text', required: true },
            { name: 'lastName', label: 'Last Name', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'specialization', label: 'Specialization', type: 'text' },
            { name: 'phone', label: 'Phone', type: 'text' },
            { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive', 'On Leave', 'Pending'] },
        ],
        Nurses: [
            { name: 'firstName', label: 'First Name', type: 'text', required: true },
            { name: 'lastName', label: 'Last Name', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'phone', label: 'Phone', type: 'text' },
            { name: 'specialization', label: 'Specialization', type: 'text' },
            { name: 'department', label: 'Department', type: 'select', options: ['Ayurveda', 'Panchakarma', 'General', 'Other'] },
            { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive', 'On Leave', 'Pending'] },
        ],
        Receptionists: [
            { name: 'firstName', label: 'First Name', type: 'text' },
            { name: 'lastName', label: 'Last Name', type: 'text' },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'phone', label: 'Phone', type: 'text' },
        ],
        Pharmacists: [
            { name: 'firstName', label: 'First Name', type: 'text' },
            { name: 'lastName', label: 'Last Name', type: 'text' },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'phone', label: 'Phone', type: 'text' },
        ],
        Therapists: [
            { name: 'firstName', label: 'First Name', type: 'text' },
            { name: 'lastName', label: 'Last Name', type: 'text' },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'specialization', label: 'Specialization', type: 'text' },
            { name: 'phone', label: 'Phone', type: 'text' },
        ],
        Patients: [
            { name: 'firstName', label: 'First Name', type: 'text' },
            { name: 'lastName', label: 'Last Name', type: 'text' },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'phone', label: 'Phone', type: 'text' },
            { name: 'dob', label: 'Date of Birth', type: 'date' },
        ],
    };

    const handleSave = (data: any) => {
        console.log(`Saving ${activeTab} data:`, data);
        setIsModalOpen(false);
    };

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="#" className="text-green-600 hover:underline">User Management</Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>{activeTab}</span>
                </li>
            </ul>

            <div className="flex pt-5 flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <UserTabs />
                <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center px-4 py-2 bg-green-700 text-white font-semibold rounded-lg shadow-md hover:bg-green-800 transition-colors duration-150 w-full md:w-auto"
                >
                    <IconPlus />
                    <span className="ml-2 ">Add New {getSingularType(activeTab)}</span>
                </button>
            </div>

            <div className="pt-4">{children}</div>

            {isModalOpen && (
                <GlobalModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    mode="create"
                    title={getSingularType(activeTab)}
                    fields={fieldsMap[activeTab]}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default UserManagementLayout;
