import React, { useState, ReactNode, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Table from '../../../components/Table/Table';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';

// --- Component: DashboardCard (Updated with a more modern style) ---

interface DashboardCardProps {
    title: string;
    count: number | string;
    icon: ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, count, icon }) => (
    <div className="panel bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 transition duration-300 hover:shadow-xl hover:border-green-300 dark:hover:border-green-600 transform hover:-translate-y-1">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    {title}
                </p>
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                    {count}
                </h2>
            </div>
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300">
                {icon}
            </div>
        </div>
    </div>
);


// --- Internal Icon Components (No changes needed here) ---

const IconUserPlus: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="9" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" /><path opacity="0.5" d="M17.5 15.5H19M21 15.5H19M19 15.5V13.5M19 15.5V17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M5.5 16.5C4.28822 16.5925 3.19793 17.1098 2.37836 17.9103C1.55879 18.7108 1.11111 19.7891 1.11111 21C1.11111 21.2761 1.33492 21.5 1.61111 21.5H16.3889C16.6651 21.5 16.8889 21.2761 16.8889 21C16.8889 19.7891 16.4412 18.7108 15.6216 17.9103C14.8021 17.1098 13.7118 16.5925 12.5 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
);
const IconCalendar: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.5" d="M3 10V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M21 7H3M21 7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7M21 7V4C21 2.89543 20.1046 2 19 2H5C3.89543 2 3 2.89543 3 4V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M7 10V4M17 10V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
);
const IconFileText: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.5" d="M22 10V15C22 20 20 22 15 22H9C4 22 2 20 2 15V9C2 4 4 2 9 2H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M15 2V6C15 7.10457 15.8954 8 17 8H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M7 13H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M7 17H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const IconClock: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" /><path opacity="0.5" d="M12 8V12L15 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const IconSearch: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11.5" cy="11.5" r="9.5" stroke="currentColor" strokeWidth="1.5" /><path d="M18.5 18.5L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
);

// --- Data Structures ---
interface Metric {
    title: string;
    value: number | string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

interface QuickAction {
    name: string;
    icon: ReactNode;
    path: string;
}

interface Patient {
    id: number;
    name: string;
    activityType: string;
    date: string;
    status: 'Completed' | 'Upcoming' | 'Confirmed' | 'Registered';
    age: number;
    doshicProfile: 'Vata' | 'Pitta' | 'Kapha' | 'Tridosha';
}

// --- Mock Data (Updated to reflect a unified theme) ---

const metricsData: Metric[] = [
    { title: 'Total Patients', value: 210, icon: IconUserPlus },
    { title: "Today's Appointments", value: 5, icon: IconCalendar },
    { title: 'Upcoming (7 Days)', value: 12, icon: IconClock },
    { title: 'New Prescriptions', value: 3, icon: IconFileText },
];

const quickActions: QuickAction[] = [
    { name: 'My Patients', icon: <IconUserPlus className="w-7 h-7" />, path: '/my-patients' },
    { name: 'Prescriptions', icon: <IconFileText className="w-7 h-7" />, path: '/prescription' },
    { name: 'Schedule Visit', icon: <IconCalendar className="w-7 h-7" />, path: '/next-visit' },
    { name: 'Treatments', icon: <IconClock className="w-7 h-7" />, path: '/treatments' },
];

const patientData: Patient[] = [
    // Data remains the same, only presentation will change
    { id: 101, name: 'Sumitra Devi', activityType: 'New Prescription', date: '2024-07-29', status: 'Completed', age: 45, doshicProfile: 'Vata' },
    { id: 102, name: 'Rajesh Kumar', activityType: 'Therapy Session', date: '2024-07-28', status: 'Upcoming', age: 62, doshicProfile: 'Pitta' },
    { id: 103, name: 'Priya Sharma', activityType: 'Scheduled Visit', date: '2024-07-27', status: 'Confirmed', age: 31, doshicProfile: 'Kapha' },
    { id: 104, name: 'Anil Gupta', activityType: 'Follow-up', date: '2024-07-26', status: 'Completed', age: 70, doshicProfile: 'Tridosha' },
    { id: 105, name: 'Meera Singh', activityType: 'New Patient', date: '2024-07-25', status: 'Registered', age: 24, doshicProfile: 'Vata' },
];

// Utility function to get status badge color
const getStatusBadge = (status: Patient['status']) => {
    const colorMap = {
        Completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        Upcoming: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        Confirmed: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
        Registered: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    };
    return (
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${colorMap[status]}`}>
            {status}
        </span>
    );
};

// --- Main App Component ---

const DoctorDashboard = () => {
    const dispatch = useDispatch();
    const [name] = useState('Dr. Anya Sharma');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(setPageTitle('Doctor Dashboard'));
    }, [dispatch]);

    // --- Table Configuration ---
    const filteredData = useMemo(() => {
        if (!searchTerm) return patientData;
        const lowerCaseSearch = searchTerm.toLowerCase();
        return patientData.filter(patient =>
            patient.name.toLowerCase().includes(lowerCaseSearch) ||
            patient.doshicProfile.toLowerCase().includes(lowerCaseSearch)
        );
    }, [searchTerm]);

    const columns: any[] = [
        {
            Header: 'Patient Name', accessor: 'name', Cell: ({ row }: { row: Patient }) => (
                <Link to={`/patient/${(row as Patient).id}`} className="font-semibold text-green-600 dark:text-green-400 hover:underline"> {/* eslint-disable-line @typescript-eslint/no-explicit-any */}
                    {row.name}
                </Link>
            )
        },
        { Header: 'Doshic Profile', accessor: 'doshicProfile', className: 'hidden sm:table-cell' }, // No change needed here
        { Header: 'Last Activity', accessor: 'activityType' }, // No change needed here
        { Header: 'Status', accessor: 'status', Cell: ({ value }: { value: Patient['status'] }) => getStatusBadge(value) },
    ];

    const renderTopContent = () => (
        <div className="relative w-full sm:w-72">
            <IconSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
                type="text"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2.5 pl-11 pr-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 text-gray-900 dark:text-gray-100"
            />
        </div>
    );

    // --- Main Layout ---

    return (
        <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 font-sans antialiased space-y-8">
            {/* 1. Stylish Welcome Header */}
            <div className="panel p-6 rounded-xl bg-gradient-to-r from-green-600 to-teal-500 text-white shadow-lg">
                <h1 className="text-3xl font-bold">
                    Welcome, {name}!
                </h1>
                <p className="text-green-100 mt-1">
                    Here is your Ayurvedic practice snapshot for today.
                </p>
            </div>

            {/* 2. Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {metricsData.map((stat) => (
                    <DashboardCard
                        key={stat.title}
                        title={stat.title}
                        count={stat.value}
                        icon={<stat.icon className="w-7 h-7" />}
                    />
                ))}
            </div>

            {/* 3. Quick Actions */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {quickActions.map((action, index) => (
                        <QuickActionCard key={index} action={action} />
                    ))}
                </div>
            </div>


            {/* 4. Patient Table */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Patient Management</h2>
                <div className="panel p-0 sm:p-0 overflow-hidden border-0 shadow-lg">
                    <Table<Patient>
                        columns={columns}
                        data={filteredData}
                        topContent={renderTopContent()}
                        itemsPerPage={5}
                    />
                </div>
            </div>
        </div>
    );
};

// --- Sub-Components (Updated Style) ---

const QuickActionCard: React.FC<{ action: QuickAction }> = ({ action }) => (
    <Link
        to={action.path}
        className="group flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md transition duration-300 hover:shadow-lg hover:border-green-500 dark:hover:border-green-500 hover:-translate-y-1"
    >
        <div className="p-4 mb-4 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300 transition-transform duration-300 group-hover:scale-110">
            {action.icon}
        </div>
        <span className="text-base font-semibold text-gray-800 dark:text-gray-100 text-center transition-colors group-hover:text-green-600 dark:group-hover:text-green-400">
            {action.name}
        </span>
    </Link>
);

export default DoctorDashboard;