import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import AnimateHeight from 'react-animate-height';
import { setPageTitle } from '../../../store/themeConfigSlice';
import IconUser from '../../../components/Icon/IconUser';
import IconHeart from '../../../components/Icon/IconHeart';

interface FamilyMemberType {
    id: string | undefined;
    name: string;
    age: number;
    relation: string;
    image: string;
    condition: string;
    prakruti?: string;
    vikruti?: string;
}

interface Examination {
    date: string;
    notes: string;
}

interface Prescription {
    medication: string;
    dosage: string;
    frequency: string;
    duration?: string;
    purpose?: string;
}

interface Therapy {
    type: string;
    schedule: string;
    oilOrHerbs?: string;
    duration?: string;
    notes?: string;
}

const FamilyMember: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch();
    const [member, setMember] = useState<FamilyMemberType | null>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(true);
    const [activeTab, setActiveTab] = useState<'examination' | 'prescription' | 'therapy'>('examination');
    const [isOpen, setIsOpen] = useState(false);
    const [presciptionOpen, setPresciptionOpen] = useState(false);


    // Mock family data
    const familyData: FamilyMemberType[] = [
        { id: '101', name: 'Raj Sharam', age: 60, relation: 'Father', image: '/assets/images/user-profile.jpeg', condition: 'Diabetes', prakruti: 'Vata', vikruti: 'Vata Imbalance' },
        { id: '102', name: 'Sita Sharam', age: 58, relation: 'Mother', image: '/assets/images/user-profile.jpeg', condition: 'Hypertension', prakruti: 'Pitta', vikruti: 'Pitta Imbalance' },
        { id: '103', name: 'Anita Sharam', age: 28, relation: 'Sister', image: '/assets/images/user-profile.jpeg', condition: 'Healthy', prakruti: 'Kapha', vikruti: 'None' },
    ];

    // Mock Ayurvedic data
    const [examinationData, setExaminationData] = useState<Examination[]>([
        { date: '2025-09-23', notes: 'Blood sugar slightly elevated. Pulse: Teevra Nadi, Agni: Tikshna' },
        { date: '2025-06-15', notes: 'Adjusted diet and lifestyle. Blood pressure normal.' },
    ]);

    const [prescriptionData, setPrescriptionData] = useState<Prescription[]>([
        { medication: 'Triphala Churna', dosage: '1 tsp', frequency: 'Morning before food', duration: '30 days', purpose: 'Digestive support' },
        { medication: 'Ashwagandha Powder', dosage: '1 tsp', frequency: 'Evening', duration: '45 days', purpose: 'Stress relief and immunity' },
    ]);

    const [therapyData, setTherapyData] = useState<Therapy[]>([
        { type: 'Abhyanga (Oil Massage)', schedule: 'Daily', oilOrHerbs: 'Sesame Oil', duration: '30 minutes', notes: 'Relaxation and vata pacification' },
        { type: 'Shirodhara', schedule: 'Weekly', oilOrHerbs: 'Bala Oil', duration: '30 minutes', notes: 'Mental relaxation and pitta balance' },
    ]);

    useEffect(() => {
        dispatch(setPageTitle('Family Member Details'));
        const selectedMember = familyData.find((m) => m.id === id);
        setMember(selectedMember || null);
    }, [id, dispatch]);

    if (!member) return <div className="text-center mt-10">Member not found</div>;

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <ul className="flex space-x-2 rtl:space-x-reverse mb-5">
                <li><Link to="/" className="text-primary hover:underline">Dashboard</Link></li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <Link to="/my-patients" className="text-primary hover:underline">My Patients</Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Family Member Details</span>
                </li>
            </ul>

            {/* Profile Section */}
            <div className="panel mb-5">
                <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                    <h5 className="font-semibold text-lg dark:text-white-light">
                        Profile - {member.name} ({member.relation})
                    </h5>
                    <span className="text-xl">{isProfileOpen ? '-' : '+'}</span>
                </div>
                <AnimateHeight duration={300} height={isProfileOpen ? 'auto' : 0}>
                    <div className="flex flex-col sm:flex-row items-center gap-5 mt-3">
                        <img src={member.image} alt={member.name} className="w-24 h-24 rounded-full object-cover" />
                        <div className="flex-1">
                            <h3 className="font-semibold text-primary text-xl mb-2">{member.name} ({member.relation})</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-sm">
                                <div className="flex items-center gap-2"><IconUser /> <strong>{member.age} years</strong></div>
                                <div className="flex items-center gap-2"><IconHeart /> <span><strong>Condition:</strong> {member.condition}</span></div>
                                {member.prakruti && <div><strong>Prakruti:</strong> {member.prakruti}</div>}
                                {member.vikruti && <div><strong>Vikruti:</strong> {member.vikruti}</div>}
                            </div>
                        </div>
                    </div>
                </AnimateHeight>
            </div>

            {/* Tabs */}
            <div className="panel">
                <ul className="flex border-b border-gray-200 dark:border-gray-800 font-semibold mb-4">
                    <li className="mr-4">
                        <button onClick={() => setActiveTab('examination')} className={`pb-2 ${activeTab === 'examination' ? 'border-b-2 border-primary text-primary' : ''}`}>
                            Examination
                        </button>
                    </li>
                    <li className="mr-4">
                        <button onClick={() => setActiveTab('prescription')} className={`pb-2 ${activeTab === 'prescription' ? 'border-b-2 border-primary text-primary' : ''}`}>
                            Prescription
                        </button>
                    </li>
                    <li className="mr-4">
                        <button onClick={() => setActiveTab('therapy')} className={`pb-2 ${activeTab === 'therapy' ? 'border-b-2 border-primary text-primary' : ''}`}>
                            Therapy
                        </button>
                    </li>
                </ul>

                <div>
                    {/* Examination Tab */}
                  {/* Examination Tab */}
{/* Examination Tab */}
{activeTab === 'examination' && (
    <div className="space-y-3">
        {/* Existing Examination Records */}
        {examinationData.map((item, idx) => (
            <div key={idx} className="border rounded p-3 shadow-sm">
                <div className="flex justify-between text-sm text-gray-500">
                    <span>Date: {item.date}</span>
                </div>
                <p className="mt-2">{item.notes}</p>
            </div>
        ))}

        {/* Side-by-Side Accordions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
            {/* Add Examination Accordion */}
            <div className="border rounded p-3 shadow-sm bg-white dark:bg-gray-800">
                <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <h5 className="font-semibold text-lg text-primary">
                        Add Examination
                    </h5>
                    <span className="text-xl">{isOpen ? '-' : '+'}</span>
                </div>

                <AnimateHeight duration={300} height={isOpen ? 'auto' : 0}>
                    <div className="mt-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[
                                'Height (cm)', 'Weight (kg)', 'Blood Pressure (BP)', 'Pulse Type (Nadi)',
                                'Temperature', 'BMI', 'SPO2', 'Heart Rate',
                                'Vata Level', 'Pitta Level', 'Kapha Level', 'Agni (Digestion)',
                                'Stool', 'Urine', 'Sleep Quality'
                            ].map((label, idx) => (
                                <div key={idx} className="flex flex-col">
                                    <label className="text-sm font-medium mb-1">{label}</label>
                                    <input
                                        type="text"
                                        className="border rounded px-2 py-1 text-sm focus:ring focus:ring-primary focus:outline-none"
                                        placeholder="Input value"
                                    />
                                </div>
                            ))}
                        </div>
                        <button className="mt-3 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                            Add Examination
                        </button>
                    </div>
                </AnimateHeight>
            </div>

            {/* Diagnosis & Recommendations Accordion */}
            <div className="border rounded p-3 shadow-sm bg-white dark:bg-gray-800">
                <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => setPresciptionOpen(!presciptionOpen)}
                >
                    <h5 className="font-semibold text-lg text-primary">
                        Diagnosis & Recommendations
                    </h5>
                    <span className="text-xl">{presciptionOpen ? '-' : '+'}</span>
                </div>

                <AnimateHeight duration={300} height={presciptionOpen ? 'auto' : 0}>
                    <div className="mt-3">
                        <div className="grid grid-cols-1 gap-2">
                            {[
                                'Diet Recommendation', 'Lifestyle Advice',
                                'Herbal Medication', 'Therapy Suggestion'
                            ].map((label, idx) => (
                                <div key={idx} className="flex flex-col">
                                    <label className="text-sm font-medium mb-1">{label}</label>
                                    <textarea
                                        className="border rounded px-2 py-1 text-sm focus:ring focus:ring-primary focus:outline-none"
                                        placeholder={`Enter ${label.toLowerCase()}`}
                                        rows={2}
                                    />
                                </div>
                            ))}
                        </div>
                        <button className="mt-3 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                            Add Diagnosis
                        </button>
                    </div>
                </AnimateHeight>
            </div>
        </div>
    </div>
)}



                    {/* Prescription Tab */}
                   {activeTab === 'prescription' && (
    <div className="space-y-5">

        {/* Existing Prescriptions */}
        {prescriptionData.map((item, idx) => (
            <div key={idx} className="border rounded p-3 shadow-sm bg-white dark:bg-gray-800">
                <p><strong>Medication:</strong> {item.medication}</p>
                <p><strong>Dosage:</strong> {item.dosage}</p>
                <p><strong>Frequency:</strong> {item.frequency}</p>
                {item.duration && <p><strong>Duration:</strong> {item.duration}</p>}
                {item.purpose && <p><strong>Purpose:</strong> {item.purpose}</p>}
            </div>
        ))}

        {/* Add Prescription Form */}
        <div 
                className="flex justify-between items-center cursor-pointer mb-4"
                onClick={() => setPresciptionOpen(!presciptionOpen)}
            >
                <h5 className="font-semibold text-lg text-primary">
                    Add Ayurvedic Prescription
                </h5>
                <span className="text-xl">{presciptionOpen ? '-' : '+'}</span>
            </div>

            {/* Collapsible Form */}
            <AnimateHeight duration={300} height={presciptionOpen ? 'auto' : 0}>
                <form className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1">Herbal Medicine / Formulation</label>
                            <input type="text" className="border rounded px-3 py-2 text-sm focus:ring focus:ring-primary focus:outline-none" placeholder="e.g., Triphala Churna" />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1">Dosage</label>
                            <input type="text" className="border rounded px-3 py-2 text-sm focus:ring focus:ring-primary focus:outline-none" placeholder="e.g., 1 tsp" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1">Frequency</label>
                            <input type="text" className="border rounded px-3 py-2 text-sm focus:ring focus:ring-primary focus:outline-none" placeholder="Morning / Evening" />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1">Duration</label>
                            <input type="text" className="border rounded px-3 py-2 text-sm focus:ring focus:ring-primary focus:outline-none" placeholder="e.g., 30 days" />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1">Purpose / Notes</label>
                        <textarea className="border rounded px-3 py-2 text-sm focus:ring focus:ring-primary focus:outline-none" placeholder="Enter purpose or notes" rows={3}></textarea>
                    </div>

                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md transition">
                        Add Prescription
                    </button>
                </form>
            </AnimateHeight>
    </div>
)}

                    {/* Therapy Tab */}
                   {activeTab === 'therapy' && (
    <div className="space-y-5">

        {/* Existing Therapy Records */}
        {therapyData.map((item, idx) => (
            <div key={idx} className="border rounded p-3 shadow-sm bg-white dark:bg-gray-800">
                <p><strong>Therapy:</strong> {item.type}</p>
                <p><strong>Schedule:</strong> {item.schedule}</p>
                {item.oilOrHerbs && <p><strong>Oil / Herbs:</strong> {item.oilOrHerbs}</p>}
                {item.duration && <p><strong>Duration:</strong> {item.duration}</p>}
                {item.notes && <p><strong>Notes:</strong> {item.notes}</p>}
            </div>
        ))}
<div 
                className="flex justify-between items-center cursor-pointer mb-4"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h5 className="font-semibold text-lg text-primary">
                    Add Ayurvedic Therapy
                </h5>
                <span className="text-xl">{isOpen ? '-' : '+'}</span>
            </div>
        {/* Add Therapy Form */}
         <AnimateHeight duration={300} height={isOpen ? 'auto' : 0}>
                <form className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1">Therapy Type</label>
                            <input type="text" className="border rounded px-3 py-2 text-sm focus:ring focus:ring-primary focus:outline-none" placeholder="e.g., Abhyanga" />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1">Schedule / Frequency</label>
                            <input type="text" className="border rounded px-3 py-2 text-sm focus:ring focus:ring-primary focus:outline-none" placeholder="Daily / Weekly" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1">Oil / Herbs used</label>
                            <input type="text" className="border rounded px-3 py-2 text-sm focus:ring focus:ring-primary focus:outline-none" placeholder="e.g., Sesame Oil" />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1">Duration / Session Time</label>
                            <input type="text" className="border rounded px-3 py-2 text-sm focus:ring focus:ring-primary focus:outline-none" placeholder="e.g., 30 min" />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1">Purpose / Notes</label>
                        <textarea className="border rounded px-3 py-2 text-sm focus:ring focus:ring-primary focus:outline-none" placeholder="Enter purpose or notes" rows={3}></textarea>
                    </div>

                    <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-md transition">
                        Add Therapy
                    </button>
                </form>
            </AnimateHeight>
    </div>
)}
                </div>
            </div>
        </div>
    );
};

export default FamilyMember;
