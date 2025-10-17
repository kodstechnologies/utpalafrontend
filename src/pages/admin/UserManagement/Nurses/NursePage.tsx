import React, { useState, useMemo, useCallback } from "react";
import Table, { Column } from "../../../../components/Table/Table";
import IconEye from "../../../../components/Icon/IconEye";
import IconEdit from "../../../../components/Icon/IconEdit";
import IconTrash from "../../../../components/Icon/IconTrash";
import IconDownload from "../../../../components/Icon/IconDownload";
import IconSearch from "../../../../components/Icon/IconSearch";
import FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import GlobalModal, { FieldConfig } from "../../../../components/Modal/GlobalModal";

interface Nurse {
    id: number;
    firstName: string;
    lastName: string;
    name: string;
    email: string;
    phone: string;
    dob: string;
    gender: "Male" | "Female" | "Other";
    specialization: string;
    licenseNumber: string;
    department: "Ayurveda" | "Panchakarma" | "General" | "Other";
    joiningDate: string;
    status: "Active" | "Inactive" | "On Leave" | "Pending";
}

const StatusBadge = ({ status }: { status: Nurse["status"] }) => {
    const colorClasses = {
        Active: "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100",
        Inactive: "bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100",
        Pending: "bg-amber-100 text-amber-700 dark:bg-amber-600 dark:text-amber-100",
        "On Leave": "bg-blue-500 text-white dark:bg-blue-700 dark:text-blue-100",
    };
    return <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full shadow-sm ${colorClasses[status] || "bg-gray-400 text-gray-900 dark:bg-gray-700 dark:text-gray-100"}`}>{status}</span>;
};

const NursesPage = () => {
    const navigate = useNavigate();

    const [nursesData, setNursesData] = useState<Nurse[]>([
        { id: 1, firstName: "Leena", lastName: "Nair", name: "Sister Leena Nair", email: "leena.nair@veda.com", phone: "555-1001", dob: "1985-05-10", gender: "Female", specialization: "Abhyanga & Shirodhara", licenseNumber: "NUR-1001", department: "Panchakarma", joiningDate: "2020-01-01", status: "Active" },
        { id: 2, firstName: "Rohan", lastName: "Patel", name: "Nurse Rohan Patel", email: "rohan.p@veda.com", phone: "555-1002", dob: "1990-12-01", gender: "Male", specialization: "Vasti & Swedana", licenseNumber: "NUR-1002", department: "Ayurveda", joiningDate: "2019-06-15", status: "Active" },
    ]);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNurse, setSelectedNurse] = useState<Nurse | null>(null);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedNurse(null);
    }, []);

    const handleAdd = () => {
        setSelectedNurse(null);
        setIsModalOpen(true);
    };

    const handleEdit = (nurse: Nurse) => {
        setSelectedNurse(nurse);
        setIsModalOpen(true);
    };

    const handleView = (nurse: Nurse) => navigate(`/nurse/${nurse.id}`);

    const handleDelete = (nurse: Nurse) => {
        if (window.confirm(`Are you sure you want to dismiss ${nurse.name}?`)) {
            setNursesData(prev => prev.filter(n => n.id !== nurse.id));
        }
    };

    const handleSave = (data: any) => {
        const fullName = `${data.firstName} ${data.lastName}`;
        if (selectedNurse) {
            // Edit
            setNursesData(prev => prev.map(n => n.id === selectedNurse.id ? { ...n, ...data, name: fullName } : n));
        } else {
            // Add new
            const newId = Math.max(...nursesData.map(n => n.id)) + 1;
            setNursesData(prev => [...prev, { id: newId, ...data, name: fullName }]);
        }
        setIsModalOpen(false);
        setSelectedNurse(null);
    };

    const filteredData = useMemo(() => nursesData
        .filter(n => n.name.toLowerCase().includes(search.toLowerCase()) || n.email.toLowerCase().includes(search.toLowerCase()))
        .filter(n => statusFilter ? n.status === statusFilter : true),
        [nursesData, search, statusFilter]
    );

    const columns: Column<Nurse>[] = useMemo(() => [
        { Header: 'Nurse Name', accessor: 'name' },
        { Header: 'Email', accessor: 'email' },
        { Header: 'Specialization', accessor: 'specialization' },
        { Header: 'Status', accessor: 'status', Cell: ({ value }) => <StatusBadge status={value} /> },
    ], []);

    const handleExportData = () => {
        const dataToExport = filteredData.map(n => ({
            Name: n.name,
            Email: n.email,
            Phone: n.phone,
            DOB: n.dob,
            Gender: n.gender,
            Specialization: n.specialization,
            License: n.licenseNumber,
            Department: n.department,
            JoiningDate: n.joiningDate,
            Status: n.status
        }));
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = { Sheets: { 'Nurses_Data': ws }, SheetNames: ['Nurses_Data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        FileSaver.saveAs(blob, 'nurses_data.xlsx');
    };

    const renderActions = (n: Nurse) => (
        <div className="flex space-x-3">
            <button onClick={() => handleView(n)} title="View"><IconEye className="w-5 h-5 text-blue-500" /></button>
            <button onClick={() => handleEdit(n)} title="Edit"><IconEdit className="w-5 h-5 text-amber-500" /></button>
            <button onClick={() => handleDelete(n)} title="Dismiss"><IconTrash className="w-5 h-5 text-red-500" /></button>
        </div>
    );

    const renderTopContent = (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0 w-full">
            <div className="relative w-full sm:w-60">
                <input
                    type="text"
                    placeholder="Search Nurses..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full border-2 border-green-200 dark:border-gray-600 rounded-lg py-2 pl-10 dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
            </div>
            <div className="flex items-center space-x-3 w-full sm:w-auto justify-end ">
                <button
                    type="button"
                    onClick={handleExportData}
                    className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                    <IconDownload className="w-5 h-5 mr-1" /> Export Data
                </button>
            </div>
        </div>
    );

    // Fields for GlobalModal
    const nurseFields: FieldConfig[] = [
        { name: "firstName", label: "First Name", type: "text", required: true },
        { name: "lastName", label: "Last Name", type: "text", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "phone", label: "Phone", type: "text", required: true },
        { name: "dob", label: "Date of Birth", type: "date" },
        { name: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Other"] },
        { name: "specialization", label: "Specialization", type: "text" },
        { name: "licenseNumber", label: "License Number", type: "text" },
        { name: "department", label: "Department", type: "select", options: ["Ayurveda", "Panchakarma", "General", "Other"] },
        { name: "joiningDate", label: "Joining Date", type: "date" },
        { name: "status", label: "Status", type: "select", options: ["Active", "Inactive", "On Leave", "Pending"] },
    ];

    return (
        <>
            <Table columns={columns} data={filteredData} actions={renderActions} topContent={renderTopContent} />

            {isModalOpen && (
                <GlobalModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    mode={selectedNurse ? "edit" : "create"}
                    title="Nurse"
                    fields={nurseFields}
                    initialData={selectedNurse || undefined}
                    onSave={handleSave}
                />
            )}
        </>
    );
};

export default NursesPage;
