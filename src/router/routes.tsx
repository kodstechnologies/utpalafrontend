import { lazy } from 'react';
import { useLocation } from 'react-router-dom';
import PatientDetails from '../pages/Doctor/Patients/patientsDetails';
import FamilyMember from '../pages/Doctor/Patients/FamilyMember';
const MyPatients = lazy(() => import('../pages/Doctor/Patients/patients'));
const Prescription = lazy(() => import('../pages/Doctor/Priscription'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard/AdminDashboard'));
const AdminUserManagementDoctor = lazy(() => import('../pages/admin/UserManagement/Doctors/DoctorPage'))
const AdminUserManagementNurse = lazy(() => import('../pages/admin/UserManagement/Nurses/NursePage'))
const AdminUserManagementReceptionist = lazy(() => import('../pages/admin/UserManagement/Receptionists/ReceptionistPage'))
const AdminUserManagementPharmacist = lazy(() => import('../pages/admin/UserManagement/Pharmacists/PharmacistPage'))
const AdminUserManagementTherapist = lazy(() => import('../pages/admin/UserManagement/Therapists/TherapistPage'))
const AdminUserManagementPatient = lazy(() => import('../pages/admin/UserManagement/Patients/PatientPage'))
const UserManagementLayout = lazy(() => import('../pages/admin/UserManagement/UserManagementLayout'))
const DoctorProfile = lazy(() => import('../pages/admin/UserManagement/Doctors/DoctorProfile'))
const NurseProfile = lazy(() => import('../pages/admin/UserManagement/Nurses/NurseProfile'))
const PatientProfile = lazy(() => import('../pages/admin/UserManagement/Patients/PatientProfile'))
const PharmacistProfile = lazy(() => import('../pages/admin/UserManagement/Pharmacists/PharmacistProfile'))
const ReceptionistProfile = lazy(() => import('../pages/admin/UserManagement/Receptionists/ReceptionistProfile'))
const TherapistProfile = lazy(()=> import ('../pages/admin/UserManagement/Therapists/TherapistProfile'))



const routeComponents = {
    doctors: AdminUserManagementDoctor,
    nurses: AdminUserManagementNurse,
    receptionists: AdminUserManagementReceptionist,
    pharmacists: AdminUserManagementPharmacist,
    therapists: AdminUserManagementTherapist,
    patients: AdminUserManagementPatient,
};

const UserManagementWrapper = () => {
    const location = useLocation();
    const userTypeKey = location.pathname.split('/').pop() || 'doctors';

    const UserTableComponent = routeComponents[userTypeKey.toLowerCase()] || AdminUserManagementDoctor;

    return (
        <UserManagementLayout key={userTypeKey}>
            <UserTableComponent />
        </UserManagementLayout>
    );
};

const PatientExamination = lazy(() => import('../pages/Doctor/Patients/PatientExamination'));

const routes = [
    // admin-dashboard
    {
        path: '/',
        element: <AdminDashboard />,
        layout: 'default',
    },

    {
        path: 'user-management/:userType',
        element: <UserManagementWrapper />,
        layout: 'default',
    },
    {
        path: 'doctor/:id',
        element: <DoctorProfile />,
        layout: 'default',
    },
    {
        path: 'nurse/:id',
        element: <NurseProfile />,
        layout: 'default',
    },
    {
        path: 'patient/:id',
        element: <PatientProfile />,
        layout: 'default',
    },
    {
        path: 'pharmacist/:id',
        element: <PharmacistProfile />,
        layout: 'default',
    },
    {
        path: 'receptionist/:id',
        element: <ReceptionistProfile />,
        layout: 'default',
    },
    {
        path: 'therapist/:id',
        element: <TherapistProfile />,
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
    {
        path: 'family-member/:id',
        element: <FamilyMember />,
        layout: 'default',
    },
    {
        path: 'patient-examination/:id',
        element: <PatientExamination />,
        layout: 'default',
    }

];

export { routes };
