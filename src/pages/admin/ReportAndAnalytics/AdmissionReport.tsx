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
    mobileNo: string;
    admissionDate: string;
}

const AdmissionReport: React.FC = () => {
    const [search, setSearch] = useState("");

    // ✅ Dummy patient data
    const [patients] = useState<Patient[]>([
        {
            id: 1,
            patientId: "P1001",
            patientName: "Amit Sharma",
            mobileNo: "9876543210",
            admissionDate: "2025-10-12",
        },
        {
            id: 2,
            patientId: "P1002",
            patientName: "Neha Verma",
            mobileNo: "8765432109",
            admissionDate: "2025-10-10",
        },
        {
            id: 3,
            patientId: "P1003",
            patientName: "Rohit Singh",
            mobileNo: "9123456780",
            admissionDate: "2025-10-08",
        },
    ]);

    // ✅ Filter by name or ID
    const filteredPatients = useMemo(
        () =>
            patients.filter(
                (p) =>
                    p.patientName.toLowerCase().includes(search.toLowerCase()) ||
                    p.patientId.toLowerCase().includes(search.toLowerCase())
            ),
        [patients, search]
    );

    // ✅ Columns for the table
    const columns: Column<Patient>[] = [
        { Header: "Patient ID", accessor: "patientId" },
        { Header: "Patient Name", accessor: "patientName" },
        { Header: "Mobile No", accessor: "mobileNo" },
        { Header: "Admission Date", accessor: "admissionDate" },
    ];

    // ✅ Export to Excel
    const handleExportData = () => {
        const dataToExport = filteredPatients.map((p) => ({
            "Patient ID": p.patientId,
            "Patient Name": p.patientName,
            "Mobile No": p.mobileNo,
            "Admission Date": p.admissionDate,
        }));
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = { Sheets: { Patient_Data: ws }, SheetNames: ["Patient_Data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        });
        FileSaver.saveAs(blob, "patient_data.xlsx");
    };

    // ✅ Top content bar (Search + Export)
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
                        <span>Admission List</span>
                    </li>
                </ul>
            </div>

            {/* Patient Table */}
            <Table columns={columns} data={filteredPatients} topContent={topContent} />
        </>
    );
};

export default AdmissionReport;
