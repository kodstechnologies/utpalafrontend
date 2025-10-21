import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import IconSearch from '../../../components/Icon/IconSearch';

// --- Imports for react-big-calendar ---
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// --- Setup for react-big-calendar localizer ---
const locales = {
    'en-US': enUS,
};
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

// --- Types (Kept the same) ---
type SessionStatus = 'Completed' | 'Absent' | 'Discontinued';

interface TherapySession {
    day: number;
    date: string; // e.g., '2025-05-01'
    startTime: string; // e.g., '10:00'
    endTime: string; // e.g., '11:00'
    title: string; // e.g., 'Initial Assessment', 'Mobility Exercises'
    status: SessionStatus;
    notes: string;
}

interface PatientProgress {
    patientId: number;
    patientName: string;
    sessions: TherapySession[];
}

// --- Dummy Data (Kept the same) ---
const allPatientsProgress: PatientProgress[] = [
    {
        patientId: 1,
        patientName: 'John Doe',
        sessions: [
            {
                day: 1,
                date: '2025-10-01',
                startTime: '10:00',
                endTime: '11:00',
                title: 'Initial Assessment',
                status: 'Completed',
                notes: 'Good start, patient was cooperative.',
            },
            {
                day: 2,
                date: '2025-10-02',
                startTime: '10:00',
                endTime: '11:00',
                title: 'Mobility Exercises',
                status: 'Completed',
                notes: 'Slight improvement in mobility.',
            },
            {
                day: 3,
                date: '2025-10-03',
                startTime: '14:00',
                endTime: '15:00',
                title: 'Follow-up',
                status: 'Absent',
                notes: 'Patient did not show up. Called to reschedule.',
            },
            {
                day: 4,
                date: '2025-10-05',
                startTime: '10:00',
                endTime: '11:00',
                title: 'Resumed Exercises',
                status: 'Completed',
                notes: 'Resumed exercises. Patient feels better.',
            },
            {
                day: 5,
                date: '2025-10-06',
                startTime: '11:00',
                endTime: '12:00',
                title: 'Final Session',
                status: 'Discontinued',
                notes: 'Patient requested to discontinue due to personal reasons.',
            },
            {
                day: 6,
                date: '2025-10-03',
                startTime: '10:00',
                endTime: '11:00',
                title: 'New Plan: Leg Press',
                status: 'Completed',
                notes: 'Patient returned, starting new plan.',
            },
            {
                day: 7,
                date: '2025-06-05',
                startTime: '10:00',
                endTime: '11:00',
                title: 'New Plan: Stretching',
                status: 'Completed',
                notes: 'Good flexibility.',
            },
        ],
    },
    {
        patientId: 2,
        patientName: 'Jane Smith',
        sessions: [
            {
                day: 1,
                date: '2025-05-10',
                startTime: '09:00',
                endTime: '10:00',
                title: 'Initial Assessment',
                status: 'Completed',
                notes: 'Initial assessment complete.',
            },
            {
                day: 2,
                date: '2025-05-11',
                startTime: '09:00',
                endTime: '10:00',
                title: 'Strength Training',
                status: 'Completed',
                notes: 'Patient is highly motivated.',
            },
            {
                day: 3,
                date: '2025-05-12',
                startTime: '10:00',
                endTime: '11:00',
                title: 'Cardio',
                status: 'Completed',
                notes: 'Progressing faster than expected.',
            },
            {
                day: 4,
                date: '2025-05-14',
                startTime: '09:00',
                endTime: '10:00',
                title: 'Strength Training',
                status: 'Absent',
                notes: 'Called in sick. Rescheduled.',
            },
            {
                day: 5,
                date: '2025-05-16',
                startTime: '09:00',
                endTime: '10:00',
                title: 'Strength Training',
                status: 'Completed',
                notes: 'Made up for missed session. Good energy.',
            },
        ],
    },
    {
        patientId: 3,
        patientName: 'Michael Brown',
        sessions: [
            {
                day: 1,
                date: '2025-06-10',
                startTime: '13:00',
                endTime: '14:00',
                title: 'Shoulder Eval',
                status: 'Completed',
                notes: 'Initial shoulder evaluation.',
            },
            {
                day: 2,
                date: '2025-06-12',
                startTime: '13:00',
                endTime: '14:00',
                title: 'Range of Motion',
                status: 'Completed',
                notes: 'Exercises well received.',
            },
            {
                day: 3,
                date: '2025-06-14',
                startTime: '14:00',
                endTime: '15:00',
                title: 'Resistance Bands',
                status: 'Discontinued',
                notes: 'Patient moving out of state. Transferred notes.',
            },
            {
                day: 4,
                date: '2025-05-20',
                startTime: '11:00',
                endTime: '12:00',
                title: 'Initial Consult',
                status: 'Completed',
                notes: 'Just a consultation.',
            },
        ],
    },
];

// --- Config (Using explicit hex codes for stronger style enforcement) ---
const statusConfig: Record<SessionStatus, { styleClass: string; label: string; textClass: string; bgColor: string; borderColor: string }> = {
    Completed: {
        styleClass: 'hover:bg-green-600',
        textClass: 'text-white',
        label: 'Completed',
        bgColor: '#10B981', // Tailwind green-500
        borderColor: '#059669', // Tailwind green-700
    },
    Absent: {
        styleClass: 'hover:bg-red-600',
        textClass: 'text-white',
        label: 'Absent',
        bgColor: '#EF4444', // Tailwind red-500
        borderColor: '#B91C1C', // Tailwind red-700
    },
    Discontinued: {
        styleClass: 'hover:bg-yellow-600',
        textClass: 'text-gray-900',
        label: 'Discontinued',
        bgColor: '#F59E0B', // Tailwind yellow-500
        borderColor: '#D97706', // Tailwind yellow-700
    },
};

// --- Custom Event Component with Improved Tooltip ---
const CustomEvent = ({ event }: { event: any }) => {
    const session: TherapySession = event.resource;
    const patientName: string = event.patientName;
    const statusInfo = statusConfig[session.status] || { label: 'N/A', styleClass: 'bg-gray-400', textClass: 'text-gray-900' };

    if (!session) return null;

    return (
        // Apply text class here to ensure content is readable against the background color
        <div className={`h-full w-full overflow-hidden truncate ${statusInfo.textClass}`}>
            <div className="font-semibold text-xs truncate">{event.title}</div>
            <div className="text-[10px] truncate opacity-80">{patientName}</div>

            {/* Tooltip - Improved Styling and Content */}
            <div className="absolute bottom-full mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 pointer-events-none shadow-xl left-1/2 -translate-x-1/2">
                <p className="font-bold text-base mb-2">{session.title}</p>
                <div className="border-b border-gray-700 pb-2 mb-2">
                    <p className="mb-1">
                        <span className="font-semibold">Patient:</span> {patientName}
                    </p>
                    <p className="mb-1 flex items-center">
                        <span className="font-semibold mr-2">Status:</span>
                        <span className={`font-bold px-2 py-[2px] rounded text-xs border-2`}
                            style={{ backgroundColor: statusInfo.bgColor, color: statusInfo.textClass === 'text-gray-900' ? '#111827' : '#FFFFFF' }}
                        >
                            {statusInfo.label}
                        </span>
                    </p>
                    <p>
                        <span className="font-semibold">Time:</span> {format(event.start, 'p')} - {format(event.end, 'p')}
                    </p>
                </div>
                <p className="font-semibold mb-1">Notes:</p>
                <p className="whitespace-normal max-h-20 overflow-y-auto text-gray-300">{session.notes}</p>

                {/* Tooltip Arrow */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-gray-900"></div>
            </div>
        </div>
    );
};

// --- Main Component ---
const TherapyProgress: React.FC = () => {
    const [search, setSearch] = useState('');
    const [selectedPatient, setSelectedPatient] = useState<PatientProgress | null>(
        allPatientsProgress[0]
    );

    const filteredPatients = useMemo(
        () =>
            allPatientsProgress.filter((p) =>
                p.patientName.toLowerCase().includes(search.toLowerCase())
            ),
        [search]
    );

    // --- Transform patient sessions into "events" for react-big-calendar ---
    const events = useMemo(() => {
        if (!selectedPatient) return [];
        const patientName = selectedPatient.patientName;

        return selectedPatient.sessions.map((session) => {
            const startDate = parseISO(`${session.date}T${session.startTime}`);
            const endDate = parseISO(`${session.date}T${session.endTime}`);

            return {
                title: `${session.title} (Day ${session.day})`,
                start: startDate,
                end: endDate,
                resource: session,
                patientName: patientName,
            };
        });
    }, [selectedPatient]);

    // --- (CRITICAL FIX) Function to apply styles and z-index fix to events based on status ---
    const eventPropGetter = useCallback((event: any) => {
        const session: TherapySession = event.resource;
        if (!session?.status) return {};

        const config = statusConfig[session.status];

        // Base classes including the critical z-index fix for the tooltip
        const baseClasses = `rounded-md px-1 py-[2px] border-2 text-left text-ellipsis whitespace-nowrap overflow-hidden relative group hover:z-[100] ${config.styleClass}`;

        return {
            className: baseClasses,
            // Use the style property with explicit hex codes to forcefully override 
            // the default blue background set by the react-big-calendar CSS.
            style: {
                backgroundColor: config.bgColor,
                borderColor: config.borderColor,
                color: config.textClass === 'text-gray-900' ? '#111827' : '#FFFFFF', // Use explicit hex for text color too
            },
        };
    }, []);

    return (
        <div>
            {/* Breadcrumbs and Title */}
            <div className="flex items-center justify-between mb-6">
                <ul className="flex space-x-2 rtl:space-x-reverse">
                    <li>
                        <Link to="#" className="text-green-600 hover:underline">
                            Therapist
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span>Therapy Progress</span>
                    </li>
                </ul>
            </div>

            <div className="panel bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md">
                {/* Header & Search */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h5 className="font-semibold text-lg dark:text-white-light">
                        Patient Therapy Timeline
                    </h5>
                    <div className="relative w-full md:w-80">
                        <div className="flex items-center border rounded-xl overflow-hidden shadow-sm bg-gray-50 dark:bg-gray-800 focus-within:ring-2 focus-within:ring-green-500">
                            <IconSearch className="w-5 h-5 text-gray-400 mx-3" />
                            <input
                                type="text"
                                className="form-input border-none focus:ring-0 bg-transparent w-full py-2 text-sm"
                                placeholder="Search Patient..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        {search && (
                            <div className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 border rounded-lg shadow-lg max-h-56 overflow-y-auto">
                                {filteredPatients.length > 0 ? (
                                    filteredPatients.map((patient) => (
                                        <div
                                            key={patient.patientId}
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                            onClick={() => {
                                                setSelectedPatient(patient);
                                                setSearch('');
                                            }}
                                        >
                                            {patient.patientName}
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-2 text-gray-500">
                                        No patient found
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Selected Patient Info */}
                <div className="border-t pt-4 dark:border-gray-700">
                    <h6 className="font-bold text-xl mb-4 text-gray-800 dark:text-gray-100">
                        Progress for:{' '}
                        <span className="text-green-600">
                            {selectedPatient
                                ? selectedPatient.patientName
                                : 'No Patient Selected'}
                        </span>
                    </h6>

                    {/* --- Calendar Component --- */}
                    <div
                        className="calendar-wrapper 
                            [&_.rbc-header]:py-2 
                            [&_.rbc-header]:font-semibold 
                            [&_.rbc-header]:capitalize 
                            [&_.rbc-toolbar-label]:text-2xl 
                            [&_.rbc-toolbar-label]:font-bold 
                            [&_.rbc-toolbar-label]:text-green-600 
                            [&_.rbc-toolbar_button]:bg-green-600 
                            [&_.rbc-toolbar_button]:text-white 
                            [&_.rbc-toolbar_button]:rounded-md 
                            [&_.rbc-toolbar_button]:px-3 
                            [&_.rbc-toolbar_button]:py-1 
                            [&_.rbc-toolbar_button:hover]:bg-green-700
                            [&_.rbc-toolbar_button:focus]:shadow-none
                        "
                        style={{ height: '700px' }}
                    >
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            defaultView="month"
                            views={['month']}
                            eventPropGetter={eventPropGetter} // Now uses the style prop to enforce color
                            components={{ event: CustomEvent }}
                            defaultDate={new Date(2025, 9, 1)}
                        />
                    </div>

                    {/* Legend */}
                    <div className="mt-8 flex justify-center items-center gap-6 flex-wrap">
                        {Object.entries(statusConfig).map(([status, { bgColor, label }]) => {
                            const s = status as SessionStatus;
                            return (
                                <div key={status} className="flex items-center gap-2">
                                    <div
                                        className={`w-4 h-4 rounded-full border-2`}
                                        style={{ backgroundColor: bgColor, borderColor: statusConfig[s].borderColor }}
                                    ></div>
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        {label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TherapyProgress;