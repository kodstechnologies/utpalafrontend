import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

// Icons
import IconEdit from '../../../../components/Icon/IconEdit';
import IconDownload from '../../../../components/Icon/IconDownload';
import IconMail from '../../../../components/Icon/IconMail';
import IconPhone from '../../../../components/Icon/IconPhone';
import IconCalendar from '../../../../components/Icon/IconCalendar';
import IconUser from '../../../../components/Icon/IconUser';
import IconBox from '../../../../components/Icon/IconBox';
import IconHome from '../../../../components/Icon/IconHome';
import IconFile from '../../../../components/Icon/IconFile';
import IconClock from '../../../../components/Icon/IconClock';

// --- Data Types and Dummy Data ---
interface Receptionist {
    id: number;
    name: string;
    email: string;
    shift: 'Morning' | 'Afternoon' | 'Evening' | 'Full Day';
    status: 'Active' | 'Inactive' | 'On Leave' | 'Training';
    employeeId: string;
    dob?: string;
    gender?: string;
    department: 'Front Desk' | 'Billing' | 'Admissions';
    joiningDate?: string;
}

type StatusBadgeProps = { status: Receptionist['status'] };

const DUMMY_RECEPTIONISTS: Receptionist[] = [
    { id: 1, employeeId: 'R-001', name: 'Manoj Patel', email: 'manoj.p@veda.com', shift: 'Morning', status: 'Active', department: 'Front Desk', joiningDate: '2021-01-15' },
    { id: 2, employeeId: 'R-002', name: 'Neha Sharma', email: 'neha.s@veda.com', shift: 'Full Day', status: 'On Leave', department: 'Admissions', joiningDate: '2020-05-20' },
    { id: 3, employeeId: 'R-003', name: 'Vijay Kumar', email: 'vijay.k@veda.com', shift: 'Evening', status: 'Inactive', department: 'Billing', joiningDate: '2022-08-01' },
    { id: 4, employeeId: 'R-004', name: 'Priya Reddy', email: 'priya.r@veda.com', shift: 'Morning', status: 'Active', department: 'Front Desk', joiningDate: '2019-03-10' },
    { id: 5, employeeId: 'R-005', name: 'Gopal Krishnan', email: 'gopal.k@veda.com', shift: 'Afternoon', status: 'Training', department: 'Admissions', joiningDate: '2023-11-01' },
];

// --- Helper Components ---
const StatusBadge = ({ status }: StatusBadgeProps) => {
    let colorClass = '';
    switch (status) {
        case 'Active': colorClass = 'bg-green-600 text-white dark:bg-green-800 dark:text-green-100'; break;
        case 'Inactive': colorClass = 'bg-red-400 text-white dark:bg-red-700 dark:text-red-100'; break;
        case 'Training': colorClass = 'bg-amber-400 text-amber-900 dark:bg-amber-600 dark:text-amber-100'; break;
        case 'On Leave': colorClass = 'bg-blue-500 text-white dark:bg-blue-700 dark:text-blue-100'; break;
        default: colorClass = 'bg-gray-400 text-gray-900 dark:bg-gray-700 dark:text-gray-100';
    }
    return (
        <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full shadow-sm ${colorClass}`}>
            {status}
        </span>
    );
};

const DetailItem = ({ icon, label, value }: { icon?: React.ReactNode, label: string, value: string }) => (
    <div className="flex flex-col p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition duration-150 hover:shadow-md">
        <div className="flex items-center space-x-2 mb-1">
            {icon && <div className="text-green-600 dark:text-green-400">{icon}</div>}
            <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400">{label}</p>
        </div>
        <p className="font-bold text-gray-900 dark:text-white text-base">{value}</p>
    </div>
);

// --- Tab Content Components ---
const ReceptionistGeneralInfoTab = ({ receptionist }: { receptionist: Receptionist }) => (
    <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white border-b pb-3 mb-4 border-gray-200 dark:border-gray-700">
            Personal Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DetailItem icon={<IconUser className="w-5 h-5" />} label="Employee ID" value={receptionist.employeeId} />
            <DetailItem icon={<IconBox className="w-5 h-5" />} label="Department" value={receptionist.department} />
            <DetailItem icon={<IconClock className="w-5 h-5" />} label="Shift" value={receptionist.shift} />
            <DetailItem icon={<IconCalendar className="w-5 h-5" />} label="Joining Date" value={receptionist.joiningDate || 'N/A'} />
            <DetailItem icon={<IconMail className="w-5 h-5" />} label="Email Address" value={receptionist.email} />
            <DetailItem icon={<IconPhone className="w-5 h-5" />} label="Phone Number" value="(91) 98765 43210" />
        </div>

        <div className="mt-8">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Status Overview</h4>
            <div className="p-5 border border-green-200 dark:border-green-800 rounded-lg bg-green-50 dark:bg-gray-700 shadow-inner flex items-center space-x-4">
                <p className='text-sm font-semibold text-green-700 dark:text-green-300'>Current Status:</p>
                <StatusBadge status={receptionist.status} />
            </div>
        </div>
    </div>
);

const ReceptionistWorkProfileTab = ({ receptionist }: { receptionist: Receptionist }) => (
    <div className="space-y-8">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white border-b pb-3 mb-4 border-gray-200 dark:border-gray-700">
            Work Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DetailItem icon={<IconUser className="w-5 h-5" />} label="Employee Name" value={receptionist.name} />
            <DetailItem icon={<IconBox className="w-5 h-5" />} label="Department" value={receptionist.department} />
            <DetailItem icon={<IconClock className="w-5 h-5" />} label="Shift Timing" value={receptionist.shift} />
            <DetailItem icon={<IconCalendar className="w-5 h-5" />} label="Joining Date" value={receptionist.joiningDate || 'N/A'} />
            <DetailItem icon={<IconMail className="w-5 h-5" />} label="Official Email" value={receptionist.email} />
        </div>

        <div className="mt-6">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Duties & Responsibilities</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>Handling front desk operations and assisting visitors.</li>
                <li>Managing calls, emails, and appointment scheduling.</li>
                <li>Coordinating between departments for smooth operations.</li>
                <li>Maintaining visitor and staff records efficiently.</li>
            </ul>
        </div>
    </div>
);

// --- Main Profile Component ---
const ReceptionistProfile = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'general' | 'work'>('general');

    const receptionist = DUMMY_RECEPTIONISTS.find(r => r.id === parseInt(id || '0'));

    const getInitials = (name: string) => {
        const parts = name.split(' ');
        if (parts.length > 1) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return parts[0][0].toUpperCase();
    };

    const primaryColor = 'text-green-600';
    const primaryHover = 'hover:text-green-700';
    const avatarBg = 'bg-green-100';
    const avatarBorder = 'border-green-500';
    const avatarText = 'text-green-700';
    const tabActiveClasses = `border-b-4 border-green-600 font-bold ${primaryColor}`;
    const tabInactiveClasses = 'border-b-4 border-transparent text-gray-500 hover:text-green-600';

    if (!receptionist) {
        return (
            <div className="min-h-[calc(100vh-100px)] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="p-10 bg-white dark:bg-gray-800 rounded-lg shadow-xl text-center">
                    <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">404 - Receptionist Not Found</h1>
                    <p className="text-gray-600 dark:text-gray-300">No profile found for ID: <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{id}</span></p>
                    <button
                        onClick={() => navigate('/user-management/receptionists')}
                        className="mt-6 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 transition"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Breadcrumbs */}
            <div className="bg-gray-50 dark:bg-gray-900 py-2 mb-4">
                <ul className="flex space-x-2 text-sm font-medium">
                    <li><Link to="/user-management/receptionists" className={`${primaryColor} ${primaryHover}`}>User Management</Link></li>
                    <li className="before:content-['/'] before:mx-2 text-gray-500 dark:text-gray-400"><Link to="/user-management/receptionists" className={`${primaryColor} ${primaryHover}`}>Receptionists</Link></li>
                    <li className="before:content-['/'] before:mx-2 text-gray-500 dark:text-gray-400">Profile: {receptionist.employeeId}</li>
                </ul>
            </div>

            {/* Profile Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-gray-200 dark:border-gray-700 bg-green-50 dark:bg-gray-900/50">
                    <div className="flex flex-col sm:flex-row items-center justify-between">
                        <div className="flex items-center space-x-5">
                            <div className={`w-24 h-24 rounded-full ${avatarBg} ${avatarText} flex items-center justify-center text-4xl font-extrabold border-4 ${avatarBorder}`}>
                                {getInitials(receptionist.name)}
                            </div>
                            <div>
                                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{receptionist.name}</h1>
                                <div className="flex items-center space-x-3 mt-1">
                                    <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">ID: {receptionist.employeeId}</p>
                                    <span className="text-gray-400 dark:text-gray-600">•</span>
                                    <p className={`text-lg font-semibold ${primaryColor}`}>Dept: {receptionist.department}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex space-x-3 mt-4 sm:mt-0">
                            <button title="Edit Receptionist" className="p-3 bg-amber-500 text-white hover:bg-amber-600 rounded-full">
                                <IconEdit className="w-5 h-5" />
                            </button>
                            <button title="Download Record" className="p-3 bg-green-500 text-white hover:bg-green-600 rounded-full">
                                <IconDownload className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700 px-6 sm:px-8">
                    <div className="flex space-x-6 -mb-px">
                        <button onClick={() => setActiveTab('general')} className={`py-4 px-1 text-sm font-medium ${activeTab === 'general' ? tabActiveClasses : tabInactiveClasses}`}>
                            <IconHome className="w-5 h-5 inline mr-2" /> General Info
                        </button>
                        <button onClick={() => setActiveTab('work')} className={`py-4 px-1 text-sm font-medium ${activeTab === 'work' ? tabActiveClasses : tabInactiveClasses}`}>
                            <IconFile className="w-5 h-5 inline mr-2" /> Work Profile
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="p-6 sm:p-8 min-h-[400px]">
                    {activeTab === 'general' ? (
                        <ReceptionistGeneralInfoTab receptionist={receptionist} />
                    ) : (
                        <ReceptionistWorkProfileTab receptionist={receptionist} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReceptionistProfile;
