"use client";
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

// Icons
import IconUser from "../../../components/Icon/IconUser";
import IconHome from "../../../components/Icon/IconHome";
import IconCalendar from "../../../components/Icon/IconCalendar";
import IconListCheck from "../../../components/Icon/IconListCheck";
import IconEdit from "../../../components/Icon/IconEdit";
import IconDownload from "../../../components/Icon/IconDownload";

// ------------------- Types -------------------
interface TherapySession {
    sessionNumber: number;
    date: string;
    notes: string;
    progress: string;
}

interface PatientTherapy {
    id: number;
    patientName: string;
    therapyType: string;
    ward: string;
    cost: number;
    doctor: string;
    therapist: string;
    status: "Ongoing" | "Completed";
    startDate: string;
    endDate?: string;
    totalDuration: string;
    sessions: TherapySession[];
}

// ------------------- Dummy Fetch -------------------
const fetchPatientTherapy = (id: number): PatientTherapy => ({
    id,
    patientName: "John Doe",
    therapyType: "Physiotherapy",
    ward: "Special",
    cost: 5000,
    doctor: "Dr. Rohan",
    therapist: "Dr. Meena",
    status: "Ongoing",
    startDate: "2025-10-10",
    totalDuration: "4 weeks",
    sessions: [
        { sessionNumber: 1, date: "2025-10-10", notes: "Initial assessment", progress: "10%" },
        { sessionNumber: 2, date: "2025-10-12", notes: "Movement improved slightly", progress: "25%" },
        { sessionNumber: 3, date: "2025-10-14", notes: "Strength training started", progress: "40%" },
    ],
});

const getInitials = (name: string) => {
    const parts = name.split(' ').filter(p => p.length > 0);
    if (parts.length > 1) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return parts.length > 0 ? parts[0][0].toUpperCase() : 'DR';
};

// ------------------- Components -------------------
const StatusBadge = ({ status }: { status: PatientTherapy["status"] }) => {
    const colorMap: Record<PatientTherapy["status"], string> = {
        Ongoing: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
        Completed: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    };
    return (
        <span className={`px-3 py-1 inline-flex text-sm leading-5 font-medium rounded-full ${colorMap[status]}`}>
            {status}
        </span>
    );
};

const DetailItem = ({
    icon,
    label,
    value,
    largeText = false,
}: {
    icon?: React.ReactNode;
    label: string;
    value: string | JSX.Element;
    largeText?: boolean;
}) => (
    <div className="flex flex-col p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition duration-150 hover:shadow-md">
        <div className="flex items-center space-x-2 mb-1">
            {icon && <div className="text-green-500 dark:text-green-400">{icon}</div>}
            <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400">{label}</p>
        </div>
        <p className={`font-bold text-gray-900 dark:text-white ${largeText ? "text-xl" : "text-base"}`}>{value}</p>
    </div>
);

// ------------------- Main Component -------------------
const PatientTherapyDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [therapy, setTherapy] = useState<PatientTherapy | null>(null);
    const [activeTab, setActiveTab] = useState<"general" | "sessions">("general");

    useEffect(() => {
        if (id) setTherapy(fetchPatientTherapy(Number(id)));
    }, [id]);

    if (!therapy) return <div>Loading...</div>;

    const primaryColor = 'text-green-600';
    const primaryHover = 'hover:text-green-700';
    const avatarBg = 'bg-green-100';
    const avatarBorder = 'border-green-600';
    const avatarText = 'text-green-700';

    return (
        <div className="w-full">
            <div className="bg-gray-50 dark:bg-gray-900 pb-6">
                <ul className="flex space-x-2 rtl:space-x-reverse text-sm font-medium">
                    <li><Link to="/treatment-therapy" className={`${primaryColor} ${primaryHover} dark:text-green-400 dark:hover:text-green-300 transition`}>Treatment & Therapy</Link></li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span className="text-gray-500 dark:text-gray-400">Patient Therapy</span>
                    </li>
                </ul>
            </div>

            {/* Main Card */}
            <div className="bg-white  dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-6 sm:p-8 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center">
                    <div className="flex items-center space-x-5">
                        <div className={`w-20 h-20 rounded-full ${avatarBg} ${avatarText} flex items-center justify-center text-3xl font-extrabold border-4 ${avatarBorder} shadow-lg`}>
                            {getInitials(therapy.patientName)}
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">{therapy.patientName}</h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">
                                {therapy.therapyType} - {therapy.ward}
                            </p>
                        </div>
                    </div>
                    <div className="flex space-x-3">
                        <button className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition">
                            <IconEdit className="w-5 h-5" />
                        </button>
                        <button className="p-3 bg-gray-300 text-gray-800 rounded-full hover:bg-gray-400 transition dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                            <IconDownload className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700 px-6 sm:px-8">
                    <div className="flex space-x-6 -mb-px">
                        <button
                            onClick={() => setActiveTab("general")}
                            className={`py-4 px-1 text-sm font-medium focus:outline-none transition duration-150 ease-in-out ${activeTab === "general"
                                ? "border-b-4 border-green-600 font-bold text-green-600"
                                : "border-b-4 border-transparent text-gray-500 hover:text-green-600"
                                }`}
                        >
                            <IconHome className="w-5 h-5 inline mr-2 align-text-bottom" />
                            General Info
                        </button>
                        <button
                            onClick={() => setActiveTab("sessions")}
                            className={`py-4 px-1 text-sm font-medium focus:outline-none transition duration-150 ease-in-out ${activeTab === "sessions"
                                ? "border-b-4 border-green-600 font-bold text-green-600"
                                : "border-b-4 border-transparent text-gray-500 hover:text-green-600"
                                }`}
                        >
                            <IconListCheck className="w-5 h-5 inline mr-2 align-text-bottom" />
                            Therapy Sessions
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="p-6 sm:p-8 min-h-[350px] space-y-6">
                    {/* General Info */}
                    {activeTab === "general" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <DetailItem icon={<IconUser className="w-5 h-5" />} label="Assigned Doctor" value={therapy.doctor} />
                            <DetailItem icon={<IconUser className="w-5 h-5" />} label="Assigned Therapist" value={therapy.therapist} />
                            <DetailItem icon={<IconCalendar className="w-5 h-5" />} label="Start Date" value={therapy.startDate} />
                            <DetailItem icon={<IconCalendar className="w-5 h-5" />} label="Total Duration" value={therapy.totalDuration} />
                            <DetailItem icon={<IconListCheck className="w-5 h-5" />} label="Status" value={<StatusBadge status={therapy.status} />} />
                            <DetailItem icon={<IconHome className="w-5 h-5" />} label="Cost" value={`₹${therapy.cost}`} />
                        </div>
                    )}

                    {/* Therapy Sessions */}
                    {activeTab === "sessions" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {therapy.sessions.map((s) => (
                                <div
                                    key={s.sessionNumber}
                                    className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700"
                                >
                                    <p className="font-bold text-gray-900 dark:text-white">Session {s.sessionNumber}</p>
                                    <p className="text-gray-500 dark:text-gray-300 text-sm">Date: {s.date}</p>
                                    <p className="text-gray-500 dark:text-gray-300 text-sm">Notes: {s.notes}</p>
                                    <p className="text-gray-500 dark:text-gray-300 text-sm">Progress: {s.progress}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientTherapyDetails;
