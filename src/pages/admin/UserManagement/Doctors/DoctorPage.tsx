import React, { useState, useMemo } from 'react';
import Table, { Column } from '../../../../components/Table/Table'; 
import DoctorModal from './DoctorModal';
import IconEye from '../../../../components/Icon/IconEye';
import IconEdit from '../../../../components/Icon/IconEdit';
import IconTrash from '../../../../components/Icon/IconTrash';
import IconDownload from '../../../../components/Icon/IconDownload';
import IconSearch from '../../../../components/Icon/IconSearch';

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
        Active: 'bg-green-600 text-white dark:bg-green-800 dark:text-green-100',
        Inactive: 'bg-red-400 text-white dark:bg-red-700 dark:text-red-100',
        Pending: 'bg-amber-400 text-amber-900 dark:bg-amber-600 dark:text-amber-100',
        'On Leave': 'bg-blue-500 text-white dark:bg-blue-700 dark:text-blue-100',
    };
    const colorClass = colorClasses[status] || 'bg-gray-400 text-gray-900 dark:bg-gray-700 dark:text-gray-100';
    return <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full shadow-sm ${colorClass}`}>{status}</span>;
};

const DoctorsPage = () => {
    const [doctorsData] = useState<Doctor[]>([
        { id: 1, name: 'Dr. Kavita Rao', email: 'k.rao@veda.com', specialization: 'Internal Medicine', status: 'Active', licenseNumber: 'MED-1001', dob: '1985-06-15', gender: 'Female', department: 'General Medicine', joiningDate: '2010-08-01' },
         { id: 8, name: 'Dr. Kavita Rao', email: 'k.rao@veda.com', specialization: 'Internal Medicine', status: 'Active', licenseNumber: 'MED-1001', dob: '1985-06-15', gender: 'Female', department: 'General Medicine', joiningDate: '2010-08-01' },
        { id: 2, name: 'Dr. Suresh Verma', email: 's.verma@veda.com', specialization: 'Wellness Therapy', status: 'Active', licenseNumber: 'MED-1002', dob: '1990-11-20', gender: 'Male', department: 'Therapy Unit', joiningDate: '2015-05-10' },
        { id: 3, name: 'Dr. Anjali Puri', email: 'anjali.p@veda.com', specialization: 'Gynecology', status: 'Inactive', licenseNumber: 'MED-1003', dob: '1978-03-05', gender: 'Female', department: 'Women’s Health', joiningDate: '2005-01-20' },
        { id: 4, name: 'Dr. Deepak Sharma', email: 'd.sharma@veda.com', specialization: 'Surgery', status: 'Active', licenseNumber: 'MED-1004', dob: '1995-09-25', gender: 'Male', department: 'Surgical Care', joiningDate: '2018-03-15' },
        { id: 5, name: 'Dr. Preeti Das', email: 'preeti.d@veda.com', specialization: 'Pediatrics', status: 'Pending', licenseNumber: 'MED-1005', dob: '1982-07-12', gender: 'Female', department: 'Child Health', joiningDate: '2012-07-01' },
    ]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

    const navigate = (path: string) => console.log(`Navigating to ${path}`); // Mock navigation

    // Handlers are now in the parent component
    const handleEdit = (doctor: Doctor) => { setSelectedDoctor(doctor); setIsModalOpen(true); };
    const handleView = (doctor: Doctor) => navigate(`/doctors/${doctor.id}`);
    const handleCloseModal = () => { setIsModalOpen(false); setSelectedDoctor(null); };
    const handleDelete = (doctor: Doctor) => { if (window.confirm(`Are you sure you want to dismiss ${doctor.name}?`)) console.log(`Dismissing ${doctor.name}`); };

    const filteredData = useMemo(() => doctorsData
        .filter(d => d.name.toLowerCase().includes(search.toLowerCase()))
        .filter(d => statusFilter ? d.status === statusFilter : true),
        [doctorsData, search, statusFilter]
    );

    // 1. Define the columns for the table
    const columns: Column<Doctor>[] = useMemo(() => [
        { Header: 'Doctor Name', accessor: 'name', Cell: ({ value }) => <div className="font-semibold text-gray-900 dark:text-white">{value}</div> },
        { Header: 'Contact Email', accessor: 'email', Cell: ({ value }) => <div className="text-gray-600 dark:text-gray-400">{value}</div> },
        { Header: 'Doctor Expertise', accessor: 'specialization' },
        { Header: 'Current Status', accessor: 'status', Cell: ({ value }) => <StatusBadge status={value} /> },
    ], []);

    // 2. Define the actions for each row
    const renderActions = (doctor: Doctor) => (
        <>
            <button title="View Profile" onClick={() => handleView(doctor)}><IconEye className="w-5 h-5 text-blue-500 hover:text-blue-700" /></button>
            <button title="Edit Details" onClick={() => handleEdit(doctor)}><IconEdit className="w-5 h-5 text-amber-500 hover:text-amber-700" /></button>
            <button title="Dismiss Doctor" onClick={() => handleDelete(doctor)}><IconTrash className="w-5 h-5 text-red-500 hover:text-red-700" /></button>
        </>
    );

    // 3. Define the content for the top bar (search, filters, etc.)
    const renderTopContent = () => (
        <>
            <div className="relative"><input type="text" placeholder="Search Doctors..." value={search} onChange={e => setSearch(e.target.value)} className="form-input ltr:pl-10 rtl:pr-10" /><IconSearch className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2" /></div>
            <div className="flex items-center space-x-3">
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="form-select"><option value="">Filter by Status</option><option value="Active">Active</option><option value="Inactive">Inactive</option><option value="Pending">Pending</option><option value="On Leave">On Leave</option></select>
                 <button
                        type="button"
                        className="flex items-center bg-green-500 text-white border border-green-600 rounded-lg py-2 px-4 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-600 transition duration-150 shadow-md"
                    >
                        <IconDownload className="w-5 h-5 mr-1.5" />
                        Export Data
                    </button>
            </div>
        </>
    );

    return (
        <>
            <Table columns={columns} data={filteredData} actions={renderActions} topContent={renderTopContent()} />
            <DoctorModal isOpen={isModalOpen} onClose={handleCloseModal} doctorData={selectedDoctor ? { firstName: selectedDoctor.name.split(' ')[1] || '', lastName: selectedDoctor.name.split(' ').pop() || '', phone: 'N/A', email: selectedDoctor.email, specialization: selectedDoctor.specialization, licenseNumber: selectedDoctor.licenseNumber || '', dob: selectedDoctor.dob || '', gender: selectedDoctor.gender || '', department: selectedDoctor.department || '', joiningDate: selectedDoctor.joiningDate || '', } : null} mode={selectedDoctor ? 'edit' : 'create'} />
        </>
    );
};

export default DoctorsPage;