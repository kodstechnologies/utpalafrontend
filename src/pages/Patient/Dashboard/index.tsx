import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { Link } from 'react-router-dom';
import IconUsers from '../../../components/Icon/IconUsers';
import IconCalendar from '../../../components/Icon/IconCalendar';
import IconMenuForms from '../../../components/Icon/Menu/IconMenuForms';
import IconReport from '../../../components/Icon/IconFile';

const PatientDashboard: React.FC = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Dashboard'));
    }, [dispatch]);

    // Mock data for demonstration
    const upcomingAppointment = {
        doctorName: 'Dr. Priya Singh',
        date: '2024-06-05',
        time: '11:00 AM',
    };

    const familyMembersCount = 3;

    const ongoingTherapy = {
        name: 'Abhyanga (Oil Massage)',
        progress: 'Day 5 of 7',
    };

    const recentPrescription = {
        date: '2024-05-20',
        items: 2,
    };

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="panel">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Welcome, Patient!</h1>
                        <p className="text-gray-500 dark:text-gray-400">Here's a summary of your health records.</p>
                    </div>
                </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Upcoming Follow-up */}
                <div className="panel">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                            <IconCalendar className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Upcoming Follow-up</p>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                {new Date(upcomingAppointment.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">with {upcomingAppointment.doctorName}</p>
                        </div>
                    </div>
                </div>

                {/* Family Members */}
                <div className="panel">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                            <IconUsers className="w-8 h-8 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Family Profiles</p>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                {familyMembersCount} Members
                            </h3>
                            <Link to="/patient/family" className="text-sm text-primary hover:underline">Manage Profiles</Link>
                        </div>
                    </div>
                </div>

                {/* Recent Prescription */}
                <div className="panel">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
                            <IconMenuForms className="w-8 h-8 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Recent Prescription</p>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                {recentPrescription.items} items
                            </h3>
                            <Link to="/patient/prescriptions" className="text-sm text-primary hover:underline">View Details</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Other Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Ongoing Therapies */}
                <div className="panel">
                    <h2 className="text-xl font-bold mb-4">Ongoing Therapies</h2>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div>
                            <p className="font-semibold">{ongoingTherapy.name}</p>
                            <p className="text-sm text-gray-500">{ongoingTherapy.progress}</p>
                        </div>
                        <Link to="/patient/therapies" className="btn btn-sm btn-outline-secondary">View All</Link>
                    </div>
                </div>

                {/* Recent Reports */}
                <div className="panel">
                    <h2 className="text-xl font-bold mb-4">Recent Reports</h2>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <IconReport className="w-6 h-6 text-gray-500"/>
                            <div>
                                <p className="font-semibold">Complete Blood Count (CBC)</p>
                                <p className="text-sm text-gray-500">Uploaded on May 22, 2024</p>
                            </div>
                        </div>
                        <Link to="/patient/reports" className="btn btn-sm btn-outline-secondary">View All</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;