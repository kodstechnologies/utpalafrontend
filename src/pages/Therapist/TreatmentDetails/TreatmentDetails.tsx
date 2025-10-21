import React, { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import Table, { Column } from "../../../components/Table/Table";
import IconEdit from "../../../components/Icon/IconEdit";
import IconTrash from "../../../components/Icon/IconTrash";
import IconDownload from "../../../components/Icon/IconDownload";
import IconSearch from "../../../components/Icon/IconSearch";
import FileSaver from "file-saver";
import * as XLSX from "xlsx";
import GlobalModal, { FieldConfig } from "../../../components/Modal/GlobalModal";
import DeleteModal from "../../../components/DeleteModal";

// --- Types ---
interface TherapyAssignment {
    id: number;
    patientName: string;
    therapyName: string;
    cost: number;
    duration?: string;
}

interface ModalFormData {
    patientName?: string;
    therapyName: string;
    duration: string;
}

const TreatmentDetails: React.FC = () => {
    // Removed unused const navigate = useNavigate();

    const [records, setRecords] = useState<TherapyAssignment[]>([
        // Mock data
        { id: 1, patientName: "John Doe", therapyName: "Physiotherapy", cost: 1500 },
        { id: 2, patientName: "Jane Smith", therapyName: "Occupational Therapy", cost: 2000, duration: "45 mins" },
        { id: 3, patientName: "Peter Jones", therapyName: "Speech Therapy", cost: 1800 },
        { id: 4, patientName: "Mary Lee", therapyName: "Physiotherapy", cost: 1500 },
    ]);
    const [search, setSearch] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<TherapyAssignment | null>(null);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState<TherapyAssignment | null>(null);

    const filteredData = useMemo(
        () =>
            records.filter(
                r =>
                    r.therapyName.toLowerCase().includes(search.toLowerCase()) ||
                    r.patientName.toLowerCase().includes(search.toLowerCase())
            ),
        [records, search]
    );

    // --- Handlers ---

    const handleOpenEdit = useCallback((record: TherapyAssignment) => {
        setEditingRecord(record);
        setModalOpen(true);
    }, []);

    const handleOpenDelete = useCallback((record: TherapyAssignment) => {
        setRecordToDelete(record);
        setDeleteModalOpen(true);
    }, []);

    const renderActions = useCallback((record: TherapyAssignment) => (
        <div className="flex items-center space-x-3">
            <button title="Edit Duration/Time" onClick={() => handleOpenEdit(record)}>
                <IconEdit className="w-5 h-5 text-amber-500 hover:text-amber-700" />
            </button>
            <button title="Delete" onClick={() => handleOpenDelete(record)}>
                <IconTrash className="w-5 h-5 text-red-500 hover:text-red-700" />
            </button>
        </div>
    ), [handleOpenEdit, handleOpenDelete]);

    const handleExportData = useCallback(() => {
        if (filteredData.length === 0) return;
        const dataToExport = filteredData.map(item => ({
            "Patient Name": item.patientName,
            "Therapy Type": item.therapyName,
            "Cost": item.cost,
            "Therapy Duration/Time": item.duration || "",
        }));
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = { Sheets: { Therapy_Data: ws }, SheetNames: ["Therapy_Data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
        FileSaver.saveAs(blob, "therapy_data.xlsx");
    }, [filteredData]);

    const handleConfirmDelete = useCallback(() => {
        if (recordToDelete) {
            setRecords(prev => prev.filter(r => r.id !== recordToDelete.id));
        }
        setDeleteModalOpen(false);
        setRecordToDelete(null);
    }, [recordToDelete]);

    const handleModalClose = useCallback(() => {
        setModalOpen(false);
        setEditingRecord(null);
    }, []);

    // Only handles single-record duration update
    const handleModalSave = useCallback((data: any) => {
        const { duration } = data as ModalFormData;

        if (editingRecord) {
            setRecords(prevRecords =>
                prevRecords.map(record =>
                    record.id === editingRecord.id ? { ...record, duration: String(duration) } : record
                )
            );
        }

        handleModalClose();
    }, [editingRecord, handleModalClose]);

    // --- Modal Configuration ---

    const getModalFields = (): FieldConfig[] => {
        return [
            // Patient Name (Context, not editable via this config)
            {
                name: "patientName",
                label: "Patient",
                type: "text",
                required: true,
                disabledInEdit: true,
            },
            // Therapy Type (Context, not editable via this config)
            {
                name: "therapyName",
                label: "Therapy Type",
                type: "text",
                required: true,
                disabledInEdit: true,
            },
            // Duration/Time (Editable)
            {
                name: "duration",
                label: "Duration/Time",
                type: "text",
                required: true,
                disabledInEdit: false,
            },
        ];
    };

    const modalInitialData: Partial<ModalFormData> = editingRecord
        ? {
            patientName: editingRecord.patientName,
            therapyName: editingRecord.therapyName,
            duration: editingRecord.duration || ""
        }
        : {
            therapyName: "",
            duration: ""
        };

    // --- Table Columns ---

    const columns: Column<TherapyAssignment>[] = useMemo(() => [
        { Header: "Patient Name", accessor: "patientName" },
        { Header: "Therapy Type", accessor: "therapyName" },
        { Header: "Cost", accessor: "cost" },
        { Header: "Therapy Duration/Time", accessor: "duration" },
        { Header: "Action", accessor: "id", Cell: ({ row }: { row: TherapyAssignment }) => renderActions(row) },
    ], [renderActions]);

    return (
        <>
            {/* Top Navigation (Breadcrumb only) */}
            <div className="flex pb-10 flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <ul className="flex space-x-2 rtl:space-x-reverse">
                    <li>
                        <Link to="#" className="text-green-600 hover:underline">
                            Treatment & Therapy
                        </Link>
                    </li>
                </ul>
                {/* Removed: "Add Duration/Time" button */}
            </div>

            {/* Table */}
            <Table
                columns={columns}
                data={filteredData}
                topContent={
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 w-full">
                        {/* Search Input */}
                        <div className="relative w-full sm:w-60">
                            <input
                                type="text"
                                placeholder="Search Patient or Therapy..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full border-2 border-green-200 dark:border-gray-600 rounded-lg py-2 pl-10 dark:bg-gray-700 dark:text-gray-100 focus:border-green-500 focus:ring-green-500 transition"
                            />
                            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
                        </div>
                        {/* Export Button */}
                        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                            <button
                                onClick={handleExportData}
                                className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                            >
                                <IconDownload className="w-5 h-5 mr-1" /> Export Data
                            </button>
                        </div>
                    </div>
                }
                itemsPerPage={5}
            />

            {/* Edit Duration/Time Modal */}
            <GlobalModal
                title={editingRecord ? `Duration for ${editingRecord.patientName}` : "Duration"}
                isOpen={modalOpen}
                onClose={handleModalClose}
                mode="edit"
                fields={getModalFields()}
                initialData={modalInitialData}
                onSave={handleModalSave}
            />

            {/* Delete Modal */}
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

export default TreatmentDetails;