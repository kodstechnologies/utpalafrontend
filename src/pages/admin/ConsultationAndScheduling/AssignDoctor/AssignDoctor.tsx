import React, { useState, useMemo, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import Table, { Column } from "../../../../components/Table/Table";
import IconEdit from "../../../../components/Icon/IconEdit";
import IconTrash from "../../../../components/Icon/IconTrash";
import IconDownload from "../../../../components/Icon/IconDownload";
import IconSearch from "../../../../components/Icon/IconSearch";
import FileSaver from "file-saver";
import * as XLSX from "xlsx";
import DeleteModal from "../../../../components/DeleteModal";
import IconPlus from "../../../../components/Icon/IconPlus";
import GlobalModal, { FieldConfig } from "../../../../components/Modal/GlobalModal";

interface Doctor {
    id: number;
    name: string;
    day: string;
    startTime: string;
    endTime: string;
    availableSlots: number;
}

interface Assignment {
    id: number;
    doctorId: number;
    doctorName: string;
    patients: string[];
    day: string;
    startTime: string;
    endTime: string;
    availableSlots: number;
}

const AssignDoctor: React.FC = () => {
    const navigate = useNavigate();

    // Predefined doctors
    const [doctors] = useState<Doctor[]>([
        { id: 1, name: "Dr. Priya Sharma", day: "Monday", startTime: "10:00 AM", endTime: "11:00 AM", availableSlots: 5 },
        { id: 2, name: "Dr. Ramesh Kumar", day: "Tuesday", startTime: "12:00 PM", endTime: "01:00 PM", availableSlots: 2 },
        { id: 3, name: "Dr. Priya Sharma", day: "Monday", startTime: "10:00 AM", endTime: "11:00 AM", availableSlots: 5 },
    ]);

    // Doctor-patient assignments
    const [assignments, setAssignments] = useState<Assignment[]>([]);

    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Assignment | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [assignmentToDelete, setAssignmentToDelete] = useState<Assignment | null>(null);

    const assignmentFields: FieldConfig[] = [
        {
            name: "doctorId",
            label: "Doctor",
            type: "select",
            options: doctors.map((d) => ({ value: String(d.id), label: d.name })),
            required: true,
        },
        { name: "patientName", label: "Patient Name", type: "text", required: true },
    ];

    const filteredAssignments = useMemo(
        () =>
            assignments.filter((a) => {
                const patientStr = a.patients.join(", ").toLowerCase();
                return (
                    a.doctorName.toLowerCase().includes(search.toLowerCase()) ||
                    patientStr.includes(search.toLowerCase())
                );
            }),
        [assignments, search]
    );

    const columns: Column<Assignment>[] = [
        { Header: "Doctor", accessor: "doctorName" },
        {
            Header: "Patients",
            accessor: "patients",
            Cell: ({ row }) => row.patients.join(", "),
        },
        { Header: "Day", accessor: "day" },
        {
            Header: "Time",
            accessor: "startTime",
            Cell: ({ row }) => `${row.startTime} - ${row.endTime}`,
        },
        { Header: "Available Slots", accessor: "availableSlots" },
    ];

    const renderActions = (row: Assignment) => (
        <div className="flex items-center space-x-3">
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
                    setAssignmentToDelete(row);
                    setDeleteModalOpen(true);
                }}
            >
                <IconTrash className="w-5 h-5 text-red-500 hover:text-red-700" />
            </button>
        </div>
    );

    const handleExportData = useCallback(() => {
        const dataToExport = filteredAssignments.map((a) => ({
            Doctor: a.doctorName,
            Patients: a.patients.join(", "),
            Day: a.day,
            Time: `${a.startTime} - ${a.endTime}`,
            "Available Slots": a.availableSlots,
        }));
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = { Sheets: { Assignment_Data: ws }, SheetNames: ["Assignment_Data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        });
        FileSaver.saveAs(blob, "assignments_data.xlsx");
    }, [filteredAssignments]);

    const handleConfirmDelete = () => {
        if (assignmentToDelete) {
            setAssignments((prev) => prev.filter((a) => a.id !== assignmentToDelete.id));
        }
        setDeleteModalOpen(false);
        setAssignmentToDelete(null);
    };

    const topContent = (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 w-full">
            <div className="relative w-full sm:w-60">
                <input
                    type="text"
                    placeholder="Search Doctor or Patient..."
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
                            Consultation & Scheduling
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span>Assign Doctors</span>
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
                    <span className="ml-2">Assign Doctor</span>
                </button>
            </div>

            <Table
                columns={columns}
                data={filteredAssignments}
                actions={renderActions}
                topContent={topContent}
            />

            <GlobalModal
                title="Assignment"
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditing(null);
                }}
                mode={editing ? "edit" : "create"}
                fields={assignmentFields}
                initialData={
                    editing
                        ? { doctorId: editing.doctorId, patientName: "" }
                        : { doctorId: undefined, patientName: "" }
                }
                onSave={(data: any) => {
                    const doctor = doctors.find((d) => d.id === Number(data.doctorId));
                    if (!doctor) return;

                    if (editing) {
                        // If editing, update patients list for the doctor
                        setAssignments((prev) =>
                            prev.map((a) =>
                                a.id === editing.id
                                    ? { ...a, patients: [...a.patients, data.patientName] }
                                    : a
                            )
                        );
                    } else {
                        // Check if doctor already has an assignment
                        const existing = assignments.find((a) => a.doctorId === doctor.id);
                        if (existing) {
                            existing.patients.push(data.patientName);
                            setAssignments([...assignments]);
                        } else {
                            setAssignments((prev) => [
                                ...prev,
                                {
                                    id: Date.now(),
                                    doctorId: doctor.id,
                                    doctorName: doctor.name,
                                    patients: [data.patientName],
                                    day: doctor.day,
                                    startTime: doctor.startTime,
                                    endTime: doctor.endTime,
                                    availableSlots: doctor.availableSlots,
                                },
                            ]);
                        }


                    }

                    setModalOpen(false);
                    setEditing(null);
                }}
            />

            <DeleteModal
                isOpen={deleteModalOpen}
                onConfirm={handleConfirmDelete}
                onCancel={() => {
                    setDeleteModalOpen(false);
                    setAssignmentToDelete(null);
                }}
            />
        </>
    );
};

export default AssignDoctor;
