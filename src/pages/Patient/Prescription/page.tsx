import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';

// --- ICONS ---
const IconPrinter: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 17H4C2.89543 17 2 16.1046 2 15V10C2 8.89543 2.89543 8 4 8H20C21.1046 8 22 8.89543 22 10V15C22 16.1046 21.1046 17 20 17H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M17 8V4C17 2.89543 16.1046 2 15 2H9C7.89543 2 7 2.89543 7 4V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M6 14H18V21C18 21.5523 17.5523 22 17 22H7C6.44772 22 6 21.5523 6 21V14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const IconMenuForms: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 7.8501C2 6.0001 3.58 4.8501 5.36 4.8501H18.64C20.42 4.8501 22 6.0001 22 7.8501C22 10.0001 20.42 11.1501 18.64 11.1501H5.36C3.58 11.1501 2 10.0001 2 7.8501Z" stroke="currentColor" strokeWidth="1.5"/><path opacity="0.4" d="M6 16.1501C6 14.3001 7.58 13.1501 9.36 13.1501H14.64C16.42 13.1501 18 14.3001 18 16.1501C18 18.0001 16.42 19.1501 14.64 19.1501H9.36C7.58 19.1501 6 18.0001 6 16.1501Z" stroke="currentColor" strokeWidth="1.5"/></svg>
);

// --- DATA TYPES & MOCK DATA ---
interface Medicine {
    name: string;
    dosage: string;
    timing: string;
    duration: string;
    specialInstructions: string;
}

interface Prescription {
    id: string;
    consultationId: string;
    consultationDate: string;
    doctorName: string;
    medicines: Medicine[];
    generalInstructions: string;
}

const mockPrescriptions: Prescription[] = [
    {
        id: 'PRES-001',
        consultationId: 'CON-001',
        consultationDate: '2024-05-20',
        doctorName: 'Dr. Priya Singh',
        medicines: [
            { name: 'Sitopaladi Churna', dosage: '1/2 tsp', timing: 'Twice a day with honey', duration: '7 days', specialInstructions: 'After food.' },
            { name: 'Talisadi Churna', dosage: '1/2 tsp', timing: 'Twice a day with warm water', duration: '7 days', specialInstructions: 'After food.' },
        ],
        generalInstructions: 'Drink plenty of warm water and avoid cold foods and drinks. Take adequate rest.',
    },
    {
        id: 'PRES-002',
        consultationId: 'CON-002',
        consultationDate: '2024-04-15',
        doctorName: 'Dr. Anjali Verma',
        medicines: [
            { name: 'Avipattikar Churna', dosage: '1 tsp', timing: 'At bedtime with warm water', duration: '30 days', specialInstructions: 'For digestive relief.' },
            { name: 'Hingwashtak Churna', dosage: '1/2 tsp', timing: 'Before meals with ghee', duration: '15 days', specialInstructions: 'To improve digestion.' },
        ],
        generalInstructions: 'Follow a light and easily digestible diet. Avoid spicy and oily foods.',
    },
];

const PatientPrescriptions: React.FC = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('My Prescriptions'));
    }, [dispatch]);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">My Prescriptions</h1>
            </div>

            <div className="space-y-6">
                {mockPrescriptions.map((prescription) => (
                    <div key={prescription.id} className="panel print:shadow-none">
                        {/* Card Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-primary-light dark:bg-primary-dark-light flex items-center justify-center">
                                    <IconMenuForms className="w-8 h-8 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                        Prescription from {new Date(prescription.consultationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Prescribed by: {prescription.doctorName} (Consultation ID: {prescription.consultationId})
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 sm:mt-0 sm:text-right print:hidden">
                                <button onClick={handlePrint} className="btn btn-outline-primary flex items-center gap-2">
                                    <IconPrinter className="w-5 h-5" />
                                    Print
                                </button>
                            </div>
                        </div>

                        {/* Medicines Table */}
                        <div className="mt-4">
                            <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Medicines:</h4>
                            <div className="table-responsive">
                                <table className="table-auto w-full">
                                    <thead className="bg-gray-50 dark:bg-gray-800">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Medicine</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Dosage & Timing</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Duration</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Instructions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                                        {prescription.medicines.map((med, index) => (
                                            <tr key={index}>
                                                <td className="px-4 py-3 whitespace-nowrap font-semibold">{med.name}</td>
                                                <td className="px-4 py-3 whitespace-nowrap">{med.dosage}, {med.timing}</td>
                                                <td className="px-4 py-3 whitespace-nowrap">{med.duration}</td>
                                                <td className="px-4 py-3">{med.specialInstructions}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* General Instructions */}
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <h4 className="font-semibold text-gray-700 dark:text-gray-200">General Instructions:</h4>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">{prescription.generalInstructions}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PatientPrescriptions;