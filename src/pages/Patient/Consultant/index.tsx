import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { Dialog, Transition } from '@headlessui/react';
import Table, { Column } from '../../../components/Table/Table';

// --- ICONS ---
const IconCalendar = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 2v4" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 2v4" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/><path d="M3.5 9.09h17" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 8.5V17c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V8.5c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/><path opacity="0.4" d="M11.995 13.7h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path opacity="0.4" d="M8.294 13.7h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path opacity="0.4" d="M8.294 16.7h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const IconNotes = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 2v4" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 2v4" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 8.5V17c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V8.5c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 11h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const IconSearch = (props:React.SVGProps<SVGSVGElement>) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11.5" cy="11.5" r="9.5" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/><path d="M18.5 18.5L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
);
const IconX = (props:React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

// --- DATA TYPES & MOCK DATA ---
interface Consultation { id: string; patientName: string; doctorName: string; consultationDate: string; chiefComplaint: string; followUpDate: string | null; }
const mockConsultations = [
    {
        id: 'CON-001',
        patientName: 'Self',
        doctorName: 'Dr. Priya Singh',
        consultationDate: '2024-05-20',
        chiefComplaint: 'Persistent cough and cold for over a week. Recommended antibiotics and rest.',
        followUpDate: '2024-06-05',
    },
    {
        id: 'CON-002',
        patientName: 'Rohan Sharma', // Family Member
        doctorName: 'Dr. Anjali Verma',
        consultationDate: '2024-04-15',
        chiefComplaint: 'General check-up and consultation for mild digestive issues (bloating). Prescribed a diet chart and probiotics.',
        followUpDate: null,
    },
    {
        id: 'CON-003',
        patientName: 'Self',
        doctorName: 'Dr. Priya Singh',
        consultationDate: '2024-03-10',
        chiefComplaint: 'Follow-up on previous treatment for chronic knee joint pain. Adjusted medication dosage.',
        followUpDate: '2024-04-10',
    },
    {
        id: 'CON-004',
        patientName: 'Priya Sharma', // Family Member
        doctorName: 'Dr. Rohan Sharma',
        consultationDate: '2024-06-18',
        chiefComplaint: 'Severe headache and nausea. Referred to a specialist for further neurological evaluation.',
        followUpDate: '2024-07-01',
    },
    {
        id: 'CON-005',
        patientName: 'Self',
        doctorName: 'Dr. Anjali Verma',
        consultationDate: '2024-02-01',
        chiefComplaint: 'Annual physical examination. All vitals within normal range.',
        followUpDate: null,
    },
];

// Helper to format date strings
const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};
const formatLongDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};

// --- MODAL COMPONENT ---

const ConsultationDetailModal = ({ consultation, onClose }: { consultation: Consultation | null, onClose: () => void }) => {
    if (!consultation) return null;

    return (
        <Transition appear show={!!consultation} as={React.Fragment}>
            <Dialog as="div" open={!!consultation} onClose={onClose} className="relative z-50">
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
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-xl font-bold leading-6 text-gray-900 dark:text-white flex items-center gap-2 border-b dark:border-gray-700 pb-4 mb-5">
                                    <IconNotes className="w-6 h-6 text-primary" />
                                    Consultation Details
                                </Dialog.Title>
                                <div className="space-y-5">
                    
                    {/* ID and Doctor */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <DetailItem label="Consultation ID" value={consultation.id} className="text-blue-500 font-mono" />
                        <DetailItem label="Doctor" value={consultation.doctorName} />
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <DetailItem 
                            label="Consultation Date" 
                            value={formatLongDate(consultation.consultationDate)} 
                            icon={<IconCalendar className="w-5 h-5 text-gray-500" />}
                        />
                         {consultation.followUpDate ? (
                             <DetailItem 
                                label="Next Follow-up" 
                                value={formatLongDate(consultation.followUpDate)} 
                                icon={<IconCalendar className="w-5 h-5 text-yellow-600" />}
                                highlight={true}
                            />
                        ) : (
                            <DetailItem label="Next Follow-up" value="No follow-up scheduled" className="italic text-gray-500" />
                        )}
                    </div>

                    {/* Chief Complaint / Notes */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-2">Chief Complaint & Notes</h3>
                        <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                            {consultation.chiefComplaint}
                        </p>
                    </div>

                    {/* Mock Prescription/Next Steps */}
                    <div className="text-sm text-gray-500 dark:text-gray-400 pt-2 border-t dark:border-gray-700">
                        *This is a detailed record summary. For official prescription details, please contact your clinic.
                    </div>
                </div>
                                <div className="mt-6 flex justify-end">
                                    <button type="button" className="btn btn-outline-danger" onClick={onClose}>
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
};

const DetailItem = ({ label, value, icon, highlight = false, className = '' }: { label: string, value: string | React.ReactNode, icon?: React.ReactNode, highlight?: boolean, className?: string }) => (
    <div className={`p-3 rounded-lg ${highlight ? 'bg-yellow-100 dark:bg-yellow-900/40' : 'bg-gray-50 dark:bg-gray-700'}`}>
        <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1">{label}</p>
        <div className="flex items-center gap-2 text-gray-800 dark:text-white font-medium">
            {icon}
            <span className={className}>{value}</span>
        </div>
    </div>
);

// --- MAIN APPLICATION COMPONENT ---
const PatientConsultations = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('My Consultations'));
    }, [dispatch]);

    const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = useMemo(() => {
        if (!searchTerm) return mockConsultations;
        const lowerCaseSearch = searchTerm.toLowerCase();
        return mockConsultations.filter(item =>
            Object.values(item).some(value =>
                String(value).toLowerCase().includes(lowerCaseSearch)
            )
        );
    }, [searchTerm]);

    // 1. Define Table Columns
    const columns: Column<Consultation>[] = [
        {
            Header: 'Patient Name',
            accessor: 'patientName',
            Cell: ({ value }) => <span className="font-semibold">{value}</span>,
        },
        { 
            Header: 'ID', 
            accessor: 'id',
            Cell: ({ value }) => <span className="font-mono text-xs">{value}</span>,
        },
        { 
            Header: 'Doctor', 
            accessor: 'doctorName',
            Cell: ({ value }) => <span className="font-semibold">{value}</span>,
        },
        { 
            Header: 'Date', 
            accessor: 'consultationDate',
            Cell: ({ value }) => formatDate(value),
        },
        { 
            Header: 'Chief Complaint',
            accessor: 'chiefComplaint',
            Cell: ({ value }) => <p className="w-full max-w-xs truncate">{value}</p>,
        },
        {
            Header: 'Follow-up', 
            accessor: 'followUpDate',
            Cell: ({ value }) => (
                value ? (
                    <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                        <IconCalendar className="w-4 h-4" />
                        {formatDate(value)}
                    </span>
                ) : (
                    <span className="text-gray-500 dark:text-gray-400">None Scheduled</span>
                )
            ),
        },
    ];

    // 2. Define Row Actions (the View button)
    const renderActions = (consultation: Consultation) => (
        <button
            type="button"
            className="btn btn-sm btn-outline-primary whitespace-nowrap"
            onClick={() => setSelectedConsultation(consultation)}
        >
            View Details
        </button>
    );

    // 3. Define Top Content (Search Bar)
    const renderTopContent = () => (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-xl font-bold flex items-center gap-2">
                My Consultations
            </h1>
            <div className="relative w-full sm:w-64">
                <input
                    type="text"
                    placeholder="Search consultations..."
                    className="form-input ltr:pl-10 rtl:pr-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <IconSearch className="absolute w-4 h-4 text-gray-400 top-1/2 -translate-y-1/2 ltr:left-3 rtl:right-3" />
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <Table
                columns={columns}
                data={mockConsultations}
                actions={renderActions}
                topContent={renderTopContent}
            />

            {/* Modal for viewing details */}
            <ConsultationDetailModal
                consultation={selectedConsultation}
                onClose={() => setSelectedConsultation(null)}
            />
        </div>
    );
};

export default PatientConsultations;
