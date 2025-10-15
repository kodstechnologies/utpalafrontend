import React, { useState, useEffect } from "react";
import { patients, doctors, therapists, therapies, wardCosts } from "./dummy/dummyData";

interface TherapyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (data: {
        patient?: string;
        therapyType?: string;
        ward?: string;
        cost?: number;
        doctor?: string;
        therapist?: string;
        id?: number;
    }) => void;
    data?: {
        id?: number;
        patient?: string;
        therapyType?: string;
        ward?: string;
        cost?: number;
        doctor?: string;
        therapist?: string;
    };
}

const TherapyModal: React.FC<TherapyModalProps> = ({ isOpen, onClose, onAdd, data }) => {
    const [patient, setPatient] = useState("");
    const [therapyType, setTherapyType] = useState("");
    const [ward, setWard] = useState("");
    const [cost, setCost] = useState(0);
    const [doctor, setDoctor] = useState("");
    const [therapist, setTherapist] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);


    // Populate fields if editing
    useEffect(() => {
        if (data) {
            setPatient(data.patient || "");
            setTherapyType(data.therapyType || "");
            setWard(data.ward || "");
            setCost(data.cost || 0);
            setDoctor(data.doctor || "");
            setTherapist(data.therapist || "");
        }
    }, [data]);

    useEffect(() => {
        setCost(ward ? wardCosts[ward] || 0 : 0);
    }, [ward]);

    const handleAdd = () => {
        onAdd({
            id: data?.id, // pass id if editing
            patient: patient || undefined,
            therapyType: therapyType || undefined,
            ward: ward || undefined,
            cost: cost || undefined,
            doctor: doctor || undefined,
            therapist: therapist || undefined,
        });
        // Reset fields
        setPatient(""); setTherapyType(""); setWard(""); setDoctor(""); setTherapist(""); setCost(0);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-white dark:bg-gray-800 w-full max-w-md p-6 rounded-2xl shadow-xl relative animate-fade-in">
                {/* Header */}
                <div className="flex justify-between items-center mb-5 border-b border-gray-200 dark:border-gray-700 pb-2">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        {data ? "Edit Therapy" : "Add Therapy"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition text-xl font-bold"
                    >
                        &times;
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    {/* Patient */}
                    <div className="flex flex-col relative">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Patient
                        </label>
                        <input
                            type="text"
                            value={patient}
                            onChange={(e) => {
                                setPatient(e.target.value);
                                setShowDropdown(!!e.target.value);
                            }}
                            onFocus={() => setShowDropdown(!!patient)}
                            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                            placeholder="Search patient by name or ID"
                            className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-700 dark:text-gray-100 transition"
                        />

                        {showDropdown && (
                            <ul className="absolute z-10 top-full left-0 right-0 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 max-h-40 overflow-auto shadow-lg">
                                {patients
                                    .filter((p) =>
                                        `${p.id} - ${p.name}`.toLowerCase().includes(patient.toLowerCase())
                                    )
                                    .map((p) => (
                                        <li
                                            key={p.id}
                                            onMouseDown={() => {
                                                setPatient(`${p.id} - ${p.name}`);
                                                setShowDropdown(false);
                                            }}
                                            className="p-2 cursor-pointer hover:bg-green-100 dark:hover:bg-green-600"
                                        >
                                            {p.id} - {p.name}
                                        </li>
                                    ))}
                                {patients.filter((p) =>
                                    `${p.id} - ${p.name}`.toLowerCase().includes(patient.toLowerCase())
                                ).length === 0 && (
                                        <li className="p-2 text-gray-500 dark:text-gray-300">
                                            No matches found
                                        </li>
                                    )}
                            </ul>
                        )}
                    </div>




                    {/* Therapy Type */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Therapy Type</label>
                        <select
                            value={therapyType}
                            onChange={(e) => setTherapyType(e.target.value)}
                            className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-700 dark:text-gray-100 transition"
                        >
                            <option value="">Select Therapy Type</option>
                            {therapies.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>

                    {/* Ward */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ward</label>
                        <select
                            value={ward}
                            onChange={(e) => setWard(e.target.value)}
                            className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-700 dark:text-gray-100 transition"
                        >
                            <option value="">Select Ward</option>
                            <option value="general">General</option>
                            <option value="special">Special</option>
                            <option value="delux">Delux</option>
                        </select>
                    </div>

                    {/* Cost */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cost</label>
                        <input
                            value={cost || ""}
                            readOnly
                            placeholder="Cost"
                            className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-gray-100 dark:bg-gray-700 dark:text-gray-100 cursor-not-allowed"
                        />
                    </div>

                    {/* Doctor */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assign Doctor</label>
                        <select
                            value={doctor}
                            onChange={(e) => setDoctor(e.target.value)}
                            className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-700 dark:text-gray-100 transition"
                        >
                            <option value="">Select Doctor</option>
                            {doctors.map((d) => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>

                    {/* Therapist */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assign Therapist</label>
                        <select
                            value={therapist}
                            onChange={(e) => setTherapist(e.target.value)}
                            className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-700 dark:text-gray-100 transition"
                        >
                            <option value="">Select Therapist</option>
                            {therapists.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 mt-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAdd}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                        >
                            {data ? "Update Therapy" : "Add Therapy"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TherapyModal;
