import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Table, { Column } from "../../../components/Table/Table";
import IconSearch from "../../../components/Icon/IconSearch";
import IconDownload from "../../../components/Icon/IconDownload";
import FileSaver from "file-saver";
import * as XLSX from "xlsx";

interface Patient {
    id: number;
    patientId: string;
    patientName: string;
    consultingDoctor: string;
    admissionDate: string;
    dischargeDate: string;
}

const DischargeReport: React.FC = () => {
    const [search, setSearch] = useState("");

    // ✅ Dummy patient data
    const [patients] = useState<Patient[]>([
        {
            id: 1,
            patientId: "P1001",
            patientName: "Amit Sharma",
            consultingDoctor: "Dr. Priya Sharma",
            admissionDate: "2025-10-12",
            dischargeDate: "2025-10-15",
        },
        {
            id: 2,
            patientId: "P1002",
            patientName: "Neha Verma",
            consultingDoctor: "Dr. Ramesh Kumar",
            admissionDate: "2025-10-10",
            dischargeDate: "2025-10-14",
        },
        {
            id: 3,
            patientId: "P1003",
            patientName: "Rohit Singh",
            consultingDoctor: "Dr. Kavita Mehra",
            admissionDate: "2025-10-08",
            dischargeDate: "2025-10-11",
        },
    ]);

    // ✅ Filter by patient name or ID
    const filteredPatients = useMemo(
        () =>
            patients.filter(
                (p) =>
                    p.patientName.toLowerCase().includes(search.toLowerCase()) ||
                    p.patientId.toLowerCase().includes(search.toLowerCase())
            ),
        [patients, search]
    );

    // ✅ Table columns
    const columns: Column<Patient>[] = [
        { Header: "Patient ID", accessor: "patientId" },
        { Header: "Patient Name", accessor: "patientName" },
        { Header: "Consulting Doctor", accessor: "consultingDoctor" },
        { Header: "Admission Date", accessor: "admissionDate" },
        { Header: "Discharge Date", accessor: "dischargeDate" },
    ];

    // ✅ Export to Excel
    const handleExportData = () => {
        const dataToExport = filteredPatients.map((p) => ({
            "Patient ID": p.patientId,
            "Patient Name": p.patientName,
            "Consulting Doctor": p.consultingDoctor,
            "Admission Date": p.admissionDate,
            "Discharge Date": p.dischargeDate,
        }));
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = { Sheets: { Admission_Report: ws }, SheetNames: ["Admission_Report"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        });
        FileSaver.saveAs(blob, "admission_report.xlsx");
    };

    // ✅ Top bar: search + export
    const topContent = (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 w-full">
            <div className="relative w-full sm:w-60">
                <input
                    type="text"
                    placeholder="Search by Patient ID or Name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border-2 border-green-200 dark:border-gray-600 rounded-lg py-2 pl-10 dark:bg-gray-700 dark:text-gray-100 focus:border-green-500 focus:ring-green-500 transition"
                />
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
            </div>

            <button
                onClick={handleExportData}
                className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
                <IconDownload className="w-5 h-5 mr-1" /> Export Data
            </button>
        </div>
    );

    return (
        <>
            {/* Breadcrumbs */}
            <div className="flex pb-10 flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <ul className="flex space-x-2 rtl:space-x-reverse">
                    <li>
                        <Link to="#" className="text-green-600 hover:underline">
                            Report & Analytics
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span>Discharge Report</span>
                    </li>
                </ul>
            </div>

            {/* Table */}
            <Table columns={columns} data={filteredPatients} topContent={topContent} />
        </>
    );
};

export default DischargeReport;
