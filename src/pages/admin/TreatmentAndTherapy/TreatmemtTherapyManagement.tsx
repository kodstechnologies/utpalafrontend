import React, { useState, useMemo } from "react";
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

interface TherapyMaster {
    id: number;
    therapyName: string;
    cost: number;
}

interface TherapyAssignment {
    id: number;
    therapyId: number;
    therapyName: string;
    cost: number;
    therapist: string | undefined;
}

const TherapyManagementPage: React.FC = () => {
    const navigate = useNavigate();

    const [therapyMasterList, setTherapyMasterList] = useState<TherapyMaster[]>([]);
    const [records, setRecords] = useState<TherapyAssignment[]>([]);
    const [search, setSearch] = useState("");

    const [addTherapyModalOpen, setAddTherapyModalOpen] = useState(false);
    const [assignTherapistModalOpen, setAssignTherapistModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<TherapyAssignment | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState<TherapyAssignment | null>(null);

    // Parent state to control Assign Therapist modal form
    const [assignFormData, setAssignFormData] = useState<{
        therapyId?: number;
        cost?: number;
        therapist?: string;
    }>({});


    // Add Therapy Fields
    const addTherapyFields: FieldConfig[] = [
        { name: "therapyName", label: "Therapy Name", type: "text", required: true },
        { name: "cost", label: "Cost", type: "number", required: true },
    ];


    const filteredData = useMemo(
        () =>
            records.filter(
                r =>
                    r.therapyName.toLowerCase().includes(search.toLowerCase()) ||
                    r.therapist?.toLowerCase().includes(search.toLowerCase())
            ),
        [records, search]
    );

    const columns: Column<TherapyAssignment>[] = [
        { Header: "Therapy Type", accessor: "therapyName" },
        { Header: "Therapist", accessor: "therapist" },
        { Header: "Cost", accessor: "cost" },
    ];

    const renderActions = (record: TherapyAssignment) => (
        <div className="flex items-center space-x-3">
            <button title="View" onClick={() => navigate(`/patient-therapy/${record.id}`)}>
                <IconEye className="w-5 h-5 text-blue-500 hover:text-blue-700" />
            </button>
            <button
                title="Edit"
                onClick={() => {
                    setEditingRecord(record);
                    setAssignFormData({ therapyId: record.therapyId, cost: record.cost, therapist: record.therapist });
                    setAssignTherapistModalOpen(true);
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

    const handleExportData = () => {
        if (records.length === 0) return;
        const dataToExport = filteredData.map(item => ({
            "Therapy Type": item.therapyName,
            Therapist: item.therapist,
            Cost: item.cost,
        }));
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = { Sheets: { Therapy_Data: ws }, SheetNames: ["Therapy_Data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
        FileSaver.saveAs(blob, "therapy_data.xlsx");
    };

    const handleConfirmDelete = () => {
        if (recordToDelete) setRecords(prev => prev.filter(r => r.id !== recordToDelete.id));
        setDeleteModalOpen(false);
        setRecordToDelete(null);
    };

    return (
        <>
            {/* Top Buttons */}
            <div className="flex pb-10 flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <ul className="flex space-x-2 rtl:space-x-reverse">
                    <li>
                        <Link to="#" className="text-green-600 hover:underline">
                            Treatment & Therapy
                        </Link>
                    </li>
                </ul>
                <div className="flex space-x-3 w-full md:w-auto">
                    <button
                        type="button"
                        onClick={() => setAddTherapyModalOpen(true)}
                        className="flex items-center justify-center px-4 py-2 bg-green-700 text-white font-semibold rounded-lg shadow-md hover:bg-green-800 transition-colors duration-150"
                    >
                        <IconPlus />
                        <span className="ml-2">Add Therapy</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setAssignTherapistModalOpen(true)}
                        className="flex items-center justify-center px-4 py-2 bg-green-700 text-white font-semibold rounded-lg shadow-md hover:bg-green-800 transition-colors duration-150"
                    >
                        <IconPlus />
                        <span className="ml-2">Assign Therapist</span>
                    </button>
                </div>
            </div>

            {/* Table */}
            <Table
                columns={columns}
                data={filteredData}
                actions={renderActions}
                topContent={
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 w-full">
                        <div className="relative w-full sm:w-60">
                            <input
                                type="text"
                                placeholder="Search Therapy or Therapist..."
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
                }
                itemsPerPage={5}
            />

            {/* Add Therapy Modal */}
            <GlobalModal
                title="Therapy"
                isOpen={addTherapyModalOpen}
                onClose={() => setAddTherapyModalOpen(false)}
                mode="create"
                fields={addTherapyFields}
                onSave={(data) => {
                    const newTherapy: TherapyMaster = {
                        id: Date.now(),
                        therapyName: String((data as any).therapyName),
                        cost: Number((data as any).cost),
                    };
                    setTherapyMasterList((prev) => [...prev, newTherapy]);
                    setAddTherapyModalOpen(false);
                }}
            />
            <GlobalModal
                title={editingRecord ? "Assignment" : "Therapist"}
                isOpen={assignTherapistModalOpen}
                onClose={() => {
                    setAssignTherapistModalOpen(false);
                    setEditingRecord(null);
                    setAssignFormData({});
                }}
                mode={editingRecord ? "edit" : "create"}
                fields={[
                    {
                        name: "therapyId",
                        label: "Therapy Type",
                        type: "select",
                        options: therapyMasterList.map(t => ({ value: String(t.id), label: t.therapyName })),
                        required: true,
                        customRender: (value, onChange) => (
                            <select
                                value={assignFormData.therapyId || ""}
                                onChange={(e) => {
                                    const id = Number(e.target.value);
                                    const therapy = therapyMasterList.find(t => t.id === id);
                                    if (!therapy) return;
                                    setAssignFormData({ ...assignFormData, therapyId: id, cost: therapy.cost });
                                    onChange(id); // updates modal internal formData too
                                }}
                                className="w-full rounded-lg border px-3 py-2"
                            >
                                <option value="">Select Therapy</option>
                                {therapyMasterList.map(t => (
                                    <option key={t.id} value={t.id}>{t.therapyName}</option>
                                ))}
                            </select>
                        ),
                    },
                    {
                        name: "cost",
                        label: "Cost",
                        type: "number",
                        required: true,
                        customRender: () => (
                            <input
                                type="number"
                                value={assignFormData.cost || ""}
                                disabled
                                className="w-full rounded-lg border px-3 py-2 bg-gray-100"
                            />
                        ),
                    },
                    {
                        name: "therapist",
                        label: "Therapist",
                        type: "select",
                        options: ["John Doe", "Jane Smith", "Mark Lee"],
                        required: true,
                    },
                ]}
                initialData={editingRecord || assignFormData}
                onSave={(data) => {
                    const therapy = therapyMasterList.find(t => t.id === Number(assignFormData.therapyId));
                    if (!therapy) return;

                    const newRecord: TherapyAssignment = {
                        id: editingRecord ? editingRecord.id : Date.now(),
                        therapyId: therapy.id,
                        therapyName: therapy.therapyName,
                        cost: therapy.cost,
                        therapist: data.therapist,
                    };

                    if (editingRecord) {
                        setRecords(prev => prev.map(r => r.id === editingRecord.id ? newRecord : r));
                    } else {
                        setRecords(prev => [...prev, newRecord]);
                    }

                    setAssignTherapistModalOpen(false);
                    setEditingRecord(null);
                    setAssignFormData({});
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
