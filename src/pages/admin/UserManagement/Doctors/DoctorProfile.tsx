// pages/admin/UserManagement/Doctors/DoctorProfile.tsx

import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

// Assuming these icons are available from your component path
import IconEdit from '../../../../components/Icon/IconEdit';
import IconDownload from '../../../../components/Icon/IconDownload';
import IconMail from '../../../../components/Icon/IconMail';
import IconPhone from '../../../../components/Icon/IconPhone';
import IconCalendar from '../../../../components/Icon/IconCalendar';
import IconUser from '../../../../components/Icon/IconUser';
// -------------------------------------------------------------

// --- Data Types and Dummy Data (Unchanged) ---
interface Doctor {
    id: number;
    name: string;
    email: string;
    specialization: string;
    status: 'Active' | 'Inactive' | 'On Leave' | 'Pending';
    licenseNumber?: string;
    dob?: string;
    gender?: string;
    department?: string;
    joiningDate?: string;
    phone?: string; 
}
type StatusBadgeProps = { status: Doctor['status']; };
const DUMMY_DOCTORS: Doctor[] = [
    { id: 1, name: 'Dr. Kavita Rao', email: 'k.rao@veda.com', specialization: 'Internal Medicine', status: 'Active', licenseNumber: 'MED-1001', dob: '1985-06-15', gender: 'Female', department: 'General Medicine', joiningDate: '2010-08-01', phone: '(91) 98765 43210' },
    { id: 2, name: 'Dr. Suresh Verma', email: 's.verma@veda.com', specialization: 'Wellness Therapy', status: 'Active', licenseNumber: 'MED-1002', dob: '1990-11-20', gender: 'Male', department: 'Therapy Unit', joiningDate: '2015-05-10', phone: '(91) 98765 43211' },
    { id: 3, name: 'Dr. Anjali Puri', email: 'anjali.p@veda.com', specialization: 'Gynecology', status: 'Inactive', licenseNumber: 'MED-1003', dob: '1978-03-05', gender: 'Female', department: 'Women’s Health', joiningDate: '2005-01-20', phone: '(91) 98765 43212' },
    { id: 4, name: 'Dr. Deepak Sharma', email: 'd.sharma@veda.com', specialization: 'Surgery', status: 'On Leave', licenseNumber: 'MED-1004', dob: '1995-09-25', gender: 'Male', department: 'Surgical Care', joiningDate: '2018-03-15', phone: '(91) 98765 43213' },
    { id: 5, name: 'Dr. Preeti Das', email: 'preeti.d@veda.com', specialization: 'Pediatrics', status: 'Pending', licenseNumber: 'MED-1005', dob: '1982-07-12', gender: 'Female', department: 'Child Health', joiningDate: '2012-07-01', phone: '(91) 98765 43214' },
];

// --- Helper Components (Unchanged) ---
const StatusBadge = ({ status }: StatusBadgeProps) => {
    let colorClass = '';
    switch (status) {
        case 'Active': colorClass = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100'; break;
        case 'Inactive': colorClass = 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'; break;
        case 'Pending': colorClass = 'bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100'; break;
        case 'On Leave': colorClass = 'bg-sky-100 text-sky-800 dark:bg-sky-800 dark:text-sky-100'; break;
        default: colorClass = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
    }
    return (
        <span className={`px-3 py-1 inline-flex text-sm leading-5 font-medium rounded-full ${colorClass}`}>
            {status}
        </span>
    );
};

const DetailItem = ({ icon, label, value }: { icon?: React.ReactNode, label: string, value: string }) => (
    <div className="flex items-start space-x-4">
        {icon && <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">{icon}</div>}
        <div className='flex flex-col'>
            <p className="text-xs uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500">{label}</p>
            <p className="text-base font-bold text-gray-900 dark:text-white mt-0.5">{value}</p>
        </div>
    </div>
);

// --- Main Profile Component ---
const DoctorProfile = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const doctor = DUMMY_DOCTORS.find(d => d.id === parseInt(id || '0'));
    
    const getInitials = (name: string) => {
        const parts = name.split(' ').filter(p => p.length > 0);
        if (parts.length > 1) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return parts.length > 0 ? parts[0][0].toUpperCase() : 'DR';
    };

    if (!doctor) {
        return (
             <div className="min-h-[calc(100vh-100px)] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                 <div className="p-10 bg-white dark:bg-gray-800 rounded-lg shadow-xl text-center">
                     <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">404 - Doctor Not Found</h1>
                     <p className="text-gray-600 dark:text-gray-300">No profile found for ID: <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{id}</span></p>
                     <button
                         onClick={() => navigate('/user-management/doctors')}
                         className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 dark:bg-sky-700 dark:hover:bg-sky-600 transition"
                     >
                         Go Back to Doctors List
                     </button>
                 </div>
             </div>
        );
    }

    return (
        // The outer div should be the container for the entire page's content, allowing the admin layout to provide the background.
        <div className="w-full">
            
            {/* 1. Breadcrumbs Section */}
            <div className=" bg-gray-50 dark:bg-gray-900  dark:border-gray-700">
                <ul className="flex space-x-2 rtl:space-x-reverse text-sm font-medium">
                    <li>
                        <Link to="/user-management/doctors" className="text-[#d06f33] hover:text-[#ab5622] dark:text-[#d06f33] dark:hover:text-[#ab5622] transition">
                            User Management 
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <Link to="/user-management/doctors" className="text-[#d06f33] hover:text-[#ab5622] dark:text-[#d06f33] dark:hover:text-[#c16023] transition">
                            Doctors
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span className="text-gray-500 dark:text-gray-400">Profile: Dr. {doctor.id}</span>
                    </li>
                </ul>
            </div>

            {/* 2. Page Header/Title Section (Full Width, Distinct Color) */}
            <div className="bg-white dark:bg-gray-800 px-4 sm:px-6 py-6 mt-4 border-b border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-4">
                        {/* Avatar */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-yellow-100 text-[#d06f33] flex items-center justify-center text-2xl sm:text-3xl font-bold border-4 border-[#db7b3f] shadow-md">
                            {getInitials(doctor.name)}
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">{doctor.name}</h1>
                            <p className="text-lg text-gray-500 dark:text-gray-400 mt-1">{doctor.specialization} Specialist</p>
                        </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                        <button
                            title="Edit Profile"
                            className="p-3 bg-amber-500 text-white hover:bg-amber-600 rounded-lg transition shadow-md"
                            onClick={() => console.log(`Editing Doctor ${doctor.id}`)}
                        >
                            <IconEdit className="w-5 h-5" />
                        </button>
                        <button
                            title="Download Profile PDF"
                            className="p-3 bg-green-500 text-white hover:bg-green-600 rounded-lg transition shadow-md"
                            onClick={() => console.log(`Downloading Doctor ${doctor.id} profile`)}
                        >
                            <IconDownload className="w-5 h-5" />
                        </button>
                       
                    </div>
                </div>
            </div>

            {/* --- Main Content Area (With Margin/Padding to show background) --- */}
            <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-[calc(100vh-250px)]">
                <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                    
                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 dark:divide-gray-700">

                        {/* Left Column: Contact & Professional Details (1/3 width) */}
                        <div className="p-6 sm:p-8 space-y-8 lg:col-span-1">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white border-b pb-3 border-gray-200 dark:border-gray-700">Contact & Professional</h2>
                            
                            <div className="space-y-6">
                                <DetailItem 
                                    icon={<IconMail className="w-5 h-5 text-[#d06f33]" />} 
                                    label="Email Address" 
                                    value={doctor.email} 
                                />
                                <DetailItem 
                                    icon={<IconPhone className="w-5 h-5 text-[#d06f33]" />} 
                                    label="Phone Number" 
                                    value={doctor.phone || 'N/A'} 
                                />
                                <DetailItem 
                                    icon={<IconUser className="w-5 h-5 text-[#d06f33]" />} 
                                    label="License Number" 
                                    value={doctor.licenseNumber || 'N/A'} 
                                />
                                <DetailItem 
                                    icon={<IconCalendar className="w-5 h-5 text-[#d06f33]" />} 
                                    label="Department" 
                                    value={doctor.department || 'Ayurveda'} 
                                />
                            </div>
                        </div>

                        {/* Right Column: Status, Personal & Bio (2/3 width) */}
                        <div className="p-6 sm:p-8 space-y-8 lg:col-span-2">
                            
                            {/* Status Row */}
                            <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 pb-4 border-b border-gray-100 dark:border-gray-700'>
                                <div className='flex flex-col space-y-1'>
                                    <p className="text-xs uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500">Current Status</p>
                                    <StatusBadge status={doctor.status} />
                                </div>
                                <DetailItem label="Date of Birth" value={doctor.dob || 'N/A'} />
                                <DetailItem label="Joining Date" value={doctor.joiningDate || 'N/A'} />
                            </div>


                            {/* Bio / Description */}
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white border-b pb-3 mb-4 border-gray-200 dark:border-gray-700">Notes & Expertise</h2>
                                <div className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-5 rounded-lg border border-gray-200 dark:border-gray-600 shadow-inner">
                                    <p className='leading-relaxed'>
                                        Dr. **{doctor.name.split(' ').pop()}** (License: {doctor.licenseNumber || 'N/A'}) is a respected **{doctor.specialization}** specialist within the **{doctor.department || 'Ayurveda'}** department. Known for a commitment to patient well-being, Dr. {doctor.name.split(' ').pop()} emphasizes holistic wellness and preventive care, making them a core asset to the team since {doctor.joiningDate || 'N/A'}.
                                    </p>
                                </div>
                            </div>

                            {/* Additional Info (Optional) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                                 <DetailItem label="Gender" value={doctor.gender || 'N/A'} />
                                 <DetailItem label="Internal ID" value={`DOC-${doctor.id.toString().padStart(4, '0')}`} />
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorProfile;