import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import Table, { Column } from '../../../components/Table/Table';
import { Dialog, Transition } from '@headlessui/react';

interface DischargePatient {
    id: string;
    patientName: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    ward: string;
    bed: string;
    admissionDate: string;
    doctorName: string;
}

const mockDischargeList: DischargePatient[] = [
    { id: 'PAT-105', patientName: 'Geeta Kapoor', age: 55, gender: 'Female', ward: 'Private Room', bed: '102-B', admissionDate: '2024-05-20', doctorName: 'Dr. Priya Singh' },
    { id: 'PAT-108', patientName: 'Vijay Rathod', age: 48, gender: 'Male', ward: 'General Ward', bed: 'GW-05', admissionDate: '2024-05-22', doctorName: 'Dr. Anjali Verma' },
];

const NurseDischarge: React.FC = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Discharge Preparation'));
    }, [dispatch]);

    const [isDischargeModalOpen, setIsDischargeModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<DischargePatient | null>(null);

    const handleDischargeClick = (patient: DischargePatient) => {
        setSelectedPatient(patient);
        setIsDischargeModalOpen(true);
    };

    const columns: Column<DischargePatient>[] = useMemo(() => [
        { Header: 'Patient ID', accessor: 'id' },
        { Header: 'Patient Name', accessor: 'patientName', Cell: ({ value }) => <div className="font-semibold">{value}</div> },
        { Header: 'Ward/Bed', accessor: 'ward', Cell: ({ row }) => <span>{row.ward} / {row.bed}</span> },
        { Header: 'Admission Date', accessor: 'admissionDate' },
        { Header: 'Consulting Doctor', accessor: 'doctorName' },
    ], []);

    const renderActions = (patient: DischargePatient) => (
        <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={() => handleDischargeClick(patient)}
        >
            Prepare Discharge
        </button>
    );

    return (
        <div className="panel">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-xl font-bold">Patients Ready for Discharge</h1>
            </div>
            <Table<DischargePatient>
                columns={columns}
                data={mockDischargeList}
                actions={renderActions}
                itemsPerPage={10}
            />

            {/* Discharge Checklist Modal */}
            <Transition appear show={isDischargeModalOpen} as={React.Fragment}>
                <Dialog as="div" open={isDischargeModalOpen} onClose={() => setIsDischargeModalOpen(false)} className="relative z-50">
                    <Transition.Child as={React.Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-[black]/60" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child as={React.Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                                        Discharge Checklist for: {selectedPatient?.patientName}
                                    </Dialog.Title>
                                    <div className="mt-4 space-y-4">
                                        <form onSubmit={(e) => e.preventDefault()}>
                                            <div className="space-y-3">
                                                <label className="flex items-center space-x-3">
                                                    <input type="checkbox" className="form-checkbox" />
                                                    <span>Final Vitals Check Completed</span>
                                                </label>
                                                <label className="flex items-center space-x-3">
                                                    <input type="checkbox" className="form-checkbox" />
                                                    <span>Medication Summary Prepared</span>
                                                </label>
                                                <label className="flex items-center space-x-3">
                                                    <input type="checkbox" className="form-checkbox" />
                                                    <span>Discharge Summary Signed by Doctor</span>
                                                </label>
                                                <label className="flex items-center space-x-3">
                                                    <input type="checkbox" className="form-checkbox" />
                                                    <span>Invoice & Billing Cleared</span>
                                                </label>
                                                <label className="flex items-center space-x-3">
                                                    <input type="checkbox" className="form-checkbox" />
                                                    <span>Patient/Family Counseling Done</span>
                                                </label>
                                            </div>
                                            <div className="mt-6 flex justify-end gap-4">
                                                <button type="button" className="btn btn-outline-danger" onClick={() => setIsDischargeModalOpen(false)}>
                                                    Cancel
                                                </button>
                                                <button type="submit" className="btn btn-primary" onClick={() => setIsDischargeModalOpen(false)}>
                                                    Confirm Discharge
                                                </button>
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

export default NurseDischarge;