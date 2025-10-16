import React, { useMemo, useState, useEffect, ReactNode } from 'react';
import { Dialog, Transition } from '@headlessui/react';

// --- ASSUMED EXTERNAL IMPORTS (Commented out for single-file compliance) ---
// import { useDispatch } from 'react-redux';
// import { setPageTitle } from '../../../store/themeConfigSlice';
// import Table, { Column } from '../../../components/Table/Table';

// --- ICONS ---
const IconPlus = (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 19V13H5V11H11V5H13V11H19V13H13V19H11Z" fill="currentColor"/></svg>);
const IconX = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 6L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

// --- TYPE DEFINITIONS (For self-contained component) ---
interface TreatmentSession {
    id: number;
    name: string; // Patient Name
    date: string;
    type: string;
    days: number;
    instructions: string;
}

interface Column<T> {
    accessor: keyof T | ((data: T) => string | number | ReactNode);
    header: string;
    sortable?: boolean;
    cell?: (data: T) => ReactNode;
}

interface FieldConfig {
    key: string;
    label: string;
    type: 'text' | 'number' | 'textarea' | 'select';
    options?: { value: string; label: string }[];
    required: boolean;
    colSpan?: 'full' | 'half'; // Added for layout control
}

interface GlobalModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'create' | 'edit';
    title: string;
    fields: FieldConfig[];
    initialData: Record<string, any>;
    onSave: (data: Record<string, any>) => void;
}

// --- MOCK DATA ---
const mockSessions: TreatmentSession[] = [
    { id: 1, name: 'Ajay Sharama', date: '2024-03-10', type: 'Physiotherapy', days: 5, instructions: 'Patient showed improved mobility and reduced pain in the left shoulder. Recommended follow-up exercises.' },
    { id: 2, name: 'Vijay Kumar', date: '2024-03-05', type: 'Acupuncture', days: 2, instructions: 'Migraine symptoms alleviated. Patient reported significant reduction in headache intensity. Next session scheduled.' },
    { id: 3, name: 'Ram', date: '2024-02-28', type: 'Massage Therapy', days: 5, instructions: 'Relieved muscle tension in the lower back. Patient felt relaxed and reported better sleep quality.' },
    { id: 4, name: 'Kajol', date: '2024-02-20', type: 'Yoga Therapy', days: 5, instructions: 'Improved flexibility and stress reduction. Patient showed better breathing control techniques.' },
    { id: 5, name: 'Deepika', date: '2024-02-15', type: 'Physiotherapy', days: 3, instructions: 'Continued progress on knee rehabilitation. Patient demonstrated increased range of motion. New exercises prescribed.' },
];

// --- PLACEHOLDER COMPONENTS (For self-contained functionality) ---

// Minimal implementation of Table
const Table = ({ columns, data, topContent, itemsPerPage = 5 }: { columns: Column<any>[], data: any[], topContent: ReactNode, itemsPerPage?: number }) => {
    // Note: Pagination and sorting logic is omitted for brevity in this self-contained example.
    const paginatedData = data.slice(0, itemsPerPage);
 
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
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                        {paginatedData.map((item, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex} className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                        {col.cell ? col.cell(item) : (typeof col.accessor === 'string' ? item[col.accessor] : col.accessor(item))}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Global Modal component structure based on user request
const GlobalModal: React.FC<GlobalModalProps> = ({
    isOpen,
    onClose,
    title,
    fields,
    initialData,
    onSave
}) => {
    const [formData, setFormData] = useState(initialData);

    // Sync initial data when modal opens or initialData changes
    useEffect(() => {
        setFormData(initialData);
    }, [initialData, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple validation check for required fields
        const isValid = fields.every(field => !field.required || (formData[field.key] !== null && formData[field.key] !== ''));
        
        if (isValid) {
            onSave(formData);
            onClose();
        } else {
            console.error("Form validation failed. Please fill all required fields.");
        }
    };

    const renderInput = (field: FieldConfig) => {
        const commonProps = {
            id: field.key,
            value: formData[field.key] || (field.type === 'number' ? '' : ''),
            onChange: handleChange,
            required: field.required,
            className: "form-input w-full dark:bg-gray-900 dark:border-gray-700",
        };

        switch (field.type) {
            case 'textarea':
                return <textarea {...commonProps} rows={4} placeholder={`Enter ${field.label}`} />;
            case 'select':
                return (
                    <select {...commonProps}>
                        <option value="">Select {field.label}</option>
                        {field.options?.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                );
            case 'number':
                return <input type="number" {...commonProps} placeholder={`Enter ${field.label}`} />;
            case 'text':
            default:
                return <input type="text" {...commonProps} placeholder={`Enter ${field.label}`} />;
        }
    };

    return (
        <Transition appear show={isOpen} as={React.Fragment}>
            <Dialog as="div" open={isOpen} onClose={onClose} className="relative z-50">
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
                            <Dialog.Panel className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl transition-all dark:bg-gray-800">
                                <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                                    <Dialog.Title as="h3" className="text-xl font-bold leading-6 text-gray-900 dark:text-white">
                                        {title}
                                    </Dialog.Title>
                                    <button onClick={onClose} type="button" className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white">
                                        <IconX className="w-6 h-6" />
                                    </button>
                                </div>
                                
                                <form onSubmit={handleSubmit} className="mt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {fields.map(field => (
                                            <div key={field.key} className={field.colSpan === 'full' ? 'col-span-full' : ''}>
                                                <label htmlFor={field.key} className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                                                    {field.label} {field.required && <span className="text-red-500">*</span>}
                                                </label>
                                                {renderInput(field)}
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="flex justify-end gap-3 pt-6 border-t dark:border-gray-700 mt-6">
                                        <button type="button" onClick={onClose} className="btn btn-outline-dark">
                                            Cancel
                                        </button>
                                        <button type="submit" className={`btn ${formData.mode === 'edit' ? 'btn-warning' : 'btn-success'}`}>
                                            {formData.mode === 'edit' ? 'Update Treatment' : 'Add Treatment'}
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};


// --- TREATMENT SESSION COMPONENT ---

const TreatmentSessions = () => {
    // Disabled Redux dispatch for self-contained file
    // const dispatch = useDispatch();
    // useEffect(() => {
    //     dispatch(setPageTitle('Treatments'));
    // }, [dispatch]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sessions, setSessions] = useState<TreatmentSession[]>(mockSessions);
    const [selectedSession, setSelectedSession] = useState<TreatmentSession | null>(null);

    const handleOpenModal = () => {
        setSelectedSession(null); // Clear selected session for 'create' mode
        setIsModalOpen(true);
    };
    
    // Note: Edit functionality is available by opening the modal with a session selected
    const handleEditSession = (session: TreatmentSession) => {
        setSelectedSession(session);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedSession(null);
    };

    const handleSaveTreatment = (data: Record<string, any>) => {
        const newSession: TreatmentSession = {
            id: selectedSession ? selectedSession.id : sessions.length + 1, // Simple ID generation
            name: data.patientName,
            date: new Date().toISOString().split('T')[0], // Use current date for simplicity
            type: data.treatmentType,
            days: parseInt(data.days),
            instructions: data.instructions,
        };

        if (selectedSession) {
            // Edit mode: update the existing session
            setSessions(sessions.map(s => s.id === newSession.id ? newSession : s));
            console.log('Treatment Updated:', newSession);
        } else {
            // Create mode: add new session
            setSessions([newSession, ...sessions]);
            console.log('Treatment Added:', newSession);
        }
    };

    const getInitialTreatmentData = (session: TreatmentSession | null) => ({
        patientName: session?.name || '',
        treatmentType: session?.type || '',
        days: session?.days.toString() || '',
        instructions: session?.instructions || '',
        mode: session ? 'edit' : 'create', // Used internally by the modal
    });


    // --- COLUMN DEFINITION ---
    const columns: Column<TreatmentSession>[] = useMemo(() => [
        {
            header: 'Patient Name',
            accessor: 'name',
            sortable: true,
            cell: (row) => (
                <div className="font-semibold text-gray-800 dark:text-white">
                    {row.name}
                </div>
            )
        },
        { 
            header: 'Date', 
            accessor: 'date',
            cell: (row) => new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        },
        { 
            header: 'Therapy Type', 
            accessor: 'type',
            cell: (row) => (
                <span className="bg-primary/10 text-primary py-1 px-2 rounded-full text-xs font-medium">{row.type}</span>
            )
        },
        { 
            header: 'Days', 
            accessor: 'days',
            sortable: true,
        },
        { 
            header: 'Instructions', 
            accessor: 'instructions',
            cell: (row) => <span className="line-clamp-1 max-w-[200px] block text-sm text-gray-500 dark:text-gray-400">{row.instructions}</span>
        },
        // Action column for editing
        {
            header: 'Action',
            accessor: 'id', // Placeholder for the accessor
            cell: (row) => (
                <button 
                    type="button" 
                    className="btn btn-outline-warning p-2 text-xs rounded-full hover:shadow-lg transition duration-200"
                    onClick={() => handleEditSession(row)}
                >
                    Edit
                </button>
            )
        }
    ], [sessions]); // Re-create if sessions change (to re-wire the edit button if necessary)

    // --- FIELD CONFIGURATION for GlobalModal ---
    const treatmentFields: FieldConfig[] = [
        { key: 'patientName', label: 'Patient Name', type: 'text', required: true, colSpan: 'half' },
        { 
            key: 'treatmentType', 
            label: 'Treatment Type', 
            type: 'select', 
            required: true, 
            colSpan: 'half',
            options: [
                { value: 'Physiotherapy', label: 'Physiotherapy' },
                { value: 'Acupuncture', label: 'Acupuncture' },
                { value: 'Massage Therapy', label: 'Massage Therapy' },
                { value: 'Yoga Therapy', label: 'Yoga Therapy' },
            ] 
        },
        { key: 'days', label: 'Days of Treatment', type: 'number', required: true, colSpan: 'half' },
        { 
            key: 'instructions', 
            label: 'Special Instructions', 
            type: 'textarea', 
            required: true, 
            colSpan: 'full' 
        },
    ];

    // --- TOP CONTENT ---
    const renderTopContent = () => (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h4 className="text-xl font-bold dark:text-white">Treatment Session History</h4>
            <button type="button" className="btn btn-success flex items-center gap-1" onClick={handleOpenModal}>
                <IconPlus className="w-5 h-5" />
                Add Treatment
            </button>
        </div>
    );

    return (
        <div className="space-y-6">
            <Table<TreatmentSession>
                columns={columns as Column<TreatmentSession>[]}
                data={sessions}
                topContent={renderTopContent()}
                itemsPerPage={5}
            />
            
            {/* GLOBAL MODAL FOR CREATE/EDIT TREATMENT */}
            <GlobalModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                mode={selectedSession ? "edit" : "create"}
                title={selectedSession ? "Edit Treatment Session" : "Create New Treatment Session"}
                fields={treatmentFields as FieldConfig[]}
                initialData={getInitialTreatmentData(selectedSession)}
                onSave={handleSaveTreatment}
            />
        </div>
    );
};

export default TreatmentSessions;
