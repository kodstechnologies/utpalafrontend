import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import AnimateHeight from 'react-animate-height';
import { setPageTitle } from '../../../store/themeConfigSlice';
import IconUser from '../../../components/Icon/IconUser'; // Icon for 'Examination' (Placeholder for IconHome/IconListCheck)
import IconX from '../../../components/Icon/IconX';
import Prescription from '../Priscription';
import TreatmentSessions from '../Treatment';
import IconHeart from '../../../components/Icon/IconHeart';

// Define placeholder icons for the tabs (you should replace these with your actual icon imports)
const IconExamination = IconUser;
const IconPrescription = IconHeart;
const IconTreatment = IconX; // Placeholder for a third icon

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

// Custom hook for managing accordion state for multiple sections
const useAccordionState = (initialState: Record<string, boolean>) => {
    const [openStates, setOpenStates] = useState(initialState);
    const toggle = (key: string) => {
        setOpenStates((prev) => ({ ...prev, [key]: !prev[key] }));
    };
    return { openStates, toggle };
};

const PatientExamination: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch();
    const [patient, setPatient] = useState<Patient | null>(null);
    // Updated tab state to include all three tabs
    const [activeTab, setActiveTab] = useState<'examination' | 'prescription' | 'treatment'>('examination');

    // --- START: Tab Specific Classes (Based on your first code block) ---
    const tabActiveClasses = 'text-primary border-b-2 border-primary dark:text-primary dark:border-primary';
    const tabInactiveClasses = 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600';
    // --- END: Tab Specific Classes ---

    // Accordion states for the new and existing sections
    const { openStates, toggle } = useAccordionState({
        isProfileOpen: true,
        isPrakritAssessmentOpen: true, 
        isComplaintsOpen: true, 
        isHistoryOfPatientIllnessOpen: true, 
        isOnGoingMedicationsOpen: true, 
        isPreviousInvestigationsOpen: true, 
        isPresentInvestigationsOpen: true, 
        isMedicalSurgicalHistoryOpen: true, 
        isExamAccordionOpen: true, 
        isDiagnosisAccordionOpen: true, 
    });

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

    // Helper component for the new sections to maintain UI consistency
    const SectionAccordion: React.FC<{ title: string; stateKey: string; required?: boolean }> = ({ title, stateKey, required = false }) => (
        <div className="panel p-0 shadow-none">
            <div
                className="flex justify-between items-center cursor-pointer p-4 border-b dark:border-gray-700"
                onClick={() => toggle(stateKey)}
            >
                <h5 className={`font-semibold text-lg text-primary`}>
                    {title} {required && <span className="text-red-500">*</span>}
                </h5>
                <span className="text-sm">{openStates[stateKey] ? 'Close' : 'Open'}</span>
            </div>
            <AnimateHeight duration={300} height={openStates[stateKey] ? 'auto' : 0}>
                <div className="p-4">
                    <textarea
                        className="form-input text-sm w-full min-h-[100px]"
                        placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin felis a eget eget urna. Ultricies sit pharetra maecenas neque, vel hendrerit viverra consectetur adipiscing dolor sit."
                        rows={4}
                        // In a real application, you would add state management here for the textarea value
                        readOnly={true} // Set to true for placeholder example
                    />
                    {title.includes('Investigations') && (
                        <div className="mt-2">
                            <button type="button" className="btn btn-outline-primary btn-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M11 19v-6H5v-2h6V5h2v6h6v2h-6v6Z" /></svg>
                                Upload file
                            </button>
                        </div>
                    )}
                </div>
            </AnimateHeight>
        </div>
    );

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

            {/* Main Content Panel */}
            <div className="panel p-0 mb-5">
                {/* Profile Section (Kept outside the tab logic as it appears to be a header) */}
                <div className="p-6 sm:p-8">
                    <div className="flex justify-between items-center cursor-pointer" onClick={() => toggle('isProfileOpen')}>
                        <h5 className="font-semibold text-lg dark:text-white-light">Profile - {patient.name}</h5>
                        <span className="text-sm">{openStates.isProfileOpen ? 'Close' : 'Open'}</span>
                    </div>
                    <AnimateHeight duration={300} height={openStates.isProfileOpen ? 'auto' : 0}>
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
                
                {/* Tabs for Navigation (NEW STYLING APPLIED HERE) */}
                <div className="border-b border-gray-200 dark:border-gray-700 px-6 sm:px-8">
                    <div className="flex space-x-6 -mb-px">
                        {/* Doctor Examination Tab */}
                        <button
                            onClick={() => setActiveTab('examination')}
                            className={`py-4 px-1 text-sm font-medium focus:outline-none transition duration-150 ease-in-out flex items-center ${
                                activeTab === 'examination' ? tabActiveClasses : tabInactiveClasses
                            }`}
                        >
                            <IconExamination className="w-5 h-5 inline ltr:mr-2 rtl:ml-2 align-text-bottom" />
                            Doctor Examination
                        </button>
                        
                        {/* Prescription Tab */}
                        <button
                            onClick={() => setActiveTab('prescription')}
                            className={`py-4 px-1 text-sm font-medium focus:outline-none transition duration-150 ease-in-out flex items-center ${
                                activeTab === 'prescription' ? tabActiveClasses : tabInactiveClasses
                            }`}
                        >
                            <IconPrescription className="w-5 h-5 inline ltr:mr-2 rtl:ml-2 align-text-bottom" />
                            Prescription
                        </button>

                        {/* Treatment Tab */}
                        <button
                            onClick={() => setActiveTab('treatment')}
                            className={`py-4 px-1 text-sm font-medium focus:outline-none transition duration-150 ease-in-out flex items-center ${
                                activeTab === 'treatment' ? tabActiveClasses : tabInactiveClasses
                            }`}
                        >
                            <IconTreatment className="w-5 h-5 inline ltr:mr-2 rtl:ml-2 align-text-bottom" />
                            Treatment
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="p-6 sm:p-8 min-h-[400px]">
                    {activeTab === 'examination' && (
                        <div className="space-y-5">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                <div className="space-y-5">
                                    <SectionAccordion title="Prakriti Assessment" stateKey="isPrakritAssessmentOpen" />
                                    <SectionAccordion title="Complaints" stateKey="isComplaintsOpen" required={true} />
                                    <SectionAccordion title="History of Patient Illness" stateKey="isHistoryOfPatientIllnessOpen" />
                                    <SectionAccordion title="Ongoing Medications" stateKey="isOnGoingMedicationsOpen" />
                                    <SectionAccordion title="Previous Investigations" stateKey="isPreviousInvestigationsOpen" />
                                    <SectionAccordion title="Present Investigations" stateKey="isPresentInvestigationsOpen" />
                                    <SectionAccordion title="Medical History / Surgical History" stateKey="isMedicalSurgicalHistoryOpen" />
                                </div>
                                <div className="space-y-5">
                                    {/* Add Examination Accordion */}
                                    <div className="panel p-0 shadow-none">
                                        <div className="flex justify-between items-center cursor-pointer p-4 border-b dark:border-gray-700" onClick={() => toggle('isExamAccordionOpen')}>
                                            <h5 className="font-semibold text-lg text-primary">Add Examination</h5>
                                            <span className="text-sm">{openStates.isExamAccordionOpen ? 'Close' : 'Open'}</span>
                                        </div>
                                        <AnimateHeight duration={300} height={openStates.isExamAccordionOpen ? 'auto' : 0}>
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
                                        <div className="flex justify-between items-center cursor-pointer p-4 border-b dark:border-gray-700" onClick={() => toggle('isDiagnosisAccordionOpen')}>
                                            <h5 className="font-semibold text-lg text-primary">Diagnosis & Recommendations</h5>
                                            <span className="text-sm">{openStates.isDiagnosisAccordionOpen ? 'Close' : 'Open'}</span>
                                        </div>
                                        <AnimateHeight duration={300} height={openStates.isDiagnosisAccordionOpen ? 'auto' : 0}>
                                            <div className="p-4 space-y-3">
                                                {recommendations.map((rec, index) => (
                                                    <div key={rec.id} className="flex items-start gap-2">
                                                        <div className="flex-grow">
                                                            <textarea
                                                                className="form-input text-sm w-full"
                                                                placeholder={index === 0 ? 'Enter diagnosis/recommendation...' : 'Enter details...'}
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
                                                <button type="button" onClick={handleAddRecommendation} className="btn btn-sm btn-outline-primary mt-3">+ Add Diagnosis/Recommendation</button>
                                            </div>
                                        </AnimateHeight>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-4 mt-5">
                                <button type="button" className="btn btn-outline-danger">Cancel</button>
                                <button type="button" className="btn btn-success">Confirm</button>
                            </div>
                        </div>
                    )}
                    
                    {/* Prescription Tab Content */}
                    {activeTab === 'prescription' && (
                        <div>
                            <Prescription />
                        </div>
                    )}
                    
                    {/* Treatment Tab Content */}
                    {activeTab === 'treatment' && (
                        <div>
                            <TreatmentSessions />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientExamination;