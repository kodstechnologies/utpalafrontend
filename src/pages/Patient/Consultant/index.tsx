import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { Link } from 'react-router-dom';

// --- ICONS ---
const IconCalendar: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 2v4" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 2v4" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/><path d="M3.5 9.09h17" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 8.5V17c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V8.5c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/><path opacity="0.4" d="M11.995 13.7h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path opacity="0.4" d="M8.294 13.7h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path opacity="0.4" d="M8.294 16.7h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const IconNotes: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 2v4" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 2v4" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 8.5V17c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V8.5c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 11h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

// --- DATA TYPES & MOCK DATA ---
interface Consultation {
    id: string;
    doctorName: string;
    consultationDate: string;
    chiefComplaint: string;
    followUpDate: string | null;
}

const mockConsultations: Consultation[] = [
    {
        id: 'CON-001',
        doctorName: 'Dr. Priya Singh',
        consultationDate: '2024-05-20',
        chiefComplaint: 'Persistent cough and cold for over a week.',
        followUpDate: '2024-06-05',
    },
    {
        id: 'CON-002',
        doctorName: 'Dr. Anjali Verma',
        consultationDate: '2024-04-15',
        chiefComplaint: 'General check-up and consultation for digestive issues.',
        followUpDate: null,
    },
    {
        id: 'CON-003',
        doctorName: 'Dr. Priya Singh',
        consultationDate: '2024-03-10',
        chiefComplaint: 'Follow-up on previous treatment for joint pain.',
        followUpDate: '2024-04-10',
    },
];

const PatientConsultations: React.FC = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('My Consultations'));
    }, [dispatch]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">My Consultations</h1>
            </div>

            <div className="space-y-6">
                {mockConsultations.map((consultation) => (
                    <div key={consultation.id} className="panel">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                                    <IconNotes className="w-8 h-8 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Consultation ID: {consultation.id}</p>
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                        Consultation with {consultation.doctorName}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        on {new Date(consultation.consultationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 sm:mt-0 sm:text-right">
                                <Link to={`/patient/consultations/${consultation.id}`} className="btn btn-outline-primary">
                                    View Details
                                </Link>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                            <div>
                                <h4 className="font-semibold text-gray-700 dark:text-gray-200">Chief Complaint:</h4>
                                <p className="text-gray-600 dark:text-gray-400">{consultation.chiefComplaint}</p>
                            </div>
                            {consultation.followUpDate && (
                                <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                    <IconCalendar className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                    <div>
                                        <span className="font-semibold text-yellow-800 dark:text-yellow-200">Next Follow-up: </span>
                                        <span className="text-yellow-700 dark:text-yellow-300">
                                            {new Date(consultation.followUpDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PatientConsultations;