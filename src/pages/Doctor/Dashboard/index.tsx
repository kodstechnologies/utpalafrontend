import React, { useState, ReactNode, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Table from '../../../components/Table/Table';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';

// --- Component: DashboardCard (Defined here for single-file requirement) --- 

interface DashboardCardProps {
    title: string;
    count: number | string;
    icon: ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, count, icon }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition duration-300 hover:shadow-xl transform hover:-translate-y-0.5">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    {title}
                </p>
                <div className="flex items-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mr-3">
                        {count}
                    </h2>
                </div>
            </div>
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-700/50 text-green-600 dark:text-green-300">
                {icon}
            </div>
        </div>
    </div>
);


// --- Internal Icon Components ---

const IconUserPlus: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="9" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
        <path opacity="0.5" d="M17.5 15.5H19M21 15.5H19M19 15.5V13.5M19 15.5V17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M5.5 16.5C4.28822 16.5925 3.19793 17.1098 2.37836 17.9103C1.55879 18.7108 1.11111 19.7891 1.11111 21C1.11111 21.2761 1.33492 21.5 1.61111 21.5H16.3889C16.6651 21.5 16.8889 21.2761 16.8889 21C16.8889 19.7891 16.4412 18.7108 15.6216 17.9103C14.8021 17.1098 13.7118 16.5925 12.5 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const IconCalendar: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.5" d="M3 10V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M21 7H3M21 7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7M21 7V4C21 2.89543 20.1046 2 19 2H5C3.89543 2 3 2.89543 3 4V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M7 10V4M17 10V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);

const IconFileText: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.5" d="M22 10V15C22 20 20 22 15 22H9C4 22 2 20 2 15V9C2 4 4 2 9 2H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15 2V6C15 7.10457 15.8954 8 17 8H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 13H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 17H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const IconClock: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path opacity="0.5" d="M12 8V12L15 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const IconSearch: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="11.5" cy="11.5" r="9.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M18.5 18.5L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const IconEdit: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.0001 20H5.00012C4.44783 20 4.00012 19.5523 4.00012 19V5.00001C4.00012 4.44772 4.44783 4.00001 5.00012 4.00001H15.0001C15.5524 4.00001 16.0001 4.44772 16.0001 5.00001V8.00001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13.435 10.575L21.05 3.00001L15.0001 4.00001V5.00001L19.0001 9.00001L11.435 16.575C11.1687 16.8413 10.8524 17.054 10.5001 17.205L8.00012 18.0001L8.80012 15.5001C8.95116 15.1478 9.16388 14.8315 9.43012 14.565L13.435 10.575Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


// --- Data Structures ---

interface Metric {
    title: string;
    value: number | string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    color: string;
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

interface Column<T extends { id: number | string }> {
    Header: string;
    accessor: keyof T;
    Cell?: ({ value, row }: { value: any; row: T }) => ReactNode;
    className?: string;
}




// --- Mock Data ---

const metricsData: Metric[] = [
    { title: 'Total Patients Assigned', value: 210, icon: IconUserPlus, color: 'text-green-500' },
    { title: "Today's Appointments", value: 5, icon: IconCalendar, color: 'text-blue-500' },
    { title: 'Upcoming Visits (7 Days)', value: 12, icon: IconClock, color: 'text-purple-500' },
    { title: 'New Prescriptions Today', value: 3, icon: IconFileText, color: 'text-orange-500' },
];

const quickActions: QuickAction[] = [
    { name: 'My Patients', icon: <IconUserPlus className="w-6 h-6" />, path: '/my-patients' },
    { name: 'Prescriptions', icon: <IconFileText className="w-6 h-6" />, path: '/prescription' },
    { name: 'Schedule Visit', icon: <IconCalendar className="w-6 h-6" />, path: '/next-visit' },
    { name: 'Treatments Records', icon: <IconClock className="w-6 h-6" />, path: '/treatments' },
];

const patientData: Patient[] = [
    { id: 101, name: 'Sumitra Devi', activityType: 'New Prescription', date: '2024-07-29', status: 'Completed', age: 45, doshicProfile: 'Vata' },
    { id: 102, name: 'Rajesh Kumar', activityType: 'Therapy Session', date: '2024-07-28', status: 'Upcoming', age: 62, doshicProfile: 'Pitta' },
    { id: 103, name: 'Priya Sharma', activityType: 'Scheduled Visit', date: '2024-07-27', status: 'Confirmed', age: 31, doshicProfile: 'Kapha' },
    { id: 104, name: 'Anil Gupta', activityType: 'Follow-up', date: '2024-07-26', status: 'Completed', age: 70, doshicProfile: 'Tridosha' },
    { id: 105, name: 'Meera Singh', activityType: 'New Patient', date: '2024-07-25', status: 'Registered', age: 24, doshicProfile: 'Vata' },
    { id: 106, name: 'Vikram Patel', activityType: 'Panchakarma', date: '2024-07-25', status: 'Confirmed', age: 58, doshicProfile: 'Pitta' },
    { id: 107, name: 'Neha Joshi', activityType: 'Diet Review', date: '2024-07-24', status: 'Upcoming', age: 39, doshicProfile: 'Kapha' },
    { id: 108, name: 'Sanjay Rawat', activityType: 'New Prescription', date: '2024-07-24', status: 'Completed', age: 51, doshicProfile: 'Vata' },
    { id: 109, name: 'Kavita Iyer', activityType: 'Therapy Session', date: '2024-07-23', status: 'Completed', age: 48, doshicProfile: 'Pitta' },
    { id: 110, name: 'Gopal Reddy', activityType: 'New Patient', date: '2024-07-23', status: 'Registered', age: 75, doshicProfile: 'Kapha' },
    { id: 111, name: 'Lata Mangeshkar', activityType: 'Scheduled Visit', date: '2024-07-22', status: 'Confirmed', age: 80, doshicProfile: 'Vata' },
];

// Utility function to get status badge color
const getStatusBadge = (status: Patient['status']) => {
    let colorClass = '';
    switch (status) {
        case 'Completed':
            colorClass = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            break;
        case 'Upcoming':
            colorClass = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            break;
        case 'Confirmed':
            colorClass = 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
            break;
        case 'Registered':
            colorClass = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
            break;
        default:
            colorClass = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
    return (
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${colorClass}`}>
            {status}
        </span>
    );
};


// --- Generic Table Component (T is the data type, e.g., Patient) ---




// --- Main App Component ---

const DoctorDashboard = () => {
    const dispatch = useDispatch();
    const [name] = useState('Dr. Anya Sharma'); // Mock user name
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(setPageTitle('Doctor Dashboard'));
    }, [dispatch]);


    // --- Table Configuration ---
    
    // 1. Filtering Logic
    const filteredData = useMemo(() => {
        if (!searchTerm) return patientData;
        const lowerCaseSearch = searchTerm.toLowerCase();
        return patientData.filter(patient =>
            patient.name.toLowerCase().includes(lowerCaseSearch) ||
            patient.activityType.toLowerCase().includes(lowerCaseSearch) ||
            patient.doshicProfile.toLowerCase().includes(lowerCaseSearch)
        );
    }, [searchTerm]);

    // 2. Column Definitions
    const columns: Column<Patient>[] = [
        { 
            Header: 'Patient Name', 
            accessor: 'name', 
            Cell: ({ row }) => (
                <Link to={`/patient/${row.id}`} className="font-semibold text-green-700 dark:text-green-400 hover:underline">
                    {row.name}
                </Link>
            ),
        },
        { Header: 'Doshic Profile', accessor: 'doshicProfile', className: 'hidden sm:table-cell' },
        { Header: 'Last Activity', accessor: 'activityType' },
        { 
            Header: 'Status', 
            accessor: 'status', 
            Cell: ({ value }) => getStatusBadge(value) 
        },
        // { 
        //     Header: 'Actions', 
        //     accessor: 'id', // Use a dummy accessor, as actions are custom rendered
        //     Cell: ({ row }) => renderActions(row),
        // },
    ];

    // 3. Render Actions
    const renderActions = (patient: Patient): ReactNode => (
        <div className="flex justify-end space-x-2">
            <button 
                onClick={() => console.log(`Viewing patient ${patient.id}`)}
                className="p-1.5 rounded-full text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors"
                title="View Details"
            >
                <IconFileText className="w-5 h-5" />
            </button>
            <button 
                onClick={() => console.log(`Editing patient ${patient.id}`)}
                className="p-1.5 rounded-full text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-gray-700 transition-colors"
                title="Edit Record"
            >
                <IconEdit className="w-5 h-5" />
            </button>
        </div>
    );
    
    // 4. Render Top Content (Search Bar & Add Button)
    const renderTopContent = () => (
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="relative w-full sm:w-80">
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                    type="text"
                    placeholder="Search patients by name or Dosha..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-2 pl-10 pr-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg shadow-sm focus:border-green-500 focus:ring-green-500 text-gray-900 dark:text-gray-100"
                />
            </div>

        </div>
    );


    // --- Main Layout ---

    return (
        <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 font-sans antialiased">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome, {name}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
                Your Ayurvedic practice snapshot.
            </p>

            {/* 1. Metric Cards (Key Stats) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {metricsData.map((stat) => (
                    <DashboardCard
                        key={stat.title}
                        title={stat.title}
                        count={stat.value}
                        icon={<stat.icon className={`w-6 h-6 ${stat.color}`} />}
                    />
                ))}
            </div>

            {/* 2. Quick Actions */}
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-5 border-b border-green-200 dark:border-green-700 pb-2">
                Quick Actions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                {quickActions.map((action, index) => (
                    <QuickActionCard key={index} action={action} />
                ))}
            </div>

            {/* 3. Patient Table (Refactored to use the generic Table component) */}
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-5 border-b border-green-200 dark:border-green-700 pb-2">
                Patient Management
            </h2>
            <Table<Patient>
                columns={columns}
                data={filteredData}
                // actions={renderActions}
                topContent={renderTopContent()}
                itemsPerPage={5} // Setting to 5 for better demonstration of pagination
            />
        </div>
    );
};

// --- Sub-Components (Relocated for App clarity) ---

const QuickActionCard: React.FC<{ action: QuickAction }> = ({ action }) => (
    <Link
        to={action.path}
        className="flex flex-col items-center justify-center p-6 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-xl shadow-md transition duration-300 hover:shadow-lg hover:bg-green-100 dark:hover:bg-green-950/60 group focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
    >
        <div className="p-3 mb-3 rounded-full bg-green-200 dark:bg-green-700 text-green-700 dark:text-green-200 group-hover:scale-105 transition-transform">
            {action.icon}
        </div>
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 mt-2 text-center">
            {action.name}
        </span>
    </Link>
);

export default DoctorDashboard;
