import { lazy } from 'react';
import PatientDetails from '../pages/Doctor/Patients/patientsDetails';
import path from 'path';
const Index = lazy(() => import('../pages/Index'));
const MyPatients = lazy(() => import('../pages/Doctor/Patients/patients'));
const Prescription = lazy(() => import('../pages/Doctor/Priscription'));

const routes = [
    // dashboard
    {
        path: '/',
        element: <Index />,
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
