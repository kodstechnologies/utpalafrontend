import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { Link } from 'react-router-dom';
import { DashboardCard } from '../../../components/DashboardCard';
import IconUsers from '../../../components/Icon/IconUsers';
import IconUserPlus from '../../../components/Icon/IconUserPlus';
import IconLogout from '../../../components/Icon/IconLogout';
import IconHeart from '../../../components/Icon/IconHeart';

const NurseDashboard: React.FC = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Nurse Dashboard'));
    }, [dispatch]);

    const statsData = [
        { title: 'Admitted Patients', count: 12, icon: IconUsers },
        { title: 'Pending Admissions', count: 3, icon: IconUserPlus },
        { title: 'Ready for Discharge', count: 2, icon: IconLogout },
    ];

    // Mock data for new sections
    const pendingAdmissions = [
        { id: 'PAT-001', patientName: 'Anil Kumar', doctorName: 'Dr. Priya Singh' },
        { id: 'PAT-002', patientName: 'Sunita Devi', doctorName: 'Dr. Anjali Verma' },
    ];

    const admittedPatients = [
        { id: 'PAT-101', patientName: 'Rakesh Sharma', ward: 'Private Room', bed: '101-A', lastVitalCheck: '2 hours ago' },
        { id: 'PAT-102', patientName: 'Meena Kumari', ward: 'General Ward', bed: 'GW-12', lastVitalCheck: '1 hour ago' },
        { id: 'PAT-103', patientName: 'Suresh Verma', ward: 'Semi-Private', bed: '204-B', lastVitalCheck: '3 hours ago' },
    ];

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="panel">
                <h1 className="text-2xl font-bold">Welcome, Nurse!</h1>
                <p className="text-gray-500 dark:text-gray-400">Here is a summary of your current workload.</p>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {statsData.map((stat) => (
                    <DashboardCard
                        key={stat.title}
                        title={stat.title}
                        count={stat.count}
                        icon={stat.icon}
                    />
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="panel">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-primary-light dark:bg-primary-dark-light flex items-center justify-center">
                            <IconUserPlus className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Admit New Patient</h3>
                            <p className="text-sm text-gray-500">Assign wards to patients awaiting admission.</p>
                            <Link to="/admissions" className="text-sm text-primary hover:underline mt-1 inline-block">Go to Admissions</Link>
                        </div>
                    </div>
                </div>
                <div className="panel">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center">
                            <IconHeart className="w-8 h-8 text-cyan-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Monitor Patients</h3>
                            <p className="text-sm text-gray-500">View patient history and update daily records.</p>
                            <Link to="/monitoring" className="text-sm text-cyan-600 hover:underline mt-1 inline-block">View Admitted Patients</Link>
                        </div>
                    </div>
                </div>
                <div className="panel">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-danger-light dark:bg-danger-dark-light flex items-center justify-center">
                            <IconLogout className="w-8 h-8 text-danger" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Prepare Discharge</h3>
                            <p className="text-sm text-gray-500">Manage and prepare patients for discharge.</p>
                            <Link to="/discharge" className="text-sm text-danger hover:underline mt-1 inline-block">Go to Discharge</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NurseDashboard;