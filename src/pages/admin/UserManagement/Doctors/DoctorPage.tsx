import React, { useState, useMemo, useCallback } from 'react';
import Table, { Column } from '../../../../components/Table/Table';
import GlobalModal, { FieldConfig } from '../../../../components/Modal/GlobalModal';
import IconEye from '../../../../components/Icon/IconEye';
import IconEdit from '../../../../components/Icon/IconEdit';
import IconTrash from '../../../../components/Icon/IconTrash';
import IconDownload from '../../../../components/Icon/IconDownload';
import IconSearch from '../../../../components/Icon/IconSearch';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import DeleteModal from '../../../../components/DeleteModal';
import { useNavigate } from 'react-router-dom';

interface Doctor {
    id: number;
    name: string;
    email: string;
    specialization: string;
    status: 'Active' | 'Inactive' | 'On Leave' | 'Pending';
    licenseNumber?: string;
    dob?: string;
    gender?: string;
    department?: string;
    joiningDate?: string;
}

type StatusBadgeProps = { status: Doctor['status'] };
const StatusBadge = ({ status }: StatusBadgeProps) => {
    const colorClasses = {
        Active: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
        Inactive: 'bg-red-100 text-red-700  dark:bg-red-700 dark:text-red-100',
        Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-600 dark:text-amber-100',
        'On Leave': 'bg-blue-500 text-white dark:bg-blue-700 dark:text-blue-100',
    };
    return (
        <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full shadow-sm ${colorClasses[status] || 'bg-gray-400 text-gray-900 dark:bg-gray-700 dark:text-gray-100'}`}>
            {status}
        </span>
    );
};

const DoctorsPage = () => {
    const [doctorsData, setDoctorsData] = useState<Doctor[]>([
        { id: 1, name: 'Kavita Rao', email: 'k.rao@veda.com', specialization: 'Internal Medicine', status: 'Active', licenseNumber: 'MED-1001', dob: '1985-06-15', gender: 'Female', department: 'General Medicine', joiningDate: '2010-08-01' },
        { id: 2, name: 'Suresh Verma', email: 's.verma@veda.com', specialization: 'Wellness Therapy', status: 'Active', licenseNumber: 'MED-1002', dob: '1990-11-20', gender: 'Male', department: 'Therapy Unit', joiningDate: '2015-05-10' },
        { id: 3, name: 'Anjali Puri', email: 'anjali.p@veda.com', specialization: 'Gynecology', status: 'Inactive', licenseNumber: 'MED-1003', dob: '1978-03-05', gender: 'Female', department: 'Women’s Health', joiningDate: '2005-01-20' },
        { id: 4, name: 'Deepak Sharma', email: 'd.sharma@veda.com', specialization: 'Surgery', status: 'Active', licenseNumber: 'MED-1004', dob: '1995-09-25', gender: 'Male', department: 'Surgical Care', joiningDate: '2018-03-15' },
        { id: 5, name: 'Preeti Das', email: 'preeti.d@veda.com', specialization: 'Pediatrics', status: 'Pending', licenseNumber: 'MED-1005', dob: '1982-07-12', gender: 'Female', department: 'Child Health', joiningDate: '2012-07-01' },
    ]);

    const doctorFields: FieldConfig[] = [
        { name: "firstName", label: "First Name", type: "text", required: true },
        { name: "lastName", label: "Last Name", type: "text", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "phone", label: "Phone", type: "text" },
        { name: "dob", label: "Date of Birth", type: "date" },
        { name: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Other"] },
        { name: "specialization", label: "Specialization", type: "text", required: true },
        { name: "licenseNumber", label: "License Number", type: "text", required: true, disabledInEdit: true },
        {
            name: "department",
            label: "Department",
            type: "select",
            options: ["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "General Surgery"],
        },
        { name: "joiningDate", label: "Joining Date", type: "date" }
    ];


    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);

    const navigate = useNavigate();

    const handleView = (doctor: Doctor) => navigate(`/doctor/${doctor.id}`);

    const handleEdit = (doctor: Doctor) => {
        setSelectedDoctor(doctor);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setSelectedDoctor(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedDoctor(null);
    };

    const handleSaveDoctor = (data: any) => {
        if (selectedDoctor) {
            // Edit mode
            setDoctorsData(prev =>
                prev.map(doc => (doc.id === selectedDoctor.id ? { ...doc, ...data, name: `${data.firstName} ${data.lastName}` } : doc))
            );
        } else {
            // Create mode
            const newDoctor: Doctor = {
                id: doctorsData.length + 1,
                name: `${data.firstName} ${data.lastName}`,
                email: data.email,
                specialization: data.specialization,
                status: 'Active',
                licenseNumber: data.licenseNumber,
                dob: data.dob,
                gender: data.gender,
                department: data.department,
                joiningDate: data.joiningDate,
            };
            setDoctorsData(prev => [...prev, newDoctor]);
        }
    };

    const handleDeleteClick = (doctor: Doctor) => {
        setDoctorToDelete(doctor);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (doctorToDelete) {
            setDoctorsData(prev => prev.filter(d => d.id !== doctorToDelete.id));
        }
        setIsDeleteModalOpen(false);
        setDoctorToDelete(null);
    };

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
        setDoctorToDelete(null);
    };

    const filteredData = useMemo(() => doctorsData
        .filter(d => d.name.toLowerCase().includes(search.toLowerCase()))
        .filter(d => statusFilter ? d.status === statusFilter : true),
        [doctorsData, search, statusFilter]
    );

    const columns: Column<Doctor>[] = useMemo(() => [
        { Header: 'Doctor Name', accessor: 'name', Cell: ({ value }) => <div className="font-semibold text-gray-900 dark:text-white">{value}</div> },
        { Header: 'Email', accessor: 'email', Cell: ({ value }) => <div className="text-gray-600 dark:text-gray-400">{value}</div> },
        { Header: 'Specialization', accessor: 'specialization' },
        { Header: 'Status', accessor: 'status', Cell: ({ value }) => <StatusBadge status={value} /> },
    ], []);

    const handleExportData = useCallback(() => {
        const dataToExport = filteredData.map(item => ({
            'Doctor Name': item.name,
            'Email': item.email,
            'Specialization': item.specialization,
            'Status': item.status,
        }));
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = { Sheets: { 'Doctors_Data': ws }, SheetNames: ['Doctors_Data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        FileSaver.saveAs(blob, 'doctors_data_export.xlsx');
    }, [filteredData]);

    const renderActions = (doctor: Doctor) => (
        <div className="flex items-center space-x-3">
            <button title="View" onClick={() => handleView(doctor)}><IconEye className="w-5 h-5 text-blue-500 hover:text-blue-700" /></button>
            <button title="Edit" onClick={() => handleEdit(doctor)}><IconEdit className="w-5 h-5 text-amber-500 hover:text-amber-700" /></button>
            <button title="Delete" onClick={() => handleDeleteClick(doctor)}><IconTrash className="w-5 h-5 text-red-500 hover:text-red-700" /></button>
        </div>
    );

    const renderTopContent = () => (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 w-full">
            <div className="relative w-full sm:w-60">
                <input
                    type="text"
                    placeholder="Search Doctors..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full border-2 border-green-200 dark:border-gray-600 rounded-lg py-2 pl-10 dark:bg-gray-700 dark:text-gray-100 focus:border-green-500 focus:ring-green-500 transition"
                />
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
            </div>
            <div className="flex items-center space-x-3 w-full sm:w-auto justify-end ">
                <button
                    onClick={handleExportData}
                    className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                >
                    <IconDownload className="w-5 h-5 mr-1" /> Export Data
                </button>
            </div>
        </div>
    );

    return (
        <>
            <Table columns={columns} data={filteredData} actions={renderActions} topContent={renderTopContent()} />
            <GlobalModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                mode={selectedDoctor ? "edit" : "create"}
                title="Doctor"
                fields={doctorFields}
                initialData={
                    selectedDoctor
                        ? {
                            firstName: selectedDoctor.name.split(" ")[0] || "",
                            lastName: selectedDoctor.name.split(" ")[1] || "",
                            email: selectedDoctor.email,
                            specialization: selectedDoctor.specialization,
                            licenseNumber: selectedDoctor.licenseNumber,
                            dob: selectedDoctor.dob,
                            gender: selectedDoctor.gender,
                            department: selectedDoctor.department,
                            joiningDate: selectedDoctor.joiningDate,
                        }
                        : undefined
                }
                onSave={handleSaveDoctor}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onCancel={handleCancelDelete}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
};

export default DoctorsPage;
