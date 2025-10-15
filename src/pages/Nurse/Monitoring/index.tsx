import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import Table, { Column } from '../../../components/Table/Table';
import { Link } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import IconHeart from '../../../components/Icon/IconHeart';

interface AdmittedPatient {
    id: string;
    patientName: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    ward: string;
    bed: string;
    admissionDate: string;
    doctorName: string;
}

const mockAdmittedList: AdmittedPatient[] = [
    { id: 'PAT-101', patientName: 'Rakesh Sharma', age: 58, gender: 'Male', ward: 'Private Room', bed: '101-A', admissionDate: '2024-05-25', doctorName: 'Dr. Priya Singh' },
    { id: 'PAT-102', patientName: 'Meena Kumari', age: 65, gender: 'Female', ward: 'General Ward', bed: 'GW-12', admissionDate: '2024-05-24', doctorName: 'Dr. Anjali Verma' },
    { id: 'PAT-103', patientName: 'Suresh Verma', age: 42, gender: 'Male', ward: 'Semi-Private', bed: '204-B', admissionDate: '2024-05-26', doctorName: 'Dr. Priya Singh' },
];

const NurseMonitoring: React.FC = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Patient Monitoring'));
    }, [dispatch]);

    const [isVitalsModalOpen, setIsVitalsModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<AdmittedPatient | null>(null);

    const handleUpdateVitalsClick = (patient: AdmittedPatient) => {
        setSelectedPatient(patient);
        setIsVitalsModalOpen(true);
    };

    const columns: Column<AdmittedPatient>[] = useMemo(() => [
        { Header: 'Patient ID', accessor: 'id' },
        { Header: 'Patient Name', accessor: 'patientName', Cell: ({ value }) => <div className="font-semibold">{value}</div> },
        { Header: 'Ward/Bed', accessor: 'ward', Cell: ({ row }) => <span>{row.ward} / {row.bed}</span> },
        { Header: 'Admission Date', accessor: 'admissionDate' },
        { Header: 'Consulting Doctor', accessor: 'doctorName' },
    ], []);

    const renderActions = (patient: AdmittedPatient) => (
        <div className="flex items-center gap-2">
            <Link to={`/patient-history/${patient.id}`} className="btn btn-outline-info btn-sm">
                View History
            </Link>
            <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => handleUpdateVitalsClick(patient)}
            >
                Update Vitals
            </button>
        </div>
    );

    return (
        <div className="panel">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-xl font-bold">Admitted Patients</h1>
            </div>
            <Table<AdmittedPatient>
                columns={columns}
                data={mockAdmittedList}
                actions={renderActions}
                itemsPerPage={10}
            />

            {/* Update Vitals Modal */}
            <Transition appear show={isVitalsModalOpen} as={React.Fragment}>
                <Dialog as="div" open={isVitalsModalOpen} onClose={() => setIsVitalsModalOpen(false)} className="relative z-50">
                    <Transition.Child as={React.Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-[black]/60" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child as={React.Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-white flex items-center gap-2">
                                        <IconHeart /> Update Vitals for: {selectedPatient?.patientName}
                                    </Dialog.Title>
                                    <div className="mt-4 space-y-4">
                                        <form onSubmit={(e) => e.preventDefault()}>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="temp" className="block text-sm font-medium">Temperature (°F)</label>
                                                    <input type="text" name="temp" id="temp" className="form-input mt-1" />
                                                </div>
                                                <div>
                                                    <label htmlFor="bp" className="block text-sm font-medium">Blood Pressure (mmHg)</label>
                                                    <input type="text" name="bp" id="bp" className="form-input mt-1" placeholder="e.g., 120/80" />
                                                </div>
                                                <div>
                                                    <label htmlFor="hr" className="block text-sm font-medium">Heart Rate (bpm)</label>
                                                    <input type="number" name="hr" id="hr" className="form-input mt-1" />
                                                </div>
                                                <div>
                                                    <label htmlFor="rr" className="block text-sm font-medium">Respiratory Rate</label>
                                                    <input type="number" name="rr" id="rr" className="form-input mt-1" />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <label htmlFor="notes" className="block text-sm font-medium">Notes</label>
                                                    <textarea name="notes" id="notes" rows={3} className="form-textarea mt-1"></textarea>
                                                </div>
                                            </div>
                                            <div className="mt-6 flex justify-end gap-4">
                                                <button type="button" className="btn btn-outline-danger" onClick={() => setIsVitalsModalOpen(false)}>Cancel</button>
                                                <button type="submit" className="btn btn-primary" onClick={() => setIsVitalsModalOpen(false)}>Save Vitals</button>
                                            </div>
                                        </form>
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

export default NurseMonitoring;
