import { lazy } from 'react';
import { useLocation } from 'react-router-dom';
import PatientDetails from '../pages/Doctor/Patients/patientsDetails';
import DoctorDashboard from '../pages/Doctor/Dashboard';
import FamilyMember from '../pages/Doctor/Patients/FamilyMember';
import TreatmentSessions from '../pages/Doctor/Treatment';
import PharmaDashboard from '../pages/Pharmacist/Dashboard';
import PharmacistInventory from '../pages/Pharmacist/Inventory';
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
const WardAndCategory = lazy(() => import('../pages/admin/WardAndCategory/WardCategoryManagement'))
const TreatmentTherapy = lazy(() => import('../pages/admin/TreatmentAndTherapy/TreatmemtTherapyManagement'))
const AddSlot = lazy(() => import('../pages/admin/ConsultationAndScheduling/AddSlot/AddSlot'))
const TherapyDetails = lazy(() => import('../pages/admin/TreatmentAndTherapy/TherapyDetails'))
const PharmacyInventory = lazy(() => import('../pages/admin/PharmacyAndInventory/PharmacyInventoryPage'))
const AssignDoctors = lazy(() => import('../pages/admin/ConsultationAndScheduling/AssignDoctor/AssignDoctor'))
const TherapistProfile = lazy(() => import('../pages/admin/UserManagement/Therapists/TherapistProfile'))
const NextVisit = lazy(() => import('../pages/Doctor/ScheduleAppointment'))
const Prescriptions = lazy(() => import('../pages/Pharmacist/Prescriptions'))
const Invoice = lazy(() => import('../components/invoice/Preview'))
const PatientFamily = lazy(() => import('../pages/Patient/Family'))
const PatientConsultations = lazy(() => import('../pages/Patient/Consultant'))
const PatientTherapies = lazy(() => import('../pages/Patient/Therapy'))
const PatientReports = lazy(() => import('../pages/Patient/Reports'))
const PatientPrescriptions = lazy(() => import('../pages/Patient/Prescription/page'));
const PatientDashboard = lazy(() => import('../pages/Patient/Dashboard'));
const NurseDashboard = lazy(() => import('../pages/Nurse/Dashboard'));
const NurseAdmissions = lazy(() => import('../pages/Nurse/Admissions'));
const NurseMonitoring = lazy(() => import('../pages/Nurse/Monitoring'));
const NurseDischarge = lazy(() => import('../pages/Nurse/Discharge'));
const ReceptionistDashboard = lazy(() => import('../pages/Receptionist/Dashboard'));
const ReceptionistAppointments = lazy(() => import('../pages/Receptionist/Appointments'));
const ReceptionistPayments = lazy(() => import('../pages/Receptionist/Payments'));
// const ReceptionistReports = lazy(() => import('../pages/Receptionist/Reports'));
const ReceptionistReports = lazy(() => import('../pages/Receptionist/Reports'));
const PatientRegistrationForm = lazy(() => import('../pages/Receptionist/WhatsupForm'));
const DischargeSummaryPage = lazy(() => import('../pages/Shared/index'));
const AdmissionReport = lazy(() => import('../pages/admin/ReportAndAnalytics/AdmissionReport'))
const DischargeReport = lazy(() => import('../pages/admin/ReportAndAnalytics/DischargeReport'))
const BillingDischarge = lazy(() => import('../pages/admin/BillingAndDischarge/BillingDischargePage'))


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

    // const UserTableComponent = routeComponents[userTypeKey.toLowerCase()] || AdminUserManagementDoctor;
    const UserTableComponent =
        routeComponents[userTypeKey.toLowerCase() as keyof typeof routeComponents] ||
        AdminUserManagementDoctor;

    return (
        <UserManagementLayout key={userTypeKey}>
            <UserTableComponent />
        </UserManagementLayout>
    );
};

const PatientExamination = lazy(() => import('../pages/Doctor/Patients/PatientExamination'));
const role = 'admin';
const routes = [
    // admin-dashboard

    role === 'admin'
        ? {
            path: '/',
            element: <AdminDashboard />,
            layout: 'default',
        }
        : role === 'doctor'
            ? {
                path: '/',
                element: <DoctorDashboard />,
                layout: 'default',
            }
            : role === 'pharmacist'
                ? {
                    path: '/',
                    element: <PharmaDashboard />,
                    layout: 'default',
                }
                : role === 'nurse'
                    ? {
                        path: '/',
                        element: <NurseDashboard />,
                        layout: 'default',
                    }
                    : role === 'receptionist'
                        ? {
                            path: '/',
                            element: <ReceptionistDashboard />,
                            layout: 'default',
                        }
                        : { // Default to patient
                            path: '/',
                            element: <PatientDashboard />,
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
        path: 'ward-category',
        element: <WardAndCategory />,
        layout: 'default',
    },
    {
        path: 'treatment-therapy',
        element: <TreatmentTherapy />,
        layout: 'default',
    },
    {
        path: 'patient-therapy/:id',
        element: <TherapyDetails />,
        layout: 'default',
    },
    {
        path: 'consultation-scheduling/slot',
        element: <AddSlot />,
        layout: 'default',
    },
    {
        path: 'consultation-scheduling/doctors',
        element: <AssignDoctors />,
        layout: 'default',
    },
    {
        path: 'pharmacy-inventory',
        element: <PharmacyInventory />,
        layout: 'default',
    },
    {
        path: 'Reports-analytics/admissions',
        element: <AdmissionReport />,
        layout: 'default',
    },
    {
        path: 'Reports-analytics/discharges',
        element: <DischargeReport />,
        layout: 'default',
    },
    {
        path: 'billing-discharge',
        element: <BillingDischarge />,
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
    },
    {
        path: 'treatments',
        element: <TreatmentSessions />,
        layout: 'default',
    },
    {
        path: 'next-visit',
        element: <NextVisit />,
        layout: 'default'

    },
    // Pharamacist routes

    {
        path: 'prescriptions',
        element: <Prescriptions />,
        layout: 'default',
    },
    {
        path: 'invoice',
        element: <Invoice />,
        layout: 'default',
    },
    {
        path: 'inventory',
        element: <PharmacistInventory />,
        layout: 'default',
    },

    // Patients Routes
    {
        path: 'patient/family',
        element: <PatientFamily />,
        layout: 'default',
    },
    {
        path: 'patient/consultations',
        element: <PatientConsultations />,
        layout: 'default',
    },
    {
        path: 'patient/prescriptions',
        element: <PatientPrescriptions />,
        layout: 'default',
    },
    {
        path: 'patient/therapies',
        element: <PatientTherapies />,
        layout: 'default',
    },
    {
        path: 'patient/reports',
        element: <PatientReports />,
        layout: 'default',
    },
    // Nurse Routes
    {
        path: 'admissions',
        element: <NurseAdmissions />,
        layout: 'default',
    },
    {
        path: 'monitoring',
        element: <NurseMonitoring />,
        layout: 'default',
    },
    {
        path: 'discharge',
        element: <NurseDischarge />,
        layout: 'default',
    },
    // Receptionist Routes
    {
        path: 'receptionist/appointments',
        element: <ReceptionistAppointments />,
        layout: 'default',
    },
    {
        path: 'receptionist/payments',
        element: <ReceptionistPayments />,
        layout: 'default',
    },
    {
        path: 'receptionist/reports',
        element: <ReceptionistReports />,
        layout: 'default',
    },
    // Public Form Route
    {
        path: '/patient-registration-form',
        element: <PatientRegistrationForm />,
        layout: 'blank',
    },
    // Shared Routes
    {
        path: '/discharge-summary',
        element: <DischargeSummaryPage />,
        layout: 'default',
    }

];

export { routes };
