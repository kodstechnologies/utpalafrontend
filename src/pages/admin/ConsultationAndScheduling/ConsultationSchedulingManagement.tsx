import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Table, { Column } from '../../../components/Table/Table';
import ConsultationSchedulingModal from './ConsultationSchedulingModal';
import IconEye from '../../../components/Icon/IconEye';
import IconEdit from '../../../components/Icon/IconEdit';
import IconTrash from '../../../components/Icon/IconTrash';
import IconDownload from '../../../components/Icon/IconDownload';
import IconSearch from '../../../components/Icon/IconSearch';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import DeleteModal from '../../../components/DeleteModal';
import IconPlus from '../../../components/Icon/IconPlus';

interface Consultation {
  id: number;
  doctorName: string;
  ward?: string;
  patientName?: string;
  day: string;
  startTime: string;
  endTime: string;
  availableSlots: number;
}

const ConsultationSchedulingManagement: React.FC = () => {
  const navigate = useNavigate();

  const [consultations, setConsultations] = useState<Consultation[]>([
    {
      id: 1,
      doctorName: 'Dr. Priya Sharma',
      ward: 'ICU',
      patientName: 'John Doe',
      day: 'Monday',
      startTime: '10:00 AM',
      endTime: '11:00 AM',
      availableSlots: 5,
    },
    {
      id: 2,
      doctorName: 'Dr. Ramesh Kumar',
      ward: 'General',
      patientName: 'soumyan',
      day: 'Tuesday',
      startTime: '12:00 PM',
      endTime: '01:00 PM',
      availableSlots: 2,
    },
  ]);

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Consultation | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [consultationToDelete, setConsultationToDelete] = useState<Consultation | null>(null);

  // Filter consultations by search
  const filteredConsultations = useMemo(
    () =>
      consultations.filter((c) =>
        c.doctorName.toLowerCase().includes(search.toLowerCase())
      ),
    [consultations, search]
  );

  // Columns for Table
  const columns: Column<Consultation>[] = [
    { Header: 'Doctor', accessor: 'doctorName' },
    { Header: 'Ward', accessor: 'ward' },
    { Header: 'Patient', accessor: 'patientName' },
    { Header: 'Day', accessor: 'day' },
    {
      Header: 'Time',
      accessor: 'startTime',
      Cell: ({ row }) => `${row.startTime} - ${row.endTime}`,
    },
    { Header: 'Available Slots', accessor: 'availableSlots' },
  ];

  // Actions
  const renderActions = (row: Consultation) => (
    <div className="flex items-center space-x-3">
      <button title="View Doctor" onClick={() => navigate(`/doctor/${row.id}`)}>
        <IconEye className="w-5 h-5 text-blue-500 hover:text-blue-700" />
      </button>
      <button
        title="Edit"
        onClick={() => {
          setEditing(row);
          setModalOpen(true);
        }}
      >
        <IconEdit className="w-5 h-5 text-amber-500 hover:text-amber-700" />
      </button>
      <button
        title="Delete"
        onClick={() => {
          setConsultationToDelete(row);
          setDeleteModalOpen(true);
        }}
      >
        <IconTrash className="w-5 h-5 text-red-500 hover:text-red-700" />
      </button>
    </div>
  );

  // Export to Excel
  const handleExportData = useCallback(() => {
    const dataToExport = filteredConsultations.map((c) => ({
      'Doctor Name': c.doctorName,
      Ward: c.ward || 'Not assigned',
      Patient: c.patientName || 'Not assigned',
      Day: c.day,
      Time: `${c.startTime} - ${c.endTime}`,
      'Available Slots': c.availableSlots,
    }));
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = { Sheets: { 'Consultation_Data': ws }, SheetNames: ['Consultation_Data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    FileSaver.saveAs(blob, 'consultations_data.xlsx');
  }, [filteredConsultations]);

  // Top Content (Search + Export)
  const topContent = (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 w-full">
      <div className="relative w-full sm:w-60">
        <input
          type="text"
          placeholder="Search Doctors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border-2 border-green-200 dark:border-gray-600 rounded-lg py-2 pl-10 dark:bg-gray-700 dark:text-gray-100 focus:border-green-500 focus:ring-green-500 transition"
        />
        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
      </div>
      <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
        <button
          onClick={handleExportData}
          className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
        >
          <IconDownload className="w-5 h-5 mr-1" /> Export Data
        </button>
      </div>
    </div>
  );

  // Delete consultation
  const handleConfirmDelete = () => {
    if (consultationToDelete) {
      setConsultations((prev) => prev.filter((c) => c.id !== consultationToDelete.id));
    }
    setDeleteModalOpen(false);
    setConsultationToDelete(null);
  };

  return (
    <>
      <div className="flex pb-10 flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <ul className="flex space-x-2 rtl:space-x-reverse">
          <li>
            <Link to="#" className="text-green-600 hover:underline">
              Consultation & Scheduling
            </Link>
          </li>
        </ul>

        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="flex items-center justify-center px-4 py-2 bg-green-700 text-white font-semibold rounded-lg shadow-md hover:bg-green-800 transition-colors duration-150 w-full md:w-auto"
        >
          <IconPlus />
          <span className="ml-2 ">Add Slot</span>
        </button>
      </div>
      <Table
        columns={columns}
        data={filteredConsultations}
        actions={renderActions}
        topContent={topContent}
      />

      {modalOpen && (
        <ConsultationSchedulingModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          onSave={(data) => {
            if (editing) {
              setConsultations((prev) =>
                prev.map((c) => (c.id === editing.id ? { ...editing, ...data } : c))
              );
            } else {
              setConsultations((prev) => [...prev, { ...data, id: Date.now() }]);
            }
            setModalOpen(false);
            setEditing(null);
          }}
          data={editing || undefined}
        />
      )}

      <DeleteModal
        isOpen={deleteModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setConsultationToDelete(null);
        }}
      />
    </>
  );
};

export default ConsultationSchedulingManagement;
