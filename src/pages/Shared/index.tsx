import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconUser from '../../components/Icon/IconUser';
import IconFile from '../../components/Icon/IconFile';
import IconCreditCard from '../../components/Icon/IconCreditCard';

interface Patient {
    name: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    uhid: string;
}

// Mock patient database for demonstration
const mockPatientDatabase: Patient[] = [
    { name: 'Rakesh Sharma', age: 58, gender: 'Male', uhid: 'PAT-101' },
    { name: 'Meena Kumari', age: 65, gender: 'Female', uhid: 'PAT-102' },
];

const DischargeSummaryPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        dispatch(setPageTitle('Discharge Summary & Billing'));
    }, [dispatch]);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

    const [summary, setSummary] = useState({
        consultation: 'Initial consultation revealed high-grade fever and dehydration.',
        diagnosis: 'Recovered from viral fever.',
        history: 'Patient was admitted with high fever and body aches.',
        hospitalCourse: 'Patient was administered IV fluids and antipyretics. Responded well to treatment.',
        significantFindings: 'Blood reports are normal. No signs of secondary infection.',
        conditionAtDischarge: 'Stable, afebrile, and ambulatory.',
        investigationResults: 'CBC: Normal, Platelets: 2.5L',
        treatmentsGiven: 'IV Paracetamol, Multivitamins.',
        adviceOnDischarge: 'Take rest for 3 days. Follow up after 5 days if symptoms persist.',
        preparedBy: 'Dr. Anjali Verma',
        checkedBy: 'Dr. Priya Singh',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setSummary((prev) => ({ ...prev, [name]: value }));
    };

    const handleFindPatient = () => {
        if (!searchQuery) return;
        const foundPatient = mockPatientDatabase.find(
            (p) => p.name.toLowerCase() === searchQuery.toLowerCase() || p.uhid.toLowerCase() === searchQuery.toLowerCase()
        );

        if (foundPatient) {
            setSelectedPatient(foundPatient);
        } else {
            alert('Patient not found.');
            setSelectedPatient(null);
        }
    };

    const handleSave = () => {
        console.log('Saving Summary:', { patient: selectedPatient, summary });
        alert('Discharge summary saved successfully!');
    };

    const handleGenerateBill = () => {
        if (!selectedPatient) return;
        console.log('Navigating to invoice for patient:', selectedPatient?.uhid);
        // Navigate to the invoice page, passing patient data in the state
        navigate('/invoice', { state: { patient: selectedPatient } });
    };

    const renderTextarea = (label: string, name: keyof typeof summary, rows = 3) => (
        <div>
            <label htmlFor={name}>{label}</label>
            <textarea id={name} name={name} className="form-textarea mt-1" rows={rows} value={summary[name]} onChange={handleInputChange}></textarea>
        </div>
    );

    if (!selectedPatient) {
        return (
            <div className="panel">
                <h1 className="text-xl font-bold mb-4">Find Patient for Discharge</h1>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <input
                        type="text"
                        placeholder="Enter Patient Name or UHID"
                        className="form-input w-full sm:max-w-xs"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="button" className="btn btn-primary" onClick={handleFindPatient}>
                        Find Patient
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="panel">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h1 className="text-xl font-bold">Discharge Summary</h1>
                    <div className="flex items-center gap-2 text-sm">
                        <IconUser />
                        <span className="font-semibold">
                            {selectedPatient.name} ({selectedPatient.uhid})
                        </span>
                        <button type="button" className="btn btn-outline-danger btn-sm ml-4" onClick={() => setSelectedPatient(null)}>
                            Change Patient
                        </button>
                    </div>
                </div>
            </div>

            <div className="panel">
                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">{renderTextarea('Consultation', 'consultation')}</div>
                        <div className="space-y-6">{renderTextarea('Condition at the time of Discharge', 'conditionAtDischarge')}</div>
                        <div className="space-y-6">{renderTextarea('Diagnosis', 'diagnosis')}</div>
                        <div className="space-y-6">{renderTextarea('Investigation results', 'investigationResults')}</div>
                        <div className="space-y-6">{renderTextarea('History', 'history')}</div>
                        <div className="space-y-6">{renderTextarea('Treatments Given', 'treatmentsGiven')}</div>
                        <div className="space-y-6">{renderTextarea('Hospital Course', 'hospitalCourse')}</div>
                        <div className="space-y-6">{renderTextarea('Advice on Discharge', 'adviceOnDischarge')}</div>
                        <div className="space-y-6">{renderTextarea('Significant Findings', 'significantFindings')}</div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t pt-6">
                        <div>
                            <label htmlFor="preparedBy">Summary Prepared by</label>
                            <input id="preparedBy" name="preparedBy" type="text" className="form-input mt-1" value={summary.preparedBy} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label htmlFor="checkedBy">Summary checked by</label>
                            <input id="checkedBy" name="checkedBy" type="text" className="form-input mt-1" value={summary.checkedBy} onChange={handleInputChange} />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <button type="button" className="btn btn-success" onClick={handleGenerateBill}>
                            <IconCreditCard className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                            Generate Bill
                        </button>
                        <button type="button" className="btn btn-primary" onClick={handleSave}>
                            <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                            Save Summary
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DischargeSummaryPage;