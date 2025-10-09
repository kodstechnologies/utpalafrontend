import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import IconPlus from '../../../components/Icon/IconPlus';
import UserTabs from './components/UserTabs';
import DoctorModal from './Doctors/DoctorModal';
import NurseModal from './Nurses/NurseModal';

const UserManagementLayout = ({ children }: { children: React.ReactNode }) => {
    const { userType } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const userTypes = ['Doctors', 'Nurses', 'Receptionists', 'Pharmacists', 'Therapists', 'Patients'];
    const activeTab = userTypes.find(t => t.toLowerCase() === userType) || 'Doctors';


    const getSingularType = (type: string) => {
        if (type.endsWith('s')) {
            return type.slice(0, -1);
        }
        return type;
    };

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="#" className="text-green-600 hover:underline">
                        User Management
                    </Link>
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

            <div className="pt-4">
                {children}
            </div>

            {isModalOpen && activeTab === 'Doctors' && (
                <DoctorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} mode={'create'} />
            )}

            {isModalOpen && activeTab === 'Nurses' && (
                <NurseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} nurseData={null} mode={'create'} />)}
        </div>
    );
};

export default UserManagementLayout;