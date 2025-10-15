import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';

// --- ICONS ---
const IconCalendar: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 2v4" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 2v4" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/><path d="M3.5 9.09h17" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 8.5V17c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V8.5c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/><path opacity="0.4" d="M11.995 13.7h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path opacity="0.4" d="M8.294 13.7h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path opacity="0.4" d="M8.294 16.7h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

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

const mockTherapies: Therapy[] = [
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
];

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

const PatientTherapies: React.FC = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('My Therapies'));
    }, [dispatch]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">My Therapies</h1>
            </div>

            <div className="space-y-6">
                {mockTherapies.map((therapy) => (
                    <div key={therapy.id} className="panel">
                        <div className="flex items-start justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{therapy.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Prescribed by: {therapy.doctorName} for {therapy.duration} days
                                </p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">Therapy Progress</h4>
                            <div className="flex flex-wrap gap-2">
                                {therapy.days.map((day) => (
                                    <div key={day.day} className="flex flex-col items-center">
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${getStatusColor(day.status)}`}
                                            title={`${day.status} - Day ${day.day}`}
                                        >
                                            {day.day}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-green-500"></div>Completed</div>
                                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500"></div>Absent</div>
                                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-gray-300"></div>Upcoming</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PatientTherapies;
