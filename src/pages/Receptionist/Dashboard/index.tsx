import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setPageTitle } from '../../../store/themeConfigSlice';

const ReceptionistDashboard = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Receptionist Dashboard'));
    }, [dispatch]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Placeholder widgets */}
                <div className="panel">
                    <h2 className="font-semibold text-lg">Today's Appointments</h2>
                    <p className="text-2xl font-bold">15</p>
                </div>
                <div className="panel">
                    <h2 className="font-semibold text-lg">New Patient Registrations</h2>
                    <p className="text-2xl font-bold">8</p>
                </div>
                <div className="panel">
                    <h2 className="font-semibold text-lg">Pending Payments</h2>
                    <p className="text-2xl font-bold">3</p>
                </div>
                <div className="panel">
                    <h2 className="font-semibold text-lg">Therapist Sessions Today</h2>
                    <p className="text-2xl font-bold">12</p>
                </div>
            </div>
            <div className="panel">
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-4">
                    <Link to="/receptionist/appointments" className="btn btn-primary">Manage Appointments</Link>
                    <Link to="/receptionist/payments" className="btn btn-secondary">Record Payment</Link>
                    <Link to="/receptionist/reports" className="btn btn-info">View Reports</Link>
                </div>
            </div>
        </div>
    );
};

export default ReceptionistDashboard;

