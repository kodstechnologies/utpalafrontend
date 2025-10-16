import React, { useEffect, useState, useMemo, ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { setPageTitle } from '../../../store/themeConfigSlice';
import Table, { Column } from '../../../components/Table/Table';

// --- Internal Icon Components (for visual flair) ---
const IconEye: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>);
const IconUser: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path opacity="0.5" d="M20 21C20 16.5817 16.4183 13 12 13C7.58172 13 4 16.5817 4 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const IconStethoscope: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 8C20.6569 8 22 6.65685 22 5C22 3.34315 20.6569 2 19 2C17.3431 2 16 3.34315 16 5C16 6.65685 17.3431 8 19 8Z" stroke="currentColor" strokeWidth="1.5"/>
        <path opacity="0.5" d="M19 8V11C19 13.2091 17.2091 15 15 15H9C6.79086 15 5 13.2091 5 11V8" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M5 8C6.65685 8 8 6.65685 8 5C8 3.34315 6.65685 2 5 2C3.34315 2 2 3.34315 2 5C2 6.65685 3.34315 8 5 8Z" stroke="currentColor" strokeWidth="1.5"/>
        <path opacity="0.5" d="M9 15V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);

const IconCalendar: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 7H3M21 7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7M21 7V4C21 2.89543 20.1046 2 19 2H5C3.89543 2 3 2.89543 3 4V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path opacity="0.5" d="M3 10V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);

const IconClipboardText: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 4.5H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path opacity="0.5" d="M7.5 2.5H16.5C17.6046 2.5 18.5 3.39543 18.5 4.5V19.5C18.5 20.6046 17.6046 21.5 16.5 21.5H7.5C6.39543 21.5 5.5 20.6046 5.5 19.5V4.5C5.5 3.39543 6.39543 2.5 7.5 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9.5 9.5H14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M9.5 13.5H14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);

// --- Data Structures ---

interface PrescribedItem {
    name: string;
    dosage: string;
}

interface Prescription {
    id: number;
    patientName: string;
    doctorName: string;
    date: string;
    items: PrescribedItem[];
    internalNote: string;
}

// --- Mock Data ---

const mockPrescriptions: Prescription[] = [
    {
        id: 1,
        patientName: 'Sumitra Devi',
        doctorName: 'Dr. Anya Sharma',
        date: '2024-07-29',
        items: [
            { name: 'Ashwagandha Churna', dosage: '1 tsp with milk, twice daily' },
            { name: 'Brahmi Vati', dosage: '2 tablets after meals' },
        ],
        internalNote: 'Patient reported high stress and poor sleep. Follow up in 2 weeks to monitor progress.',
    },
    {
        id: 2,
        patientName: 'Rajesh Kumar',
        doctorName: 'Dr. Anya Sharma',
        date: '2024-07-28',
        items: [
            { name: 'Arjuna Ksheera Paka', dosage: '20ml, once daily in the morning' },
            { name: 'Guggulu Tablets', dosage: '1 tablet, twice daily' },
        ],
        internalNote: 'Prescribed for cardiovascular support and cholesterol management. Patient has a history of hypertension.',
    },
    {
        id: 3,
        patientName: 'Anil Gupta',
        doctorName: 'Dr. Anya Sharma',
        date: '2024-07-26',
        items: [
            { name: 'Triphala Guggulu', dosage: '2 tablets at bedtime' },
            { name: 'Trikatu Churna', dosage: '1/2 tsp with honey before meals' },
        ],
        internalNote: 'Focus on improving digestion and detoxification. Patient has a Tridoshic imbalance.',
    },
];

// --- Components ---

const PrescriptionCard: React.FC<{ prescription: Prescription }> = ({ prescription }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 space-y-5">
            {/* Card Header */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b dark:border-gray-600 pb-4">
                <div className="flex items-center gap-3 mb-3 sm:mb-0">
                    <IconUser className="w-6 h-6 text-green-600 dark:text-green-400" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{prescription.patientName}</h3>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                        <IconStethoscope className="w-4 h-4" />
                        <span>{prescription.doctorName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <IconCalendar className="w-4 h-4" />
                        <span>{prescription.date}</span>
                    </div>
                </div>
            </div>

            {/* Prescribed Items */}
            <div>
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Prescribed Items</h4>
                <ul className="space-y-2 list-disc list-inside pl-1 text-gray-600 dark:text-gray-300">
                    {prescription.items.map((item, index) => (
                        <li key={index}>
                            <span className="font-medium text-gray-800 dark:text-gray-100">{item.name}:</span> {item.dosage}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Internal Note */}
            {prescription.internalNote && (
                <div className="pt-4 border-t dark:border-gray-600">
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Internal Note</h4>
                    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <IconClipboardText className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-1" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">{prescription.internalNote}</p>
                    </div>
                </div>
            )}

            {/* Card Footer with Actions */}
            <div className="pt-5 border-t dark:border-gray-600 flex justify-end gap-3">
                <Link to="/invoice" className="btn btn-outline-primary">
                    Generate Invoice
                </Link>
                {/* <button type="button" className="btn btn-primary">
                    Dispense
                </button> */}
            </div>
        </div>
    );
};

const PrescriptionPage: React.FC = () => {
    const dispatch = useDispatch();
    const [prescriptions, setPrescriptions] = useState<Prescription[]>(mockPrescriptions);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewingPrescription, setViewingPrescription] = useState<Prescription | null>(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        dispatch(setPageTitle('Prescriptions'));
    }, [dispatch]);

    const filteredData = useMemo(() => {
        return prescriptions.filter(p =>
            p.patientName.toLowerCase().includes(search.toLowerCase()) ||
            p.doctorName.toLowerCase().includes(search.toLowerCase()) ||
            p.items.some(item => item.name.toLowerCase().includes(search.toLowerCase()))
        );
    }, [prescriptions, search]);

    const handleOpenViewModal = (prescription: Prescription) => {
        setViewingPrescription(prescription);
        setIsViewModalOpen(true);
    };

    const handleCloseViewModal = () => {
        setIsViewModalOpen(false);
        setViewingPrescription(null);
    };

    const columns: Column<Prescription>[] = useMemo(() => [
        { Header: 'Patient Name', accessor: 'patientName', Cell: ({ value }) => <div className="font-semibold">{value}</div> },
        { Header: 'Doctor', accessor: 'doctorName' },
        { Header: 'Date', accessor: 'date' },
        { Header: 'Items', accessor: 'items', Cell: ({ value }) => `${value.length} item(s)` },
    ], []);

    const renderActions = (prescription: Prescription): ReactNode => (
        <div className="flex items-center justify-center gap-2">
            <button
                type="button"
                className="btn btn-sm btn-outline-primary flex items-center gap-1"
                onClick={() => handleOpenViewModal(prescription)}
            >
                <IconEye className="w-4 h-4" />
                View
            </button>
            {/* <button type="button" className="btn btn-sm btn-primary">
                Dispense
            </button> */}
        </div>
    );

    const renderTopContent = (): ReactNode => (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Incoming Prescriptions</h2>
            <div className="flex items-center gap-4 w-full sm:w-auto">
                <input
                    type="text"
                    placeholder="Search by Patient, Doctor, or Medicine..."
                    className="form-input w-full sm:w-64"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {/* <button type="button" className="btn btn-success flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M11 19v-6H5v-2h6V5h2v6h6v2h-6v6Z" /></svg>
                    Add
                </button> */}
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="panel p-0">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    {renderTopContent()}
                </div>
                <div className="p-4">
                    <Table<Prescription>
                        columns={columns}
                        data={filteredData}
                        actions={renderActions}
                        itemsPerPage={5}
                    />
                </div>
            </div>

            {/* View Prescription Modal */}
            <Transition appear show={isViewModalOpen} as={React.Fragment}>
                <Dialog as="div" open={isViewModalOpen} onClose={handleCloseViewModal} className="relative z-50">
                    <Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-[black]/60" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={React.Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 text-left align-middle shadow-xl transition-all">
                                    {viewingPrescription && <PrescriptionCard prescription={viewingPrescription} />}
                                    {/* Modal Footer with Close Button */}
                                    <div className="p-6 pt-4 flex justify-end bg-white dark:bg-gray-800 rounded-b-2xl">
                                        <button type="button" className="btn btn-outline-danger" onClick={handleCloseViewModal}>
                                            Close
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default PrescriptionPage;