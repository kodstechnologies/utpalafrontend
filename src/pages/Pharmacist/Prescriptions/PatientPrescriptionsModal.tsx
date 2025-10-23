import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';

// --- Data Structures & Mock Data ---
// These were moved from the main index.tsx file
interface PrescribedItem {
    name: string;
    dosage: string;
}
export interface Prescription {
    id: number;
    patientName: string;
    doctorName: string;
    date: string;
    items: PrescribedItem[];
    internalNote: string;
}
export interface Patient {
    id: number;
    name: string;
    age: number;
    gender: string;
    diagnosis: string;
    doctor: string;
}

const mockPatients: Patient[] = [
    { id: 1, name: 'Sumitra Devi', age: 56, gender: 'Female', diagnosis: 'Stress/Insomnia', doctor: 'Dr. Sharma'},
    { id: 2, name: 'Rajesh Kumar', age: 48, gender: 'Male', diagnosis: 'Hypertension' , doctor: 'Dr. Khan'},
    { id: 3, name: 'Anil Gupta', age: 62, gender: 'Male', diagnosis: 'Digestive Issues', doctor: 'Dr. Patel'},
];


// --- Component: Patient Prescriptions Modal Content (Used Headless UI Dialog) ---
const PatientPrescriptionsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    patientName: string;
    prescriptions: Prescription[];
    onViewClick: (prescription: Prescription) => void;
}> = ({ isOpen, onClose, patientName, prescriptions }) => {

    const patientPrescriptions = useMemo(() => {
        return prescriptions.filter(p => p.patientName === patientName).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [prescriptions, patientName]);

    return (
        <Transition appear show={isOpen} as={React.Fragment}>
            <Dialog as="div" open={isOpen} onClose={onClose} className="relative z-50">
                <Transition.Child as={React.Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-[black]/60" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child as={React.Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-xl font-bold leading-6 text-gray-900 dark:text-white border-b pb-4 mb-4">
                                    Prescription History for {patientName}
                                </Dialog.Title>
                                <div className="max-h-[70vh] overflow-y-auto p-2">
                                    {patientPrescriptions.length > 0 ? (
                                        (() => {
                                            const latestPrescription = patientPrescriptions[0];
                                            const patientDetails = mockPatients.find(p => p.name === latestPrescription.patientName);

                                            return (
                                                <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg border-2 border-gray-300 dark:border-gray-700 shadow-lg font-serif relative">
                                                    <div className="text-center border-b-2 border-gray-300 dark:border-gray-600 pb-4 mb-6">
                                                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">Utpalaayurdhama</h1>
                                                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">123 Wellness St, Ayurveda City, 560001</p>
                                                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Phone: (123) 456-7890</p>
                                                    </div>
                                                    <div className="flex justify-between items-start mb-6 text-sm">
                                                        <div>
                                                            <p><strong>Patient:</strong> {latestPrescription.patientName}</p>
                                                            {patientDetails && <p><strong>Age/Gender:</strong> {patientDetails.age} / {patientDetails.gender}</p>}
                                                        </div>
                                                        <div><p><strong>Date:</strong> {latestPrescription.date}</p></div>
                                                    </div>
                                                    <div className="mt-8">
                                                        <div className="text-5xl font-bold text-gray-700 dark:text-gray-300 mb-4">R<sub className="text-3xl">x</sub></div>
                                                        <ul className="space-y-4 pl-6 text-base">
                                                            {latestPrescription.items.map((item, index) => (<li key={index} className="border-b border-dashed dark:border-gray-600 pb-3"><div className="font-semibold text-lg text-gray-800 dark:text-gray-100">{item.name}</div><div className="text-gray-600 dark:text-gray-300 pl-4">{item.dosage}</div></li>))}
                                                        </ul>
                                                    </div>
                                                    <div className="mt-16 text-right"><div className="inline-block text-center"><p className="border-t-2 border-gray-400 pt-2 w-48">Dr. {latestPrescription.doctorName}</p><p className="text-xs text-gray-500">(Doctor's Signature)</p></div></div>
                                                </div>
                                            );
                                        })()
                                    ) : (<p className="text-center text-gray-500 dark:text-gray-400">No prescriptions found for this patient.</p>)}
                                </div>
                                <div className="mt-6 flex justify-end gap-4">
                                    <Link to="/invoice" className="btn btn-outline-primary">Generate Invoice</Link>
                                    <button type="button" className="btn btn-outline-danger" onClick={onClose}>Close</button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default PatientPrescriptionsModal;