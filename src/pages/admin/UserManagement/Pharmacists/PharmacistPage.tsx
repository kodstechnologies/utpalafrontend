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
import PharmacistModal from './PharmacistModal';

interface Pharmacist {
  id: number;
  name: string;
  email: string;
  role: 'Head Pharmacist' | 'Senior' | 'Junior' | 'Trainee';
  status: 'Active' | 'Inactive' | 'On Leave' | 'Pending';
  licenseNumber: string;
  dob?: string;
  gender?: string;
  section: 'Dispensing' | 'Compounding' | 'Inventory' | 'Clinical';
  joiningDate?: string;
}

type StatusBadgeProps = { status: Pharmacist['status'] };
const StatusBadge = ({ status }: StatusBadgeProps) => {
  let colorClass = '';
  switch (status) {
    case 'Active': colorClass = 'bg-green-600 text-white dark:bg-green-800 dark:text-green-100'; break;
    case 'Inactive': colorClass = 'bg-red-400 text-white dark:bg-red-700 dark:text-red-100'; break;
    case 'Pending': colorClass = 'bg-amber-400 text-amber-900 dark:bg-amber-600 dark:text-amber-100'; break;
    case 'On Leave': colorClass = 'bg-blue-500 text-white dark:bg-blue-700 dark:text-blue-100'; break;
    default: colorClass = 'bg-gray-400 text-gray-900 dark:bg-gray-700 dark:text-gray-100';
  }
  return <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full shadow-sm ${colorClass}`}>{status}</span>;
};

const PharmacistsPage = () => {
  const [pharmacistsData, setPharmacistsData] = useState<Pharmacist[]>([
    { id: 1, name: 'Rohan Deshmukh', email: 'rohan.d@pharmacy.com', role: 'Head Pharmacist', status: 'Active', licenseNumber: 'PHM-5001', dob: '1975-06-15', gender: 'Male', section: 'Dispensing', joiningDate: '2005-08-01' },
    { id: 2, name: 'Pooja Tandon', email: 'pooja.t@pharmacy.com', role: 'Senior', status: 'Active', licenseNumber: 'PHM-5002', dob: '1988-11-20', gender: 'Female', section: 'Compounding', joiningDate: '2012-05-10' },
    { id: 3, name: 'Vivek Malhotra', email: 'vivek.m@pharmacy.com', role: 'Junior', status: 'Inactive', licenseNumber: 'PHM-5003', dob: '1995-03-05', gender: 'Male', section: 'Inventory', joiningDate: '2020-01-20' },
    { id: 4, name: 'Sonia Kapoor', email: 'sonia.k@pharmacy.com', role: 'Senior', status: 'On Leave', licenseNumber: 'PHM-5004', dob: '1982-09-25', gender: 'Female', section: 'Clinical', joiningDate: '2014-03-15' },
    { id: 5, name: 'Ajay Sharma', email: 'ajay.s@pharmacy.com', role: 'Trainee', status: 'Pending', licenseNumber: 'PHM-5005', dob: '2000-07-12', gender: 'Male', section: 'Dispensing', joiningDate: '2024-07-01' },
  ]);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPharmacist, setSelectedPharmacist] = useState<Pharmacist | null>(null);
  const navigate = useNavigate();

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedPharmacist(null);
  }, []);

  const handleEdit = useCallback((pharmacist: Pharmacist) => {
    setSelectedPharmacist(pharmacist);
    setIsModalOpen(true);
  }, []);

  const handleAdd = () => {
    setSelectedPharmacist(null);
    setIsModalOpen(true);
  };

  const handleView = (pharmacist: Pharmacist) => navigate(`/pharmacist/${pharmacist.id}`);

  const handleDelete = useCallback((pharmacist: Pharmacist) => {
    if (window.confirm(`Are you sure you want to dismiss ${pharmacist.name}?`)) {
      setPharmacistsData(prev => prev.filter(p => p.id !== pharmacist.id));
    }
  }, []);

  const handleSave = (data: any) => {
    if (selectedPharmacist) {
      // Edit
      setPharmacistsData(prev => prev.map(p => p.id === selectedPharmacist.id ? { ...p, ...data } : p));
    } else {
      // Add new
      const newId = Math.max(...pharmacistsData.map(p => p.id)) + 1;
      setPharmacistsData(prev => [...prev, { id: newId, ...data }]);
    }
  };

  const filteredData = useMemo(() => pharmacistsData
    .filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.licenseNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
    )
    .filter(p => statusFilter ? p.status === statusFilter : true),
    [pharmacistsData, search, statusFilter]
  );

  const columns: Column<Pharmacist>[] = useMemo(() => [
    { Header: 'Pharmacist Name', accessor: 'name', Cell: ({ value }) => <div className="font-semibold text-gray-900 dark:text-white">{value}</div> },
    { Header: 'License No.', accessor: 'licenseNumber', Cell: ({ value }) => <div className="text-sm font-semibold text-green-700 dark:text-green-400">{value}</div> },
    { Header: 'Contact Email', accessor: 'email', Cell: ({ value }) => <div className="text-sm text-gray-600 dark:text-gray-400">{value}</div> },
    { Header: 'Role', accessor: 'role', Cell: ({ value }) => <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">{value}</div> },
    { Header: 'Section', accessor: 'section', Cell: ({ value }) => <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">{value}</div> },
    { Header: 'Current Status', accessor: 'status', Cell: ({ value }) => <StatusBadge status={value} /> },
  ], []);

  const handleExportData = useCallback(() => {
    const fileExtension = '.xlsx';
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

    const dataToExport = filteredData.map(item => ({
      'ID': item.id,
      'Name': item.name,
      'License Number': item.licenseNumber,
      'Email': item.email,
      'Role': item.role,
      'Section': item.section,
      'Status': item.status,
      'DOB': item.dob || 'N/A',
      'Gender': item.gender || 'N/A',
      'Joining Date': item.joiningDate || 'N/A',
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    ws['!cols'] = [
      { wch: 5 },
      { wch: 25 },
      { wch: 15 },
      { wch: 30 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 12 },
      { wch: 10 },
      { wch: 15 },
    ];
    const wb = { Sheets: { 'Pharmacists_Data': ws }, SheetNames: ['Pharmacists_Data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(blob, 'pharmacists_data_export' + fileExtension);
  }, [filteredData]);

  const renderActions = (pharmacist: Pharmacist) => (
    <div className="flex items-center justify-center space-x-4">
      <button className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition" title="View Profile" onClick={() => handleView(pharmacist)}>
        <IconEye className="w-5 h-5" />
      </button>
      <button className="text-amber-500 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition" title="Edit Details" onClick={() => handleEdit(pharmacist)}>
        <IconEdit className="w-5 h-5" />
      </button>
      <button className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition" title="Dismiss Pharmacist" onClick={() => handleDelete(pharmacist)}>
        <IconTrash className="w-5 h-5" />
      </button>
    </div>
  );

  const renderTopContent = () => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 w-full">
      <div className="relative w-full sm:w-60">
        <input
          type="text"
          placeholder="Search Pharmacists..."
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
        <PharmacistModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          pharmacistData={selectedPharmacist || undefined}
          mode={selectedPharmacist ? 'edit' : 'add'}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default PharmacistsPage;
