// pages/admin/UserManagement/Doctors/DoctorProfile.tsx

import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

// Icons
import IconEdit from '../../../../components/Icon/IconEdit';
import IconDownload from '../../../../components/Icon/IconDownload';
import IconMail from '../../../../components/Icon/IconMail';
import IconPhone from '../../../../components/Icon/IconPhone';
import IconCalendar from '../../../../components/Icon/IconCalendar';
import IconUser from '../../../../components/Icon/IconUser';
import IconHome from '../../../../components/Icon/IconHome';
import IconListCheck from '../../../../components/Icon/IconListCheck';

// -------------------------------------------------------------

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
    address?: string;
}

// Dummy Data
const DUMMY_DOCTORS: Doctor[] = [
    { id: 1, name: 'Dr. Kavita Rao', email: 'k.rao@veda.com', specialization: 'Internal Medicine', status: 'Active', licenseNumber: 'MED-1001', dob: '1985-06-15', gender: 'Female', department: 'General Medicine', joiningDate: '2010-08-01', phone: '(91) 98765 43210', address: '401, Health Block, Mumbai' },
    { id: 2, name: 'Dr. Suresh Verma', email: 's.verma@veda.com', specialization: 'Wellness Therapy', status: 'Active', licenseNumber: 'MED-1002', dob: '1990-11-20', gender: 'Male', department: 'Therapy Unit', joiningDate: '2015-05-10', phone: '(91) 98765 43211', address: 'A-202, Wellness Center, Delhi' },
];

// -------------------------------------------------------------
// Status Badge
const StatusBadge = ({ status }: { status: Doctor['status'] }) => {
    const colorMap: Record<Doctor['status'], string> = {
        Active: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
        Inactive: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
        Pending: 'bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100',
        'On Leave': 'bg-sky-100 text-sky-800 dark:bg-sky-800 dark:text-sky-100',
    };
    return (
        <span className={`px-3 py-1 inline-flex text-sm leading-5 font-medium rounded-full ${colorMap[status]}`}>
            {status}
        </span>
    );
};

// Detail Item
const DetailItem = ({ icon, label, value, largeText = false }: { icon?: React.ReactNode, label: string, value: string, largeText?: boolean }) => (
    <div className="flex flex-col p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition duration-150 hover:shadow-md">
        <div className="flex items-center space-x-2 mb-1">
            {icon && <div className="text-green-500 dark:text-green-400">{icon}</div>}
            <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400">{label}</p>
        </div>
        <p className={`font-bold text-gray-900 dark:text-white ${largeText ? 'text-xl' : 'text-base'}`}>{value}</p>
    </div>
);

// -------------------------------------------------------------
// Tabs Content
const GeneralInfoTab = ({ doctor }: { doctor: Doctor }) => (
    <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white border-b pb-3 mb-4 border-gray-200 dark:border-gray-700">Contact & Personal Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DetailItem icon={<IconMail className="w-5 h-5" />} label="Email Address" value={doctor.email} />
            <DetailItem icon={<IconPhone className="w-5 h-5" />} label="Phone Number" value={doctor.phone || 'N/A'} />
            <DetailItem icon={<IconCalendar className="w-5 h-5" />} label="Date of Birth" value={doctor.dob || 'N/A'} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem icon={<IconUser className="w-5 h-5" />} label="Gender" value={doctor.gender || 'N/A'} />
            <DetailItem icon={<IconHome className="w-5 h-5" />} label="Registered Address" value={doctor.address || 'N/A'} />
        </div>
    </div>
);

const ProfessionalDetailsTab = ({ doctor }: { doctor: Doctor }) => (
    <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white border-b pb-3 mb-4 border-gray-200 dark:border-gray-700">Professional Credentials & Employment</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <DetailItem icon={<IconUser className="w-5 h-5" />} label="Specialization" value={doctor.specialization} largeText />
            <DetailItem icon={<IconUser className="w-5 h-5" />} label="Department" value={doctor.department || 'N/A'} largeText />
            <DetailItem icon={<IconUser className="w-5 h-5" />} label="License Number" value={doctor.licenseNumber || 'N/A'} />
            <DetailItem icon={<IconCalendar className="w-5 h-5" />} label="Joining Date" value={doctor.joiningDate || 'N/A'} />
        </div>
        <div className="p-5 border border-green-200 dark:border-green-800 rounded-lg bg-green-50 dark:bg-gray-700 shadow-inner">
            <p className='text-xs uppercase tracking-wider font-bold text-green-600 dark:text-green-400 mb-2'>Current Status</p>
            <StatusBadge status={doctor.status} />
        </div>
        <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mt-8 mb-3">Notes & Expertise</h4>
            <div className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-5 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className='leading-relaxed'>
                    Dr. <b>{doctor.name.split(' ').pop()}</b> (License: {doctor.licenseNumber || 'N/A'}) is a respected <b>{doctor.specialization}</b> specialist in the <b>{doctor.department || 'General'}</b> department. Known for commitment to patient well-being, Dr. {doctor.name.split(' ').pop()} emphasizes holistic care and preventive wellness, contributing significantly since {doctor.joiningDate || 'N/A'}.
                </p>
            </div>
        </div>
    </div>
);

// -------------------------------------------------------------
// Main Profile Component
const DoctorProfile = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'general' | 'professional'>('general');

    const doctor = DUMMY_DOCTORS.find(d => d.id === parseInt(id || '0'));

    const getInitials = (name: string) => {
        const parts = name.split(' ').filter(p => p.length > 0);
        if (parts.length > 1) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        return parts.length > 0 ? parts[0][0].toUpperCase() : 'DR';
    };

    // Theme
    const primaryColor = 'text-green-600';
    const primaryHover = 'hover:text-green-700';
    const avatarBg = 'bg-green-100';
    const avatarBorder = 'border-green-600';
    const avatarText = 'text-green-700';
    const tabActiveClasses = `border-b-4 border-green-600 font-bold ${primaryColor}`;
    const tabInactiveClasses = 'border-b-4 border-transparent text-gray-500 hover:text-green-600';

    if (!doctor) {
        return (
            <div className="min-h-[calc(100vh-100px)] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="p-10 bg-white dark:bg-gray-800 rounded-lg shadow-xl text-center">
                    <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">404 - Doctor Not Found</h1>
                    <button
                        onClick={() => navigate('/user-management/doctors')}
                        className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 transition"
                    >
                        Go Back to Doctors List
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Breadcrumbs */}
            <div className="bg-gray-50 dark:bg-gray-900 py-2">
                <ul className="flex space-x-2 rtl:space-x-reverse text-sm font-medium">
                    <li><Link to="/user-management/doctors" className={`${primaryColor} ${primaryHover} dark:text-green-400 dark:hover:text-green-300 transition`}>User Management</Link></li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <Link to="/user-management/doctors" className={`${primaryColor} ${primaryHover} dark:text-green-400 dark:hover:text-green-300 transition`}>Doctors</Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span className="text-gray-500 dark:text-gray-400">Profile: Dr. {doctor.id}</span>
                    </li>
                </ul>
            </div>

            {/* Main Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl mt-4 overflow-hidden">
                {/* Header */}
                <div className="p-6 sm:p-8 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                    <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                        <div className="flex items-center space-x-5">
                            <div className={`w-24 h-24 rounded-full ${avatarBg} ${avatarText} flex items-center justify-center text-4xl font-extrabold border-4 ${avatarBorder} shadow-lg`}>
                                {getInitials(doctor.name)}
                            </div>
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">{doctor.name}</h1>
                                <div className='flex items-center space-x-3 mt-1'>
                                    <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">{doctor.specialization}</p>
                                    <span className="text-gray-400 dark:text-gray-600">•</span>
                                    <p className={`text-lg font-semibold ${primaryColor}`}>License: {doctor.licenseNumber || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                        {/* Action Buttons */}
                        <div className="flex space-x-3 mt-4 sm:mt-0">
                            <button
                                title="Edit Profile"
                                className="p-3 bg-green-500 text-white hover:bg-green-600 rounded-full transition shadow-lg"
                            >
                                <IconEdit className="w-5 h-5" />
                            </button>
                            <button
                                title="Download Profile PDF"
                                className="p-3 bg-gray-300 text-gray-800 hover:bg-gray-400 rounded-full transition shadow-lg dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                            >
                                <IconDownload className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700 px-6 sm:px-8">
                    <div className="flex space-x-6 -mb-px">
                        <button
                            onClick={() => setActiveTab('general')}
                            className={`py-4 px-1 text-sm font-medium focus:outline-none transition duration-150 ease-in-out ${activeTab === 'general' ? tabActiveClasses : tabInactiveClasses}`}
                        >
                            <IconHome className="w-5 h-5 inline mr-2 align-text-bottom" />
                            General Info
                        </button>
                        <button
                            onClick={() => setActiveTab('professional')}
                            className={`py-4 px-1 text-sm font-medium focus:outline-none transition duration-150 ease-in-out ${activeTab === 'professional' ? tabActiveClasses : tabInactiveClasses}`}
                        >
                            <IconListCheck className="w-5 h-5 inline mr-2 align-text-bottom" />
                            Professional Details
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="p-6 sm:p-8 min-h-[400px]">
                    {activeTab === 'general' ? <GeneralInfoTab doctor={doctor} /> : <ProfessionalDetailsTab doctor={doctor} />}
                </div>
            </div>
        </div>
    );
};

export default DoctorProfile;
