import React, { useState, useEffect, useMemo, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
// Assuming you have type definitions for Patient, WardCategory, and Prescription
// Define these types in a separate file (e.g., types.ts) or at the top of this file.

/**
 * --- Type Definitions ---
 * (These would ideally be in a shared `types.ts` file)
 */

interface PrescriptionItem {
  medication: string;
  dosage: string;
  frequency: string;
}

interface TreatmentItem {
  therapy: string;
  notes: string;
  date: string; // ISO date string
}

interface Patient {
  age: number;
  id: string;
  name: string;
  consultationNotes: string;
  admissionDate: string;
  wardCategory: string;
  // History fields
  pastPrescriptions: PrescriptionItem[];
  pastTreatments: TreatmentItem[];
  // Current fields
  dailyPrescriptions: PrescriptionItem[];
  dailyTreatments: TreatmentItem[];
}

// Mock data and services for demonstration
const mockPatientHistory: Patient = {
  id: 'P12345',
  name: 'Jane Doe',
  age: 42,
  consultationNotes: 'Patient presents with severe flu symptoms and dehydration. Needs IV fluids and observation.',
  admissionDate: '', // To be set on admission
  wardCategory: '', // To be set on admission
  pastPrescriptions: [
    { medication: 'Amoxicillin', dosage: '500mg', frequency: 'TDS' },
  ],
  pastTreatments: [
    { therapy: 'Physiotherapy', notes: 'Back pain session', date: '2025-09-01' },
  ],
  dailyPrescriptions: [],
  dailyTreatments: [],
};

const WardCategories = ['General Ward', 'Semi-Private', 'Private Room', 'ICU'];


/**
 * --- The Component ---
 */

const NurseAdmissions: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Patient Admissions'));
  }, [dispatch]);

  // State for the new patient data being admitted/updated
  const [patientData, setPatientData] = useState<Patient | null>(null);
  const [patientIdInput, setPatientIdInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [admissionCompleted, setAdmissionCompleted] = useState(false);

  // Modal States
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [isTreatmentModalOpen, setIsTreatmentModalOpen] = useState(false);

  // State for forms
  const [selectedWard, setSelectedWard] = useState<string>('');
  const [newPrescription, setNewPrescription] = useState<PrescriptionItem>({ medication: '', dosage: '', frequency: ''});
  const [newTreatment, setNewTreatment] = useState<TreatmentItem>({ therapy: '', notes: '', date: new Date().toISOString().split('T')[0] });


  // 1. Admission/Consultation Check
  const handleFetchPatient = async () => {
    if (!patientIdInput) return;
    setIsLoading(true);
    // Simulate API call to fetch patient data post-consultation
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // In a real app, you'd fetch the patient's record using patientIdInput
    setPatientData({ ...mockPatientHistory, id: patientIdInput });
    setSelectedWard(mockPatientHistory.wardCategory);
    setIsLoading(false);
  };

  // 2. Admit Patients After Consultation & Assign Ward Category
  const handleAdmitPatient = () => {
    if (!patientData || !selectedWard) {
      alert('Please select a ward category.');
      return;
    }

    const admittedPatient: Patient = {
      ...patientData,
      wardCategory: selectedWard,
      admissionDate: new Date().toISOString(),
    };

    // Simulate API call to save admission record
    console.log('Admitting Patient:', admittedPatient);
    setPatientData(admittedPatient);
    setAdmissionCompleted(true);
    alert('Patient Admitted and Ward Assigned Successfully!');
  };

  // 4. Update daily prescriptions as per doctor’s orders
  const handleAddPrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientData || !newPrescription.medication) return;

    const updatedPrescriptions = [...patientData.dailyPrescriptions, newPrescription];
    setPatientData({ ...patientData, dailyPrescriptions: updatedPrescriptions });
    setNewPrescription({ medication: '', dosage: '', frequency: '' });
    setIsPrescriptionModalOpen(false);
    
    // Simulate API call to save the new daily prescription
    console.log('Updated Daily Prescriptions:', updatedPrescriptions);
  };
  
  // 5. Update daily treatments/therapies
  const handleAddTreatment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientData || !newTreatment.therapy) return;

    const updatedTreatments = [...patientData.dailyTreatments, newTreatment];
    setPatientData({ ...patientData, dailyTreatments: updatedTreatments });
    setNewTreatment({ therapy: '', notes: '', date: new Date().toISOString().split('T')[0] });
    setIsTreatmentModalOpen(false);
    
    // Simulate API call to save the new daily treatment
    console.log('Updated Daily Treatments:', updatedTreatments);
  };

  // Helper to combine all history (past and current daily)
  const allPrescriptions = useMemo(() => ([
    ...(patientData?.pastPrescriptions || []),
    ...(patientData?.dailyPrescriptions || []),
  ]), [patientData]);
  
  const allTreatments = useMemo(() => ([
    ...(patientData?.pastTreatments || []),
    ...(patientData?.dailyTreatments || []),
  ]), [patientData]);

  // --- Rendering Logic ---

  if (isLoading) {
    return <div className="panel">Loading patient data...</div>;
  }

  if (!patientData) {
    return (
      <div className="panel">
        <h2 className="text-xl font-bold mb-4">Patient Lookup for Admission</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <input
              type="text"
              placeholder="Enter Patient ID (e.g., P12345)"
              value={patientIdInput}
              onChange={(e) => setPatientIdInput(e.target.value)}
              className="form-input w-full sm:w-auto sm:max-w-xs"
            />
            <button type="button" onClick={handleFetchPatient} className="btn btn-primary">
              Fetch Patient Details
            </button>
        </div>
      </div>
    );
  }

  // Once data is fetched, show the main admission/update interface
  return (
    <div className="space-y-6">
        <div className="panel">
            <h1 className="text-xl font-bold">Patient Admission & Management: {patientData.name}</h1>
            <p className="text-sm text-gray-500">ID: {patientData.id} • Age: {patientData.age}</p>
        </div>

        {/* Admission & Ward Assignment */}
        <div className="panel">
            <h2 className="text-lg font-semibold mb-4">1. Admit Patient & Assign Ward</h2>
            <p className="mb-4 border-l-4 border-blue-500 pl-4"><strong>Consultation Notes:</strong> <em>{patientData.consultationNotes}</em></p>
            
            {admissionCompleted ? (
              <div className="p-4 bg-green-100 text-green-700 border border-green-200 rounded-md">
                ✅ Patient <strong>{patientData.name}</strong> admitted to <strong>{patientData.wardCategory}</strong> on <strong>{new Date(patientData.admissionDate).toLocaleDateString()}</strong>.
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <label htmlFor="wardCategory" className="font-semibold shrink-0">Ward Category:</label>
                <select id="wardCategory" value={selectedWard} onChange={(e) => setSelectedWard(e.target.value)} className="form-select w-full sm:w-auto">
                  <option value=""> Select Ward </option>
                  {WardCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <button type="button" onClick={handleAdmitPatient} disabled={!selectedWard} className="btn btn-success">
                  Admit Patient
                </button>
              </div>
            )}
        </div>

        {/* Patient Actions */}
        <div className="panel">
            <h2 className="text-lg font-semibold mb-4">2. Patient Actions</h2>
            <div className="flex flex-wrap gap-4">
                <button type="button" className="btn btn-outline-info" onClick={() => setIsHistoryModalOpen(true)}>View Complete History</button>
                <button type="button" className="btn btn-outline-primary" onClick={() => setIsPrescriptionModalOpen(true)}>Update Daily Prescriptions</button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => setIsTreatmentModalOpen(true)}>Update Daily Treatments</button>
            </div>
        </div>

        {/* --- Modals --- */}

        {/* History Modal */}
        <Transition appear show={isHistoryModalOpen} as={Fragment}>
            <Dialog as="div" open={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)} className="relative z-50">
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-[black]/60" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                                Complete History for: {patientData.name}
                            </Dialog.Title>
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold mb-2">Prescription History ({allPrescriptions.length})</h4>
                                    <ul className="list-disc pl-5 space-y-2 text-sm">
                                        {allPrescriptions.map((p, index) => (
                                            <li key={`presc-${index}`}>
                                                <strong>{p.medication}</strong> - {p.dosage} ({p.frequency})
                                                {index >= patientData.pastPrescriptions.length && <span className="ml-2 badge badge-outline-warning">DAILY</span>}
                                            </li>
                                        ))}
                                        {allPrescriptions.length === 0 && <li>No prescriptions found.</li>}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Treatment/Therapy History ({allTreatments.length})</h4>
                                    <ul className="list-disc pl-5 space-y-2 text-sm">
                                        {allTreatments.map((t, index) => (
                                            <li key={`treat-${index}`}>
                                                <strong>{t.therapy}</strong> on {new Date(t.date).toLocaleDateString()} - <em>{t.notes}</em>
                                                {index >= patientData.pastTreatments.length && <span className="ml-2 badge badge-outline-warning">DAILY</span>}
                                            </li>
                                        ))}
                                        {allTreatments.length === 0 && <li>No treatments found.</li>}
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-6 text-right">
                                <button type="button" className="btn btn-outline-danger" onClick={() => setIsHistoryModalOpen(false)}>Close</button>
                            </div>
                        </Dialog.Panel>
                    </div>
                </div>
            </Dialog>
        </Transition>

        {/* Add Prescription Modal */}
        <Transition appear show={isPrescriptionModalOpen} as={Fragment}>
            <Dialog as="div" open={isPrescriptionModalOpen} onClose={() => setIsPrescriptionModalOpen(false)} className="relative z-50">
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-[black]/60" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                                Add Daily Prescription
                            </Dialog.Title>
                            <form onSubmit={handleAddPrescription} className="mt-4 space-y-4">
                                <div>
                                    <label htmlFor="medication">Medication</label>
                                    <input id="medication" type="text" placeholder="e.g., Paracetamol" value={newPrescription.medication} onChange={(e) => setNewPrescription({...newPrescription, medication: e.target.value})} className="form-input mt-1" required />
                                </div>
                                <div>
                                    <label htmlFor="dosage">Dosage</label>
                                    <input id="dosage" type="text" placeholder="e.g., 500mg" value={newPrescription.dosage} onChange={(e) => setNewPrescription({...newPrescription, dosage: e.target.value})} className="form-input mt-1" required />
                                </div>
                                <div>
                                    <label htmlFor="frequency">Frequency</label>
                                    <input id="frequency" type="text" placeholder="e.g., TDS" value={newPrescription.frequency} onChange={(e) => setNewPrescription({...newPrescription, frequency: e.target.value})} className="form-input mt-1" required />
                                </div>
                                <div className="mt-6 flex justify-end gap-4">
                                    <button type="button" className="btn btn-outline-danger" onClick={() => setIsPrescriptionModalOpen(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Add Prescription</button>
                                </div>
                            </form>
                        </Dialog.Panel>
                    </div>
                </div>
            </Dialog>
        </Transition>

        {/* Add Treatment Modal */}
        <Transition appear show={isTreatmentModalOpen} as={Fragment}>
            <Dialog as="div" open={isTreatmentModalOpen} onClose={() => setIsTreatmentModalOpen(false)} className="relative z-50">
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-[black]/60" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                                Add Daily Treatment/Therapy
                            </Dialog.Title>
                            <form onSubmit={handleAddTreatment} className="mt-4 space-y-4">
                                <div>
                                    <label htmlFor="therapy">Therapy Name</label>
                                    <input id="therapy" type="text" placeholder="e.g., IV Fluids" value={newTreatment.therapy} onChange={(e) => setNewTreatment({...newTreatment, therapy: e.target.value})} className="form-input mt-1" required />
                                </div>
                                <div>
                                    <label htmlFor="date">Date</label>
                                    <input id="date" type="date" value={newTreatment.date} onChange={(e) => setNewTreatment({...newTreatment, date: e.target.value})} className="form-input mt-1" required />
                                </div>
                                <div>
                                    <label htmlFor="notes">Notes/Instructions</label>
                                    <textarea id="notes" placeholder="e.g., 500ml over 4 hours" value={newTreatment.notes} onChange={(e) => setNewTreatment({...newTreatment, notes: e.target.value})} rows={3} className="form-textarea mt-1" />
                                </div>
                                <div className="mt-6 flex justify-end gap-4">
                                    <button type="button" className="btn btn-outline-danger" onClick={() => setIsTreatmentModalOpen(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Add Treatment</button>
                                </div>
                            </form>
                        </Dialog.Panel>
                    </div>
                </div>
            </Dialog>
        </Transition>
    </div>
  );
};

export default NurseAdmissions;