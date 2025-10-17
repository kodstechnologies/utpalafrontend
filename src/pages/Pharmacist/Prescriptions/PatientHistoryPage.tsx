import React, { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Printer, FileText } from 'lucide-react';
import { setPageTitle } from '../../../store/themeConfigSlice'; // Re-use types
import { Prescription, Patient } from './PatientPrescriptionsModal';

// --- Updated Data Structures ---
interface PrescribedItem {
    name: string;
    units: string;
    time: string;
    note: string;
}

// Adjust the Prescription type to use the new PrescribedItem
interface PagePrescription extends Omit<Prescription, 'items'> {
    items: PrescribedItem[];
}

// --- Mock Data (Should be moved to a shared location or fetched from an API) ---
const mockPrescriptions: PagePrescription[] = [
    { id: 1, patientName: 'Sumitra Devi', doctorName: 'Dr. Sharma', date: '2024-10-01', items: [{ name: 'Zolpidem', units: '5mg', time: 'Nightly', note: 'Before sleep' }, { name: 'Meditation', units: '30 mins', time: 'Daily', note: 'Morning' }], internalNote: 'Follow-up in 2 weeks.' },
    { id: 2, patientName: 'Rajesh Kumar', doctorName: 'Dr. Khan', date: '2024-09-15', items: [{ name: 'Lisinopril', units: '20mg', time: 'Daily', note: 'After breakfast' }], internalNote: 'Lifestyle changes critical.' },
    { id: 3, patientName: 'Sumitra Devi', doctorName: 'Dr. Sharma', date: '2024-10-10', items: [{ name: 'Melatonin', units: '3mg', time: 'Nightly', note: 'As needed' }], internalNote: 'New sleeping pill trial.' },
    { id: 4, patientName: 'Anil Gupta', doctorName: 'Dr. Patel', date: '2024-10-12', items: [{ name: 'Omeprazole', units: '20mg', time: 'Daily', note: 'Before food' }, { name: 'Diet Plan', units: 'N/A', time: 'N/A', note: 'Low Acid' }], internalNote: '' },
];

const mockPatients: Patient[] = [
    { id: 1, name: 'Sumitra Devi', age: 56, gender: 'Female', diagnosis: 'Stress/Insomnia' },
    { id: 2, name: 'Rajesh Kumar', age: 48, gender: 'Male', diagnosis: 'Hypertension' },
    { id: 3, name: 'Anil Gupta', age: 62, gender: 'Male', diagnosis: 'Digestive Issues' },
];

const PatientHistoryPage: React.FC = () => {
    const { patientName } = useParams<{ patientName: string }>();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle(`Prescription for ${patientName}`));
    }, [dispatch, patientName]);

    const latestPrescription = useMemo(() => {
        return mockPrescriptions
            .filter(p => p.patientName === patientName)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    }, [patientName]);

    const patientDetails = useMemo(() => {
        return mockPatients.find(p => p.name === patientName);
    }, [patientName]);

    if (!latestPrescription) {
        return (
            <div className="panel text-center">
                <h2 className="text-xl font-bold mb-4">No Prescription Found</h2>
                <p>No prescription history could be found for "{patientName}".</p>
                <Link to="/prescriptions" className="btn btn-primary mt-4">Back to Patient List</Link>
            </div>
        );
    }

    return (
        <div>
            <div className="print:hidden">
                <ul className="flex space-x-2 rtl:space-x-reverse mb-6">
                    <li>
                        <Link to="/" className="text-primary hover:underline">Dashboard</Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <Link to="/prescriptions" className="text-primary hover:underline">Prescriptions</Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span>{patientName}</span>
                    </li>
                </ul>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 mb-6">
                    <Link to="/invoice" className="btn btn-outline-primary flex items-center gap-2">
                        <FileText size={16} /> Generate Invoice
                    </Link>
                    <button onClick={() => window.print()} className="btn btn-primary flex items-center gap-2">
                        <Printer size={16} /> Download / Print
                    </button>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg border-2 border-gray-300 dark:border-gray-700 shadow-lg font-serif relative print:shadow-none print:border-none print:rounded-none">
                {/* Hospital Header */}
                <div className="text-center border-b-2 border-gray-300 dark:border-gray-600 pb-4 mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">Utpalaayurdhama</h1>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">123 Wellness St, Ayurveda City, 560001</p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Phone: (123) 456-7890</p>
                </div>

                {/* Patient and Date Info */}
                <div className="flex justify-between items-start mb-6 text-sm">
                    <div>
                        <p><strong>Patient:</strong> {latestPrescription.patientName}</p>
                        {patientDetails && <p><strong>Age/Gender:</strong> {patientDetails.age} / {patientDetails.gender}</p>}
                    </div>
                    <div>
                        <p><strong>Date:</strong> {latestPrescription.date}</p>
                    </div>
                </div>

                {/* Prescription Body */}
                <div className="mt-8">
                    <div className="text-5xl font-bold text-gray-700 dark:text-gray-300 mb-4">R<sub className="text-3xl">x</sub></div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b-2 border-gray-300 dark:border-gray-600">
                                <tr>
                                    <th className="py-2 px-4 font-semibold text-gray-700 dark:text-gray-200">Medicine Name</th>
                                    <th className="py-2 px-4 font-semibold text-gray-700 dark:text-gray-200">Units</th>
                                    <th className="py-2 px-4 font-semibold text-gray-700 dark:text-gray-200">Time</th>
                                    <th className="py-2 px-4 font-semibold text-gray-700 dark:text-gray-200">Note</th>
                                </tr>
                            </thead>
                            <tbody>
                                {latestPrescription.items.map((item, index) => (
                                    <tr key={index} className="border-b border-dashed dark:border-gray-700">
                                        <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-100">{item.name}</td>
                                        <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{item.units}</td>
                                        <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{item.time}</td>
                                        <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{item.note}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Doctor's Signature */}
                <div className="mt-16 text-right">
                    <div className="inline-block text-center">
                        <p className="border-t-2 border-gray-400 pt-2 w-48">Dr. {latestPrescription.doctorName}</p>
                        <p className="text-xs text-gray-500">(Doctor's Signature)</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientHistoryPage;