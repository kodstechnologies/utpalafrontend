import React, { useState, ReactNode, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Table from '../../../components/Table/Table'; // Assuming this component exists
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';

// --- Component: DashboardCard (Updated Styling) ---

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
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mr-3">
                    {count}
                </h2>
            </div>
            {/* Themed Icon background */}
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-700/50 text-green-600 dark:text-green-300">
                {icon}
            </div>
        </div>
    </div>
);


// --- Internal Icon Components ---

const IconUserPlus: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 8.99991C16 11.2091 14.2091 12.9999 12 12.9999C9.79086 12.9999 8 11.2091 8 8.99991C8 6.79077 9.79086 4.99991 12 4.99991C14.2091 4.99991 16 6.79077 16 8.99991Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path opacity="0.5" d="M3 20.25C3 17.6044 6.13401 15.5 12 15.5C17.866 15.5 21 17.6044 21 20.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const IconFileText: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.5" d="M22 10V15C22 20 20 22 15 22H9C4 22 2 20 2 15V9C2 4 4 2 9 2H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M15 2V6C15 7.10457 15.8954 8 17 8H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 13H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 17H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const IconClock: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" /><path opacity="0.5" d="M12 8V12L15 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const IconBox: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.5" d="M2 12C2 7.22876 2 4.84315 3.42157 3.42157C4.84315 2 7.22876 2 12 2C16.7712 2 19.1569 2 20.5784 3.42157C22 4.84315 22 7.22876 22 12C22 16.7712 22 19.1569 20.5784 20.5784C19.1569 22 16.7712 22 12 22C7.22876 22 4.84315 22 3.42157 20.5784C2 19.1569 2 16.7712 2 12Z" stroke="currentColor" strokeWidth="1.5"/><path d="M10 9V15L15 12L10 9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const IconCheckCircle: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="1.5"/></svg>
);
const IconSearch: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11.5" cy="11.5" r="9.5" stroke="currentColor" strokeWidth="1.5" /><path d="M18.5 18.5L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
);


// --- Pharmacist-Specific Data Structures ---

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

interface Prescription {
    id: string;
    patientName: string;
    doctorName: string;
    date: string;
    status: 'Pending' | 'Dispensed' | 'Cancelled';
}

// --- Mock Data for Pharmacist ---

const metricsData: Metric[] = [
    { title: 'New Prescriptions Today', value: 15, icon: IconFileText, color: 'text-green-500' },
    { title: 'Pending Verification', value: 8, icon: IconClock, color: 'text-orange-500' },
    { title: 'Low Stock Items', value: 4, icon: IconBox, color: 'text-red-500' },
    { title: 'Dispensed Today', value: 125, icon: IconCheckCircle, color: 'text-green-500' },
];

const quickActions: QuickAction[] = [
    { name: 'Verify Prescriptions', icon: <IconCheckCircle className="w-6 h-6" />, path: '/prescriptions/verify' },
    { name: 'Manage Inventory', icon: <IconBox className="w-6 h-6" />, path: '/inventory' },
    { name: 'Patient History', icon: <IconUserPlus className="w-6 h-6" />, path: '/patients' },
    { name: 'Generate Reports', icon: <IconFileText className="w-6 h-6" />, path: '/reports' },
];

const prescriptionData: Prescription[] = [
    { id: 'RX78901', patientName: 'Sumitra Devi', doctorName: 'Dr. Alok Verma', date: '2024-10-17', status: 'Pending' },
    { id: 'RX78902', patientName: 'Rajesh Kumar', doctorName: 'Dr. Meena Gupta', date: '2024-10-17', status: 'Pending' },
    { id: 'RX78903', patientName: 'Priya Sharma', doctorName: 'Dr. Alok Verma', date: '2024-10-16', status: 'Dispensed' },
    { id: 'RX78904', patientName: 'Anil Gupta', doctorName: 'Dr. Sanjay Rao', date: '2024-10-16', status: 'Dispensed' },
    { id: 'RX78905', patientName: 'Meera Singh', doctorName: 'Dr. Meena Gupta', date: '2024-10-15', status: 'Cancelled' },
    { id: 'RX78906', patientName: 'Vikram Patel', doctorName: 'Dr. Sanjay Rao', date: '2024-10-15', status: 'Dispensed' },
    { id: 'RX78907', patientName: 'Neha Joshi', doctorName: 'Dr. Alok Verma', date: '2024-10-14', status: 'Dispensed' },
];

// Utility function to get status badge color
const getStatusBadge = (status: Prescription['status']) => {
    const colorMap = {
        Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        Dispensed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    return (
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${colorMap[status]}`}>
            {status}
        </span>
    );
};


// --- Main App Component ---

const PharmaDashboard = () => {
    const dispatch = useDispatch();
    const [name] = useState('Ankit Desai'); // Mock pharmacist name
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(setPageTitle('Pharmacist Dashboard'));
    }, [dispatch]);


    // --- Table Configuration ---
    
    // 1. Filtering Logic
    const filteredData = useMemo(() => {
        if (!searchTerm) return prescriptionData;
        const lowerCaseSearch = searchTerm.toLowerCase();
        return prescriptionData.filter(rx =>
            rx.patientName.toLowerCase().includes(lowerCaseSearch) ||
            rx.doctorName.toLowerCase().includes(lowerCaseSearch) ||
            rx.id.toLowerCase().includes(lowerCaseSearch)
        );
    }, [searchTerm, prescriptionData]);

    // 2. Column Definitions
    const columns : any[]= [
        { Header: 'Prescription ID', accessor: 'id', Cell: ({ value }: { value: string }) => <span className="font-mono text-xs">{value}</span> },
        { Header: 'Patient Name', accessor: 'patientName', Cell: ({ value }: { value: string }) => <span className="font-semibold text-gray-700 dark:text-gray-200">{value}</span> },
        { Header: 'Prescribing Doctor', accessor: 'doctorName', className: 'hidden sm:table-cell' },
        { Header: 'Status', accessor: 'status', Cell: ({ value }: { value: Prescription['status'] }) => getStatusBadge(value) },
        { Header: 'Actions', accessor: 'actions', Cell: ({ row }: { row: Prescription }) => renderActions(row) },
    ];

    // 3. Render Actions
    const renderActions = (prescription: Prescription): ReactNode => (
        <div className="flex justify-end space-x-2">
            <Link to={`/prescriptions/${prescription.id}`} className="p-1.5 rounded-full text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-gray-700 transition-colors" title="View Details">
                <IconFileText className="w-5 h-5" />
            </Link>
            {prescription.status === 'Pending' && (
                <button onClick={() => alert(`Dispensing ${prescription.id}`)} className="p-1.5 rounded-full text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-gray-700 transition-colors" title="Mark as Dispensed">
                    <IconCheckCircle className="w-5 h-5" />
                </button>
            )}
        </div>
    );
    
    // 4. Render Top Content (Search Bar)
    const renderTopContent = () => (
        <div className="relative w-full sm:w-80">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
                type="text"
                placeholder="Search by Patient, Doctor, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg shadow-sm focus:border-green-500 focus:ring-green-500 text-gray-900 dark:text-gray-100"
            />
        </div>
    );


    // --- Main Layout ---

    return (
        <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 font-sans antialiased">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome, {name}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
                Here's your pharmacy's activity summary for today.
            </p>

            {/* 1. Metric Cards */}
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
            <div className="mb-10">
                 <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-5">
                    Quick Actions
                 </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {quickActions.map((action, index) => (
                        <QuickActionCard key={index} action={action} />
                    ))}
                </div>
            </div>


            {/* 3. Prescription Queue Table */}
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-5">
                Prescription Queue
            </h2>
            <Table<Prescription>
                columns={columns}
                data={filteredData}
                topContent={renderTopContent()}
                itemsPerPage={5}
            />
        </div>
    );
};

// --- Sub-Components ---

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

export default PharmaDashboard;