import React,{useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { Link } from 'react-router-dom';
import IconUsers from '../../../components/Icon/IconUsers';
import IconCalendar from '../../../components/Icon/IconCalendar';
import IconMenuForms from '../../../components/Icon/Menu/IconMenuForms';
import IconReport from '../../../components/Icon/IconFile';
import IconHeart from '../../../components/Icon/IconHeart'; // A new icon for therapy

const PatientDashboard: React.FC = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('My Dashboard'));
    }, [dispatch]);

    // Mock data for demonstration
    const patientName = 'Aisha Sharma';

    const upcomingAppointment = {
        doctorName: 'Dr. Priya Singh',
        specialty: 'Ayurvedic Physician',
        date: '2025-10-24', // Updated to a future date
        time: '11:00 AM',
    };

    const familyMembersCount = 3;

    const ongoingTherapy = {
        name: 'Abhyanga (Oil Massage)',
        progress: 'Day 5 of 7',
    };

    const recentReport = {
        name: 'Complete Blood Count (CBC)',
        date: '2025-10-15',
    };


    return (
        <div className="space-y-8 font-sans">
            {/* --- Welcome Header --- */}
            <div className="panel bg-gradient-to-r from-green-400 to-teal-300 text-white p-6 rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold">Welcome, {patientName}!</h1>
                <p className="text-green-100 mt-1">Your health and wellness journey, all in one place.</p>
            </div>

            {/* --- Quick Stats Cards --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Upcoming Follow-up */}
                <div className="panel bg-white dark:bg-gray-800 border border-green-200 dark:border-gray-700 rounded-xl p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                            <IconCalendar className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Upcoming Appointment</p>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1">
                                {new Date(upcomingAppointment.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">with {upcomingAppointment.doctorName}</p>
                        </div>
                    </div>
                </div>

                {/* Family Members */}
                <div className="panel bg-white dark:bg-gray-800 border border-green-200 dark:border-gray-700 rounded-xl p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                            <IconUsers className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Family Profiles</p>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1">
                                {familyMembersCount} Members
                            </h3>
                            <Link to="/patient/family" className="text-sm text-green-600 hover:underline font-semibold">Manage Profiles</Link>
                        </div>
                    </div>
                </div>

                {/* Recent Prescription */}
                <div className="panel bg-white dark:bg-gray-800 border border-green-200 dark:border-gray-700 rounded-xl p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                            <IconMenuForms className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Prescriptions</p>
                             <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1">
                                2 New Items
                            </h3>
                            <Link to="/patient/prescriptions" className="text-sm text-green-600 hover:underline font-semibold">View Details</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Other Sections --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Ongoing Therapies */}
                <div className="panel bg-white dark:bg-gray-800 p-6 rounded-xl border border-green-200 dark:border-gray-700 shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Ongoing Therapy</h2>
                    <div className="flex items-center justify-between p-4 bg-green-50/50 dark:bg-gray-900/50 rounded-lg">
                        <div className="flex items-center gap-4">
                            <IconHeart className="w-6 h-6 text-green-500"/>
                            <div>
                                <p className="font-semibold text-gray-700 dark:text-gray-200">{ongoingTherapy.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{ongoingTherapy.progress}</p>
                            </div>
                        </div>
                        <Link to="/patient/therapies" className="btn btn-sm btn-outline-primary">View All</Link>
                    </div>
                </div>

                {/* Recent Reports */}
                <div className="panel bg-white dark:bg-gray-800 p-6 rounded-xl border border-green-200 dark:border-gray-700 shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Recent Reports</h2>
                    <div className="flex items-center justify-between p-4 bg-green-50/50 dark:bg-gray-900/50 rounded-lg">
                        <div className="flex items-center gap-4">
                            <IconReport className="w-6 h-6 text-green-500"/>
                            <div>
                                <p className="font-semibold text-gray-700 dark:text-gray-200">{recentReport.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Uploaded on {new Date(recentReport.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                            </div>
                        </div>
                        <Link to="/patient/reports" className="btn btn-sm btn-outline-primary">View All</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;