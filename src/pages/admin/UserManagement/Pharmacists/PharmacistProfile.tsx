// pages/admin/UserManagement/Pharmacists/PharmacistProfile.tsx

import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

import IconEdit from '../../../../components/Icon/IconEdit';
import IconDownload from '../../../../components/Icon/IconDownload';
import IconMail from '../../../../components/Icon/IconMail';
import IconPhone from '../../../../components/Icon/IconPhone';
import IconCalendar from '../../../../components/Icon/IconCalendar';
import IconUser from '../../../../components/Icon/IconUser'; 
import IconLock from '../../../../components/Icon/IconLock'; 
import IconHome from '../../../../components/Icon/IconHome'; 
import IconListCheck from '../../../../components/Icon/IconListCheck'; 
import NoDataFound from '../../../../components/NoDataFound';

// --- Data Types ---
interface Pharmacist {
    id: number;
    name: string;
    email: string;
    role: 'Head Pharmacist' | 'Senior' | 'Junior' | 'Trainee';
    status: 'Active' | 'Inactive' | 'On Leave' | 'Pending';
    licenseNumber: string;
    dob?: string;
    gender?: string;
    section: 'Dispensing' | 'Compounding' | 'Inventory' | 'Clinical';
    joiningDate?: string;
    phone?: string; 
    address?: string;
}

// Dummy data
const DUMMY_PHARMACISTS: Pharmacist[] = [
    { id: 1, name: 'Rohan Deshmukh', email: 'rohan.d@pharmacy.com', role: 'Head Pharmacist', status: 'Active', licenseNumber: 'PHM-5001', dob: '1975-06-15', gender: 'Male', section: 'Dispensing', joiningDate: '2005-08-01', phone: '(91) 98765 43210', address: '12-A, Pharma Tower, Mumbai' },
    { id: 2, name: 'Pooja Tandon', email: 'pooja.t@pharmacy.com', role: 'Senior', status: 'Active', licenseNumber: 'PHM-5002', dob: '1988-11-20', gender: 'Female', section: 'Compounding', joiningDate: '2012-05-10', phone: '(91) 87654 32109', address: '45, Chemist Road, Pune' },
];

// --- Helper Components ---
const StatusBadge = ({ status }: { status: Pharmacist['status'] }) => {
    const colorMap: Record<Pharmacist['status'], string> = {
        Active: "bg-green-600 text-white dark:bg-green-800 dark:text-green-100",
        Inactive: "bg-red-400 text-white dark:bg-red-700 dark:text-red-100",
        Pending: "bg-amber-400 text-amber-900 dark:bg-amber-600 dark:text-amber-100",
        "On Leave": "bg-blue-500 text-white dark:bg-blue-700 dark:text-blue-100",
    };
    return (
        <span className={`px-3 py-1 text-sm font-semibold rounded-full shadow-sm ${colorMap[status]}`}>
            {status}
        </span>
    );
};

const DetailItem = ({ icon, label, value, largeText = false }: { icon?: React.ReactNode, label: string, value: string, largeText?: boolean }) => (
    <div className="flex flex-col p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition duration-150 hover:shadow-md">
        <div className="flex items-center space-x-2 mb-1">
            {icon && <div className="text-green-600 dark:text-green-400">{icon}</div>}
            <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400">{label}</p>
        </div>
        <p className={`font-bold text-gray-900 dark:text-white ${largeText ? 'text-xl' : 'text-base'}`}>{value}</p>
    </div>
);

// Tabs
const GeneralInfoTab = ({ pharmacist }: { pharmacist: Pharmacist }) => (
    <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white border-b pb-3 mb-4 border-gray-200 dark:border-gray-700">Contact & Personal Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DetailItem icon={<IconMail className="w-5 h-5" />} label="Email Address" value={pharmacist.email} />
            <DetailItem icon={<IconPhone className="w-5 h-5" />} label="Phone Number" value={pharmacist.phone || 'N/A'} />
            <DetailItem icon={<IconCalendar className="w-5 h-5" />} label="Date of Birth" value={pharmacist.dob || 'N/A'} />
            <DetailItem icon={<IconUser className="w-5 h-5" />} label="Gender" value={pharmacist.gender || 'N/A'} />
            <DetailItem icon={<IconHome className="w-5 h-5" />} label="Address" value={pharmacist.address || 'N/A'} />
        </div>
    </div>
);

const EmploymentDetailsTab = ({ pharmacist }: { pharmacist: Pharmacist }) => (
    <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white border-b pb-3 mb-4 border-gray-200 dark:border-gray-700">Employment & Credentials</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <DetailItem icon={<IconLock className="w-5 h-5" />} label="License Number" value={pharmacist.licenseNumber} largeText />
            <DetailItem icon={<IconUser className="w-5 h-5" />} label="Role" value={pharmacist.role} largeText />
            <DetailItem icon={<IconCalendar className="w-5 h-5" />} label="Joining Date" value={pharmacist.joiningDate || 'N/A'} />
            <DetailItem icon={<IconUser className="w-5 h-5" />} label="Section" value={pharmacist.section} />
        </div>

        <div className="p-5 border border-green-200 dark:border-green-800 rounded-lg bg-green-50 dark:bg-gray-700 shadow-inner">
            <p className="text-xs uppercase tracking-wider font-bold text-green-600 dark:text-green-400 mb-2">Current Status</p>
            <StatusBadge status={pharmacist.status} />
        </div>

        <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mt-8 mb-3">Role Overview</h4>
            <div className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-5 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className="leading-relaxed">
                    <b>{pharmacist.name.split(' ').pop()}</b> serves as a <b>{pharmacist.role}</b> in <b>{pharmacist.section}</b>. They ensure high-quality pharmacy operations and patient safety.
                </p>
            </div>
        </div>
    </div>
);

// Main Component
const PharmacistProfile = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'general' | 'employment'>('general');

    const pharmacist = DUMMY_PHARMACISTS.find(d => d.id === parseInt(id || '0'));

    const getInitials = (name: string) => {
        const parts = name.split(' ');
        return parts.length > 1 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : parts[0][0].toUpperCase();
    };

    // Emerald/Green Theme
    const primaryColor = 'text-green-600';
    const primaryHover = 'hover:text-green-700';
    const avatarBg = 'bg-green-100';
    const avatarBorder = 'border-green-500';
    const avatarText = 'text-green-700';
    const tabActiveClasses = `border-b-4 border-green-600 font-bold ${primaryColor}`;
    const tabInactiveClasses = 'border-b-4 border-transparent text-gray-500 hover:text-green-600';

    if (!pharmacist) {
        return (
            <div className="min-h-[calc(100vh-100px)] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <NoDataFound />
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Breadcrumbs */}
            <div className="bg-gray-50 dark:bg-gray-900 py-2 mb-4">
                <ul className="flex space-x-2 text-sm font-medium">
                    <li><Link to="/user-management/pharmacists" className={`${primaryColor} ${primaryHover}`}>User Management</Link></li>
                    <li className="before:content-['/'] before:mx-2"><Link to="/user-management/pharmacists" className={`${primaryColor} ${primaryHover}`}>Pharmacists</Link></li>
                    <li className="before:content-['/'] before:mx-2 text-gray-500 dark:text-gray-400">Profile: {pharmacist.licenseNumber}</li>
                </ul>
            </div>

            {/* Profile Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl mt-4 overflow-hidden">
                {/* Header */}
                <div className="p-6 sm:p-8 border-b border-gray-200 dark:border-gray-700 bg-green-50 dark:bg-gray-900/50">
                    <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                        <div className="flex items-center space-x-5">
                            <div className={`w-24 h-24 rounded-full ${avatarBg} ${avatarText} flex items-center justify-center text-4xl font-extrabold border-4 ${avatarBorder} shadow-lg`}>
                                {getInitials(pharmacist.name)}
                            </div>
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">{pharmacist.name}</h1>
                                <div className="flex items-center space-x-3 mt-1">
                                    <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">{pharmacist.role}</p>
                                    <span className="text-gray-400 dark:text-gray-600">•</span>
                                    <p className={`text-lg font-semibold ${primaryColor}`}>{pharmacist.licenseNumber}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-3 mt-4 sm:mt-0">
                            <button className="p-3 bg-green-500 text-white hover:bg-green-600 rounded-full transition shadow-lg"><IconEdit className="w-5 h-5" /></button>
                            <button className="p-3 bg-gray-300 text-gray-800 hover:bg-gray-400 rounded-full transition shadow-lg dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"><IconDownload className="w-5 h-5" /></button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700 px-6 sm:px-8">
                    <div className="flex space-x-6 -mb-px">
                        <button onClick={() => setActiveTab('general')} className={`py-4 px-1 text-sm font-medium focus:outline-none ${activeTab === 'general' ? tabActiveClasses : tabInactiveClasses}`}>
                            <IconHome className="w-5 h-5 inline mr-2" /> General Info
                        </button>
                        <button onClick={() => setActiveTab('employment')} className={`py-4 px-1 text-sm font-medium focus:outline-none ${activeTab === 'employment' ? tabActiveClasses : tabInactiveClasses}`}>
                            <IconListCheck className="w-5 h-5 inline mr-2" /> Employment Details
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="p-6 sm:p-8 min-h-[400px]">
                    {activeTab === 'general' ? <GeneralInfoTab pharmacist={pharmacist} /> : <EmploymentDetailsTab pharmacist={pharmacist} />}
                </div>
            </div>
        </div>
    );
};

export default PharmacistProfile;
