"use client";
import React, { useState, useEffect } from "react";

type Doctor = { id: number; name: string; specialization: string };
type Patient = { id: number; name: string };

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (slot: any) => void;
    data?: any;
    doctors?: Doctor[];
    patients?: Patient[];
};

const wards = ["General", "Special", "Deluxe"];
const dummyDoctors: Doctor[] = [
    { id: 1, name: "Dr. Priya Sharma", specialization: "Cardiology" },
    { id: 2, name: "Dr. Ramesh Kumar", specialization: "Neurology" },
    { id: 3, name: "Dr. Anjali Verma", specialization: "Pediatrics" },
];

const dummyPatients: Patient[] = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Michael Johnson" },
];

const ConsultationSchedulingModal: React.FC<Props> = ({
    isOpen,
    onClose,
    onSave,
    data,
    doctors = dummyDoctors,
    patients = dummyPatients,
}) => {
    const [slot, setSlot] = useState({
        id: 0,
        doctorId: 0,
        doctorName: "",
        specialization: "",
        ward: "",
        patientId: 0,
        patientName: "",
        day: "",
        startTime: "",
        endTime: "",
        availableSlots: 1,
    });

    const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
    const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
    const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);
    const [showPatientDropdown, setShowPatientDropdown] = useState(false);

    useEffect(() => {
        if (data) setSlot({ ...data });
    }, [data]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSlot((prev) => ({ ...prev, [name]: value }));

        if (name === "doctorName") {
            const filtered = doctors.filter(
                (d) => d.name.toLowerCase().includes(value.toLowerCase()) || d.id.toString() === value
            );
            setFilteredDoctors(filtered);
            setShowDoctorDropdown(filtered.length > 0);
        }

        if (name === "patientName") {
            const filtered = patients.filter(
                (p) => p.name.toLowerCase().includes(value.toLowerCase()) || p.id.toString() === value
            );
            setFilteredPatients(filtered);
            setShowPatientDropdown(filtered.length > 0);
        }
    };

    const handleSelectDoctor = (doctor: Doctor) => {
        setSlot((prev) => ({
            ...prev,
            doctorId: doctor.id,
            doctorName: doctor.name,
            specialization: doctor.specialization,
        }));
        setShowDoctorDropdown(false);
    };

    const handleSelectPatient = (patient: Patient) => {
        setSlot((prev) => ({ ...prev, patientId: patient.id, patientName: patient.name }));
        setShowPatientDropdown(false);
    };

    const handleSubmit = () => {
        if (!slot.doctorName || !slot.day) return alert("Please fill all required fields!");
        onSave(slot);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-3xl p-6 shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {data ? "Edit Consultation Slot" : "Add Consultation Slot"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>

                {/* Form */}
                <form className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Doctor */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Doctor</label>
                            <input
                                type="text"
                                name="doctorName"
                                value={slot.doctorName}
                                onChange={handleChange}
                                placeholder="Search by name or ID"
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 shadow-sm px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                                autoComplete="off"
                            />
                            {showDoctorDropdown && filteredDoctors.length > 0 && (
                                <ul className="absolute z-10 w-full max-h-40 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded mt-1 shadow-lg">
                                    {filteredDoctors.map((doc) => (
                                        <li
                                            key={doc.id}
                                            onClick={() => handleSelectDoctor(doc)}
                                            className="px-3 py-2 hover:bg-green-100 dark:hover:bg-gray-700 cursor-pointer text-sm flex justify-between"
                                        >
                                            <span>{doc.name}</span>
                                            <span className="text-gray-500 dark:text-gray-300">{doc.specialization}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Ward */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ward</label>
                            <select
                                name="ward"
                                value={slot.ward}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 shadow-sm px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                            >
                                <option value="">Select Ward</option>
                                {wards.map((w) => (
                                    <option key={w} value={w}>{w}</option>
                                ))}
                            </select>
                        </div>

                        {/* Patient */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Patient</label>
                            <input
                                type="text"
                                name="patientName"
                                value={slot.patientName}
                                onChange={handleChange}
                                placeholder="Search patient"
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 shadow-sm px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                                autoComplete="off"
                            />
                            {showPatientDropdown && filteredPatients.length > 0 && (
                                <ul className="absolute z-10 w-full max-h-40 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded mt-1 shadow-lg">
                                    {filteredPatients.map((p) => (
                                        <li
                                            key={p.id}
                                            onClick={() => handleSelectPatient(p)}
                                            className="px-3 py-2 hover:bg-green-100 dark:hover:bg-gray-700 cursor-pointer text-sm"
                                        >
                                            {p.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Day */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Day</label>
                            <select
                                name="day"
                                value={slot.day}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 shadow-sm px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                            >
                                <option value="">Select Day</option>
                                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                                    <option key={day} value={day}>{day}</option>
                                ))}
                            </select>
                        </div>

                        {/* Time */}
                        <div className="w-full flex gap-2">
                            <div className="w-1/2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
                                <input
                                    type="time"
                                    name="startTime"
                                    value={slot.startTime}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 shadow-sm px-3 py-2"
                                />
                            </div>
                            <div className="w-1/2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Time</label>
                                <input
                                    type="time"
                                    name="endTime"
                                    value={slot.endTime}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 shadow-sm px-3 py-2"
                                />
                            </div>
                        </div>

                        {/* Available Slots */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Available Slots</label>
                            <input
                                type="number"
                                name="availableSlots"
                                value={slot.availableSlots}
                                onChange={handleChange}
                                min={1}
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 shadow-sm px-3 py-2"
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="px-5 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg shadow-md transition font-medium"
                        >
                            {data ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ConsultationSchedulingModal;
