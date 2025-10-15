import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import AnimateHeight from 'react-animate-height';
import { setPageTitle } from '../../../store/themeConfigSlice';
import IconUser from '../../../components/Icon/IconUser';
import IconHeart from '../../../components/Icon/IconHeart';
import IconX from '../../../components/Icon/IconX';
import Prescription from '../Priscription';

interface Patient {
    id: string | undefined;
    name: string;
    age: number;
    gender: string;
    image: string;
    condition: string;
    prakruti?: string;
    vikruti?: string;
}

interface Recommendation {
    id: number;
    label: string;
    value: string;
}

interface DynamicField {
    id: number;
    label: string;
    value: string;
}

const PatientExamination: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch();
    const [patient, setPatient] = useState<Patient | null>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(true);
    const [isExamAccordionOpen, setExamAccordionOpen] = useState(true);
    const [activeTab, setActiveTab] = useState<'examination' | 'prescription' | 'treatment'>('examination');
    const [isDiagnosisAccordionOpen, setDiagnosisAccordionOpen] = useState(true);

    const [recommendations, setRecommendations] = useState<Recommendation[]>([{ id: 1, label: 'Diet Recommendation', value: '' }]);
    const [examinationValues, setExaminationValues] = useState<Record<string, string>>({});
    const [additionalExamFields, setAdditionalExamFields] = useState<DynamicField[]>([]);

    // Mock patient data - in a real app, this would be fetched
    const patientData: Patient[] = [
        { id: '1', name: 'Jay Sharma', age: 30, gender: 'Male', image: '/assets/images/user-profile.jpeg', condition: 'Diabetes', prakruti: 'Vata-Pitta', vikruti: 'Vata Imbalance' },
        // ... other patients
    ];

    useEffect(() => {
        dispatch(setPageTitle('Patient Examination'));
        const selectedPatient = patientData.find((p) => p.id === id);
        setPatient(selectedPatient || null);
    }, [id, dispatch]);

    const handleAddRecommendation = () => {
        setRecommendations([...recommendations, { id: Date.now(), label: '', value: '' }]);
    };

    const handleRecommendationChange = (id: number, field: 'label' | 'value', text: string) => {
        setRecommendations(recommendations.map((rec) => (rec.id === id ? { ...rec, [field]: text } : rec)));
    };

    const handleRemoveRecommendation = (id: number) => {
        setRecommendations((prev) => prev.filter((rec) => rec.id !== id));
    };

    const handleStaticExamChange = (label: string, value: string) => {
        setExaminationValues((prev) => ({ ...prev, [label]: value }));
    };

    const handleAddAdditionalExamField = () => {
        setAdditionalExamFields((prev) => [...prev, { id: Date.now(), label: '', value: '' }]);
    };

    const handleAdditionalExamChange = (id: number, field: 'label' | 'value', text: string) => {
        setAdditionalExamFields((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: text } : item)));
    };

    const handleRemoveAdditionalExamField = (id: number) => {
        setAdditionalExamFields((prev) => prev.filter((item) => item.id !== id));
    };

    if (!patient) return <div className="text-center mt-10">Patient not found</div>;

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <ul className="flex space-x-2 rtl:space-x-reverse mb-5">
                <li><Link to="/" className="text-primary hover:underline">Dashboard</Link></li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <Link to="/my-patients" className="text-primary hover:underline">My Patients</Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Patient Examination</span>
                </li>
            </ul>

            {/* Profile Section */}
            <div className="panel mb-5">
                <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                    <h5 className="font-semibold text-lg dark:text-white-light">Profile - {patient.name}</h5>
                    <span className="text-xl">{isProfileOpen ? '-' : '+'}</span>
                </div>
                <AnimateHeight duration={300} height={isProfileOpen ? 'auto' : 0}>
                    <div className="flex flex-col sm:flex-row items-center gap-5 mt-3">
                        <img src={patient.image} alt={patient.name} className="w-24 h-24 rounded-full object-cover" />
                        <div className="flex-1">
                            <h3 className="font-semibold text-primary text-xl mb-2">{patient.name}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-sm">
                                <div className="flex items-center gap-2"><IconUser /> <strong>{patient.age} years, {patient.gender}</strong></div>
                                <div className="flex items-center gap-2"><IconHeart /> <span><strong>Condition:</strong> {patient.condition}</span></div>
                                {patient.prakruti && <div><strong>Prakruti:</strong> {patient.prakruti}</div>}
                                {patient.vikruti && <div><strong>Vikruti:</strong> {patient.vikruti}</div>}
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
                            Doctor Examination
                        </button>
                    </li>
                    <li className="mr-4">
                        <button onClick={() => setActiveTab('prescription')} className={`pb-2 ${activeTab === 'prescription' ? 'border-b-2 border-primary text-primary' : ''}`}>
                            Prescription
                        </button>
                    </li>
                    <li className="mr-4">
                        <button onClick={() => setActiveTab('treatment')} className={`pb-2 ${activeTab === 'treatment' ? 'border-b-2 border-primary text-primary' : ''}`}>
                            Treatment
                        </button>
                    </li>
                </ul>

                <div>
                    {activeTab === 'examination' && (
                        <div className="space-y-5">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                {/* Add Examination Accordion */}
                                <div className="panel p-0 shadow-none">
                                    <div className="flex justify-between items-center cursor-pointer p-4 border-b dark:border-gray-700" onClick={() => setExamAccordionOpen(!isExamAccordionOpen)}>
                                        <h5 className="font-semibold text-lg text-primary">Add Examination</h5>
                                        <span className="text-xl">{isExamAccordionOpen ? '-' : '+'}</span>
                                    </div>
                                    <AnimateHeight duration={300} height={isExamAccordionOpen ? 'auto' : 0}>
                                        <div className="p-4 space-y-3">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {['Height (cm)', 'Weight (kg)', 'Blood Pressure (BP)', 'Temperature', 'BMI', 'SPO2', 'Heart Rate', 'Pulse Rate'].map((label) => (
                                                    <div key={label} className="flex flex-col">
                                                        <label className="text-sm font-medium mb-1">{label}</label>
                                                        <input type="text" className="form-input text-sm" placeholder="Input value" value={examinationValues[label] || ''} onChange={(e) => handleStaticExamChange(label, e.target.value)} />
                                                    </div>
                                                ))}
                                            </div>
                                            {additionalExamFields.map((field) => (
                                                <div key={field.id} className="pt-2 border-t border-dashed dark:border-gray-700">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                                                        <div>
                                                            <label className="text-sm font-medium mb-1">Additional Parameter</label>
                                                            <input type="text" className="form-input text-sm" placeholder="Enter parameter name" value={field.label} onChange={(e) => handleAdditionalExamChange(field.id, 'label', e.target.value)} />
                                                        </div>
                                                        <div className="flex items-end gap-2">
                                                            <div className="flex-grow">
                                                                <label className="text-sm font-medium mb-1">Value</label>
                                                                <input type="text" className="form-input text-sm" placeholder="Enter value" value={field.value} onChange={(e) => handleAdditionalExamChange(field.id, 'value', e.target.value)} />
                                                            </div>
                                                            <button type="button" onClick={() => handleRemoveAdditionalExamField(field.id)} className="btn btn-outline-danger p-2"> <IconX className="w-4 h-4" /> </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <button type="button" onClick={handleAddAdditionalExamField} className="btn btn-sm btn-outline-primary mt-4">+ Add More</button>
                                        </div>
                                    </AnimateHeight>
                                </div>

                                {/* Diagnosis & Recommendations Accordion */}
                                <div className="panel p-0 shadow-none">
                                    <div className="flex justify-between items-center cursor-pointer p-4 border-b dark:border-gray-700" onClick={() => setDiagnosisAccordionOpen(!isDiagnosisAccordionOpen)}>
                                        <h5 className="font-semibold text-lg text-primary">Diagnosis & Recommendations</h5>
                                        <span className="text-xl">{isDiagnosisAccordionOpen ? '-' : '+'}</span>
                                    </div>
                                    <AnimateHeight duration={300} height={isDiagnosisAccordionOpen ? 'auto' : 0}>
                                        <div className="p-4 space-y-3">
                                            {recommendations.map((rec, index) => (
                                                <div key={rec.id} className="flex items-start gap-2">
                                                    <div className="flex-grow">
                                                        <textarea
                                                            className="form-input text-sm w-full"
                                                            placeholder={index === 0 ? 'Enter diet recommendation...' : 'Enter details...'}
                                                            rows={2}
                                                            value={rec.value}
                                                            onChange={(e) => handleRecommendationChange(rec.id, 'value', e.target.value)}
                                                        />
                                                    </div>
                                                    {index > 0 && (
                                                        <button type="button" onClick={() => handleRemoveRecommendation(rec.id)} className="btn btn-outline-danger p-2 mt-1"> <IconX className="w-4 h-4" /> </button>
                                                    )}
                                                </div>
                                            ))}
                                            <button type="button" onClick={handleAddRecommendation} className="btn btn-sm btn-outline-primary mt-3">+ Add Field</button>
                                        </div>
                                    </AnimateHeight>
                                </div>
                            </div>
                            <div className="flex justify-end gap-4 mt-5">
                                <button type="button" className="btn btn-outline-danger">Cancel</button>
                                <button type="button" className="btn btn-success">Confirm</button>
                            </div>
                        </div>
                    )}
                    {activeTab === 'prescription' && (
                        <div>
                            <Prescription />
                        </div>
                    )}
                    {activeTab === 'treatment' && <div>Treatment content goes here...</div>}
                </div>
            </div>
        </div>
    );
};

export default PatientExamination;