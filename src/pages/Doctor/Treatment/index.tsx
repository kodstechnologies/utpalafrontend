import React, { useMemo, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AnimateHeight from 'react-animate-height';
import { setPageTitle } from '../../../store/themeConfigSlice';
import Table, { Column } from '../../../components/Table/Table';

import { ChevronDown, ChevronUp } from 'lucide-react';
// Assuming GlobalModal is imported from your modal component path
import GlobalModal, { FieldConfig } from '../../../components/Modal/GlobalModal';

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
  // patientName: string;
  treatmentType: string;
  days: string;
  treatementFollowup: string;
  instructions: string;
}

// --- MOCK DATA ---
const mockSessions: TreatmentSession[] = [
  { id: 1, name: 'Ajay Sharama', date: '2024-03-10', type: 'Physiotherapy', days: 5, instructions: 'Patient showed improved mobility and reduced pain in the left shoulder. Recommended follow-up exercises.' },
  { id: 2, name: 'Vijay Kumar', date: '2024-03-05', type: 'Acupuncture', days: 2, instructions: 'Migraine symptoms alleviated. Patient reported significant reduction in headache intensity. Next session scheduled.' },
  { id: 3, name: 'Ram', date: '2024-02-28', type: 'Massage Therapy', days: 5, instructions: 'Relieved muscle tension in the lower back. Patient felt relaxed and reported better sleep quality.' },
  { id: 4, name: 'Kajol', date: '2024-02-20', type: 'Yoga Therapy', days: 5, instructions: 'Improved flexibility and stress reduction. Patient showed better breathing control techniques.' },
  { id: 5, name: 'Deepika', date: '2024-02-15', type: 'Physiotherapy', days: 3, instructions: 'Continued progress on knee rehabilitation. Patient demonstrated increased range of motion. New exercises prescribed.' },
];

// Define dynamic form fields for treatment modal
const treatmentFields: FieldConfig[] = [
  // { name: "patientName", label: "Patient Name", type: "text", required: true },
  {
    name: "treatmentType", label: "Treatment Name", type: "text", required: true,
    // options: [
    //   { value: "", label: "Select Treatment" },
    //   { value: "Physiotherapy", label: "Physiotherapy" },
    //   { value: "Acupuncture", label: "Acupuncture" },
    //   { value: "Massage Therapy", label: "Massage Therapy" },
    //   { value: "Yoga Therapy", label: "Yoga Therapy" },
    // ]
  },
  { name: "days", label: "Days of Treatment", type: "number", required: true },
  {
    name: "treatementTimeline", label: "Treatment Timeline", type: "select", required: true,
    options: [
      { value: "", label: "Select Treatment" },
      { value: "alternateday", label: "Alternateday" },
      { value: "weekly", label: "Weekly" },
    ]
  },
  { name: "instructions", label: "Special Instructions", type: "textarea", required: true }
];

// Utility function to get initial data for new treatment form
const getInitialTreatmentData = (): NewTreatmentState => ({
  // patientName: "",
  treatmentType: "",
  days: "",
  treatementFollowup: "",
  instructions: ""
});

export const TreatmentSessions: React.FC<{ viewOnly?: boolean }> = ({ viewOnly = false }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle('Treatments'));
  }, [dispatch]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFollowUpOpen, setIsFollowUpOpen] = useState(true);

  const openModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSaveTreatment = (formData: NewTreatmentState) => {
    // Handle form submission data (e.g., call API or update local state)
    console.log('Saved Treatment:', formData);
    // TODO: Add the new treatment to your data list or refresh from API
    handleCloseModal();
  };

  // 1. Define Columns for the Table component.
  const columns = useMemo(() => [
    // {
    //   Header: 'Name',
    //   accessor: 'name',
    //   Cell: ({ row }: { row: TreatmentSession }) => (
    //     <div className="font-semibold whitespace-nowrap">
    //       {row.name}
    //     </div>
    //   )
    // },
    { Header: 'Date', accessor: 'date' },
    { Header: 'Therapy Type', accessor: 'type' },
    { Header: 'Days', accessor: 'days' },
    {
      Header: 'Special Instructions',
      accessor: 'instructions',
      Cell: ({ value }: { value: string }) => (
        <p className="line-clamp-2 max-w-xs" title={value}>
          {value}
        </p>
      ),
    },
  ], []);

  // 2. Define Top Content (Title and Add Button).
  const renderTopContent = () => (
    <>
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-xl font-semibold dark:text-white">Treatments Details</h4>
      </div>
      {!viewOnly && (
        <div className="flex justify-end">
          <button type="button" className="btn btn-success flex items-center gap-1" onClick={openModal}>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M11 19v-6H5v-2h6V5h2v6h6v2h-6v6Z" /></svg>
            Add Treatment
          </button>
        </div>
      )}
    </>
  );

  return (
    <div className="space">
      <Table<TreatmentSession>
        columns={columns as Column<TreatmentSession>[]}
        data={mockSessions}
        topContent={renderTopContent()}
        itemsPerPage={5}
      />

      <GlobalModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode="create"
        title="Treatment"
        fields={treatmentFields}
        initialData={getInitialTreatmentData()}
        onSave={handleSaveTreatment}
      />

      {/* make according for atting followup with date and note filed    */}
      <div className="panel mt-6">
          <div className="flex justify-between items-center cursor-pointer p-4 border-b border-gray-200 dark:border-gray-700" onClick={() => setIsFollowUpOpen(!isFollowUpOpen)}>
              <h4 className="text-xl font-semibold dark:text-white">Follow-up</h4> 
              {/* MODIFICATION START: Added Open/Close text to toggle button */}
              <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-2 py-1 bg-white dark:bg-gray-800 text-sm text-gray-600 font-medium hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                  <span>{isFollowUpOpen ? 'Close' : 'Open'}</span>
                  {isFollowUpOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
              {/* MODIFICATION END */}
          </div>
          <AnimateHeight duration={300} height={isFollowUpOpen ? 'auto' : 0}>
              <div className="p-4">
                  <div className="flex flex-col space-y-4">
                      {!viewOnly && (
                        <div className="flex items-center space-x-4">
                            <input type="date" className="form-input w-auto" />
                            <textarea placeholder="Add follow-up notes..." className="form-textarea flex-1"></textarea>
                            <button type="button" className="btn btn-primary">
                                Add
                            </button>
                        </div>
                      )}
                      {/* Example of existing follow-up entries */}
                      {/* <div className="border rounded-md p-3 bg-gray-50 dark:bg-gray-700">
                          <p className="font-semibold">2024-03-15</p>
                          <p>Patient reported feeling much better. Advised to continue current treatment plan for another week.</p>
                      </div>
                      <div className="border rounded-md p-3 bg-gray-50 dark:bg-gray-700">
                          <p className="font-semibold">2024-03-08</p>
                          <p>Initial follow-up. Patient showed slight improvement. Adjusted dosage of one medicine.</p>
                      </div> */}
                  </div>
              </div>
          </AnimateHeight>
      </div>
      

    </div>
  );
};

export default TreatmentSessions;
