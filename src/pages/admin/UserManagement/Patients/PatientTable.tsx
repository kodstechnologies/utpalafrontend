import { SetStateAction, useState } from 'react';

import IconEye from '../../../../components/Icon/IconEye';
import IconEdit from '../../../../components/Icon/IconEdit';
import IconTrash from '../../../../components/Icon/IconTrash';
import IconDownload from '../../../../components/Icon/IconDownload';
import IconSearch from '../../../../components/Icon/IconSearch';

interface Patient {
    id: number;
    name: string;
    patientId: string;
    dob: string;
    gender: 'Male' | 'Female' | 'Other';
    bodyType: 'Vata' | 'Pitta' | 'Kapha' | 'Tridosha';
    status: 'Active' | 'Discharged' | 'Pending Admission' | 'Follow-up';
    phone: string;
    primaryDoctor?: string;
    admissionDate?: string;
}

type StatusBadgeProps = {
    status: Patient['status'];
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
    let colorClass = '';
    switch (status) {
        case 'Active':
            colorClass = 'bg-green-600 text-white dark:bg-green-800 dark:text-green-100';
            break;
        case 'Discharged':
            colorClass = 'bg-gray-400 text-gray-900 dark:bg-gray-700 dark:text-gray-100';
            break;
        case 'Pending Admission':
            colorClass = 'bg-amber-400 text-amber-900 dark:bg-amber-600 dark:text-amber-100';
            break;
        case 'Follow-up':
            colorClass = 'bg-blue-500 text-white dark:bg-blue-700 dark:text-blue-100';
            break;
        default:
            colorClass = 'bg-gray-400 text-gray-900 dark:bg-gray-700 dark:text-gray-100';
    }
    return (
        <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full shadow-sm ${colorClass}`}>
            {status}
        </span>
    );
};

const PatientTable = () => {
    const [patientsData] = useState<Patient[]>([
        { id: 1, patientId: 'P-00101', name: 'Alia Bhatt', phone: '98765 43210', dob: '1995-03-14', gender: 'Female', bodyType: 'Vata', status: 'Active', primaryDoctor: 'Dr. K. Rao', admissionDate: '2024-05-10' },
        { id: 2, patientId: 'P-00102', name: 'Rajesh Khanna', phone: '87654 32109', dob: '1968-11-20', gender: 'Male', bodyType: 'Pitta', status: 'Pending Admission', primaryDoctor: 'Dr. S. Verma', admissionDate: '2024-06-01' },
        { id: 3, patientId: 'P-00103', name: 'Sarla Devi', phone: '76543 21098', dob: '1982-01-25', gender: 'Female', bodyType: 'Kapha', status: 'Follow-up', primaryDoctor: 'Dr. Anjali Puri', admissionDate: '2024-04-15' },
        { id: 4, patientId: 'P-00104', name: 'Amit Singh', phone: '65432 10987', dob: '1975-09-01', gender: 'Male', bodyType: 'Tridosha', status: 'Discharged', primaryDoctor: 'Dr. Deepak Sharma', admissionDate: '2024-03-20' },
        { id: 5, patientId: 'P-00105', name: 'Priya Mani', phone: '54321 09876', dob: '2000-07-12', gender: 'Female', bodyType: 'Vata', status: 'Active', primaryDoctor: 'Dr. Preeti Das', admissionDate: '2024-05-25' },
        { id: 6, patientId: 'P-00106', name: 'Ganesh Iyer', phone: '43210 98765', dob: '1955-02-05', gender: 'Male', bodyType: 'Pitta', status: 'Discharged', primaryDoctor: 'Dr. K. Rao', admissionDate: '2024-01-01' },
    ] as Patient[]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

    const handleEdit = (patient: Patient) => {
        setSelectedPatient(patient);
        setIsModalOpen(true);
        console.log(`Editing patient: ${patient.name}`);
    };

    const handleView = (patient: Patient) => {
        setSelectedPatient(patient);
        setIsModalOpen(true);
        console.log(`Viewing patient: ${patient.name}`);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPatient(null);
    };

    const handleDelete = (patient: Patient) => {
        if (window.confirm(`Are you sure you want to archive patient ${patient.name}?`)) {
            console.log(`Archiving Patient with ID: ${patient.id}`);
        }
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = patientsData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(patientsData.length / itemsPerPage);
    const paginate = (pageNumber: SetStateAction<number>) => setCurrentPage(pageNumber);

    const modalMode = selectedPatient ? 'edit' : 'create';

    return (
        <div className="panel p-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
            <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700 space-y-4 sm:space-y-0">
                <div className="relative w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Search Patients (Patients)..."
                        className="form-input ltr:pl-10 rtl:pr-10 border-2 border-green-200 dark:border-gray-600 rounded-lg py-2 w-full sm:w-80 focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100 transition duration-150 ease-in-out"
                    />
                    <IconSearch className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-green-400 w-5 h-5" />
                </div>

                <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                    <div className="relative">
                        <select
                            className="form-select border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-4 focus:border-green-500 appearance-none dark:bg-gray-700 dark:text-gray-100 pr-8 cursor-pointer shadow-sm"
                        >
                            <option value="">Filter by Status</option>
                            <option value="Active">Active</option>
                            <option value="Discharged">Discharged</option>
                            <option value="Pending Admission">Pending Admission</option>
                            <option value="Follow-up">Follow-up</option>
                        </select>
                    </div>

                    <button
                        type="button"
                        className="flex items-center bg-green-500 text-white border border-green-600 rounded-lg py-2 px-4 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-600 transition duration-150 shadow-md"
                    >
                        <IconDownload className="w-5 h-5 mr-1.5" />
                        Export Data
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700">
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider dark:text-gray-300">Patient ID</th>

                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider dark:text-gray-300">Patient Name</th>

                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider dark:text-gray-300">Contact</th>

                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider dark:text-gray-300">Body Type</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider dark:text-gray-300">Primary Doctor</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider dark:text-gray-300">Admission Status</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider dark:text-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100 dark:bg-gray-800 dark:divide-gray-700">
                        {currentItems.map((patient) => (
                            <tr key={patient.id} className="hover:bg-green-50/50 dark:hover:bg-gray-700/50 transition duration-150">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-semibold text-green-700 dark:text-green-400">{patient.patientId}</div>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-normal font-semibold text-gray-900 dark:text-white">{patient.name}</div>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{patient.phone}</div>

                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className={`text-sm font-medium ${patient.bodyType === 'Pitta' ? 'text-amber-600' : patient.bodyType === 'Vata' ? 'text-blue-600' : 'text-green-600'} dark:text-gray-300`}>
                                        {patient.bodyType}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">{patient.primaryDoctor || 'Unassigned'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={patient.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    <div className="flex items-center justify-center space-x-4">
                                        <button
                                            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition"
                                            title="View Patient File"
                                            onClick={() => handleView(patient)}
                                        >
                                            <IconEye className="w-5 h-5" />
                                        </button>
                                        <button
                                            className="text-amber-500 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition"
                                            title="Edit Admission"
                                            onClick={() => handleEdit(patient)}
                                        >
                                            <IconEdit className="w-5 h-5" />
                                        </button>
                                        <button
                                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition"
                                            title="Archive Patient"
                                            onClick={() => handleDelete(patient)}
                                        >
                                            <IconTrash className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="py-4 px-6 flex justify-between items-center border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {indexOfFirstItem + 1} to {indexOfLastItem > patientsData.length ? patientsData.length : indexOfLastItem} of {patientsData.length} results
                </div>
                <nav className="relative z-0 inline-flex rounded-lg shadow-sm" aria-label="Pagination">
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 rounded-l-lg border border-gray-300 bg-white text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 transition"
                    >
                        Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => paginate(i + 1)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition duration-150 
                                ${currentPage === i + 1
                                    ? 'z-10 bg-green-500 border-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:border-green-600'
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600'
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-4 py-2 rounded-r-lg border border-gray-300 bg-white text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 transition"
                    >
                        Next
                    </button>
                </nav>
            </div>

            {/* --- Patient Modal Integration (Requires a PatientModal component) --- */}
            {/* <PatientModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                patientData={selectedPatient}
                mode={modalMode}
            />
            */}
        </div>
    );
};

export default PatientTable;