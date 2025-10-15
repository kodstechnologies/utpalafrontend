// pages/admin/UserManagement/Patients/PatientsPage.tsx

import React, { useState, useMemo, useCallback } from 'react';
import Table, { Column } from '../../../../components/Table/Table';
import IconEye from '../../../../components/Icon/IconEye';
import IconEdit from '../../../../components/Icon/IconEdit';
import IconTrash from '../../../../components/Icon/IconTrash';
import IconDownload from '../../../../components/Icon/IconDownload';
import IconSearch from '../../../../components/Icon/IconSearch';
import IconPlus from '../../../../components/Icon/IconPlus';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import PatientsModal, { ModalMode } from './PatientModal';

interface Patient {
    id: number;
    name: string;
    patientId: string;
    dob: string;
    gender: 'Male' | 'Female' | 'Other';
    bodyType: 'Vata' | 'Pitta' | 'Kapha' | 'Tridosha';
    status: 'Active' | 'Discharged' | 'Pending Admission' | 'Follow-up';
    phone: string;
    mail: any,
    primaryDoctor?: string;
    admissionDate?: string;
}

type StatusBadgeProps = { status: Patient['status'] };
const StatusBadge = ({ status }: StatusBadgeProps) => {
    let colorClass = '';
    switch (status) {
        case 'Active':
            colorClass = 'bg-green-600 text-white dark:bg-green-800 dark:text-green-100';
            break;
        case 'Discharged':
            colorClass = 'bg-gray-400 text-gray-900 dark:bg-gray-700 dark:text-gray-100';
            break;
        case 'Pending Admission':
            colorClass = 'bg-amber-400 text-amber-900 dark:bg-amber-600 dark:text-amber-100';
            break;
        case 'Follow-up':
            colorClass = 'bg-blue-500 text-white dark:bg-blue-700 dark:text-blue-100';
            break;
        default:
            colorClass = 'bg-gray-400 text-gray-900 dark:bg-gray-700 dark:text-gray-100';
    }
    return (
        <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full shadow-sm ${colorClass}`}>
            {status}
        </span>
    );
};

const PatientsPage = () => {
    const [patientsData, setPatientsData] = useState<Patient[]>([
        { id: 1, patientId: 'P-00101', name: 'Alia Bhatt', phone: '98765 43210', mail: 'alia.b@example.com', dob: '1995-03-14', gender: 'Female', bodyType: 'Vata', status: 'Active', primaryDoctor: 'Dr. K. Rao', admissionDate: '2024-05-10' },
        { id: 2, patientId: 'P-00102', name: 'Rajesh Khanna', phone: '87654 32109', mail: 'rajesh.k@example.com', dob: '1968-11-20', gender: 'Male', bodyType: 'Pitta', status: 'Pending Admission', primaryDoctor: 'Dr. S. Verma', admissionDate: '2024-06-01' },
        { id: 3, patientId: 'P-00103', name: 'Sarla Devi', phone: '76543 21098', mail: 'sarla.d@example.com', dob: '1982-01-25', gender: 'Female', bodyType: 'Kapha', status: 'Follow-up', primaryDoctor: 'Dr. Anjali Puri', admissionDate: '2024-04-15' },
        { id: 4, patientId: 'P-00104', name: 'Amit Singh', phone: '65432 10987', mail: 'amit.s@example.com', dob: '1975-09-01', gender: 'Male', bodyType: 'Tridosha', status: 'Discharged', primaryDoctor: 'Dr. Deepak Sharma', admissionDate: '2024-03-20' },
        { id: 5, patientId: 'P-00105', name: 'Priya Mani', phone: '54321 09876', mail: 'priya.m@example.com', dob: '2000-07-12', gender: 'Female', bodyType: 'Vata', status: 'Active', primaryDoctor: 'Dr. Preeti Das', admissionDate: '2024-05-25' },
        { id: 6, patientId: 'P-00106', name: 'Ganesh Iyer', phone: '43210 98765', mail: 'ganesh.i@example.com', dob: '1955-02-05', gender: 'Male', bodyType: 'Pitta', status: 'Discharged', primaryDoctor: 'Dr. K. Rao', admissionDate: '2024-01-01' },
    ]);

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<ModalMode>('add');
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const navigate = useNavigate();

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedPatient(null);
    }, []);

    const handleAddPatient = () => {
        setModalMode('add');
        setSelectedPatient(null);
        setIsModalOpen(true);
    };

    const handleEdit = useCallback((patient: Patient) => {
        setModalMode('edit');
        setSelectedPatient(patient);
        setIsModalOpen(true);
    }, []);

    const handleView = (patient: Patient) => navigate(`/Patient/${patient.id}`);

    const handleDelete = useCallback((patient: Patient) => {
        if (window.confirm(`Are you sure you want to archive patient ${patient.name}?`)) {
            setPatientsData(prev => prev.filter(p => p.id !== patient.id));
            console.log(`Archived Patient with ID: ${patient.id}`);
        }
    }, []);

    const handleSavePatient = (data: any) => {
        if (modalMode === 'add') {
            const newPatient: Patient = {
                ...data,
                id: patientsData.length + 1,
            };
            setPatientsData(prev => [...prev, newPatient]);
            console.log('Added patient:', newPatient);
        } else {
            setPatientsData(prev =>
                prev.map(p => p.id === selectedPatient?.id ? { ...p, ...data } : p)
            );
            console.log('Edited patient:', data);
        }
    };

    const filteredData = useMemo(() => patientsData
        .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.patientId.toLowerCase().includes(search.toLowerCase()))
        .filter(p => statusFilter ? p.status === statusFilter : true),
        [patientsData, search, statusFilter]
    );

    const columns: Column<Patient>[] = useMemo(() => [
        { Header: 'Patient ID', accessor: 'patientId', Cell: ({ value }) => <div className="text-sm font-semibold text-green-700 dark:text-green-400">{value}</div> },
        { Header: 'Patient Name', accessor: 'name', Cell: ({ value }) => <div className="font-semibold text-gray-900 dark:text-white">{value}</div> },
        { Header: 'Contact', accessor: 'phone', Cell: ({ value }) => <div className="text-gray-600 dark:text-gray-400 font-medium">{value}</div> },
        { Header: 'Email', accessor: 'mail', Cell: ({ value }) => <div className="text-gray-600 dark:text-gray-400 font-medium">{value}</div> },
        {
            Header: 'Body Type',
            accessor: 'bodyType',
            Cell: ({ value }) => (
                <div className={`text-sm font-medium ${value === 'Pitta' ? 'text-amber-600' : value === 'Vata' ? 'text-blue-600' : 'text-green-600'} dark:text-gray-300`}>
                    {value}
                </div>
            )
        },
        { Header: 'Primary Doctor', accessor: 'primaryDoctor', Cell: ({ value }) => <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">{value || 'Unassigned'}</div> },
        { Header: 'Admission Status', accessor: 'status', Cell: ({ value }) => <StatusBadge status={value} /> },
    ], []);

    const handleExportData = useCallback(() => {
        const fileExtension = '.xlsx';
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const dataToExport = filteredData.map(item => ({
            'ID': item.id,
            'Patient ID': item.patientId,
            'Patient Name': item.name,
            'Phone': item.phone,
            'DOB': item.dob,
            'Gender': item.gender,
            'Body Type (Dosha)': item.bodyType,
            'Primary Doctor': item.primaryDoctor || 'Unassigned',
            'Admission Date': item.admissionDate || 'N/A',
            'Status': item.status,
        }));
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        ws['!cols'] = [
            { wch: 8 }, { wch: 15 }, { wch: 25 }, { wch: 15 }, { wch: 12 },
            { wch: 10 }, { wch: 20 }, { wch: 20 }, { wch: 18 }, { wch: 20 },
        ];
        const wb = { Sheets: { 'Patients_Data': ws }, SheetNames: ['Patients_Data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(blob, 'patients_data_export' + fileExtension);
    }, [filteredData]);

    const renderActions = (patient: Patient) => (
        <div className="flex items-center justify-center space-x-4">
            <button
                className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition"
                title="View Patient File"
                onClick={() => handleView(patient)}
            >
                <IconEye className="w-5 h-5" />
            </button>
            <button
                className="text-amber-500 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition"
                title="Edit Admission"
                onClick={() => handleEdit(patient)}
            >
                <IconEdit className="w-5 h-5" />
            </button>
            <button
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition"
                title="Archive Patient"
                onClick={() => handleDelete(patient)}
            >
                <IconTrash className="w-5 h-5" />
            </button>
        </div>
    );

    const renderTopContent = () => (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 w-full">
            <div className="relative w-full sm:w-60">
                <input
                    type="text"
                    placeholder="Search Patients..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="form-input ltr:pl-10 rtl:pr-10 border-2 border-green-200 dark:border-gray-600 rounded-lg py-2 w-full sm:w-60 focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100 transition duration-150 ease-in-out"
                />
                <IconSearch className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-green-400 w-5 h-5" />
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                <button
                    type="button"
                    onClick={handleExportData}
                    className="flex items-center bg-green-500 text-white border border-green-600 rounded-lg py-2 px-4 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-600 transition duration-150 shadow-md"
                >
                    <IconDownload className="w-5 h-5 mr-1.5" />
                    Export Data
                </button>
            </div>
        </div>
    );

    return (
        <>
            <Table
                columns={columns}
                data={filteredData}
                actions={renderActions}
                topContent={renderTopContent()}
            />

            {/* Patients Modal */}
            <PatientsModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                mode={modalMode}
                patientData={selectedPatient || undefined}
                onSave={handleSavePatient}
            />
        </>
    );
};

export default PatientsPage;
