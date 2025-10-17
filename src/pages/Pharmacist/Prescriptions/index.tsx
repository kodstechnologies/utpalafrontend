import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react'; // Used for better modal management
import { setPageTitle } from '../../../store/themeConfigSlice';
// '../../../store/themeSlice'; // Adjusted path if necessary
import GlobalModal, { FieldConfig as GlobalFieldConfig } from '../../../components/Modal/GlobalModal';
import PatientPrescriptionsModal, { Prescription, Patient } from './PatientPrescriptionsModal';
import Table, { Column } from '../../../components/Table/Table';

// --- Icons ---
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


// --- Data Structures & Mock Data (Unchanged) ---
const mockPrescriptions: Prescription[] = [
    { id: 1, patientName: 'Sumitra Devi', doctorName: 'Dr. Sharma', date: '2024-10-01', items: [{ name: 'Zolpidem', dosage: '5mg nightly' }, { name: 'Meditation Advice', dosage: '30 mins daily' }], internalNote: 'Follow-up in 2 weeks.' },
    { id: 2, patientName: 'Rajesh Kumar', doctorName: 'Dr. Khan', date: '2024-09-15', items: [{ name: 'Lisinopril', dosage: '10mg daily' }], internalNote: 'Lifestyle changes critical.' },
    { id: 3, patientName: 'Sumitra Devi', doctorName: 'Dr. Sharma', date: '2024-10-10', items: [{ name: 'Melatonin', dosage: '3mg nightly' }], internalNote: 'New sleeping pill trial.' },
    { id: 4, patientName: 'Anil Gupta', doctorName: 'Dr. Patel', date: '2024-10-12', items: [{ name: 'Omeprazole', dosage: '20mg daily' }, { name: 'Diet Plan', dosage: 'Low Acid' }], internalNote: '' },
];
const mockPatients: Patient[] = [
    { id: 1, name: 'Sumitra Devi', age: 56, gender: 'Female', diagnosis: 'Stress/Insomnia' },
    { id: 2, name: 'Rajesh Kumar', age: 48, gender: 'Male', diagnosis: 'Hypertension' },
    { id: 3, name: 'Anil Gupta', age: 62, gender: 'Male', diagnosis: 'Digestive Issues' },
];

interface PrescribedItem {
    name: string;
    dosage: string;
}

// --- Modal Fields + Utils (Unchanged) ---
const prescriptionFields: GlobalFieldConfig[] = [
    { name: 'patientName', label: 'Patient Name', type: 'text', required: true }, 
    { name: 'doctorName', label: 'Doctor Name', type: 'text', required: true },
    { name: 'date', label: 'Date', type: 'date', required: true },
    {
        name: 'items',
        label: 'Prescribed Items (Name: Dosage, one per line)',
        type: 'textarea',
        required: true
    },
    { name: 'internalNote', label: 'Internal Note', type: 'textarea', required: false }
];
const getInitialPrescriptionData = (prescription?: Prescription) => {
    const itemsString = prescription?.items.map(item => `${item.name}: ${item.dosage}`).join('\n') || '';
    return {
        patientName: prescription?.patientName || '',
        doctorName: prescription?.doctorName || '',
        date: prescription?.date || new Date().toISOString().slice(0, 10),
        items: itemsString,
        internalNote: prescription?.internalNote || ''
    };
};
const parseItemsString = (itemsString: string): PrescribedItem[] => {
    return itemsString.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => {
            const parts = line.split(':');
            return {
                name: parts[0].trim(),
                dosage: parts.length > 1 ? parts.slice(1).join(':').trim() : 'N/A',
            };
        });
};


// --- Table Config (Unchanged) ---
const columns: Column<Patient>[] = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Name', accessor: 'name' },
    { Header: 'Age', accessor: 'age' },
    { Header: 'Gender', accessor: 'gender' },
    { Header: 'Diagnosis', accessor: 'diagnosis' }
];

// --- Component: Prescription Card (Updated with showActions prop) ---
const PrescriptionCard: React.FC<{ 
    prescription: Prescription;
    showActions?: boolean;
    onViewClick?: (prescription: Prescription) => void;
}> = ({ prescription, showActions = true, onViewClick }) => (
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
        {showActions && (
            <div className="pt-5 border-t dark:border-gray-600 flex justify-end gap-3">
                {/* The onViewClick is only passed when this card is in the list view,
                    and it opens the dedicated ViewPrescriptionModal */}
                {onViewClick && (
                    <button type="button" className="btn btn-outline-secondary" onClick={() => onViewClick(prescription)}>
                        View
                    </button>
                )}
                <Link to="/invoice" className="btn btn-outline-primary">
                    Generate Invoice
                </Link>
                {/* <button type="button" className="btn btn-primary">
                    Dispense
                </button> */}
            </div>
        )}
    </div>
);


// --- Component: View Prescription Modal (Dedicated Modal for single card view) ---
const ViewPrescriptionModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    prescription: Prescription | null;
}> = ({ isOpen, onClose, prescription }) => {
    
    return (
        <Transition appear show={isOpen} as={React.Fragment}>
            <Dialog as="div" open={isOpen} onClose={onClose} className="relative z-[100]">
                <Transition.Child as={React.Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-[black]/60" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child as={React.Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 text-left align-middle shadow-xl transition-all">
                                {/* The PrescriptionCard is rendered here with actions */}
                                {prescription && <PrescriptionCard prescription={prescription} showActions={true} />}
                                <div className="p-6 pt-0 flex justify-end bg-white dark:bg-gray-800 rounded-b-2xl">
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


// --- Main Component ---
const PrescriptionPage: React.FC = () => {
    const dispatch = useDispatch();
    const [prescriptions, setPrescriptions] = useState<Prescription[]>(mockPrescriptions);

    // --- Create/Edit Modal State ---
    const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false);
    const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

    // --- View Modal State (For viewing a single card) ---
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewingPrescription, setViewingPrescription] = useState<Prescription | null>(null);

    // --- Patient History Modal State (For viewing ALL prescriptions for a patient) ---
    const [filteredData] = useState<Patient[]>(mockPatients);

    useEffect(() => {
        dispatch(setPageTitle('Prescriptions'));
    }, [dispatch]);

    // --- Modal Handlers ---
    const handleOpenCreateEditModal = (prescription?: Prescription) => {
        setSelectedPrescription(prescription || null);
        // Make patientName read-only if opened from the table row (i.e., new prescription for a known patient)
        const patientNameField = prescriptionFields.find(f => f.name === 'patientName');
        // if (patientNameField) {
        //      patientNameField.disabled = !!(prescription && prescription.id === 0);
        // }
        setIsCreateEditModalOpen(true);
    };

    const handleCloseCreateEditModal = () => setIsCreateEditModalOpen(false);

    const handleSavePrescription = (formData: any) => {
        const itemsArray = parseItemsString(formData.items);
        const newPrescriptionData = { ...formData, items: itemsArray };

        if (selectedPrescription && selectedPrescription.id !== 0) {
            // Edit mode
            setPrescriptions(old =>
                old.map(p => (p.id === selectedPrescription.id ? { ...p, ...newPrescriptionData } : p))
            );
        } else {
            // Create mode
            setPrescriptions(old => [
                ...old,
                {
                    id: old.length > 0 ? Math.max(...old.map(p => p.id)) + 1 : 1,
                    ...newPrescriptionData
                } as Prescription
            ]);
        }
        setIsCreateEditModalOpen(false);
    };

    // View single prescription handler
    const handleOpenViewModal = (prescription: Prescription) => {
        setViewingPrescription(prescription);
        setIsViewModalOpen(true);
    };
    const handleCloseViewModal = () => {
        setIsViewModalOpen(false);
        setViewingPrescription(null);
    };

    // --- Table Actions ---
    const renderActions = (row: Patient) => (
        <div className="flex gap-2">
            <Link
                to={`/prescriptions/${row.name}`}
                className="btn btn-outline-info btn-sm"
            >
                <IconClipboardText className="w-4 h-4 mr-1" /> 
            </Link>
            {/* <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() =>
                    handleOpenCreateEditModal({
                        id: 0, 
                        patientName: row.name,
                        doctorName: '',
                        date: new Date().toISOString().slice(0, 10),
                        items: [],
                        internalNote: ''
                    })
                }
            >
                Prescribe
            </button> */}
        </div>
    );

    // --- Table Top Content (Unchanged) ---
    const renderTopContent = () => (
        <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Patient List</h3>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Page Header - Add Prescription */}
            {/* <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Prescription Management</h2>
                <button
                    type="button"
                    className="btn btn-success flex items-center gap-2"
                    onClick={() => handleOpenCreateEditModal()}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M11 19v-6H5v-2h6V5h2v6h6v2h-6v6Z" />
                    </svg>
                    Add Prescription
                </button>
            </div> */}

            {/* --------------------- PATIENT TABLE SECTION --------------------- */}
            <div className="panel">
                <Table<Patient>
                    columns={[...columns, { 
                        Header: 'Actions', 
                        accessor: 'id', // use id for accessor but render custom content
                        Cell: ({ row }) => renderActions(row as Patient) 
                    }]}
                    data={filteredData}
                    topContent={renderTopContent()}
                    itemsPerPage={10}
                />
            </div>

            {/* --------------------- RECENT PRESCRIPTION CARDS --------------------- */}
            {/* <div className="panel">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-5">Recent Prescriptions</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {prescriptions.map(p => (
                        <PrescriptionCard 
                            key={p.id} 
                            prescription={p} 
                            showActions={true} 
                            onViewClick={handleOpenViewModal} 
                        />
                    ))}
                </div>
            </div> */}

            {/* --------------------- MODALS --------------------- */}

            {/* 1. GLOBAL MODAL FOR CREATE/EDIT PRESCRIPTION */}
            <GlobalModal
                isOpen={isCreateEditModalOpen}
                onClose={handleCloseCreateEditModal}
                mode={selectedPrescription ? "edit" : "create"}
                title={selectedPrescription && selectedPrescription.id !== 0 ? "Edit Prescription" : "Create New Prescription"}
                fields={prescriptionFields}
                initialData={getInitialPrescriptionData(selectedPrescription || undefined)}
                onSave={handleSavePrescription}
            />

            {/* 3. MODAL FOR VIEWING A SINGLE PRESCRIPTION (Called from history or recent list) */}
            <ViewPrescriptionModal
                isOpen={isViewModalOpen}
                onClose={handleCloseViewModal}
                prescription={viewingPrescription}
            />
        </div>
    );
};

export default PrescriptionPage;