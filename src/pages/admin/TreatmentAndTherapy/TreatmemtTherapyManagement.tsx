import React, { useState, useMemo, useCallback } from "react";
import Table, { Column } from "../../../components/Table/Table";
import TherapyModal from "./TherapyModal";
import IconSearch from "../../../components/Icon/IconSearch";
import IconDownload from "../../../components/Icon/IconDownload";
import IconTrash from "../../../components/Icon/IconTrash";
import IconEye from "../../../components/Icon/IconEye";
import IconEdit from "../../../components/Icon/IconEdit";
import IconPlus from "../../../components/Icon/IconPlus";
import FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { Link, useNavigate } from "react-router-dom";

interface TherapyRecord {
    id: number;
    patient?: string;
    therapyType?: string;
    ward?: string;
    cost?: number;
    doctor?: string;
    therapist?: string;
}

const TherapyManagementPage = () => {
    const [records, setRecords] = useState<TherapyRecord[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<TherapyRecord | null>(null);
    const [search, setSearch] = useState("");
    const navigate = useNavigate()

    const handleView = (therapy: TherapyRecord) => {
        navigate(`/patient-therapy/${therapy.id}`);
    };


    // Updated add or update function
    const handleAddOrUpdate = (data: {
        patient?: string;
        therapyType?: string;
        ward?: string;
        cost?: number;
        doctor?: string;
        therapist?: string;
        id?: number;
    }) => {
        if (data.id) {
            // Update existing record
            setRecords((prev) =>
                prev.map((r) => (r.id === data.id ? { ...r, ...data } : r))
            );
        } else {
            // Add new record
            const newId = records.length ? Math.max(...records.map(r => r.id)) + 1 : 1;
            setRecords((prev) => [...prev, { ...data, id: newId } as TherapyRecord]);
        }
        setEditingRecord(null);
        setModalOpen(false);
    };


    const filteredData = useMemo(
        () =>
            records.filter((r) =>
                r.patient?.toLowerCase().includes(search.toLowerCase() || "")
            ),
        [records, search]
    );

    const columns: Column<TherapyRecord>[] = useMemo(
        () => [
            { Header: "Patient", accessor: "patient" },
            { Header: "Therapy Type", accessor: "therapyType" },
            { Header: "Ward", accessor: "ward" },
            { Header: "Cost", accessor: "cost" },
            { Header: "Doctor", accessor: "doctor" },
            { Header: "Therapist", accessor: "therapist" },
        ],
        []
    );

    const handleExportData = useCallback(() => {
        const dataToExport = filteredData.map((item) => ({
            Patient: item.patient,
            "Therapy Type": item.therapyType,
            Ward: item.ward,
            Cost: item.cost,
            Doctor: item.doctor,
            Therapist: item.therapist,
        }));
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = { Sheets: { "Therapy_Data": ws }, SheetNames: ["Therapy_Data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], {
            type:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        });
        FileSaver.saveAs(blob, "therapy_data.xlsx");
    }, [filteredData]);

    // Handlers for table actions
    const handleEdit = (record: TherapyRecord) => {
        setEditingRecord(record);
        setModalOpen(true);
    };

    const handleDeleteClick = (record: TherapyRecord) => {
        if (confirm("Are you sure you want to delete this record?")) {
            setRecords((prev) => prev.filter((r) => r.id !== record.id));
        }
    };

    const renderTopContent = () => (
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

    const renderActions = (therapy: TherapyRecord) => (
        <div className="flex items-center space-x-3">
            <button onClick={() => handleView(therapy)} title="View" ><IconEye className="w-5 h-5 text-blue-500 hover:text-blue-700" /></button>
            <button
                title="Edit"
                onClick={() => handleEdit(therapy)}
            >
                <IconEdit className="w-5 h-5 text-amber-500 hover:text-amber-700" />
            </button>
            <button
                title="Delete"
                onClick={() => handleDeleteClick(therapy)}
            >
                <IconTrash className="w-5 h-5 text-red-500 hover:text-red-700" />
            </button>
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
                    <span className="ml-2 ">Add Therapy</span>
                </button>
            </div>

            <Table
                columns={columns}
                data={filteredData}
                actions={renderActions}
                topContent={renderTopContent()}
                itemsPerPage={5}
            />

            <TherapyModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onAdd={handleAddOrUpdate}
                data={editingRecord || undefined}
            />
        </>
    );
};

export default TherapyManagementPage;
