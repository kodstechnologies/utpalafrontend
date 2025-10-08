import { lazy } from 'react';
import PatientDetails from '../pages/Doctor/Patients/patientsDetails';
import path from 'path';
const MyPatients = lazy(() => import('../pages/Doctor/Patients/patients'));
const Prescription = lazy(() => import('../pages/Doctor/Priscription'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard/AdminDashboard'));
const AdminUserManagementDoctor = lazy(() => import('../pages/admin/UserManagement/Doctors/DoctorPage'))

const routes = [
    // admin-dashboard
    {
        path: '/',
        element: <AdminDashboard />,
        layout: 'default',
    },

    // admin-usermanagement-doctor
        {
        path: 'user-management/doctor',
        element: <AdminUserManagementDoctor />,
        layout: 'default',
    },
    {
        path: 'my-patients',
        element: <MyPatients />,
        layout: 'default',
    },
    {
        path: 'patients/:id',
        element: <PatientDetails />,
        layout: 'default',
    },
    {
        path: 'prescription',
        element: <Prescription />,
        layout: 'default',
    },

];

export { routes };
