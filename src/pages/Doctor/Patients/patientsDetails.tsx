import React, { useEffect, useState } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import AnimateHeight from 'react-animate-height';
import { Link, useParams } from 'react-router-dom';
import { setPageTitle } from '../../../store/themeConfigSlice';
import IconUser from '../../../components/Icon/IconUser';
import IconCalendar from '../../../components/Icon/IconCalendar';
import IconHeart from '../../../components/Icon/IconHeart';
import IconInfoCircle from '../../../components/Icon/IconInfoCircle';
import { IRootState } from '../../../store';

const PatientDetails = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const [isProfileOpen, setIsProfileOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('familyTree');

    // This is mock data. In a real application, you would fetch this based on the `id`.
    const [patientDetails] = useState({
        id: id,
        name: 'Jay Sharam',
        age: 30,
        gender: 'Male',
        lastVisit: '2025-09-23',
        treatmentType: 'Panchakarma + Herbs',
        condition: 'Diabetes',
        ongoiingTreatments: ['Metformin', 'Insulin Therapy'],
        prakruti: 'Vata-Pitta',
        vikruti: 'Pitta Imbalance',
        agniType: 'Tikshna Agni',
        doshaImbalance: 'Excess Pitta, Mild Vata',
        nadi: 'Teevra',
        mala: 'Regular',
        mutra: 'Normal',
        shwas: 'Normal',
        diet: 'Avoid spicy food, include ghee & coconut water',
        lifestyle: 'Morning yoga, avoid late nights',
        history: [
            { date: '2025-09-23', notes: 'Routine check-up. Blood sugar levels slightly elevated.' },
            { date: '2025-06-15', notes: 'Follow-up visit. Adjusted medication for better control.' },
            { date: '2025-03-10', notes: 'Initial diagnosis of diabetes. Started on metformin.' },
        ],
        prescriptions: [
            { medication: 'Metformin', dosage: '500mg', frequency: 'Twice a day' },
            { medication: 'Insulin Glargine', dosage: '10 units', frequency: 'Once daily at bedtime' },
            { medication: 'Triphala', dosage: '1 tsp', frequency: 'Once daily in morning' },
        ],
        therapies: [
            { type: 'Physical Therapy', notes: 'To improve mobility and reduce pain in joints.', schedule: 'Twice a week for 4 weeks' },
            { type: 'Abhyanga (Oil Massage)', notes: 'Daily self-massage with sesame oil', schedule: 'Daily' },
        ],
        visits: [
            { date: '2025-09-23', reason: 'Routine Check-up', doctor: 'Dr. Smith' },
            { date: '2025-06-15', reason: 'Follow-up', doctor: 'Dr. Smith' },
            { date: '2025-03-10', reason: 'Initial Consultation', doctor: 'Dr. Smith' },
        ],
        familyTree: [
            { id: 101, relation: 'Father', name: 'Raj Sharam', age: 60, image: '/assets/images/user-profile.jpeg', condition: 'Diabetes' },
            { id: 102, relation: 'Mother', name: 'Sita Sharam', age: 58, image: '/assets/images/user-profile.jpeg', condition: 'Hypertension' },
            { id: 103, relation: 'Sister', name: 'Anita Sharam', age: 28, image: '/assets/images/user-profile.jpeg', condition: 'Healthy' },
        ],
    });

    useEffect(() => {
        dispatch(setPageTitle('Patient Details'));
    });
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

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
                        <div className="flex items-center justify-between mb-5 cursor-pointer" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                            <h5 className="font-semibold text-lg dark:text-white-light">Profile</h5>
                            <span className="text-xl">{isProfileOpen ? '-' : '+'}</span>
                        </div>
                        <AnimateHeight duration={300} height={isProfileOpen ? 'auto' : 0}>
                            <div className="mb-5">
                                <div className="flex flex-col sm:flex-row items-center gap-5">
                                    <div>
                                        <img src="/assets/images/user-profile.jpeg" alt="img" className="w-24 h-24 rounded-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-primary text-xl mb-2">{patientDetails.name}</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 text-sm">
                                            <div className="flex items-center gap-2">
                                                <IconUser className="shrink-0" /> <strong>{patientDetails.gender}, {patientDetails.age} years</strong>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <IconCalendar className="shrink-0" /> <span><strong>Last Visit:</strong> {patientDetails.lastVisit}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <IconHeart className="shrink-0" /> <span><strong>Condition:</strong> {patientDetails.condition}</span>
                                            </div>
                                            <div className="flex items-center gap-2 col-span-full">
                                                <IconInfoCircle className="shrink-0" /> <span><strong>Ongoing:</strong> {patientDetails.ongoiingTreatments.join(', ')}</span>
                                            </div>

                                            {/* Ayurvedic Details */}
                                            <div className="border-t pt-3 mt-3 col-span-full">
                                                <h4 className="font-semibold text-md mb-2">Ayurvedic Profile</h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2">
                                                    <div><strong>Prakruti:</strong> {patientDetails.prakruti}</div>
                                                    <div><strong>Vikruti:</strong> {patientDetails.vikruti}</div>
                                                    <div><strong>Agni Type:</strong> {patientDetails.agniType}</div>
                                                    <div><strong>Dosha Imbalance:</strong> {patientDetails.doshaImbalance}</div>
                                                    <div><strong>Nadi:</strong> {patientDetails.nadi}</div>
                                                    <div><strong>Mala:</strong> {patientDetails.mala}</div>
                                                    <div><strong>Mutra:</strong> {patientDetails.mutra}</div>
                                                    <div><strong>Shwas:</strong> {patientDetails.shwas}</div>
                                                </div>
                                            </div>

                                            {/* Recommendations */}
                                            <div className="border-t pt-3 mt-3 col-span-full">
                                                <h4 className="font-semibold text-md mb-2">Recommendations</h4>
                                                <div className="space-y-2">
                                                    <div><strong>Diet:</strong> {patientDetails.diet}</div>
                                                    <div><strong>Lifestyle:</strong> {patientDetails.lifestyle}</div>
                                                </div>
                                            </div>
                                            <div className="col-span-full mt-4">
                                                <Link to={`/patient-examination/${patientDetails.id}`} className="btn btn-primary">
                                                    View Examination
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AnimateHeight>
                    </div>

                    <div className="panel">
                        <div className="pt-5">
                            <div className="mb-5">
                                <ul className="sm:flex font-semibold border-b border-gray-200 dark:border-gray-800">
                                    <li className="inline-block">
                                        <button onClick={() => setActiveTab('familyTree')} className={`p-3.5 py-2 -mb-[1px] block hover:text-primary ${activeTab === 'familyTree' ? 'text-primary border-b-2 border-primary' : ''}`}>
                                            Family Tree
                                        </button>
                                    </li>
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
                               {activeTab === 'familyTree' && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                                        {patientDetails.familyTree.map((member, index) => (
                                            <Link
                                                key={index}
                                                to={`/family-member/${member.id}`}
                                                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                            >
                                                <img
                                                    src={member.image}
                                                    alt={member.name}
                                                    className="w-20 h-20 rounded-full object-cover mb-3"
                                                />
                                                <h4 className="font-semibold text-lg text-gray-800 dark:text-white">{member.name}</h4>
                                                <p className="text-sm text-gray-500 dark:text-gray-300">{member.relation}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Age: {member.age}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Condition: {member.condition}</p>
                                            </Link>
                                        ))}
                                    </div>
                                )}

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

                                {activeTab === 'therapy' && (
                                    <div className="table-responsive text-[#515365] dark:text-white-light font-semibold">
                                        <table className="table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Therapy Type</th>
                                                    <th>Notes</th>
                                                    <th>Schedule</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {patientDetails.therapies.map((entry, index) => (
                                                    <tr key={index}>
                                                        <td>{entry.type}</td>
                                                        <td>{entry.notes}</td>
                                                        <td>{entry.schedule}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

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