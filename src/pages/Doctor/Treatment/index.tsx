// TreatmentSessions.tsx

import React, { useMemo, useState, useEffect } from 'react';
// Assuming your generic Table component is imported from a utility path.
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import Table, { Column } from '../../../components/Table/Table';

// --- ASSUMED MODAL COMPONENT (Replace with your actual Modal/Dialog component) ---
// For demonstration, a simplified Modal interface is used.
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

// Placeholder for a generic Modal component. You must replace this with your actual implementation.
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
            <div className="panel w-full max-w-lg">
                <div className="flex justify-between items-center mb-5">
                    <h5 className="text-lg font-semibold dark:text-white">{title}</h5>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6Z"/></svg>
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};
// ---------------------------------------------------------------------------------


// Define the structure for a treatment session (used as the data type for the Table component)
interface TreatmentSession {
    id: number;
    name: string;
    date: string;
    type: string;
    days: number;
    instructions: string;
}

// Corrected type for the new treatment form state
interface NewTreatmentState {
    patientName: string; // Separated field for the patient's name
    treatmentType: string; // Separated field for the type of treatment
    days: string;
    instructions: string;
}

const mockSessions: TreatmentSession[] = [
    { id: 1, name:'Ajay Sharama', date: '2024-03-10', type: 'Physiotherapy', days: 5, instructions: 'Patient showed improved mobility and reduced pain in the left shoulder. Recommended follow-up exercises.' },
    { id: 2, name:'Vijay Kumar', date: '2024-03-05', type: 'Acupuncture', days: 2, instructions: 'Migraine symptoms alleviated. Patient reported significant reduction in headache intensity. Next session scheduled.' },
    { id: 3, name:'Ram', date: '2024-02-28', type: 'Massage Therapy', days: 5, instructions: 'Relieved muscle tension in the lower back. Patient felt relaxed and reported better sleep quality.' },
    { id: 4, name:'Kajol', date: '2024-02-20', type: 'Yoga Therapy', days: 5, instructions: 'Improved flexibility and stress reduction. Patient showed better breathing control techniques.' },
    { id: 5, name:'Deepika', date: '2024-02-15', type: 'Physiotherapy', days: 3, instructions: 'Continued progress on knee rehabilitation. Patient demonstrated increased range of motion. New exercises prescribed.' },
];

const initialNewTreatmentState: NewTreatmentState = {
    patientName: '',
    treatmentType: '',
    days: '',
    instructions: '',
};

const TreatmentSessions: React.FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Treatments'));
    }, [dispatch]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    // State for the new treatment form - NOW USING SEPARATE FIELDS
    const [newTreatment, setNewTreatment] = useState<NewTreatmentState>(initialNewTreatmentState);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real application, you would add the newTreatment data to your global state or API call here
        console.log('New Treatment Submitted:', newTreatment);
        // Reset form and close modal
        setNewTreatment(initialNewTreatmentState);
        closeModal();
    };

    // 1. Define Columns for the Table component.
    const columns = useMemo(() => [
        // Display Patient Name and ID in a single table cell
        { 
            Header: ' Name',
            accessor: 'name', // Use 'name' as the accessor for sorting/filtering
            Cell: ({ row }: { row: TreatmentSession }) => (
                // Added whitespace-nowrap here to prevent wrapping the name/ID combination.
                <div className="font-semibold whitespace-nowrap"> 
                    {row.name}
                </div>
            )
        },
        { Header: 'Date', accessor: 'date' },
        { Header: 'Therapy Type', accessor: 'type' },
        { Header: 'Days', accessor: 'days' },
        { Header: 'Special Instructions', accessor: 'instructions' },
    ], []);

    // 2. Define Top Content (Title and Add Button).
    const renderTopContent = () => (
        <>
        <div className="flex justify-between items-center mb-4">
            <h4 className="text-xl font-semibold dark:text-white">Treatments Details</h4> {/* Updated title to match image */}
        </div>
        <div className="flex justify-end"> 
            {/* Add Treatment Button */}
           <button type="button" className="btn btn-success flex items-center gap-1" onClick={openModal}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M11 19v-6H5v-2h6V5h2v6h6v2h-6v6Z" /></svg>
                Add Treatment
            </button>
        </div>
        </>
    );

    // 3. Render the Add Treatment Modal - **CORRECTED**
    const renderAddTreatmentModal = () => (
        <Modal isOpen={isModalOpen} onClose={closeModal} title="Add Treatment">
            <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Treatment Name and Days of Treatment */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* search pateint by name or id - NOW USES patientName STATE */}
                    <div>  
                        <label htmlFor="patientName" className="block text-sm font-medium mb-1">Patient Name</label>
                        <input
                            id="patientName"
                            type="text"
                            placeholder="Enter Patient Name"
                            className="form-input w-full"
                            value={newTreatment.patientName}
                            onChange={(e) => setNewTreatment({ ...newTreatment, patientName: e.target.value })}
                            required
                        />
                    </div>

                    {/* Treatment Name (Select) - NOW USES treatmentType STATE */}
                    <div>
                        <label htmlFor="treatmentType" className="block text-sm font-medium mb-1">Treatment Name</label>
                        <select
                            id="treatmentType"
                            className="form-select w-full"
                            value={newTreatment.treatmentType}
                            onChange={(e) => setNewTreatment({ ...newTreatment, treatmentType: e.target.value })}
                            required
                        >
                            <option value="">Select treatment</option>
                            {/* Example options */}
                            <option value="Physiotherapy">Physiotherapy</option>
                            <option value="Acupuncture">Acupuncture</option>
                            <option value="Massage Therapy">Massage Therapy</option>
                            <option value="Yoga Therapy">Yoga Therapy</option>
                        </select>
                    </div>

                    {/* Days of Treatment (Input) */}
                    <div>
                        <label htmlFor="daysOfTreatment" className="block text-sm font-medium mb-1">Days of Treatment</label>
                        <input
                            id="daysOfTreatment"
                            type="number"
                            placeholder="Enter days of Treatment"
                            className="form-input w-full"
                            value={newTreatment.days}
                            onChange={(e) => setNewTreatment({ ...newTreatment, days: e.target.value })}
                            required
                        />
                    </div>
                     {/* Added a placeholder div for layout balance on small screens. In a real app, you might want a third field here or restructure the grid. */}
                     <div className="hidden sm:block"></div> 
                </div>

                {/* Special Instructions (Textarea) */}
                <div>
                    <label htmlFor="specialInstructions" className="block text-sm font-medium mb-1">Special Instructions</label>
                    <textarea
                        id="specialInstructions"
                        placeholder="Input text"
                        className="form-input w-full min-h-[100px]"
                        rows={4}
                        value={newTreatment.instructions}
                        onChange={(e) => setNewTreatment({ ...newTreatment, instructions: e.target.value })}
                        required
                    />
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-700">
                    <button type="button" onClick={closeModal} className="btn btn-outline-danger">
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-success">
                        Submit
                    </button>
                </div>
            </form>
        </Modal>
    );

    return (
        <div className="space-y-6">
            {/* Table Component for Past Therapy Sessions. */}
            <Table<TreatmentSession>
                columns={columns as Column<TreatmentSession>[]}
                data={mockSessions} // Using mock data
                topContent={renderTopContent()}
                itemsPerPage={5} // Set items per page for pagination
            />
            
            {/* Render the Add Treatment Modal */}
            {renderAddTreatmentModal()}
        </div>
    );
};

export default TreatmentSessions;