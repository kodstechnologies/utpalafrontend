import React, { useState, useMemo, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import Table, { Column } from "../../../components/Table/Table";
import IconEye from "../../../components/Icon/IconEye";
import IconEdit from "../../../components/Icon/IconEdit";
import IconTrash from "../../../components/Icon/IconTrash";
import IconDownload from "../../../components/Icon/IconDownload";
import IconSearch from "../../../components/Icon/IconSearch";
import IconPlus from "../../../components/Icon/IconPlus";
import FileSaver from "file-saver";
import * as XLSX from "xlsx";
import GlobalModal, { FieldConfig } from "../../../components/Modal/GlobalModal";
import DeleteModal from "../../../components/DeleteModal";

interface TherapyRecord {
    id: number;
    patient?: string;
    therapyType?: string;
    ward?: string;
    cost?: number;
    therapist?: string;
}

const TherapyManagementPage: React.FC = () => {
    const navigate = useNavigate();

    const [records, setRecords] = useState<TherapyRecord[]>([]);
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<TherapyRecord | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState<TherapyRecord | null>(null);

    const therapyFields: FieldConfig[] = [
        { name: "patient", label: "Patient", type: "text", required: true },
        { name: "therapyType", label: "Therapy Type", type: "text", required: true },
        { name: "ward", label: "Ward", type: "text" },
        { name: "cost", label: "Cost", type: "number" },
        { name: "therapist", label: "Therapist", type: "text" },
    ];

    const filteredData = useMemo(
        () =>
            records.filter((r) =>
                r.patient?.toLowerCase().includes(search.toLowerCase() || "")
            ),
        [records, search]
    );

    const columns: Column<TherapyRecord>[] = [
        { Header: "Patient", accessor: "patient" },
        { Header: "Therapy Type", accessor: "therapyType" },
        { Header: "Ward", accessor: "ward" },
        { Header: "Cost", accessor: "cost" },
        { Header: "Therapist", accessor: "therapist" },
    ];

    const renderActions = (record: TherapyRecord) => (
        <div className="flex items-center space-x-3">
            <button
                title="View"
                onClick={() => navigate(`/patient-therapy/${record.id}`)}
            >
                <IconEye className="w-5 h-5 text-blue-500 hover:text-blue-700" />
            </button>
            <button
                title="Edit"
                onClick={() => {
                    setEditingRecord(record);
                    setModalOpen(true);
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

    const handleExportData = useCallback(() => {
        const dataToExport = filteredData.map((item) => ({
            Patient: item.patient,
            "Therapy Type": item.therapyType,
            Ward: item.ward || "N/A",
            Cost: item.cost || "N/A",
            Therapist: item.therapist || "N/A",
        }));

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = { Sheets: { Therapy_Data: ws }, SheetNames: ["Therapy_Data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], {
            type:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        });
        FileSaver.saveAs(blob, "therapy_data.xlsx");
    }, [filteredData]);

    const handleConfirmDelete = () => {
        if (recordToDelete) {
            setRecords((prev) => prev.filter((r) => r.id !== recordToDelete.id));
        }
        setDeleteModalOpen(false);
        setRecordToDelete(null);
    };

    const topContent = (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 w-full">
            <div className="relative w-full sm:w-60">
                <input
                    type="text"
                    placeholder="Search Patient..."
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

    return (
        <>
            <div className="flex pb-10 flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <ul className="flex space-x-2 rtl:space-x-reverse">
                    <li>
                        <Link to="#" className="text-green-600 hover:underline">
                            Treatment & Therapy
                        </Link>
                    </li>
                </ul>

                <button
                    type="button"
                    onClick={() => {
                        setEditingRecord(null);
                        setModalOpen(true);
                    }}
                    className="flex items-center justify-center px-4 py-2 bg-green-700 text-white font-semibold rounded-lg shadow-md hover:bg-green-800 transition-colors duration-150 w-full md:w-auto"
                >
                    <IconPlus />
                    <span className="ml-2">Add Therapy</span>
                </button>
            </div>

            <Table
                columns={columns}
                data={filteredData}
                actions={renderActions}
                topContent={topContent}
                itemsPerPage={5}
            />

            <GlobalModal
                title="Therapy"
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditingRecord(null);
                }}
                mode={editingRecord ? "edit" : "create"}
                fields={therapyFields}
                initialData={editingRecord || undefined}
                onSave={(data) => {
                    if (editingRecord) {
                        setRecords((prev) =>
                            prev.map((r) => (r.id === editingRecord.id ? { ...editingRecord, ...data } : r))
                        );
                    } else {
                        setRecords((prev) => [...prev, { ...data, id: Date.now() }]);
                    }
                    setModalOpen(false);
                    setEditingRecord(null);
                }}
            />

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

export default TherapyManagementPage;
