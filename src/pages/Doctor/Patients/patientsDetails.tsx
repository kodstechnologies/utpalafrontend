import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AnimateHeight from 'react-animate-height';
import { Link, useParams } from 'react-router-dom';
import { setPageTitle } from '../../../store/themeConfigSlice';
import IconUser from '../../../components/Icon/IconUser';
import IconCalendar from '../../../components/Icon/IconCalendar';
import IconHeart from '../../../components/Icon/IconHeart';
import IconInfoCircle from '../../../components/Icon/IconInfoCircle';
// Assuming the following icons are available
import IconListCheck from '../../../components/Icon/IconListCheck'; // For History/Prescription
import IconHome from '../../../components/Icon/IconHome'; // For Family Tree
import IconClock from '../../../components/Icon/IconClock'; // Placeholder for Visits

import { IRootState } from '../../../store';
import FamilyMemberModal from './FamilyMemberModal';
import IconPaperclip from '../../../components/Icon/IconPaperclip';
import IconChatNotification from '../../../components/Icon/IconChatNotification';
import IconMenuNotes from '../../../components/Icon/Menu/IconMenuNotes';

interface FamilyMember {
    id: number;
    relation: string;
    name: string;
    age: number;
    image: string;
    condition: string;
}

const PatientDetails = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const [isProfileOpen, setIsProfileOpen] = useState(true);
    // Note: The requested tab structure uses 'general' and 'professional' in the example,
    // but the component uses 'familyTree', 'history', 'prescription', 'therapy', 'visits'.
    const [activeTab, setActiveTab] = useState<'familyTree' | 'history' | 'prescription' | 'therapy' | 'visits'>('familyTree');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);

    // Define the custom tab styling classes
    const tabActiveClasses = 'text-primary border-b-2 border-primary dark:text-primary dark:border-primary';
    const tabInactiveClasses = 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600';

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
    }, [dispatch]);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const handleViewMember = (member: FamilyMember) => {
        setSelectedMember(member);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedMember(null);
    };

    // Helper function to render a Tab button with the new styling
    const renderTabButton = (tabName: typeof activeTab, label: string, IconComponent: React.ElementType) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`py-4 px-1 text-sm font-medium focus:outline-none transition duration-150 ease-in-out flex items-center ${
                activeTab === tabName ? tabActiveClasses : tabInactiveClasses
            }`}
        >
            <IconComponent className="w-5 h-5 inline ltr:mr-2 rtl:ml-2 align-text-bottom" />
            {label}
        </button>
    );

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
                    {/* Profile Panel (Top part) */}
                    <div className="panel">
                        <div className="flex items-center justify-between mb-5 cursor-pointer" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                            <h5 className="font-semibold text-lg dark:text-white-light">Profile</h5>
                            <span className="text-sm">{isProfileOpen ? 'Close' : 'Open'}</span>
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
                                                <IconUser className="shrink-0 w-4 h-4" /> <strong>{patientDetails.gender}, {patientDetails.age} years</strong>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <IconCalendar className="shrink-0 w-4 h-4" /> <span><strong>Last Visit:</strong> {patientDetails.lastVisit}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <IconHeart className="shrink-0 w-4 h-4" /> <span><strong>Condition:</strong> {patientDetails.condition}</span>
                                            </div>
                                            <div className="flex items-center gap-2 col-span-full">
                                                <IconInfoCircle className="shrink-0 w-4 h-4" /> <span><strong>Ongoing:</strong> {patientDetails.ongoiingTreatments.join(', ')}</span>
                                            </div>
                                            <div className="col-span-full mt-4">
                                                <Link 
                                                    to={`/patient-examination/${patientDetails.id}`} 
                                                    className="btn btn-primary text-base font-semibold rounded-lg"
                                                >
                                                    View Examination
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AnimateHeight>
                    </div>

                    {/* Tabs Panel (Bottom part with requested structure) */}
                    <div className="panel p-0">
                        {/* Tabs for Navigation */}
                        <div className="border-b border-gray-200 dark:border-gray-700 px-6 sm:px-8">
                            <div className="flex space-x-6 -mb-px overflow-x-auto">
                                {renderTabButton('familyTree', 'Family Tree', IconHome)}
                                {renderTabButton('history', 'History', IconListCheck)}
                                {renderTabButton('prescription', 'Prescription', IconMenuNotes)}
                                {renderTabButton('therapy', 'Therapy', IconHeart)}
                                {renderTabButton('visits', 'Visits', IconClock)}
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6 sm:p-8 min-h-[400px]">
                            {activeTab === 'familyTree' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                                    {patientDetails.familyTree.map((member, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleViewMember(member)}
                                            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
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
                                        </div>
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
            <FamilyMemberModal isOpen={isModalOpen} onClose={handleCloseModal} member={selectedMember} />
        </div>
    );
};

export default PatientDetails;