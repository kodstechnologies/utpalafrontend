import React, { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Printer, FileText, ChevronLeft } from 'lucide-react'; // Added ChevronLeft for back button
import { setPageTitle } from '../../../store/themeConfigSlice'; 
// '../../../store/themeClassSlice'; // Re-use types

// --- Updated Data Structures ---
// The structure from the image is clearer as: Medicine, Dosage, Duration.
interface PrescribedItem {
    medicineName: string;
    dosage: string;
    duration: string;
}

// Adjust the Prescription type to use the new PrescribedItem
interface PagePrescription {
    id: number;
    patientName: string;
    doctorName: string;
    doctorRegNo: string;
    hospitalName: string;
    hospitalAddress: string;
    hospitalPhone: string;
    hospitalTiming: string;
    patientID: string;
    patientAge: number;
    patientGender: string;
    patientMobile: string;
    patientAddress: string;
    patientWeight: number;
    patientHeight: number;
    patientBMI: number;
    patientBP: string;
    date: string;
    chiefComplaints: string[]; // e.g., ["FEVER WITH CHILLS (4 DAYS)", "HEADACHE (2 DAYS)"]
    clinicalFindings: string;
    diagnosis: string;
    items: PrescribedItem[];
    advice: string[]; // e.g., ["TAKE BED REST", "DO NOT EAT OUTSIDE FOOD"]
    followUpDate: string;
}

interface Patient {
    id: number;
    name: string;
    age: number;
    gender: string;
    diagnosis: string;
    doctor: string;
}


// --- Mock Data (Based *exactly* on the uploaded image) ---
// Note: I'm creating a new mock object that mirrors the image content.
const mockPrescriptions: PagePrescription[] = [
    {
        id: 1,
        patientName: 'OPD6 PATIENT (M)',
        doctorName: 'Akshara',
        doctorRegNo: 'MMC 2018',
        hospitalName: 'Utpalaayurdhama',
        hospitalAddress: 'B/503, Business Center, RR Nagar, Bangalore - 411000.',
        hospitalPhone: 'Ph: 5465647658',
        hospitalTiming: '09:00 AM - 01:00 PM, 06:00 PM - 08:00 PM | Closed: Sunday',
        patientID: 'ID: 11',
        patientAge: 13,
        patientGender: 'M',
        patientMobile: '9423380390',
        patientAddress: 'PUNE',
        patientWeight: 80,
        patientHeight: 200,
        patientBMI: 20.00,
        patientBP: '120/80 mmHg',
        date: '30-Aug-2025',
        chiefComplaints: ['FEVER WITH CHILLS (4 DAYS)', 'HEADACHE (2 DAYS)'],
        clinicalFindings: 'THESE ARE TEST FINDINGS FOR A TEST PATIENT\nENTERING SAMPLE DIAGNOSIS AND SAMPLE PRESCRIPTION',
        diagnosis: 'MALARIA',
        items: [
            { medicineName: '1) TAB. ABCIXIMAB', dosage: '1 Morning', duration: '8 Days\n(Tot: 8 Tab)' },
            { medicineName: '2) TAB. VOMILAST\nDOXYLAMINE 10MG + PYRIDOXINE 10 MG +\nFOLIC ACID 2.5 MG', dosage: '1 Morning, 1 Night\n(After Food)', duration: '8 Days\n(Tot: 16 Tab)' },
            { medicineName: '3) CAP. ZOCLAR 500\nCLARITHROMYCIN IP 500MG', dosage: '1 Morning', duration: '3 Days\n(Tot: 3 Cap)' },
            { medicineName: '4) TAB. GESTAKIND 10/SR\nISOXSUPRINE 10 MG', dosage: '1 Night', duration: '4 Days\n(Tot: 4 Tab)' },
        ],
        advice: ['TAKE BED REST', 'DO NOT EAT OUTSIDE FOOD', 'EAT EASY TO DIGEST FOOD LIKE BOILED RICE WITH DAAL'],
        followUpDate: '04-09-2025',
    },
    // Adding other mock prescriptions to maintain component logic
    // ... (rest of mockPrescriptions remains from the original mock but uses the new interface for consistency, 
    // though the component logic will only use the one above for the specific patient name from the image).
];

const mockPatients: Patient[] = [
    { id: 1, name: 'OPD6 PATIENT (M)', age: 13, gender: 'Male', diagnosis: 'Malaria', doctor: 'Dr. Akshara' },
    { id: 2, name: 'Rajesh Kumar', age: 48, gender: 'Male', diagnosis: 'Hypertension', doctor: 'Dr. Khan' },
    { id: 3, name: 'Anil Gupta', age: 62, gender: 'Male', diagnosis: 'Digestive Issues', doctor: 'Dr. Patel' },
];

const PatientHistoryPage: React.FC = () => {
    const { patientName } = useParams<{ patientName: string }>();
    const dispatch = useDispatch();

    // Use the hardcoded patient from the image for demonstration, or filter by a specific key.
    // Since the image patient ID is "OPD6 PATIENT (M)", we'll use that for filtering.
    const imagePatientName = 'OPD6 PATIENT (M)';

    useEffect(() => {
        dispatch(setPageTitle(`Prescription for ${imagePatientName}`));
    }, [dispatch, imagePatientName]);

    const latestPrescription = useMemo(() => {
        return mockPrescriptions.find(p => p.patientName === imagePatientName);
    }, [imagePatientName]);
    
    // Note: The original component was set up to find the *latest* prescription, 
    // but to match the image exactly, we pull the specific image's data.

    if (!latestPrescription) {
        return (
            <div className="panel text-center">
                <h2 className="text-xl font-bold mb-4">No Prescription Found</h2>
                <p>No prescription history could be found for "{imagePatientName}".</p>
                <Link to="/prescriptions" className="btn btn-primary mt-4">Back to Patient List</Link>
            </div>
        );
    }

    // --- Helper function to render multi-line text (like drug details or duration)
    const renderMultiLine = (text: string) => {
        return text.split('\n').map((line, i) => <div key={i}>{line}</div>);
    };

    return (
        <div>
            {/* Action Buttons (Keep these out of print view) */}
            <div className="print:hidden">
                <div className="flex justify-between items-center mb-6">
                    <Link to="/prescriptions" className="btn btn-outline-primary flex items-center gap-2">
                        <ChevronLeft size={16} /> Back to List
                    </Link>
                    <div className="flex gap-4">
                        <Link to="/invoice" className="btn btn-outline-primary flex items-center gap-2">
                            <FileText size={16} /> Generate Invoice
                        </Link>
                        <button onClick={() => window.print()} className="btn btn-primary flex items-center gap-2">
                            <Printer size={16} /> Download / Print
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Prescription Panel - Matched to Image Style */}
            <div className="bg-white p-4 text-black text-xs font-sans border border-black max-w-4xl mx-auto shadow-md print:shadow-none print:border-none print:max-w-full">
                
                {/* Header Section */}
                <div className="flex justify-between items-start mb-2">
                    {/* Left: Doctor Info */}
                    <div>
                        <p className="font-bold text-base">Dr. {latestPrescription.doctorName}</p>
                        <p className="text-sm">M.S.</p>
                        <p className="text-sm">Reg. No: {latestPrescription.doctorRegNo}</p>
                    </div>
                    
                    {/* Center: Logo/Rx Symbol - Using an empty space/placeholder for alignment */}
                    <div className="flex flex-col items-center ml-40">
                        <img src="../loader.png" alt="Utpalaayurdhama symbol" className="w-15 h-20" /> {/* Placeholder for Caduceus */}
                    </div>

                    {/* Right: Hospital Info */}
                    <div className="text-right leading-relaxed">
                        <p className="font-bold text-base text-blue-800">Utpalaayurdhama</p>
                        <p>{latestPrescription.hospitalAddress}</p>
                        <p>{latestPrescription.hospitalPhone}</p>
                        <p>Timing: {latestPrescription.hospitalTiming.split('|')[0].trim()}</p>
                        <p>Closed: {latestPrescription.hospitalTiming.split('|')[1].split(':')[1].trim()}</p>
                    </div>
                </div>

                <hr className="border-t border-black mb-2" />

                {/* Patient Info Bar */}
                <div className="flex justify-between items-end mb-2">
                    <div className="leading-relaxed">
                        <p className="text-sm"><strong>{latestPrescription.patientID} PATIENT ({latestPrescription.patientGender}) / {latestPrescription.patientAge} Y</strong> Mob. No.: <strong>{latestPrescription.patientMobile}</strong></p>
                        <p>Address: {latestPrescription.patientAddress}</p>
                        <p>Weight (Kg): {latestPrescription.patientWeight}, Height (Cm): {latestPrescription.patientHeight} (B.M.I. = {latestPrescription.patientBMI.toFixed(2)}), BP: {latestPrescription.patientBP}</p>
                    </div>
                    <p className="text-sm font-bold">Date: {latestPrescription.date}</p>
                </div>

                <hr className="border-t border-black mb-2" />

                {/* Complaints/Findings Section */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Chief Complaints */}
                    <div>
                        <p className="font-bold border-b border-black mb-1">Chief Complaints</p>
                        <ul className="list-none p-0 ml-1">
                            {latestPrescription.chiefComplaints.map((comp, index) => (
                                <li key={index}>* {comp}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Clinical Findings */}
                    <div>
                        <p className="font-bold border-b border-black mb-1">Clinical Findings</p>
                        <div className="whitespace-pre-wrap text-xs">{latestPrescription.clinicalFindings}</div>
                    </div>
                </div>

                <hr className="border-t border-black my-2" />
                
                {/* Diagnosis Section */}
                <div className="mb-4">
                    <p className="font-bold border-b border-black mb-1">Diagnosis:</p>
                    <p className="ml-1">* {latestPrescription.diagnosis}</p>
                </div>

                {/* Rx Header */}
                <p className="font-bold text-2xl mb-2">℞</p>

                {/* Medicine Table */}
                <div className="overflow-x-auto border border-black">
                    <table className="w-full text-left table-fixed">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-1 w-1/2 font-bold border-r border-black">Medicine Name</th>
                                <th className="p-1 w-1/4 font-bold border-r border-black">Dosage</th>
                                <th className="p-1 w-1/4 font-bold">Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            {latestPrescription.items.map((item, index) => (
                                <tr key={index} className="border-t border-black">
                                    <td className="p-1 align-top border-r border-black whitespace-pre-wrap">{renderMultiLine(item.medicineName)}</td>
                                    <td className="p-1 align-top border-r border-black whitespace-pre-wrap">{renderMultiLine(item.dosage)}</td>
                                    <td className="p-1 align-top whitespace-pre-wrap">{renderMultiLine(item.duration)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <hr className="border-t border-black my-2" />

                {/* Advice Section */}
                <div className="mb-4">
                    <p className="font-bold border-b border-black mb-1">Advice:</p>
                    <ul className="list-none p-0 ml-1">
                        {latestPrescription.advice.map((item, index) => (
                            <li key={index}>* {item}</li>
                        ))}
                    </ul>
                </div>

                <hr className="border-t border-black my-2" />

                {/* Follow Up */}
                <div className="mb-4">
                    <p className="font-bold">Follow Up: {latestPrescription.followUpDate}</p>
                </div>

                {/* Footer/Signature */}
                {/* <div className="text-center mt-6">
                    <p className="text-xs">Susbtitute with equivalent Generics as required.</p>
                </div> */}
            </div>
        </div>
    );
};

export default PatientHistoryPage;