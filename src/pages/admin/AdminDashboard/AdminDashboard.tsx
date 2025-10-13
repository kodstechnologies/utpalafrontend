import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { useEffect } from 'react';
import { DashboardCard } from '../../../components/DashboardCard'
import MedicineStockStatusChart from './components/MedicineStockStatusChart';
import {
    Stethoscope,
    Syringe,
    UserCog,
    Pill,
    HeartPulse,
    Users,
} from 'lucide-react';

const AdminDashboard = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Finance'));
    });

    const statsData = [
        {
            title: 'Doctors',
            count: 45,
            icon: Stethoscope,
        },
        {
            title: 'Nurses',
            count: 120,
            icon: Syringe,
        },
        {
            title: 'Receptionists',
            count: 18,
            icon: UserCog,
        },
        {
            title: 'Pharmacists',
            count: 25,
            icon: Pill,
        },
        {
            title: 'Therapists',
            count: 30,
            icon: HeartPulse,
        },
        {
            title: 'Patients',
            count: '1,540',
            icon: Users,
        },
    ];


    return (
        <div>
            <div className="pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {statsData.map((stat) => (
                        <DashboardCard
                            key={stat.title}
                            title={stat.title}
                            count={stat.count}
                            icon={stat.icon}
                        />
                    ))}
                </div>


                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <MedicineStockStatusChart />
                    <div className="panel bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
                        <div className="mb-5 text-lg font-bold text-gray-800 dark:text-white">Recent Activities</div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 ltr:rounded-l-md rtl:rounded-r-md">ID</th>
                                        <th className="px-4 py-3">DATE</th>
                                        <th className="px-4 py-3">NAME</th>
                                        <th className="px-4 py-3">AMOUNT</th>
                                        <th className="px-4 py-3 text-center ltr:rounded-r-md rtl:rounded-l-md">STATUS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { id: '#01', date: 'Oct 08, 2021', name: 'Eric Page', amount: '$1,358.75', status: 'Completed', statusColor: 'bg-gradient-to-r from-green-400 to-green-600 text-white' },
                                        { id: '#02', date: 'Dec 18, 2021', name: 'Nita Parr', amount: '-$1,042.82', status: 'In Process', statusColor: 'bg-gradient-to-r from-blue-400 to-blue-600 text-white' },
                                        { id: '#03', date: 'Dec 25, 2021', name: 'Carl Bell', amount: '$1,828.16', status: 'Pending', statusColor: 'bg-gradient-to-r from-red-400 to-red-600 text-white' },
                                        { id: '#04', date: 'Nov 29, 2021', name: 'Dan Hart', amount: '$1,647.55', status: 'Completed', statusColor: 'bg-gradient-to-r from-green-400 to-green-600 text-white' },
                                        { id: '#05', date: 'Nov 24, 2021', name: 'Jake Ross', amount: '$927.43', status: 'Completed', statusColor: 'bg-gradient-to-r from-green-400 to-green-600 text-white' },
                                        { id: '#06', date: 'Jan 26, 2022', name: 'Anna Bell', amount: '$250.00', status: 'In Process', statusColor: 'bg-gradient-to-r from-blue-400 to-blue-600 text-white' },
                                    ].map((row) => (
                                        <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200">
                                            <td className="px-4 py-3 font-semibold">{row.id}</td>
                                            <td className="px-4 py-3">{row.date}</td>
                                            <td className="px-4 py-3">{row.name}</td>
                                            <td className="px-4 py-3">{row.amount}</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${row.statusColor}`}>
                                                    {row.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
