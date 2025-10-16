import React, { useEffect, useState, useMemo, ReactNode } from 'react';
// Assuming these imports are functional within the user's environment
// import { useDispatch } from 'react-redux';
// import { setPageTitle } from '../../../store/themeConfigSlice';
// import Table, { Column } from '../../../components/Table/Table';

import { Dialog, Transition } from '@headlessui/react';

// --- ICONS ---
const IconEye = (props) => (<svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>);
const IconPrinter = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 17H4C2.89543 17 2 16.1046 2 15V10C2 8.89543 2.89543 8 4 8H20C21.1046 8 22 8.89543 22 10V15C22 16.1046 21.1046 17 20 17H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M17 8V4C17 2.89543 16.1046 2 15 2H9C7.89543 2 7 2.89543 7 4V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M6 14H18V21C18 21.5523 17.5523 22 17 22H7C6.44772 22 6 21.5523 6 21V14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const IconX = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 6L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

// --- TYPE DEFINITIONS (Mimicking external imports) ---
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

interface Column<T> {
    accessor: keyof T | ((data: T) => string | number | ReactNode);
    header: string;
    sortable?: boolean;
    cell?: (data: T) => ReactNode;
}

// Minimal implementation of Table for self-containment
const Table = ({ columns, data, actions, topContent }) => {
    // In a real environment, this component would handle filtering, sorting, and pagination.
    // Here, we just render a simple table for demonstration.
    return (
        <div className="panel p-0 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                {topContent}
            </div>
            <div className="overflow-x-auto">
                <table className="table-auto w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            {columns.map((col, index) => (
                                <th key={index} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{col.header}</th>
                            ))}
                            {actions && <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                        {data.map((item, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex} className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {col.cell ? col.cell(item) : (typeof col.accessor === 'string' ? item[col.accessor] : col.accessor(item))}
                                    </td>
                                ))}
                                {actions && <td className="px-4 py-3 text-center text-sm">{actions(item)}</td>}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


// --- MOCK DATA ---
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

const PatientPrescriptions = () => {
    // Assuming dispatch and setPageTitle are functional
    // const dispatch = useDispatch();
    // useEffect(() => {
    //     dispatch(setPageTitle('My Prescriptions'));
    // }, [dispatch]);

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

    const handlePrint = () => {
        window.print();
    };

    const openModal = (prescription: Prescription) => {
        setSelectedPrescription(prescription);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedPrescription(null);
    };

    // --- TABLE CONFIGURATION ---
    
    // Define columns for the main prescription table
    const columns: Column<Prescription>[] = useMemo(() => [
        {
            header: 'Prescription ID',
            accessor: 'id',
            sortable: true,
            cell: (data) => <span className="font-semibold text-primary dark:text-primary-light">{data.id}</span>
        },
        {
            header: 'Date',
            accessor: 'consultationDate',
            sortable: true,
            cell: (data) => new Date(data.consultationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        },
        {
            header: 'Doctor',
            accessor: 'doctorName',
            sortable: true,
            cell: (data) => <span className="text-gray-700 dark:text-gray-300">{data.doctorName}</span>
        },
        {
            header: 'Medicines',
            accessor: (data) => `${data.medicines.length} items`,
            sortable: false,
            cell: (data) => (
                <span className="text-sm bg-success/10 text-success py-1 px-2 rounded-full font-medium">
                    {data.medicines.length} Items
                </span>
            )
        },
        {
            header: 'Consultation ID',
            accessor: 'consultationId',
            sortable: true,
        },
    ], []);

    // Function to render action buttons for each row
    const renderActions = (data: Prescription) => (
        <div className="flex items-center justify-center gap-2">
            <button
                type="button"
                className="btn btn-outline-info p-2 rounded-full hover:shadow-lg transition duration-200"
                onClick={() => openModal(data)}
                title="View Details"
            >
                <IconEye className="w-5 h-5" />
            </button>
        </div>
    );

    // Function to render content above the table (Title, Filters, Print Button)
    const renderTopContent = () => (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Prescriptions</h1>
            <button onClick={handlePrint} className="btn btn-primary flex items-center gap-2 print:hidden">
                <IconPrinter className="w-5 h-5" />
                Print All
            </button>
        </div>
    );

    // The data source is the mockPrescriptions array
    const filteredData = mockPrescriptions; // In a real app, this would be filtered/searched data

    // --- PRESCRIPTION DETAIL MODAL (DIALOG) ---
    const PrescriptionDetailModal = () => (
        <Transition appear show={modalOpen} as={React.Fragment}>
            <Dialog as="div" open={modalOpen} onClose={closeModal} className="relative z-50">
                <Transition.Child
                    as={React.Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={React.Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-xl transition-all dark:bg-gray-800">
                                <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                                    <Dialog.Title as="h3" className="text-xl font-bold leading-6 text-gray-900 dark:text-white">
                                        Prescription Details
                                    </Dialog.Title>
                                    <button onClick={closeModal} type="button" className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white">
                                        <IconX className="w-6 h-6" />
                                    </button>
                                </div>
                                
                                {selectedPrescription && (
                                    <div className="mt-4 space-y-6">
                                        {/* Header Info */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="font-medium text-gray-500 dark:text-gray-400">Prescribed By</p>
                                                <p className="font-semibold text-gray-800 dark:text-white">{selectedPrescription.doctorName}</p>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-500 dark:text-gray-400">Consultation Date</p>
                                                <p className="font-semibold text-gray-800 dark:text-white">
                                                    {new Date(selectedPrescription.consultationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-500 dark:text-gray-400">Prescription ID</p>
                                                <p className="text-primary font-semibold">{selectedPrescription.id}</p>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-500 dark:text-gray-400">Consultation ID</p>
                                                <p className="text-gray-800 dark:text-white font-semibold">{selectedPrescription.consultationId}</p>
                                            </div>
                                        </div>

                                        {/* Medicine Table */}
                                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                            <h4 className="font-bold text-base p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">Medicines List</h4>
                                            <div className="table-responsive">
                                                <table className="table-auto w-full">
                                                    <thead className="bg-gray-100 dark:bg-gray-800/80">
                                                        <tr>
                                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Medicine</th>
                                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Dosage & Timing</th>
                                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Duration</th>
                                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Instructions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                                        {selectedPrescription.medicines.map((med, index) => (
                                                            <tr key={index}>
                                                                <td className="px-4 py-3 whitespace-nowrap font-semibold">{med.name}</td>
                                                                <td className="px-4 py-3 whitespace-nowrap">{med.dosage}, {med.timing}</td>
                                                                <td className="px-4 py-3 whitespace-nowrap">{med.duration}</td>
                                                                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{med.specialInstructions}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        {/* General Instructions */}
                                        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                                            <h4 className="font-bold text-sm text-yellow-800 dark:text-yellow-300 mb-1">General Instructions:</h4>
                                            <p className="text-sm text-gray-800 dark:text-gray-200">{selectedPrescription.generalInstructions}</p>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="mt-6 flex justify-end gap-3 print:hidden">
                                    <button type="button" className="btn btn-outline-dark" onClick={closeModal}>
                                        Close
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );

    return (
        <div className="space-y-6">
            <Table<Prescription>
                columns={columns}
                data={filteredData}
                actions={renderActions}
                topContent={renderTopContent()}
                itemsPerPage={10}
            />
            {/* Modal for viewing details */}
            <PrescriptionDetailModal />
        </div>
    );
};

export default PatientPrescriptions;
