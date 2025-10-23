import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, addDays, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// --- Calendar Setup ---
const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

// --- DATA TYPES & MOCK DATA ---
type DayStatus = 'Completed' | 'Absent' | 'Upcoming';

interface TherapyDay {
    day: number;
    status: DayStatus;
}

interface Therapy {
    id: string;
    name: string;
    doctorName: string;
    duration: number; // in days
    startDate: string;
    days: TherapyDay[];
}

interface FamilyMember {
    id: string;
    name: string;
}

const mockFamilyMembers: FamilyMember[] = [
    { id: 'user', name: 'Self' },
    { id: 'fm1', name: 'Rohan Sharma' },
    { id: 'fm2', name: 'Priya Sharma' },
];

const allTherapies: { [patientId: string]: Therapy[] } = {
    'user': [
        {
            id: 'THER-001',
            name: 'Abhyanga (Oil Massage)',
            doctorName: 'Dr. Priya Singh',
            duration: 7,
            startDate: '2024-05-25',
            days: [
                { day: 1, status: 'Completed' },
                { day: 2, status: 'Completed' },
                { day: 3, status: 'Absent' },
                { day: 4, status: 'Completed' },
                { day: 5, status: 'Upcoming' },
                { day: 6, status: 'Upcoming' },
                { day: 7, status: 'Upcoming' },
            ],
        },
        {
            id: 'THER-002',
            name: 'Shirodhara',
            doctorName: 'Dr. Anjali Verma',
            duration: 5,
            startDate: '2024-05-28',
            days: [
                { day: 1, status: 'Completed' },
                { day: 2, status: 'Completed' },
                { day: 3, status: 'Upcoming' },
                { day: 4, status: 'Upcoming' },
                { day: 5, status: 'Upcoming' },
            ],
        },
    ],
    'fm1': [ // Rohan Sharma's therapies
        {
            id: 'THER-003',
            name: 'Nasya (Nasal Instillation)',
            doctorName: 'Dr. Ramesh Kumar',
            duration: 5,
            startDate: '2024-06-01',
            days: [
                { day: 1, status: 'Completed' },
                { day: 2, status: 'Upcoming' },
                { day: 3, status: 'Upcoming' },
                { day: 4, status: 'Upcoming' },
                { day: 5, status: 'Upcoming' },
            ],
        },
    ],
    'fm2': [], // Priya Sharma has no therapies
};

const getStatusColor = (status: DayStatus) => {
    switch (status) {
        case 'Completed':
            return 'bg-green-500';
        case 'Absent':
            return 'bg-red-500';
        default:
            return 'bg-gray-300 dark:bg-gray-600';
    }
};

const CustomEvent = ({ event }: { event: any }) => {
    return (
        <div className="w-full h-full flex items-center justify-center text-white font-bold text-xs">
            Day {event.day}
        </div>
    );
};

const eventPropGetter = (event: any) => {
    const backgroundColor = getStatusColor(event.status);
    return {
        className: `${backgroundColor} border-none rounded-full w-8 h-8 mx-auto flex items-center justify-center`,
        style: {
            backgroundColor: '', // Clear default background
        },
    };
};


const PatientTherapies: React.FC = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('My Therapies'));
    }, [dispatch]);

    const [selectedMemberId, setSelectedMemberId] = useState<string>('user');

    const therapiesForSelectedMember = useMemo(() => {
        return allTherapies[selectedMemberId] || [];
    }, [selectedMemberId]);

    return (
        <div className="space-y-6 p-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">My Therapies</h1>
                {/* --- MODIFICATION: Added Family Member Filter --- */}
                <div className="w-full max-w-xs">
                    <label htmlFor="member-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Showing therapies for:
                    </label>
                    <select
                        id="member-filter"
                        className="form-select mt-1"
                        value={selectedMemberId}
                        onChange={(e) => setSelectedMemberId(e.target.value)}
                    >
                        {mockFamilyMembers.map((member) => (
                            <option key={member.id} value={member.id}>
                                {member.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {therapiesForSelectedMember.length > 0 ? (
                therapiesForSelectedMember.map((therapy) => {
                    const events = therapy.days.map((day) => {
                        const eventDate = addDays(parseISO(therapy.startDate), day.day - 1);
                        return {
                            title: `Day ${day.day}: ${therapy.name}`,
                            start: eventDate,
                            end: eventDate,
                            allDay: true,
                            status: day.status,
                            day: day.day,
                        };
                    });

                    return (
                        <div key={therapy.id} className="panel mb-6">
                            <div className="flex flex-col sm:flex-row items-start justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{therapy.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Prescribed by: {therapy.doctorName} for {therapy.duration} days
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 mt-2 sm:mt-0 text-xs text-gray-500">
                                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-green-500"></div>Completed</div>
                                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500"></div>Absent</div>
                                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-gray-300"></div>Upcoming</div>
                                </div>
                            </div>

                            <div className="mt-4 calendar-container">
                                <Calendar
                                    localizer={localizer}
                                    events={events}
                                    startAccessor="start"
                                    endAccessor="end"
                                    defaultView={Views.MONTH}
                                    views={[Views.MONTH]}
                                    style={{ height: 400 }}
                                    components={{
                                        event: CustomEvent,
                                    }}
                                    eventPropGetter={eventPropGetter}
                                    defaultDate={parseISO(therapy.startDate)}
                                    toolbar={false} // Hide the toolbar for a cleaner look
                                />
                            </div>
                        </div>
                    )
                })
            ) : (
                <div className="panel text-center p-10">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-white">No Therapies Found</h3>
                    <p className="text-gray-500 mt-2">There are no active or past therapies for the selected family member.</p>
                </div>
            )}
        </div>
    );
};

export default PatientTherapies;
