import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Table, { Column } from "../../../components/Table/Table";
import IconEdit from "../../../components/Icon/IconEdit";
import IconTrash from "../../../components/Icon/IconTrash";
import IconSearch from "../../../components/Icon/IconSearch";
import IconPlus from "../../../components/Icon/IconPlus";
import DeleteModal from "../../../components/DeleteModal";
import { LogOut } from "lucide-react";
import AddEntryModal from './AddEntryModal';

export interface EntryExitRecord {
    id: number;
    patientName: string;
    therapistNames: string[];
    entryTime: string;
    exitTime?: string;
    status: 'Entered' | 'Exited';
}

const EntryExit: React.FC = () => {
    const [records, setRecords] = useState<EntryExitRecord[]>([
        { id: 1, patientName: 'John Doe', therapistNames: ['Dr. Meena'], entryTime: '2024-05-21 10:00 AM', status: 'Entered' },
        { id: 2, patientName: 'Jane Smith', therapistNames: ['Dr. Rohan', 'Dr. Priya'], entryTime: '2024-05-21 09:30 AM', exitTime: '2024-05-21 10:15 AM', status: 'Exited' },
    ]);
    const [search, setSearch] = useState("");

    const [addEntryModalOpen, setAddEntryModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<EntryExitRecord | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState<EntryExitRecord | null>(null);

    const filteredData = useMemo(
        () =>
            records.filter(
                r =>
                    r.patientName.toLowerCase().includes(search.toLowerCase()) ||
                    r.therapistNames.some(name =>
                        name.toLowerCase().includes(search.toLowerCase())
                    )
            ),
        [records, search]
    );

    const handleMarkExit = (record: EntryExitRecord) => {
        setRecords(prevRecords =>
            prevRecords.map(r =>
                r.id === record.id
                    ? { ...r, exitTime: new Date().toLocaleString(), status: 'Exited' }
                    : r
            )
        );
    };

    const columns: Column<EntryExitRecord>[] = [
        { Header: "Patient Name", accessor: "patientName" },
        {
            Header: "Therapists",
            accessor: "therapistNames",
            Cell: ({ value }) => (
                <div className="flex flex-wrap gap-1">{value.map((name: string) => <span key={name} className="badge bg-green-500/20 text-green-500">{name}</span>)}</div>
            )
        },
        { Header: "Entry Time", accessor: "entryTime" },
        { Header: "Exit Time", accessor: "exitTime" },
        {
            Header: "Status",
            accessor: "status",
            Cell: ({ value }) => (
                <span className={`badge ${value === 'Entered' ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
                    {value}
                </span>
            ),
        },
    ];

    const renderActions = (record: EntryExitRecord) => (
        <div className="flex items-center space-x-3">
            {record.status === 'Entered' && (
                <button title="Mark Exit" onClick={() => handleMarkExit(record)}>
                    <LogOut className="w-5 h-5 text-blue-500 hover:text-blue-700" />
                </button>
            )}
            <button
                title="Edit"
                onClick={() => {
                    setEditingRecord(record);
                    setAddEntryModalOpen(true);
                }}
            >
                <IconEdit className="w-5 h-5 text-amber-500 hover:text-amber-700" />
            </button>
            <button
                title="Delete"
                onClick={() => {
                    setRecordToDelete(record);
                    setDeleteModalOpen(true);
                }}
            >
                <IconTrash className="w-5 h-5 text-red-500 hover:text-red-700" />
            </button>
        </div>
    );

    const handleConfirmDelete = () => {
        if (recordToDelete) {
            setRecords(prev => prev.filter(r => r.id !== recordToDelete.id));
        }
        setDeleteModalOpen(false);
        setRecordToDelete(null);
    };

    return (
        <>
            {/* Top Section */}
            <div className="flex pb-10 flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <ul className="flex space-x-2 rtl:space-x-reverse">
                    <li>
                        <Link to="#" className="text-green-600 hover:underline">
                            Therapist
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span>Entry & Exit</span>
                    </li>
                </ul>
                <div className="flex space-x-3 w-full md:w-auto">
                    <button
                        type="button"
                        onClick={() => {
                            setEditingRecord(null);
                            setAddEntryModalOpen(true);
                        }}
                        className="flex items-center justify-center px-4 py-2 bg-green-700 text-white font-semibold rounded-lg shadow-md hover:bg-green-800 transition-colors duration-150"
                    >
                        <IconPlus />
                        <span className="ml-2">Add Entry</span>
                    </button>
                </div>
            </div>

            {/* Table */}
            <Table
                columns={columns}
                data={filteredData}
                actions={renderActions}
                topContent={
                    <div className="relative w-full sm:w-60">
                        <input
                            type="text"
                            placeholder="Search Patient or Therapist..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full border-2 border-green-200 dark:border-gray-600 rounded-lg py-2 pl-10 dark:bg-gray-700 dark:text-gray-100 focus:border-green-500 focus:ring-green-500 transition"
                        />
                        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
                    </div>
                }
                itemsPerPage={5}
            />

            {/* Add/Edit Entry Modal */}
            <AddEntryModal
                isOpen={addEntryModalOpen}
                onClose={() => {
                    setAddEntryModalOpen(false);
                    setEditingRecord(null);
                }}
                mode={editingRecord ? "edit" : "create"}
                initialData={editingRecord || {}}
                onSave={(data) => {
                    if (editingRecord) {
                        setRecords(prev => prev.map(r => (r.id === editingRecord.id ? {
                            ...r,
                            ...data,
                            entryTime: new Date(data.entryTime!).toLocaleString()
                        } as EntryExitRecord : r)));
                    } else {
                        const newRecord: EntryExitRecord = {
                            id: Date.now(),
                            ...data,
                            status: 'Entered',
                        } as EntryExitRecord;
                        setRecords(prev => [...prev, newRecord]);
                    }

                    setAddEntryModalOpen(false);
                    setEditingRecord(null);
                }}
            />

            {/* Delete Confirmation Modal */}
            <DeleteModal
                isOpen={deleteModalOpen}
                onConfirm={handleConfirmDelete}
                onCancel={() => {
                    setDeleteModalOpen(false);
                    setRecordToDelete(null);
                }}
            />
        </>
    );
};

export default EntryExit;
