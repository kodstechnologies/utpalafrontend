import React, { useEffect, useState, useMemo, ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setPageTitle } from '../../../store/themeConfigSlice';
import Table, { Column } from '../../../components/Table/Table';
import IconTrash from '../../../components/Icon/IconTrash';
// 🛑 Assuming GlobalModal can handle custom content or you adapt the form
import GlobalModal, { FieldConfig } from '../../../components/Modal/GlobalModal';
import IconPlus from '../../../components/Icon/IconPlus';

// Interface for form data that would be returned by GlobalModal
interface PrescriptionFormData {
    patientId: string;
    medicineName: string;
    medicineType: string;
    dosage: { [key: string]: boolean };
    intakeTime: string;
    specialInstructions: string;
}

// Interface for the table data
interface PrescriptionData {
    id: number;
    // patientName: string;
    medicineName: string;
    medicineType: string;
    dosage: string;
    intakeTime: string;
    specialInstructions: string;
}

const prescriptionFields: FieldConfig[] = [
    // {
    //     name: 'patientId', label: 'Patient Name', type: 'select', required: true, disabledInEdit: true,
    //     options: [ // This would typically be fetched from an API
    //         { value: 'Rohit Sharma', label: 'Rohit Sharma' },
    //         { value: 'Sneha Patil', label: 'Sneha Patil' },
    //         { value: 'Aarav Deshmukh', label: 'Aarav Deshmukh' },
    //     ]
    // },
    {
        name: 'medicineType',
        label: 'Medicine Type',
        type: 'select',
        required: true, // This is correct for a select field
        options: [ // This is correct for a select field
            'Select Type','Vati (Tablet)', 'Churna (Powder)', 'Kwatha (Decoction)', 'Taila (Oil)', 'Leha (Paste)'
            // '', 'kwatha', 'taila', 'leha'
            // { value: '', label: 'Select Type',type },
            // { value: 'vati', label: 'Vati (Tablet)' },
            // { value: 'churna', label: 'Churna (Powder)' },
            // { value: 'kwatha', label: 'Kwatha (Decoction)' },
            // { value: 'taila', label: 'Taila (Oil)' },
            // { value: 'leha', label: 'Leha (Paste)' },
        ],
    },
    { name: 'medicineName', label: 'Medicine Name', type: 'text', required: true },
   
    // checkbox-group
 
    // { name: 'dosageMorning', label: 'Pratahkal (Morning)', type: 'checkbox' },
    // { name: 'dosageAfternoon', label: 'Madhyahn (Afternoon)', type: 'checkbox' },
    // { name: 'dosageEvening', label: 'Sayankal (Evening)', type: 'checkbox' },
    {
        name: 'intakeTime',
        label: 'Intake Time',
        type: 'select',
        required: true,
        options: [
            'Select Intake Time','Before Food', 'After Food', 'With Honey', 'With Ghee'
            // { value: '', label: 'Select Intake Time' },
            // { value: 'before_food', label: 'Before Food' },
            // { value: 'after_food', label: 'After Food' },
            // { value: 'with_honey', label: 'With Honey' },
            // { value: 'with_ghee', label: 'With Ghee' },
        ],
    },
    { 
        name: 'dosage', // This name will correspond to the object key in FormData
        label: 'Dosage', 
        type: 'checkbox-group', // Custom type for the GlobalModal
        options: [
            // The value here must match the key used in the Dosage object
            { value: 'morning', label: 'Morning' },
            { value: 'afternoon', label: 'Afternoon' },
            { value: 'evening', label: 'Evening' },
        ],
    },
    { 
        name: 'Internal / External', // This name will correspond to the object key in FormData
        label: 'Internal / External', 
        type: 'checkbox-group', // Custom type for the GlobalModal
        options: [
            // The value here must match the key used in the Dosage object
            { value: 'internal', label: 'Internal' },
            { value: 'Externla', label: 'External' },
        ],
    },
    { name: 'specialInstructions', label: 'Special Instructions', type: 'textarea',textareaSize:2 },
];

const Prescription = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Prescription'));
    }, [dispatch]);

    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // In this refactoring, we won't need the individual form states if GlobalModal manages them.
    // However, we'll keep a state for editing, though we'll only implement 'create' for now.
    const [selectedPrescription, setSelectedPrescription] = useState<PrescriptionData | null>(null);

    // 🌿 Ayurvedic-style sample prescriptions
    const [recentPrescriptions, setRecentPrescriptions] = useState<PrescriptionData[]>([
        { id: 1,  medicineName: 'Triphala Churna', medicineType: 'churna', dosage: 'Morning, Evening', intakeTime: 'before_food', specialInstructions: 'Take with warm water for better digestion.' },
        { id: 2,  medicineName: 'Ashwagandha Vati', medicineType: 'vati', dosage: 'Morning, Night', intakeTime: 'after_food', specialInstructions: 'Helps in improving strength and immunity.' },
        { id: 3,  medicineName: 'Brahmi Ghrita', medicineType: 'taila', dosage: 'Morning', intakeTime: 'with_ghee', specialInstructions: 'Improves focus and memory power.' },
        { id: 4,  medicineName: 'Amla Rasayana', medicineType: 'leha', dosage: 'Morning', intakeTime: 'after_food', specialInstructions: 'Rich in Vitamin C, boosts immunity.' },
        { id: 5,  medicineName: 'Guduchi Kwatha', medicineType: 'kwatha', dosage: 'Morning, Evening', intakeTime: 'before_food', specialInstructions: 'Effective in fever and detoxification.' },
        { id: 6,  medicineName: 'Shatavari Churna', medicineType: 'churna', dosage: 'Morning, Evening', intakeTime: 'after_food', specialInstructions: 'Helps in hormonal balance and vitality.' },
    ]);

    const filteredData = useMemo(() => {
        return recentPrescriptions.filter(p =>
            // p.patientName.toLowerCase().includes(search.toLowerCase()) ||
            p.medicineName.toLowerCase().includes(search.toLowerCase())
        );
    }, [recentPrescriptions, search]);

    // Function to close the modal and reset selected data
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPrescription(null);
    };

    // Function to handle save action from GlobalModal
    const handleSavePrescription = (formData: PrescriptionFormData) => {
        const selectedDosages = Object.entries(formData.dosage || {})
            .filter(([, checked]) => checked)
            .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1)); // Capitalize: 'morning' -> 'Morning'

        if (selectedDosages.length === 0) {
            alert('Please select at least one dosage time.');
            return;
        }
        
        const newPrescription: PrescriptionData = {
            id: selectedPrescription ? selectedPrescription.id : Date.now(),
            // patientName: formData.patientId, // Use patientId which holds the name
            medicineName: formData.medicineName,
            medicineType: formData.medicineType,
            dosage: selectedDosages.join(', '),
            intakeTime: formData.intakeTime,
            specialInstructions: formData.specialInstructions,
        };

        if (selectedPrescription) {
            // Edit logic (simplified)
            setRecentPrescriptions((prev) => 
                prev.map((p) => (p.id === newPrescription.id ? newPrescription : p))
            );
        } else {
            // Create logic
            setRecentPrescriptions((prev) => [newPrescription, ...prev]);
        }

        handleCloseModal();
    };

    const columns: Column<PrescriptionData>[] = useMemo(() => [
        // { Header: 'Patient', accessor: 'patientName' },
        { Header: 'Medicine', accessor: 'medicineName' },
        { Header: 'Type', accessor: 'medicineType', Cell: ({ value }) => <span className="capitalize">{value}</span> },
        { Header: 'Dosage', accessor: 'dosage', Cell: ({ value }) => <span className="capitalize">{value}</span> },
        { Header: 'Intake', accessor: 'intakeTime', Cell: ({ value }) => <span className="capitalize">{value.replace('_', ' ')}</span> },
        { Header: 'Instructions', accessor: 'specialInstructions' },
    ], []);

    const handleRemovePrescription = (id: number) => {
        setRecentPrescriptions((prev) => prev.filter((p) => p.id !== id));
    };

    const renderActions = (prescription: PrescriptionData): ReactNode => (
        <button
            type="button"
            onClick={() => handleRemovePrescription(prescription.id)}
            className="text-red-600 hover:text-red-800"
            title="Remove Prescription"
        >
            <IconTrash className="w-5 h-5" />
        </button>
        // Note: Adding an edit button would require opening the modal with the prescription data
    );

    const renderTopContent = (): ReactNode => (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4">
            {/* <h5 className="font-semibold text-lg dark:text-white-light">Recent Prescriptions</h5>                 */}
            {/* Search Input */}
            <div className="relative w-full sm:w-auto">
                <input type="text" placeholder="Search by Patient or Medicine..." className="form-input ltr:pr-10 rtl:pl-10 w-full" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
        </div>
    );

    // Function to derive initial data for the GlobalModal's fields
    const getInitialPrescriptionData = (prescription: PrescriptionData | null): PrescriptionFormData | undefined => {
        if (!prescription) return undefined;
    
        // Convert the comma-separated dosage string back into boolean flags for the fields
        const dosageArray = prescription.dosage.split(',').map(d => d.trim().toLowerCase());
    
        return {
            patientId: '',
            medicineName: prescription.medicineName,
            medicineType: prescription.medicineType,
            dosage: {
                morning: dosageArray.includes('morning'),
                afternoon: dosageArray.includes('afternoon'),
                evening: dosageArray.includes('evening'),
            },
            intakeTime: prescription.intakeTime, // Ensure intakeTime is always a string
            specialInstructions: prescription.specialInstructions,
        };
    };

    return (
        <div className="">
            {/* Header with Add Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h5 className="font-semibold text-lg dark:text-white-light">Prescriptions</h5>
                <button
                    type="button"
                    className="btn btn-primary w-full sm:w-auto"
                    onClick={() => {
                        setSelectedPrescription(null); // Ensure 'create' mode
                        setIsModalOpen(true);
                    }}
                >
                    <IconPlus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                    Add Prescription
                </button>
            </div>

            {/* Main Content Area */}
            <div className="panel mt-6">
                {filteredData.length > 0 ? (
                    <Table<PrescriptionData>
                        columns={columns}
                        data={filteredData}
                        actions={renderActions}
                        topContent={renderTopContent()}
                        itemsPerPage={5}
                    />
                ) : (
                    <div className="flex flex-col sm:flex-row items-center justify-center p-10 gap-4">
                        <p className="text-gray-500">No prescriptions found. Click 'Add Prescription' to create one.</p>
                        <button 
                            type="button" 
                            className="btn btn-primary ml-4 flex items-center" 
                            onClick={() => setIsModalOpen(true)}
                        >
                            <IconPlus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                            Add Prescription
                        </button>
                    </div>
                )}
            </div>

            {/* GLOBAL MODAL FOR CREATE/EDIT PRESCRIPTION */}
            <GlobalModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                mode={selectedPrescription ? "edit" : "create"}
                title={selectedPrescription ? "Edit Prescription" : "Create Prescription"}
                fields={prescriptionFields as FieldConfig[]}
                initialData={getInitialPrescriptionData(selectedPrescription)}
                onSave={handleSavePrescription} // This function replaces handleSubmit
            />
        </div>
    );
};

export default Prescription;