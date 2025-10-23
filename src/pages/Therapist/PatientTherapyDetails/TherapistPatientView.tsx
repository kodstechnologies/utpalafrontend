import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { setPageTitle } from '../../../store/themeConfigSlice';

// --- MOCK DATA & TYPES (to be replaced with API calls) ---

interface Patient {
    id: number;
    name: string;
    age: number;
    gender: 'Male' | 'Female';
    diagnosis: string;
    doctor: string;
}

interface Therapy {
    id: number;
    patientId: number;
    therapyName: string;
    duration: string;
    cost: number;
    therapistNotes?: string;
    status: 'Not Started' | 'In Progress' | 'Completed';
}

interface Medicine {
    name: string;
    dosage: string;
    timing: string;
    duration: string;
}

interface Prescription {
    id: string;
    patientId: number;
    doctorName: string;
    consultationDate: string;
    medicines: Medicine[];
}

const mockPatients: Patient[] = [
    { id: 1, name: 'Sumitra Devi', age: 56, gender: 'Female', diagnosis: 'Stress/Insomnia', doctor: 'Dr. Sharma' },
    { id: 2, name: 'Rajesh Kumar', age: 48, gender: 'Male', diagnosis: 'Hypertension', doctor: 'Dr. Khan' },
    { id: 3, name: 'Anil Gupta', age: 62, gender: 'Male', diagnosis: 'Digestive Issues', doctor: 'Dr. Patel' },
];

const mockTherapies: Therapy[] = [
    { id: 1, patientId: 1, therapyName: 'Shirodhara', duration: '45 mins', cost: 2500, therapistNotes: 'Patient felt relaxed post-session.', status: 'Completed' },
    { id: 2, patientId: 1, therapyName: 'Abhyangam', duration: '60 mins', cost: 3000, status: 'Not Started' },
    { id: 3, patientId: 2, therapyName: 'Pizhichil', duration: '50 mins', cost: 4000, therapistNotes: 'Blood pressure slightly lower after therapy.', status: 'In Progress' },
];

const mockPrescriptions: Prescription[] = [
    {
        id: 'PRES-001',
        patientId: 1,
        doctorName: 'Dr. Sharma',
        consultationDate: '2024-05-20',
        medicines: [
            { name: 'Brahmi Vati', dosage: '1 tablet', timing: 'Twice a day', duration: '30 days' },
            { name: 'Ashwagandharishta', dosage: '15 ml', timing: 'Twice a day with water', duration: '30 days' },
        ],
    },
    {
        id: 'PRES-002',
        patientId: 2,
        doctorName: 'Dr. Khan',
        consultationDate: '2024-05-18',
        medicines: [{ name: 'Arjuna Ksheera Paka', dosage: '50 ml', timing: 'Once a day', duration: '60 days' }],
    },
];

// --- HELPER COMPONENTS ---

const InfoCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="panel">
        <h2 className="text-xl font-bold border-b pb-2 mb-4">{title}</h2>
        {children}
    </div>
);

const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-semibold text-base">{value}</p>
    </div>
);

// --- MAIN COMPONENT ---

const TherapistPatientView = () => {
    const dispatch = useDispatch();
    const { id } = useParams<{ id: string }>();

    // In a real app, you would fetch this data from an API based on the patient ID
    const patientId = parseInt(id || '0', 10);
    // Local state for therapies to allow for status changes.
    // In a real app, this would likely be managed by a global state manager like Redux.
    const [therapies, setTherapies] = useState(() => mockTherapies.filter(t => t.patientId === patientId));
    const patient = mockPatients.find(p => p.id === patientId);
    const prescriptions = mockPrescriptions.filter(p => p.patientId === patientId);

    useEffect(() => {
        if (patient) {
            dispatch(setPageTitle(`Patient Details: ${patient.name}`));
        }
    }, [dispatch, patient]);

    const handleTherapyStatusChange = (therapyId: number, newStatus: Therapy['status']) => {
        // In a real app, this would dispatch an action to an API.
        // For now, we just update the local state.
        setTherapies(currentTherapies =>
            currentTherapies.map(therapy =>
                therapy.id === therapyId
                    ? { ...therapy, status: newStatus }
                    : therapy
            )
        );
    };

    if (!patient) {
        return (
            <div className="text-center p-10">
                <h1 className="text-2xl font-bold">Patient not found</h1>
                <Link to="/therapist/patient-details" className="btn btn-primary mt-4">
                    Back to Patient List
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">{patient.name}</h1>
                <Link to="/therapist/patient-details" className="btn btn-outline-secondary">
                    Back to List
                </Link>
            </div>

            {/* Patient Information */}
            <InfoCard title="Patient Information">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <DetailItem label="Patient ID" value={`#${patient.id}`} />
                    <DetailItem label="Age" value={patient.age} />
                    <DetailItem label="Gender" value={patient.gender} />
                    <DetailItem label="Assigned Doctor" value={patient.doctor} />
                    <div className="col-span-2">
                        <DetailItem label="Primary Diagnosis" value={patient.diagnosis} />
                    </div>
                </div>
            </InfoCard>

            {/* Assigned Therapies */}
            <InfoCard title="Assigned Therapies">
                {therapies.length > 0 ? (
                    <div className="space-y-4">
                        {therapies.map(therapy => (
                            <div key={therapy.id} className="p-4 border rounded-md bg-white dark:bg-gray-800/50">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg">{therapy.therapyName}</h3>
                                        <p className="text-sm text-gray-600">Duration: {therapy.duration}</p>
                                    </div>
                                    <p className="font-semibold">₹{therapy.cost.toLocaleString()}</p>
                                </div>
                                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                                    <div>
                                        {therapy.status === 'Not Started' && (
                                            <button className="btn btn-sm btn-success" onClick={() => handleTherapyStatusChange(therapy.id, 'In Progress')}>
                                                Start Therapy
                                            </button>
                                        )}
                                        {therapy.status === 'In Progress' && (
                                            <button className="btn btn-sm btn-warning" onClick={() => handleTherapyStatusChange(therapy.id, 'Completed')}>
                                                Stop Therapy
                                            </button>
                                        )}
                                    </div>
                                    <span className={`badge ${
                                        therapy.status === 'Completed' ? 'badge-outline-primary' :
                                        therapy.status === 'In Progress' ? 'badge-outline-warning' : 'badge-outline-secondary'
                                    }`}>
                                        {therapy.status}
                                    </span>
                                </div>
                                {therapy.therapistNotes && (
                                    <div className="mt-3 pt-3 border-t">
                                        <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Notes:</strong> {therapy.therapistNotes}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No therapies assigned.</p>
                )}
            </InfoCard>

            {/* Prescriptions from Doctor */}
            <InfoCard title="Doctor's Prescriptions">
                {prescriptions.length > 0 ? (
                    <div className="space-y-6">
                        {prescriptions.map(prescription => (
                            <div key={prescription.id} className="p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-bold">Prescription #{prescription.id}</h4>
                                    <p className="text-sm">
                                        By {prescription.doctorName} on {new Date(prescription.consultationDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <table className="table-auto w-full text-left">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2">Medicine</th>
                                            <th className="px-4 py-2">Dosage & Timing</th>
                                            <th className="px-4 py-2">Duration</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {prescription.medicines.map((med, index) => (
                                            <tr key={index} className="border-t">
                                                <td className="px-4 py-2 font-semibold">{med.name}</td>
                                                <td className="px-4 py-2">{med.dosage}, {med.timing}</td>
                                                <td className="px-4 py-2">{med.duration}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No prescriptions found.</p>
                )}
            </InfoCard>
        </div>
    );
};

export default TherapistPatientView;