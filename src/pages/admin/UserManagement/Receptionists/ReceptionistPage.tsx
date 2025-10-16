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
import GlobalModal from '../../../../components/Modal/GlobalModal';
interface Receptionist {
  id: number;
  name: string;
  email: string;
  shift: 'Morning' | 'Afternoon' | 'Evening' | 'Full Day';
  status: 'Active' | 'Inactive' | 'On Leave' | 'Training';
  employeeId: string;
  dob?: string;
  gender?: 'Male' | 'Female' | 'Other';
  department: 'Front Desk' | 'Billing' | 'Admissions';
  joiningDate?: string;
}

type StatusBadgeProps = { status: Receptionist['status'] };
const StatusBadge = ({ status }: StatusBadgeProps) => {
  let colorClass = '';
  switch (status) {
    case 'Active': colorClass = 'bg-green-600 text-white dark:bg-green-800 dark:text-green-100'; break;
    case 'Inactive': colorClass = 'bg-red-400 text-white dark:bg-red-700 dark:text-red-100'; break;
    case 'Training': colorClass = 'bg-amber-400 text-amber-900 dark:bg-amber-600 dark:text-amber-100'; break;
    case 'On Leave': colorClass = 'bg-blue-500 text-white dark:bg-blue-700 dark:text-blue-100'; break;
    default: colorClass = 'bg-gray-400 text-gray-900 dark:bg-gray-700 dark:text-gray-100';
  }
  return <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full shadow-sm ${colorClass}`}>{status}</span>;
};

const ReceptionistsPage = () => {
  const [receptionistsData, setReceptionistsData] = useState<Receptionist[]>([
    { id: 1, employeeId: 'R-001', name: 'Manoj Patel', email: 'manoj.p@veda.com', shift: 'Morning', status: 'Active', department: 'Front Desk', joiningDate: '2021-01-15' },
    { id: 2, employeeId: 'R-002', name: 'Neha Sharma', email: 'neha.s@veda.com', shift: 'Full Day', status: 'On Leave', department: 'Admissions', joiningDate: '2020-05-20' },
    { id: 3, employeeId: 'R-003', name: 'Vijay Kumar', email: 'vijay.k@veda.com', shift: 'Evening', status: 'Inactive', department: 'Billing', joiningDate: '2022-08-01' },
  ]);

  const [search, setSearch] = useState('');
  const [shiftFilter, setShiftFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReceptionist, setSelectedReceptionist] = useState<Receptionist | null>(null);
  const navigate = useNavigate();

  // Filtered data
  const filteredData = useMemo(() => receptionistsData
    .filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.employeeId.toLowerCase().includes(search.toLowerCase()) || r.email.toLowerCase().includes(search.toLowerCase()))
    .filter(r => shiftFilter ? r.shift === shiftFilter : true),
    [receptionistsData, search, shiftFilter]
  );

  // Columns
  const columns: Column<Receptionist>[] = useMemo(() => [
    { Header: 'Employee ID', accessor: 'employeeId', Cell: ({ value }) => <div className="text-sm font-semibold text-green-700 dark:text-green-400">{value}</div> },
    { Header: 'Staff Name', accessor: 'name', Cell: ({ value }) => <div className="font-semibold text-gray-900 dark:text-white">{value}</div> },
    { Header: 'Contact Email', accessor: 'email', Cell: ({ value }) => <div className="text-normal font-semibold text-gray-900 dark:text-gray-300">{value}</div> },
    { Header: 'Department', accessor: 'department', Cell: ({ value }) => <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">{value}</div> },
    { Header: 'Shift', accessor: 'shift', Cell: ({ value }) => <div className="text-sm text-green-700 dark:text-green-400 font-semibold">{value}</div> },
    { Header: 'Current Status', accessor: 'status', Cell: ({ value }) => <StatusBadge status={value} /> },
  ], []);

  // Actions
  const handleView = (receptionist: Receptionist) => navigate(`/receptionist/${receptionist.id}`);
  const handleEdit = (receptionist: Receptionist) => { setSelectedReceptionist(receptionist); setIsModalOpen(true); };
  const handleDelete = (receptionist: Receptionist) => { if (window.confirm(`Dismiss ${receptionist.name}?`)) setReceptionistsData(prev => prev.filter(r => r.id !== receptionist.id)); };

  const renderActions = (receptionist: Receptionist) => (
    <div className="flex items-center justify-center space-x-4">
      <button className="text-blue-500 hover:text-blue-700" onClick={() => handleView(receptionist)}><IconEye className="w-5 h-5" /></button>
      <button className="text-amber-500 hover:text-amber-700" onClick={() => handleEdit(receptionist)}><IconEdit className="w-5 h-5" /></button>
      <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(receptionist)}><IconTrash className="w-5 h-5" /></button>
    </div>
  );

  // Export
  const handleExportData = useCallback(() => {
    const fileExtension = '.xlsx';
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const dataToExport = filteredData.map(item => ({
      'ID': item.id, 'Employee ID': item.employeeId, 'Name': item.name, 'Email': item.email,
      'Shift': item.shift, 'Department': item.department, 'Status': item.status,
      'DOB': item.dob || 'N/A', 'Gender': item.gender || 'N/A', 'Joining Date': item.joiningDate || 'N/A',
    }));
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = { Sheets: { 'Receptionists_Data': ws }, SheetNames: ['Receptionists_Data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(blob, 'receptionists_data_export' + fileExtension);
  }, [filteredData]);

  const renderTopContent = () => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 w-full">
      <div className="relative w-full sm:w-60">
        <input
          type="text"
          placeholder="Search Receptionists..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="form-input pl-10 border-2 border-green-200 dark:border-gray-600 rounded-lg py-2 w-full sm:w-60 focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100 transition"
        />
        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400 w-5 h-5" />
      </div>
      <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-1 hover:bg-green-600 transition"
          onClick={handleExportData}
        >
          <IconDownload className="w-5 h-5" />
          Export Data
        </button>
      </div>
    </div>
  );

  const handleSaveReceptionist = (data: any) => {
    if (selectedReceptionist) {
      setReceptionistsData(prev => prev.map(r => r.id === selectedReceptionist.id ? { ...r, ...data } : r));
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <Table columns={columns} data={filteredData} actions={renderActions} topContent={renderTopContent()} />

      {/* GlobalModal for Edit only */}
      {isModalOpen && selectedReceptionist && (
        <GlobalModal<Receptionist>
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          mode="edit"
          title="Receptionist"
          fields={[
            { name: 'employeeId', label: 'Employee ID', type: 'text', required: true },
            { name: 'name', label: 'Name', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'department', label: 'Department', type: 'select', options: ['Front Desk', 'Billing', 'Admissions'], required: true },
            { name: 'shift', label: 'Shift', type: 'select', options: ['Morning', 'Afternoon', 'Evening', 'Full Day'], required: true },
            { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive', 'On Leave', 'Training'], required: true },
            { name: 'dob', label: 'DOB', type: 'date' },
            { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'] },
            { name: 'joiningDate', label: 'Joining Date', type: 'date' },
          ]}
          initialData={selectedReceptionist}
          onSave={handleSaveReceptionist}
        />
      )}
    </>
  );
};

export default ReceptionistsPage;
