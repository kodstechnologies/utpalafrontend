import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import AnimateHeight from 'react-animate-height';
import { setPageTitle } from '../../../store/themeConfigSlice';
import IconUser from '../../../components/Icon/IconUser';
import IconX from '../../../components/Icon/IconX';
import IconHeart from '../../../components/Icon/IconHeart';
import Prescription from '../Priscription';
import TreatmentSessions from '../Treatment';

// Placeholder icons for tabs
const IconExamination = IconUser;
const IconPrescription = IconHeart;
const IconTreatment = IconX;

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

// Accordion hook
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
    const [activeTab, setActiveTab] = useState<'examination' | 'prescription' | 'treatment'>('examination');

    const tabActiveClasses = 'text-green-600 border-b-2 border-green-600 font-semibold';
    const tabInactiveClasses = 'text-gray-500 hover:text-green-600 border-b-2 border-transparent hover:border-green-300 transition';

    // --- MODIFICATION: Reusable style for inputs and textareas ---
    const formInputStyles = "w-full text-sm rounded-md border border-green-400 focus:border-green-600 focus:ring-2 focus:ring-green-100 bg-transparent transition-all duration-300 placeholder-gray-400 px-3 py-2";


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

    const [recommendations, setRecommendations] = useState<Recommendation[]>([{ id: 1, label: 'Diagnosis', value: '' }]);
    const [examinationValues, setExaminationValues] = useState<Record<string, string>>({});
    const [additionalExamFields, setAdditionalExamFields] = useState<DynamicField[]>([]);

    const patientData: Patient[] = [
        {
            id: '1',
            name: 'Jay Sharma',
            age: 30,
            gender: 'Male',
            image: '/assets/images/user-profile.jpeg',
            condition: 'Diabetes',
            prakruti: 'Vata-Pitta',
            vikruti: 'Vata Imbalance',
        },
    ];

    useEffect(() => {
        dispatch(setPageTitle('Patient Examination'));
        const selectedPatient = patientData.find((p) => p.id === id);
        setPatient(selectedPatient || null);
    }, [id, dispatch]);

    const handleAddRecommendation = () =>
        setRecommendations([...recommendations, { id: Date.now(), label: '', value: '' }]);

    const handleRecommendationChange = (id: number, field: 'label' | 'value', text: string) =>
        setRecommendations(recommendations.map((rec) => (rec.id === id ? { ...rec, [field]: text } : rec)));

    const handleRemoveRecommendation = (id: number) =>
        setRecommendations((prev) => prev.filter((rec) => rec.id !== id));

    const handleStaticExamChange = (label: string, value: string) =>
        setExaminationValues((prev) => ({ ...prev, [label]: value }));

    const handleAddAdditionalExamField = () =>
        setAdditionalExamFields((prev) => [...prev, { id: Date.now(), label: '', value: '' }]);

    const handleAdditionalExamChange = (id: number, field: 'label' | 'value', text: string) =>
        setAdditionalExamFields((prev) =>
            prev.map((item) => (item.id === id ? { ...item, [field]: text } : item))
        );

    const handleRemoveAdditionalExamField = (id: number) =>
        setAdditionalExamFields((prev) => prev.filter((item) => item.id !== id));

    // Generic Accordion Component
    const SectionAccordion: React.FC<{ title: string; stateKey: string; required?: boolean }> = ({
        title,
        stateKey,
        required = false,
    }) => (
        <div className="border border-green-400 rounded-xl transition-all duration-300 bg-white dark:bg-gray-900">
            <div
                className="flex justify-between items-center cursor-pointer p-4 rounded-t-xl border-b border-green-300 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 transition"
                onClick={() => toggle(stateKey)}
            >
                <h5 className="font-semibold text-green-600">
                    {title} {required && <span className="text-red-500">*</span>}
                </h5>
                <span className="text-sm text-green-600 font-medium">
                    {openStates[stateKey] ? 'Close' : 'Open'}
                </span>
            </div>
            <AnimateHeight duration={300} height={openStates[stateKey] ? 'auto' : 0}>
                <div className="p-4">
                    <textarea
                        // --- MODIFICATION: Applied new styles ---
                        className={`${formInputStyles} resize-none`}
                        placeholder={`Enter ${title}...`}
                        rows={4}
                        readOnly // Kept as readOnly as in original code, remove if editing is needed
                    />
                    {title.includes('Investigations') && (
                        <div className="mt-2">
                            <button
                                type="button"
                                className="btn border border-green-500 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 btn-sm"
                            >
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
            <ul className="flex space-x-2 mb-5">
                <li>
                    <Link to="/" className="text-green-600 hover:underline">
                        Dashboard
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <Link to="/my-patients" className="text-green-600 hover:underline">
                        My Patients
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Patient Examination</span>
                </li>
            </ul>

            {/* Profile Section */}
            <div className="panel p-6 mb-5 rounded-xl border border-green-400 bg-white dark:bg-gray-900 shadow-md">
                <div className="flex justify-between items-center cursor-pointer" onClick={() => toggle('isProfileOpen')}>
                    <h5 className="font-semibold text-lg text-green-600">Profile - {patient.name}</h5>
                    <span className="text-sm text-green-600 font-medium">
                        {openStates.isProfileOpen ? 'Close' : 'Open'}
                    </span>
                </div>
                <AnimateHeight duration={300} height={openStates.isProfileOpen ? 'auto' : 0}>
                    <div className="flex flex-col sm:flex-row items-center gap-5 mt-3">
                        <img src={patient.image} alt={patient.name} className="w-24 h-24 rounded-full object-cover" />
                        <div className="flex-1">
                            <h3 className="font-semibold text-green-600 text-xl mb-2">{patient.name}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <IconUser /> <strong>{patient.age} years, {patient.gender}</strong>
                                </div>
                                <div className="flex items-center gap-2">
                                    <IconHeart /> <span><strong>Condition:</strong> {patient.condition}</span>
                                </div>
                                {patient.prakruti && <div><strong>Prakruti:</strong> {patient.prakruti}</div>}
                                {patient.vikruti && <div><strong>Vikruti:</strong> {patient.vikruti}</div>}
                            </div>
                        </div>
                    </div>
                </AnimateHeight>
            </div>

            {/* Tabs */}
            <div className="border-b border-green-200 mb-4 flex space-x-6">
                <button onClick={() => setActiveTab('examination')} className={`py-3 ${activeTab === 'examination' ? tabActiveClasses : tabInactiveClasses}`}>
                    <IconExamination className="w-5 h-5 inline mr-2" /> Doctor Examination
                </button>
                <button onClick={() => setActiveTab('prescription')} className={`py-3 ${activeTab === 'prescription' ? tabActiveClasses : tabInactiveClasses}`}>
                    <IconPrescription className="w-5 h-5 inline mr-2" /> Prescription
                </button>
                <button onClick={() => setActiveTab('treatment')} className={`py-3 ${activeTab === 'treatment' ? tabActiveClasses : tabInactiveClasses}`}>
                    <IconTreatment className="w-5 h-5 inline mr-2" /> Treatment
                </button>
            </div>

            {/* Tab Content */}
            <div className="p-4 sm:p-6 bg-green-50/40 dark:bg-green-900/10 rounded-xl">
                {activeTab === 'examination' && (
                    <div className="space-y-5">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            {/* Left side accordions */}
                            <div className="space-y-5">
                                <SectionAccordion title="Prakriti Assessment" stateKey="isPrakritAssessmentOpen" />
                                <SectionAccordion title="Complaints" stateKey="isComplaintsOpen" required />
                                <SectionAccordion title="History of Patient Illness" stateKey="isHistoryOfPatientIllnessOpen" />
                                <SectionAccordion title="Ongoing Medications" stateKey="isOnGoingMedicationsOpen" />
                                <SectionAccordion title="Previous Investigations" stateKey="isPreviousInvestigationsOpen" />
                                <SectionAccordion title="Present Investigations" stateKey="isPresentInvestigationsOpen" />
                                <SectionAccordion title="Medical / Surgical History" stateKey="isMedicalSurgicalHistoryOpen" />
                            </div>

                            {/* Right side accordions */}
                            <div className="space-y-5">
                                {/* Add Examination */}
                                <div className="border border-green-400 rounded-xl bg-white dark:bg-gray-900 shadow-md hover:shadow-lg transition-all duration-300">
                                    <div
                                        className="flex justify-between items-center cursor-pointer p-4 border-b border-green-300 bg-green-50 dark:bg-green-900/20 rounded-t-xl"
                                        onClick={() => toggle('isExamAccordionOpen')}
                                    >
                                        <h5 className="font-semibold text-lg text-green-600 flex items-center gap-2">
                                            <IconHeart className="w-5 h-5" /> Add Examination
                                        </h5>
                                        <span className="text-sm text-green-600 font-medium">
                                            {openStates.isExamAccordionOpen ? 'Close' : 'Open'}
                                        </span>
                                    </div>
                                    <AnimateHeight duration={300} height={openStates.isExamAccordionOpen ? 'auto' : 0}>
                                        <div className="p-4 space-y-3">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {['Height (cm)', 'Weight (kg)', 'Blood Pressure', 'Temperature', 'BMI', 'SPO2', 'Heart Rate', 'Pulse Rate'].map((label) => (
                                                    <div key={label} className="flex flex-col">
                                                        <label className="text-sm font-medium mb-1 text-green-700">{label}</label>
                                                        <input
                                                            type="text"
                                                            // --- MODIFICATION: Applied new styles and dynamic placeholder ---
                                                            className={formInputStyles}
                                                            placeholder={`Enter ${label}...`}
                                                            value={examinationValues[label] || ''}
                                                            onChange={(e) => handleStaticExamChange(label, e.target.value)}
                                                        />
                                                    </div>
                                                ))}
                                            </div>

                                            {additionalExamFields.map((field) => (
                                                <div key={field.id} className="pt-2 border-t border-dashed border-green-300">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                                                        <div>
                                                            <label className="text-sm font-medium mb-1 text-green-700">Additional Parameter</label>
                                                            <input
                                                                type="text"
                                                                // --- MODIFICATION: Applied new styles ---
                                                                className={formInputStyles}
                                                                placeholder="Enter name"
                                                                value={field.label}
                                                                onChange={(e) => handleAdditionalExamChange(field.id, 'label', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="flex items-end gap-2">
                                                            <div className="flex-grow">
                                                                <label className="text-sm font-medium mb-1 text-green-700">Value</label>
                                                                <input
                                                                    type="text"
                                                                    // --- MODIFICATION: Applied new styles ---
                                                                    className={formInputStyles}
                                                                    placeholder="Enter value"
                                                                    value={field.value}
                                                                    onChange={(e) => handleAdditionalExamChange(field.id, 'value', e.target.value)}
                                                                />
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveAdditionalExamField(field.id)}
                                                                className="btn border border-red-400 text-red-500 hover:bg-red-50 p-2 rounded-lg"
                                                            >
                                                                <IconX className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            <button
                                                type="button"
                                                onClick={handleAddAdditionalExamField}
                                                className="btn border border-green-500 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 btn-sm mt-3"
                                            >
                                                + Add More
                                            </button>
                                        </div>
                                    </AnimateHeight>
                                </div>

                                {/* Diagnosis & Recommendations */}
                                <div className="border border-green-400 rounded-xl bg-white dark:bg-gray-900 shadow-md">
                                    <div
                                        className="flex justify-between items-center cursor-pointer p-4 border-b border-green-300 bg-green-50 dark:bg-green-900/20 rounded-t-xl"
                                        onClick={() => toggle('isDiagnosisAccordionOpen')}
                                    >
                                        <h5 className="font-semibold text-lg text-green-600">Diagnosis & Recommendations</h5>
                                        <span className="text-sm text-green-600 font-medium">
                                            {openStates.isDiagnosisAccordionOpen ? 'Close' : 'Open'}
                                        </span>
                                    </div>
                                    <AnimateHeight duration={300} height={openStates.isDiagnosisAccordionOpen ? 'auto' : 0}>
                                        <div className="p-4 space-y-3">
                                            {recommendations.map((rec, index) => (
                                                <div key={rec.id} className="flex items-start gap-2">
                                                    <textarea
                                                        // --- MODIFICATION: Applied new styles ---
                                                        className={`${formInputStyles} resize-none`}
                                                        placeholder={index === 0 ? 'Enter diagnosis...' : 'Enter recommendation...'}
                                                        rows={2}
                                                        value={rec.value}
                                                        onChange={(e) => handleRecommendationChange(rec.id, 'value', e.target.value)}
                                                    />
                                                    {index > 0 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveRecommendation(rec.id)}
                                                            className="btn border border-red-400 text-red-500 hover:bg-red-50 p-2 rounded-lg mt-1"
                                                        >
                                                            <IconX className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={handleAddRecommendation}
                                                className="btn border border-green-500 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 btn-sm mt-3"
                                            >
                                                + Add Diagnosis/Recommendation
                                            </button>
                                        </div>
                                    </AnimateHeight>
                                </div>
                            </div>
                        </div>

                        {/* Footer Buttons */}
                        <div className="flex justify-end gap-4 mt-6">
                            <button className="btn border border-green-500 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20">
                                Cancel
                            </button>
                            <button className="btn bg-green-600 text-white hover:bg-green-700">
                                Confirm
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'prescription' && <Prescription />}
                {activeTab === 'treatment' && <TreatmentSessions />}
            </div>
        </div>
    );
};

export default PatientExamination;