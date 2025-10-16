import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setPageTitle } from "../../store/themeConfigSlice";
import Table, { Column } from "../../components/Table/Table";
import IconUser from "../../components/Icon/IconUser";
import IconFile from "../../components/Icon/IconFile";
import IconCreditCard from "../../components/Icon/IconCreditCard";

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  uhid: string;
  readyToDischarge: boolean;
}

const mockPatientDatabase: Patient[] = [
  { id: 1, name: "Rakesh Sharma", age: 58, gender: "Male", uhid: "PAT-101", readyToDischarge: true },
  { id: 2, name: "Meena Kumari", age: 65, gender: "Female", uhid: "PAT-102", readyToDischarge: false },
  { id: 3, name: "Arun Das", age: 49, gender: "Male", uhid: "PAT-103", readyToDischarge: true },
];

const DischargeSummaryPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(setPageTitle("Discharge Summary & Billing"));
  }, [dispatch]);

  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const [summary, setSummary] = useState({
    consultation: "Initial consultation revealed high-grade fever and dehydration.",
    diagnosis: "Recovered from viral fever.",
    history: "Patient was admitted with high fever and body aches.",
    hospitalCourse: "Patient was administered IV fluids and antipyretics. Responded well to treatment.",
    significantFindings: "Blood reports are normal. No signs of secondary infection.",
    conditionAtDischarge: "Stable, afebrile, and ambulatory.",
    investigationResults: "CBC: Normal, Platelets: 2.5L",
    treatmentsGiven: "IV Paracetamol, Multivitamins.",
    adviceOnDischarge: "Take rest for 3 days. Follow up after 5 days if symptoms persist.",
    preparedBy: "Dr. Anjali Verma",
    checkedBy: "Dr. Priya Singh",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setSummary((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateBill = () => {
    if (!selectedPatient) return;
    navigate("/invoice", { state: { patient: selectedPatient } });
  };

  const filteredPatients = mockPatientDatabase.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.uhid.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<Patient>[] = [
    { Header: "Patient ID", accessor: "uhid" },
    { Header: "Patient Name", accessor: "name" },
    {
      Header: "Ready to Discharge",
      accessor: "readyToDischarge",
      Cell: ({ value }) => (
        <span className={`font-medium ${value ? "text-green-600" : "text-red-500"}`}>
          {value ? "Yes" : "No"}
        </span>
      ),
    },
    {
      Header: "Action",
      accessor: "uhid",
      Cell: ({ row }) => (
        <button
          className={`px-3 py-1 rounded-md font-medium transition ${
            row.readyToDischarge
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
          disabled={!row.readyToDischarge}
          onClick={() => setSelectedPatient(row)}
        >
          Summary
        </button>
      ),
    },
  ];

  const topContent = (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 w-full">
      <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
        Discharge Summary - Patient List
      </h1>
      <div className="relative w-full sm:w-64">
        <input
          type="text"
          placeholder="Search by Patient Name or UHID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border-2 border-green-200 dark:border-gray-600 rounded-lg py-2 pl-3 pr-3 dark:bg-gray-700 dark:text-gray-100 focus:border-green-500 focus:ring-green-500 transition"
        />
      </div>
    </div>
  );

  if (!selectedPatient) {
    return (
      <div className="panel">
        <Table columns={columns} data={filteredPatients} topContent={topContent} />
      </div>
    );
  }

  const renderTextarea = (label: string, name: keyof typeof summary, rows = 3) => (
    <div>
      <label className="font-semibold text-gray-700 dark:text-gray-200">{label}</label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        value={summary[name]}
        onChange={handleInputChange}
        className="mt-1 w-full rounded-xl border border-transparent bg-gray-100 dark:bg-gray-700 px-4 py-3 shadow-sm hover:shadow-md focus:border-green-400 focus:ring focus:ring-green-200 transition resize-none"
      />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Panel with buttons */}
      <div className="panel flex flex-wrap items-center justify-between gap-4 shadow-md p-4 rounded-md bg-white dark:bg-gray-800">
        <div className="flex items-center gap-2">
          <IconUser />
          <span className="font-semibold text-lg text-gray-800 dark:text-gray-100">
            {selectedPatient.name} ({selectedPatient.uhid})
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="btn btn-success" onClick={handleGenerateBill}>
            <IconCreditCard className="w-5 h-5 ltr:mr-2 rtl:ml-2" /> Generate Bill
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => alert("Summary saved successfully!")}
          >
            <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" /> Save Summary
          </button>
          <button type="button" className="btn btn-success btn-sm" onClick={() => setSelectedPatient(null)}>
            Change Patient
          </button>
        </div>
      </div>

      {/* Summary Form */}
      <div className="panel space-y-6 shadow-md p-4 rounded-md bg-white dark:bg-gray-800">
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderTextarea("Consultation", "consultation")}
            {renderTextarea("Condition at Discharge", "conditionAtDischarge")}
            {renderTextarea("Diagnosis", "diagnosis")}
            {renderTextarea("Investigation Results", "investigationResults")}
            {renderTextarea("History", "history")}
            {renderTextarea("Treatments Given", "treatmentsGiven")}
            {renderTextarea("Hospital Course", "hospitalCourse")}
            {renderTextarea("Advice on Discharge", "adviceOnDischarge")}
            {renderTextarea("Significant Findings", "significantFindings")}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t pt-6">
            <div>
              <label htmlFor="preparedBy" className="font-semibold text-gray-700 dark:text-gray-200">
                Summary Prepared by
              </label>
              <input
                id="preparedBy"
                name="preparedBy"
                type="text"
                className="form-input mt-1 rounded-xl px-4 py-2"
                value={summary.preparedBy}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="checkedBy" className="font-semibold text-gray-700 dark:text-gray-200">
                Summary Checked by
              </label>
              <input
                id="checkedBy"
                name="checkedBy"
                type="text"
                className="form-input mt-1 rounded-xl px-4 py-2"
                value={summary.checkedBy}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DischargeSummaryPage;
