// pages/admin/UserManagement/Patients/PatientProfile.tsx

import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

// Assuming these icons are available from your component path
import IconEdit from '../../../../components/Icon/IconEdit';
import IconDownload from '../../../../components/Icon/IconDownload';
import IconMail from '../../../../components/Icon/IconMail';
import IconPhone from '../../../../components/Icon/IconPhone';
import IconCalendar from '../../../../components/Icon/IconCalendar';
import IconUser from '../../../../components/Icon/IconUser'; 
import IconHeart from '../../../../components/Icon/IconHeart'; 
import IconHome from '../../../../components/Icon/IconHome'; // For General Info Tab
import IconFile from '../../../../components/Icon/IconFile';
// --- Data Types and Dummy Data (Unchanged) ---
interface Patient {
    id: number;
    name: string;
    patientId: string;
    dob: string;
    gender: 'Male' | 'Female' | 'Other';
    bodyType: 'Vata' | 'Pitta' | 'Kapha' | 'Tridosha';
    status: 'Active' | 'Discharged' | 'Pending Admission' | 'Follow-up';
    phone: string;
    email: string;
    primaryDoctor?: string;
    admissionDate?: string;
}

type StatusBadgeProps = { status: Patient['status'] };
const DUMMY_PATIENTS: Patient[] = [
    { id: 1, patientId: 'P-00101', name: 'Alia Bhatt', phone: '(91) 98765 43210', email: 'alia.b@patient.com', dob: '1995-03-14', gender: 'Female', bodyType: 'Vata', status: 'Active', primaryDoctor: 'Dr. Kavita Rao', admissionDate: '2024-05-10' },
    { id: 2, patientId: 'P-00102', name: 'Rajesh Khanna', phone: '(91) 87654 32109', email: 'r.khanna@patient.com', dob: '1968-11-20', gender: 'Male', bodyType: 'Pitta', status: 'Pending Admission', primaryDoctor: 'Dr. Suresh Verma', admissionDate: '2024-06-01' },
    { id: 3, patientId: 'P-00103', name: 'Sarla Devi', phone: '(91) 76543 21098', email: 'sarla.d@patient.com', dob: '1982-01-25', gender: 'Female', bodyType: 'Kapha', status: 'Follow-up', primaryDoctor: 'Dr. Anjali Puri', admissionDate: '2024-04-15' },
    { id: 4, patientId: 'P-00104', name: 'Amit Singh', phone: '(91) 65432 10987', email: 'amit.s@patient.com', dob: '1975-09-01', gender: 'Male', bodyType: 'Tridosha', status: 'Discharged', primaryDoctor: 'Dr. Deepak Sharma', admissionDate: '2024-03-20' },
    { id: 5, patientId: 'P-00105', name: 'Priya Mani', phone: '(91) 54321 09876', email: 'priya.m@patient.com', dob: '2000-07-12', gender: 'Female', bodyType: 'Vata', status: 'Active', primaryDoctor: 'Dr. Preeti Das', admissionDate: '2024-05-25' },
];

// --- Helper Components ---

const StatusBadge = ({ status }: StatusBadgeProps) => {
    let colorClass = '';
    switch (status) {
        case 'Active': colorClass = 'bg-green-600 text-white dark:bg-green-700 dark:text-green-100'; break;
        case 'Discharged': colorClass = 'bg-gray-400 text-gray-900 dark:bg-gray-700 dark:text-gray-100'; break;
        case 'Pending Admission': colorClass = 'bg-amber-400 text-amber-900 dark:bg-amber-600 dark:text-amber-100'; break;
        case 'Follow-up': colorClass = 'bg-blue-500 text-white dark:bg-blue-700 dark:text-blue-100'; break;
        default: colorClass = 'bg-gray-400 text-gray-900 dark:bg-gray-700 dark:text-gray-100';
    }
    return (
        <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full shadow-sm ${colorClass}`}>
            {status}
        </span>
    );
};

// DetailItem adapted to the new card style, using Green theme color for icons
const DetailItem = ({ icon, label, value, largeText = false }: { icon?: React.ReactNode, label: string, value: string, largeText?: boolean }) => (
    <div className="flex flex-col p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition duration-150 hover:shadow-md">
        <div className="flex items-center space-x-2 mb-1">
            {/* Using text-green-600 for the icon color */}
            {icon && <div className="text-green-600 dark:text-green-400">{icon}</div>} 
            <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400">{label}</p>
        </div>
        <p className={`font-bold text-gray-900 dark:text-white ${largeText ? 'text-xl' : 'text-base'}`}>{value}</p>
    </div>
);


// --- Tab Content Components ---

const PatientGeneralInfoTab = ({ patient }: { patient: Patient }) => (
    <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white border-b pb-3 mb-4 border-gray-200 dark:border-gray-700">Personal & Contact Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DetailItem 
                icon={<IconUser className="w-5 h-5" />} 
                label="Gender" 
                value={patient.gender} 
            />
            <DetailItem 
                icon={<IconCalendar className="w-5 h-5" />} 
                label="Date of Birth" 
                value={patient.dob} 
            />
             <DetailItem 
                icon={<IconPhone className="w-5 h-5" />} 
                label="Phone Number" 
                value={patient.phone} 
            />
            <DetailItem 
                icon={<IconMail className="w-5 h-5" />} 
                label="Email Address" 
                value={patient.email} 
            />
        </div>
    </div>
);

const PatientMedicalProfileTab = ({ patient }: { patient: Patient }) => (
    <div className="space-y-8">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white border-b pb-3 mb-4 border-gray-200 dark:border-gray-700">Admission & Ayurvedic Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <DetailItem 
                icon={<IconHeart className="w-5 h-5 text-red-500" />} 
                label="Body Type (Dosha)" 
                value={patient.bodyType} 
                largeText={true}
            />
            <DetailItem 
                icon={<IconUser className="w-5 h-5" />} 
                label="Primary Doctor" 
                value={patient.primaryDoctor || 'Unassigned'} 
                largeText={true}
            />
            <DetailItem 
                icon={<IconCalendar className="w-5 h-5" />} 
                label="Admission Date" 
                value={patient.admissionDate || 'N/A'} 
            />
            <DetailItem 
                icon={<IconUser className="w-5 h-5" />} 
                label="Patient File ID" 
                value={patient.patientId} 
            />
        </div>

        {/* Status Box - uses a themed background */}
        <div className="p-5 border border-green-200 dark:border-green-800 rounded-lg bg-green-50 dark:bg-gray-700 shadow-inner">
            <p className='text-xs uppercase tracking-wider font-bold text-green-600 dark:text-green-400 mb-2'>Current Admission Status</p>
            <StatusBadge status={patient.status} />
        </div>

        {/* Bio / Description */}
        <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mt-8 mb-3">Summary</h4>
            <div className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-5 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className='leading-relaxed'>
                    Patient **{patient.name}** is currently classified under the **{patient.bodyType}** *Dosha* profile. Their primary care physician is **{patient.primaryDoctor || 'Unassigned'}**. Admission began on {patient.admissionDate || 'N/A'}, and their current status is **{patient.status}**. Further detailed medical history and treatment plans are available in the attached files.
                </p>
            </div>
        </div>
    </div>
);


// --- Main Profile Component ---
const PatientProfile = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'general' | 'medical'>('general');

    // Find patient using DUMMY_PATIENTS data structure
    const patient = DUMMY_PATIENTS.find(p => p.id === parseInt(id || '0'));
    
    // Helper function to get initials for the Avatar
    const getInitials = (name: string) => {
        const parts = name.split(' ').filter(p => p.length > 0);
        if (parts.length > 1) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return parts.length > 0 ? parts[0][0].toUpperCase() : 'PT';
    };

    // Patient Color Theme: Green/Teal
    const primaryColor = 'text-green-600'; 
    const primaryHover = 'hover:text-green-700';
    const avatarBg = 'bg-green-100';
    const avatarBorder = 'border-green-500';
    const avatarText = 'text-green-700';
    const tabActiveClasses = `border-b-4 border-green-600 font-bold ${primaryColor}`;
    const tabInactiveClasses = 'border-b-4 border-transparent text-gray-500 hover:text-green-600';

    if (!patient) {
        return (
             <div className="min-h-[calc(100vh-100px)] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                 <div className="p-10 bg-white dark:bg-gray-800 rounded-lg shadow-xl text-center">
                     <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">404 - Patient Not Found</h1>
                     <p className="text-gray-600 dark:text-gray-300">No profile found for ID: <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{id}</span></p>
                     <button
                         onClick={() => navigate('/my-patients')}
                         className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 dark:bg-sky-700 dark:hover:bg-sky-600 transition"
                     >
                         Go Back to Patients List
                     </button>
                 </div>
             </div>
        );
    }

    return (
        <div className="w-full">
            
            {/* 1. Breadcrumbs Section */}
            <div className="bg-gray-50 dark:bg-gray-900 py-2 mb-4">
                <ul className="flex space-x-2 rtl:space-x-reverse text-sm font-medium">
                    <li><Link to="/user-management/patients" className={`${primaryColor} ${primaryHover} transition`}>User Management</Link></li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <Link to="/user-management/patients" className={`${primaryColor} ${primaryHover} transition`}>Patients</Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span className="text-gray-500 dark:text-gray-400">Profile: {patient.patientId}</span>
                    </li>
                </ul>
            </div>

            {/* 2. Main Profile Card (New Tabbed Style) */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
                
                {/* Profile Header */}
                <div className="p-6 sm:p-8 border-b border-gray-200 dark:border-gray-700 bg-green-50 dark:bg-gray-900/50">
                    <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                        <div className="flex items-center space-x-5">
                            {/* Avatar */}
                            <div className={`w-24 h-24 rounded-full ${avatarBg} ${avatarText} flex items-center justify-center text-4xl font-extrabold border-4 ${avatarBorder} shadow-lg`}>
                                {getInitials(patient.name)}
                            </div>
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">{patient.name}</h1>
                                <div className='flex items-center space-x-3 mt-1'>
                                    <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">Patient ID: {patient.patientId}</p>
                                    <span className="text-gray-400 dark:text-gray-600">•</span>
                                    <p className={`text-lg font-semibold ${primaryColor}`}>Doctor: {patient.primaryDoctor || 'Unassigned'}</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex space-x-3 mt-4 sm:mt-0">
                            <button
                                title="Edit Patient File"
                                className="p-3 bg-amber-500 text-white hover:bg-amber-600 rounded-full transition shadow-lg"
                                onClick={() => console.log(`Editing Patient ${patient.id}`)}
                            >
                                <IconEdit className="w-5 h-5" />
                            </button>
                            <button
                                title="Download Patient Chart"
                                className="p-3 bg-green-500 text-white hover:bg-green-600 rounded-full transition shadow-lg"
                                onClick={() => console.log(`Downloading Patient ${patient.id} chart`)}
                            >
                                <IconDownload className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Tabs for Navigation */}
                <div className="border-b border-gray-200 dark:border-gray-700 px-6 sm:px-8">
                    <div className="flex space-x-6 -mb-px">
                        <button
                            onClick={() => setActiveTab('general')}
                            className={`py-4 px-1 text-sm font-medium focus:outline-none transition duration-150 ease-in-out ${
                                activeTab === 'general' ? tabActiveClasses : tabInactiveClasses
                            }`}
                        >
                            <IconHome className="w-5 h-5 inline mr-2 align-text-bottom" />
                            General Info
                        </button>
                        <button
                            onClick={() => setActiveTab('medical')}
                            className={`py-4 px-1 text-sm font-medium focus:outline-none transition duration-150 ease-in-out ${
                                activeTab === 'medical' ? tabActiveClasses : tabInactiveClasses
                            }`}
                        >
                            <IconFile className="w-5 h-5 inline mr-2 align-text-bottom" />
                            Medical Profile
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="p-6 sm:p-8 min-h-[400px]">
                    {activeTab === 'general' ? (
                        <PatientGeneralInfoTab patient={patient} />
                    ) : (
                        <PatientMedicalProfileTab patient={patient} />
                    )}
                </div>

            </div>
        </div>
    );
};

export default PatientProfile;