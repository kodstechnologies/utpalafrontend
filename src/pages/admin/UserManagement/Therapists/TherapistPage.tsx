import React, { useState, useMemo, useCallback } from 'react';
import Table, { Column } from '../../../../components/Table/Table';
import TherapistModal from './TherapistModal';
import IconEye from '../../../../components/Icon/IconEye';
import IconEdit from '../../../../components/Icon/IconEdit';
import IconTrash from '../../../../components/Icon/IconTrash';
import IconDownload from '../../../../components/Icon/IconDownload';
import IconSearch from '../../../../components/Icon/IconSearch';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';

interface Therapist {
  id: number;
  name: string;
  email: string;
  specialty: 'Physiotherapist' | 'Occupational Therapist' | 'Speech Therapist' | 'Psychotherapist';
  schedule: 'Full-time' | 'Part-time' | 'Contract';
  status: 'Active' | 'Inactive' | 'On Leave' | 'Training';
  employeeId: string;
  licenseId: string;
  joiningDate?: string;
}

type StatusBadgeProps = { status: Therapist['status'] };
const StatusBadge = ({ status }: StatusBadgeProps) => {
  let colorClass = '';
  switch (status) {
    case 'Active':
      colorClass = 'bg-green-600 text-white dark:bg-green-800 dark:text-green-100';
      break;
    case 'Inactive':
      colorClass = 'bg-red-400 text-white dark:bg-red-700 dark:text-red-100';
      break;
    case 'Training':
      colorClass = 'bg-amber-400 text-amber-900 dark:bg-amber-600 dark:text-amber-100';
      break;
    case 'On Leave':
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

const TherapistsPage = () => {
  const [therapistsData] = useState<Therapist[]>([
    { id: 101, employeeId: 'T-101', name: 'Dr. Rahul Verma', email: 'r.verma@rehab.com', specialty: 'Physiotherapist', schedule: 'Full-time', status: 'Active', licenseId: 'PT-1001', joiningDate: '2018-06-01' },
    { id: 102, employeeId: 'T-102', name: 'Sonal Desai', email: 's.desai@rehab.com', specialty: 'Occupational Therapist', schedule: 'Part-time', status: 'On Leave', licenseId: 'OT-2005', joiningDate: '2021-03-15' },
    { id: 103, employeeId: 'T-103', name: 'Amit Singh', email: 'a.singh@rehab.com', specialty: 'Speech Therapist', schedule: 'Full-time', status: 'Active', licenseId: 'ST-3012', joiningDate: '2022-09-20' },
    { id: 104, employeeId: 'T-104', name: 'Geeta Menon', email: 'g.menon@rehab.com', specialty: 'Psychotherapist', schedule: 'Contract', status: 'Training', licenseId: 'PY-4001', joiningDate: '2024-01-10' },
    { id: 105, employeeId: 'T-105', name: 'Vivek Kulkarni', email: 'v.kulkarni@rehab.com', specialty: 'Physiotherapist', schedule: 'Full-time', status: 'Inactive', licenseId: 'PT-1015', joiningDate: '2019-11-25' },
  ]);

  const [search, setSearch] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const navigate = useNavigate();

  const modalMode = selectedTherapist ? 'edit' : 'add';

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedTherapist(null);
  }, []);

  const handleEdit = useCallback((therapist: Therapist) => {
    setSelectedTherapist(therapist);
    setIsModalOpen(true);
  }, []);

  const handleAdd = useCallback(() => {
    setSelectedTherapist(null);
    setIsModalOpen(true);
  }, []);

  const handleView = (therapist: Therapist) => navigate(`/therapist/${therapist.id}`);

  const handleDelete = useCallback((therapist: Therapist) => {
    if (window.confirm(`Are you sure you want to dismiss ${therapist.name}?`)) {
      console.log(`Dismissing Therapist with ID: ${therapist.id}`);
    }
  }, []);

  const filteredData = useMemo(() => therapistsData
    .filter(t =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase())
    )
    .filter(t => specialtyFilter ? t.specialty === specialtyFilter : true),
    [therapistsData, search, specialtyFilter]
  );

  const columns: Column<Therapist>[] = useMemo(() => [
    { Header: 'Employee ID', accessor: 'employeeId', Cell: ({ value }) => <div className="text-sm font-semibold text-green-700 dark:text-green-400">{value}</div> },
    { Header: 'Therapist Name', accessor: 'name', Cell: ({ value }) => <div className="font-semibold text-gray-900 dark:text-white">{value}</div> },
    { Header: 'Specialty', accessor: 'specialty', Cell: ({ value }) => <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">{value}</div> },
    { Header: 'Email', accessor: 'email', Cell: ({ value }) => <div className="text-sm font-semibold text-gray-900 dark:text-gray-300">{value}</div> },
    { Header: 'Schedule', accessor: 'schedule', Cell: ({ value }) => <div className="text-sm text-green-700 dark:text-green-400 font-semibold">{value}</div> },
    { Header: 'Status', accessor: 'status', Cell: ({ value }) => <StatusBadge status={value} /> },
  ], []);

  const handleExportData = useCallback(() => {
    const fileExtension = '.xlsx';
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

    const dataToExport = filteredData.map(item => ({
      'ID': item.id,
      'Employee ID': item.employeeId,
      'Name': item.name,
      'Email': item.email,
      'Specialty': item.specialty,
      'Schedule': item.schedule,
      'Status': item.status,
      'License ID': item.licenseId,
      'Joining Date': item.joiningDate || 'N/A',
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    ws['!cols'] = [
      { wch: 5 }, { wch: 15 }, { wch: 25 }, { wch: 30 },
      { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
    ];

    const wb = { Sheets: { 'Therapists_Data': ws }, SheetNames: ['Therapists_Data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(blob, 'therapists_data_export' + fileExtension);
  }, [filteredData]);

  const renderActions = (therapist: Therapist) => (
    <div className="flex items-center justify-center space-x-4">
      <button onClick={() => handleView(therapist)} title="View" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition">
        <IconEye className="w-5 h-5" />
      </button>
      <button onClick={() => handleEdit(therapist)} title="Edit" className="text-amber-500 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition">
        <IconEdit className="w-5 h-5" />
      </button>
      <button onClick={() => handleDelete(therapist)} title="Dismiss" className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition">
        <IconTrash className="w-5 h-5" />
      </button>
    </div>
  );

  const renderTopContent = () => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 w-full">
      <div className="relative w-full sm:w-60">
        <input
          type="text"
          placeholder="Search Therapists..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="form-input pl-10 border-2 border-green-200 dark:border-gray-600 rounded-lg py-2 w-full focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100 transition duration-150"
        />
        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400 w-5 h-5" />
      </div>
      <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
        <button onClick={handleExportData} className="flex items-center bg-green-500 text-white border border-green-600 rounded-lg py-2 px-4 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-600 transition duration-150 shadow-md">
          <IconDownload className="w-5 h-5 mr-1.5" /> Export Data
        </button>
      </div>
    </div>

  );

  return (
    <>
      <Table columns={columns} data={filteredData} actions={renderActions} topContent={renderTopContent()} />

      {isModalOpen && (
        <TherapistModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          mode={modalMode}
          therapistData={selectedTherapist || undefined}
          onSave={(data) => console.log('Saved Therapist:', data)}
        />
      )}
    </>
  );
};

export default TherapistsPage;
