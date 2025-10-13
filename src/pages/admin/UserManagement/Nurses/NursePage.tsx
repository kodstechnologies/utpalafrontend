import React, { useState, useMemo, useCallback } from 'react';
import Table, { Column } from '../../../../components/Table/Table';
import IconEye from '../../../../components/Icon/IconEye';
import IconEdit from '../../../../components/Icon/IconEdit';
import IconTrash from '../../../../components/Icon/IconTrash';
import IconDownload from '../../../../components/Icon/IconDownload';
import IconSearch from '../../../../components/Icon/IconSearch';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import NurseModal from './NurseModal';

interface Nurse {
    id: number;
    name: string;
    email: string;
    specialization: string;
    status: 'Active' | 'Inactive' | 'On Leave' | 'Pending';
    firstName: string;
    lastName: string;
    phone: string;
    dob: string;
    gender: 'Male' | 'Female' | 'Other';
    licenseNumber: string;
    department: 'Ayurveda' | 'Panchakarma' | 'General' | 'Other';
    joiningDate: string;
}

type StatusBadgeProps = { status: Nurse['status'] };
const StatusBadge = ({ status }: StatusBadgeProps) => {
    const colorClasses = {
        Active: 'bg-green-600 text-white dark:bg-green-800 dark:text-green-100',
        Inactive: 'bg-red-400 text-white dark:bg-red-700 dark:text-red-100',
        Pending: 'bg-amber-400 text-amber-900 dark:bg-amber-600 dark:text-amber-100',
        'On Leave': 'bg-blue-500 text-white dark:bg-blue-700 dark:text-blue-100',
    };
    const colorClass = colorClasses[status] || 'bg-gray-400 text-gray-900 dark:bg-gray-700 dark:text-gray-100';
    return <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full shadow-sm ${colorClass}`}>{status}</span>;
};

const NursesPage = () => {
    const [nursesData, setNursesData] = useState<Nurse[]>([
        { id: 1, name: 'Sister Leena Nair', email: 'leena.nair@veda.com', specialization: 'Abhyanga & Shirodhara', status: 'Active', firstName: 'Leena', lastName: 'Nair', phone: '555-1001', dob: '1985-05-10', gender: 'Female', licenseNumber: 'NUR-1001', department: 'Panchakarma', joiningDate: '2020-01-01' },
        { id: 2, name: 'Nurse Rohan Patel', email: 'rohan.p@veda.com', specialization: 'Vasti & Swedana', status: 'Active', firstName: 'Rohan', lastName: 'Patel', phone: '555-1002', dob: '1990-12-01', gender: 'Male', licenseNumber: 'NUR-1002', department: 'Ayurveda', joiningDate: '2019-06-15' },
        { id: 3, name: 'Sister Anjali Rao', email: 'anjali.r@veda.com', specialization: 'Yoga & Pranayama', status: 'Inactive', firstName: 'Anjali', lastName: 'Rao', phone: '555-1003', dob: '1978-03-20', gender: 'Female', licenseNumber: 'NUR-1003', department: 'General', joiningDate: '2015-02-01' },
        { id: 4, name: 'Sister Anjali Rao', email: 'anjali.r@veda.com', specialization: 'Yoga & Pranayama', status: 'Inactive', firstName: 'Anjali', lastName: 'Rao', phone: '555-1003', dob: '1978-03-20', gender: 'Female', licenseNumber: 'NUR-1003', department: 'General', joiningDate: '2015-02-01' },
        { id: 5, name: 'Sister Anjali Rao', email: 'anjali.r@veda.com', specialization: 'Yoga & Pranayama', status: 'Inactive', firstName: 'Anjali', lastName: 'Rao', phone: '555-1003', dob: '1978-03-20', gender: 'Female', licenseNumber: 'NUR-1003', department: 'General', joiningDate: '2015-02-01' },
    ]);

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNurse, setSelectedNurse] = useState<Nurse | null>(null);
    const navigate = useNavigate();

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedNurse(null);
    }, []);

    const handleEdit = useCallback((nurse: Nurse) => {
        setSelectedNurse(nurse);
        setIsModalOpen(true);
    }, []);

    const handleAdd = () => {
        setSelectedNurse(null);
        setIsModalOpen(true);
    };

    const handleView = (nurse: Nurse) => navigate(`/nurse/${nurse.id}`);

    const handleDelete = useCallback((nurse: Nurse) => {
        if (window.confirm(`Are you sure you want to dismiss ${nurse.name}?`)) {
            setNursesData(prev => prev.filter(n => n.id !== nurse.id));
        }
    }, []);

    const handleSave = (data: any) => {
        if (selectedNurse) {
            // Edit
            setNursesData(prev => prev.map(n => n.id === selectedNurse.id ? { ...n, ...data } : n));
        } else {
            // Add new
            const newId = Math.max(...nursesData.map(n => n.id)) + 1;
            setNursesData(prev => [...prev, { id: newId, ...data }]);
        }
    };

    const filteredData = useMemo(() => nursesData
        .filter(n => n.name.toLowerCase().includes(search.toLowerCase()) || n.email.toLowerCase().includes(search.toLowerCase()))
        .filter(n => statusFilter ? n.status === statusFilter : true),
        [nursesData, search, statusFilter]
    );

    const columns: Column<Nurse>[] = useMemo(() => [
        { Header: 'Nurse Name', accessor: 'name', Cell: ({ value }) => <div className="font-semibold text-gray-900 dark:text-white">{value}</div> },
        { Header: 'Email', accessor: 'email', Cell: ({ value }) => <div className="text-gray-600 dark:text-gray-400">{value}</div> },
        { Header: 'Specialization', accessor: 'specialization' },
        { Header: 'Current Status', accessor: 'status', Cell: ({ value }) => <StatusBadge status={value} /> },
    ], []);

    const handleExportData = useCallback(() => {
        const fileExtension = '.xlsx';
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

        const dataToExport = filteredData.map(item => ({
            'ID': item.id,
            'Name': item.name,
            'Email': item.email,
            'Phone': item.phone,
            'DOB': item.dob,
            'Gender': item.gender,
            'Specialization': item.specialization,
            'License Number': item.licenseNumber,
            'Department': item.department,
            'Joining Date': item.joiningDate,
            'Status': item.status,
        }));

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = { Sheets: { 'Nurses_Data': ws }, SheetNames: ['Nurses_Data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(blob, 'nurses_data_export' + fileExtension);
    }, [filteredData]);

    const renderActions = (nurse: Nurse) => (
        <div className="flex items-center justify-center space-x-4">
            <button className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition" title="View Profile" onClick={() => handleView(nurse)}>
                <IconEye className="w-5 h-5" />
            </button>
            <button className="text-amber-500 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition" title="Edit Details" onClick={() => handleEdit(nurse)}>
                <IconEdit className="w-5 h-5" />
            </button>
            <button className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition" title="Dismiss Nurse" onClick={() => handleDelete(nurse)}>
                <IconTrash className="w-5 h-5" />
            </button>
        </div>
    );

    const renderTopContent = () => (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 w-full">
            <div className="relative w-full sm:w-60">
                <input
                    type="text"
                    placeholder="Search Nurses..."
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

            {isModalOpen && (
                <NurseModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    nurseData={selectedNurse}
                    mode={selectedNurse ? 'edit' : 'create'}
                    onSave={handleSave}
                />
            )}
        </>
    );
};

export default NursesPage;
