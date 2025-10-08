// on click of eye icon navigate to patient details page file is .tsx
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom'; // import useNavigate and useParams
import { setPageTitle } from '../../../store/themeConfigSlice';
import IconUser from '../../../components/Icon/IconUser';
import IconCalendar from '../../../components/Icon/IconCalendar';
import IconMapPin from '../../../components/Icon/IconMapPin';
import IconHeart from '../../../components/Icon/IconHeart';
import IconInfoCircle from '../../../components/Icon/IconInfoCircle';

const PatientDetails = () => {
    const dispatch = useDispatch();
    const { id } = useParams(); // Get patient ID from URL
    const [activeTab, setActiveTab] = useState('history');

    const [patientDetails] = useState({
        id: id,
        name: 'Jay Sharam', 
        age: 30,
        gender: 'Male',
        lastVisit: '2025-09-23',
        treatmentType: 'Treatment Type 1',
        condition: 'Diabetes',
        ongoiingTreatments: ['Metformin', 'Insulin Therapy'],
        history: [
            { date: '2025-09-23', notes: 'Routine check-up. Blood sugar levels slightly elevated.' },
            { date: '2025-06-15', notes: 'Follow-up visit. Adjusted medication for better control.' },
            { date: '2025-03-10', notes: 'Initial diagnosis of diabetes. Started on metformin.' },
        ],
        prescriptions: [
            { medication: 'Metformin', dosage: '500mg', frequency: 'Twice a day' },
            { medication: 'Insulin Glargine', dosage: '10 units', frequency: 'Once daily at bedtime' },
        ],
        therapies: [
            { type: 'Physical Therapy', notes: 'To improve mobility and reduce pain in joints.', schedule: 'Twice a week for 4 weeks' },
        ],
        visits: [
            { date: '2025-09-23', reason: 'Routine Check-up', doctor: 'Dr. Smith' },
            { date: '2025-06-15', reason: 'Follow-up', doctor: 'Dr. Smith' },
            { date: '2025-03-10', reason: 'Initial Consultation', doctor: 'Dr. Smith' },
        ],
    });

    useEffect(() => {
        dispatch(setPageTitle('Patient Details'));
    });

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/" className="text-primary hover:underline">
                        Dashboard
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <Link to="/my-patients" className="text-primary hover:underline">
                        My Patients
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Patient Details</span>
                </li>
            </ul>
            <div className="pt-5">
                <div className="grid grid-cols-1 gap-5 mb-5">
                    <div className="panel">
                        <div className="flex items-center justify-between mb-5">
                            <h5 className="font-semibold text-lg dark:text-white-light">Profile</h5>
                        </div>
                        <div className="mb-5">
                            <div className="flex flex-col sm:flex-row items-center gap-5">
                                <div>
                                    <img src="/assets/images/user-profile.jpeg" alt="img" className="w-24 h-24 rounded-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-primary text-xl mb-2">{patientDetails.name}</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-center gap-2">
                                            <IconUser className="shrink-0" /> {patientDetails.gender}, {patientDetails.age} years
                                        </li>
                                        <li className="flex items-center gap-2 whitespace-nowrap">
                                            <IconCalendar className="shrink-0" /> <span>Last Visit: {patientDetails.lastVisit}</span>
                                        </li>
                                        <li className="flex items-center gap-2 whitespace-nowrap">
                                            <IconHeart className="shrink-0" /> <span>Condition: {patientDetails.condition}</span>
                                        </li>
                                        <li className="flex items-center gap-2 whitespace-nowrap">
                                            <IconInfoCircle className="shrink-0" /> <span>Ongoing Treatments: {patientDetails.ongoiingTreatments.join(', ')}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="panel">
                        <div className="pt-5">
                            <div className="mb-5">
                                <ul className="sm:flex font-semibold border-b border-gray-200 dark:border-gray-800">
                                    <li className="inline-block">
                                        <button onClick={() => setActiveTab('history')} className={`p-3.5 py-2 -mb-[1px] block hover:text-primary ${activeTab === 'history' ? 'text-primary border-b-2 border-primary' : ''}`}>
                                            History
                                        </button>
                                    </li>
                                    <li className="inline-block">
                                        <button onClick={() => setActiveTab('prescription')} className={`p-3.5 py-2 -mb-[1px] block hover:text-primary ${activeTab === 'prescription' ? 'text-primary border-b-2 border-primary' : ''}`}>
                                            Prescription
                                        </button>
                                    </li>
                                    <li className="inline-block">
                                        <button onClick={() => setActiveTab('therapy')} className={`p-3.5 py-2 -mb-[1px] block hover:text-primary ${activeTab === 'therapy' ? 'text-primary border-b-2 border-primary' : ''}`}>
                                            Therapy
                                        </button>
                                    </li>
                                    <li className="inline-block">
                                        <button onClick={() => setActiveTab('visits')} className={`p-3.5 py-2 -mb-[1px] block hover:text-primary ${activeTab === 'visits' ? 'text-primary border-b-2 border-primary' : ''}`}>
                                            Visits
                                        </button>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                {activeTab === 'history' && (
                                    <div className="table-responsive text-[#515365] dark:text-white-light font-semibold">
                                        <table className="table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Date</th>
                                                    <th>Notes</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {patientDetails.history.map((entry, index) => (
                                                    <tr key={index}>
                                                        <td>{entry.date}</td>
                                                        <td>{entry.notes}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                                {activeTab === 'prescription' && (
                                    <div className="table-responsive text-[#515365] dark:text-white-light font-semibold">
                                        <table className="table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Medication</th>
                                                    <th>Dosage</th>
                                                    <th>Frequency</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {patientDetails.prescriptions.map((entry, index) => (
                                                    <tr key={index}>
                                                        <td>{entry.medication}</td>
                                                        <td>{entry.dosage}</td>
                                                        <td>{entry.frequency}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                                {activeTab === 'therapy' && <div>Therapy Content</div>}
                                {activeTab === 'visits' && (
                                    <div className="table-responsive text-[#515365] dark:text-white-light font-semibold">
                                        <table className="table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Date</th>
                                                    <th>Reason for Visit</th>
                                                    <th>Doctor</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {patientDetails.visits.map((entry, index) => (
                                                    <tr key={index}>
                                                        <td>{entry.date}</td>
                                                        <td>{entry.reason}</td>
                                                        <td>{entry.doctor}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDetails;
