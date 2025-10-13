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
import IconAward from '../../../../components/Icon/IconAward';

interface Therapist {
    id: number;
    name: string;
    email: string;
    specialty: 'Physiotherapist' | 'Occupational Therapist' | 'Speech Therapist' | 'Psychotherapist';
    schedule: 'Full-time' | 'Part-time' | 'Contract';
    status: 'Active' | 'Inactive' | 'On Leave' | 'Training';
    employeeId: string;
    licenseId: string;
    joiningDate?: string;
}

type StatusBadgeProps = { status: Therapist['status'] };

const DUMMY_THERAPISTS: Therapist[] = [
    { id: 101, employeeId: 'T-101', name: 'Dr. Rahul Verma', email: 'r.verma@rehab.com', specialty: 'Physiotherapist', schedule: 'Full-time', status: 'Active', licenseId: 'PT-1001', joiningDate: '2018-06-01' },
    { id: 102, employeeId: 'T-102', name: 'Sonal Desai', email: 's.desai@rehab.com', specialty: 'Occupational Therapist', schedule: 'Part-time', status: 'On Leave', licenseId: 'OT-2005', joiningDate: '2021-03-15' },
    { id: 103, employeeId: 'T-103', name: 'Amit Singh', email: 'a.singh@rehab.com', specialty: 'Speech Therapist', schedule: 'Full-time', status: 'Active', licenseId: 'ST-3012', joiningDate: '2022-09-20' },
    { id: 104, employeeId: 'T-104', name: 'Geeta Menon', email: 'g.menon@rehab.com', specialty: 'Psychotherapist', schedule: 'Contract', status: 'Training', licenseId: 'PY-4001', joiningDate: '2024-01-10' },
    { id: 105, employeeId: 'T-105', name: 'Vivek Kulkarni', email: 'v.kulkarni@rehab.com', specialty: 'Physiotherapist', schedule: 'Full-time', status: 'Inactive', licenseId: 'PT-1015', joiningDate: '2019-11-25' },
];

const StatusBadge = ({ status }: StatusBadgeProps) => {
    let colorClass = '';
    switch (status) {
        case 'Active':
            colorClass = 'bg-green-600 text-white dark:bg-green-800 dark:text-green-100';
            break;
        case 'Inactive':
            colorClass = 'bg-red-400 text-white dark:bg-red-700 dark:text-red-100';
            break;
        case 'Training':
            colorClass = 'bg-amber-400 text-amber-900 dark:bg-amber-600 dark:text-amber-100';
            break;
        case 'On Leave':
            colorClass = 'bg-blue-500 text-white dark:bg-blue-700 dark:text-blue-100';
            break;
        default:
            colorClass = 'bg-gray-400 text-gray-900 dark:bg-gray-700 dark:text-gray-100';
    }
    return (
        <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full shadow-sm ${colorClass}`}>
            {status}
        </span>
    );
};

const DetailItem = ({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) => (
    <div className="flex flex-col p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition duration-150 hover:shadow-md">
        <div className="flex items-center space-x-2 mb-1">
            {icon && <div className="text-green-600 dark:text-green-400">{icon}</div>}
            <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400">{label}</p>
        </div>
        <p className="font-bold text-gray-900 dark:text-white text-base">{value}</p>
    </div>
);

const TherapistGeneralInfoTab = ({ therapist }: { therapist: Therapist }) => (
    <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white border-b pb-3 mb-4 border-gray-200 dark:border-gray-700">
            Personal Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DetailItem icon={<IconUser className="w-5 h-5" />} label="Employee ID" value={therapist.employeeId} />
            <DetailItem icon={<IconAward className="w-5 h-5" />} label="License ID" value={therapist.licenseId} />
            <DetailItem icon={<IconMail className="w-5 h-5" />} label="Email Address" value={therapist.email} />
            <DetailItem icon={<IconPhone className="w-5 h-5" />} label="Contact Number" value="(91) 98765 12345" />
            <DetailItem icon={<IconCalendar className="w-5 h-5" />} label="Joining Date" value={therapist.joiningDate || 'N/A'} />
        </div>

        <div className="mt-8">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Status Overview</h4>
            <div className="p-5 border border-green-200 dark:border-green-800 rounded-lg bg-green-50 dark:bg-gray-700 shadow-inner flex items-center space-x-4">
                <p className="text-sm font-semibold text-green-700 dark:text-green-300">Current Status:</p>
                <StatusBadge status={therapist.status} />
            </div>
        </div>
    </div>
);

const TherapistWorkProfileTab = ({ therapist }: { therapist: Therapist }) => (
    <div className="space-y-8">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white border-b pb-3 mb-4 border-gray-200 dark:border-gray-700">
            Work Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DetailItem icon={<IconBox className="w-5 h-5" />} label="Specialty" value={therapist.specialty} />
            <DetailItem icon={<IconClock className="w-5 h-5" />} label="Schedule" value={therapist.schedule} />
            <DetailItem icon={<IconAward className="w-5 h-5" />} label="License ID" value={therapist.licenseId} />
        </div>

        <div className="mt-6">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Roles & Responsibilities</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>Provide rehabilitation and therapy sessions for patients.</li>
                <li>Collaborate with doctors to assess and plan treatments.</li>
                <li>Track progress and maintain detailed patient records.</li>
                <li>Stay updated on latest therapy techniques and certifications.</li>
            </ul>
        </div>
    </div>
);

const TherapistProfile = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'general' | 'work'>('general');

    const therapist = DUMMY_THERAPISTS.find(t => t.id === parseInt(id || '0'));

    const getInitials = (name: string) => {
        const parts = name.split(' ');
        return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0][0].toUpperCase();
    };

    const primaryColor = 'text-green-600';
    const primaryHover = 'hover:text-green-700';
    const avatarBg = 'bg-green-100';
    const avatarBorder = 'border-green-500';
    const avatarText = 'text-green-700';
    const tabActiveClasses = `border-b-4 border-green-600 font-bold ${primaryColor}`;
    const tabInactiveClasses = 'border-b-4 border-transparent text-gray-500 hover:text-green-600';

    if (!therapist) {
        return (
            <div className="min-h-[calc(100vh-100px)] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="p-10 bg-white dark:bg-gray-800 rounded-lg shadow-xl text-center">
                    <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">404 - Therapist Not Found</h1>
                    <p className="text-gray-600 dark:text-gray-300">No profile found for ID: <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{id}</span></p>
                    <button
                        onClick={() => navigate('/user-management/therapists')}
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
            {/* Breadcrumb */}
            <div className="bg-gray-50 dark:bg-gray-900 py-2 mb-4">
                <ul className="flex space-x-2 text-sm font-medium">
                    <li><Link to="/user-management/therapists" className={`${primaryColor} ${primaryHover}`}>User Management</Link></li>
                    <li className="before:content-['/'] before:mx-2 text-gray-500 dark:text-gray-400">
                        <Link to="/user-management/therapists" className={`${primaryColor} ${primaryHover}`} >
                            Therapists
                        </Link>
                    </li>
                    <li className="before:content-['/'] before:mx-2 text-gray-500 dark:text-gray-400">Profile: {therapist.employeeId}</li>
                </ul>
            </div>

            {/* Profile Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-gray-200 dark:border-gray-700 bg-green-50 dark:bg-gray-900/50">
                    <div className="flex flex-col sm:flex-row items-center justify-between">
                        <div className="flex items-center space-x-5">
                            <div className={`w-24 h-24 rounded-full ${avatarBg} ${avatarText} flex items-center justify-center text-4xl font-extrabold border-4 ${avatarBorder}`}>
                                {getInitials(therapist.name)}
                            </div>
                            <div>
                                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{therapist.name}</h1>
                                <div className="flex items-center space-x-3 mt-1">
                                    <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">ID: {therapist.employeeId}</p>
                                    <span className="text-gray-400 dark:text-gray-600">•</span>
                                    <p className={`text-lg font-semibold ${primaryColor}`}>Specialty: {therapist.specialty}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex space-x-3 mt-4 sm:mt-0">
                            <button title="Edit Therapist" className="p-3 bg-amber-500 text-white hover:bg-amber-600 rounded-full">
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
                        <TherapistGeneralInfoTab therapist={therapist} />
                    ) : (
                        <TherapistWorkProfileTab therapist={therapist} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default TherapistProfile;
