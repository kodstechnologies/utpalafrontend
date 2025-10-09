import { SetStateAction, useState } from 'react';
import IconEye from '../../../../components/Icon/IconEye';
import IconEdit from '../../../../components/Icon/IconEdit';
import IconTrash from '../../../../components/Icon/IconTrash';
import IconDownload from '../../../../components/Icon/IconDownload';
import IconSearch from '../../../../components/Icon/IconSearch';


interface Therapist {
    id: number;
    name: string;
    email: string;
    specialty: 'Physiotherapist' | 'Occupational Therapist' | 'Speech Therapist' | 'Psychotherapist';
    schedule: 'Full-time' | 'Part-time' | 'Contract';
    status: 'Active' | 'Inactive' | 'On Leave' | 'Training';
    employeeId: string;
    licenseId: string;
    joiningDate?: string;
}

type StatusBadgeProps = {
    status: Therapist['status'];
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
    let colorClass = '';
    switch (status) {
        case 'Active':
            colorClass = 'bg-green-600 text-white dark:bg-green-800 dark:text-green-100';
            break;
        case 'Inactive':
            colorClass = 'bg-red-400 text-white dark:bg-red-700 dark:text-red-100';
            break;
        case 'Training':
            colorClass = 'bg-amber-400 text-amber-900 dark:bg-amber-600 dark:text-amber-100';
            break;
        case 'On Leave':
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


const TherapistTable = () => {
    const [therapistsData] = useState<Therapist[]>([
        { id: 101, employeeId: 'T-101', name: 'Dr. Rahul Verma', email: 'r.verma@rehab.com', specialty: 'Physiotherapist', schedule: 'Full-time', status: 'Active', licenseId: 'PT-1001', joiningDate: '2018-06-01' },
        { id: 102, employeeId: 'T-102', name: 'Sonal Desai', email: 's.desai@rehab.com', specialty: 'Occupational Therapist', schedule: 'Part-time', status: 'On Leave', licenseId: 'OT-2005', joiningDate: '2021-03-15' },
        { id: 103, employeeId: 'T-103', name: 'Amit Singh', email: 'a.singh@rehab.com', specialty: 'Speech Therapist', schedule: 'Full-time', status: 'Active', licenseId: 'ST-3012', joiningDate: '2022-09-20' },
        { id: 104, employeeId: 'T-104', name: 'Geeta Menon', email: 'g.menon@rehab.com', specialty: 'Psychotherapist', schedule: 'Contract', status: 'Training', licenseId: 'PY-4001', joiningDate: '2024-01-10' },
        { id: 105, employeeId: 'T-105', name: 'Vivek Kulkarni', email: 'v.kulkarni@rehab.com', specialty: 'Physiotherapist', schedule: 'Full-time', status: 'Inactive', licenseId: 'PT-1015', joiningDate: '2019-11-25' },
    ] as Therapist[]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleEdit = (therapist: Therapist) => {
        setSelectedTherapist(therapist);
        setIsModalOpen(true);
        console.log(`Editing therapist: ${therapist.name}`);
    };

    const handleView = (therapist: Therapist) => {
        setSelectedTherapist(therapist);
        setIsModalOpen(true);
        console.log(`Viewing therapist: ${therapist.name}`);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTherapist(null);
    };

    const handleDelete = (therapist: Therapist) => {
        if (window.confirm(`Are you sure you want to dismiss ${therapist.name}?`)) {
            console.log(`Dismissing Therapist with ID: ${therapist.id}`);
        }
    };

    const filteredTherapists = therapistsData.filter(therapist =>
        therapist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        therapist.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        therapist.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredTherapists.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredTherapists.length / itemsPerPage);
    const paginate = (pageNumber: SetStateAction<number>) => setCurrentPage(pageNumber);

    const modalMode = selectedTherapist ? 'edit' : 'create';

    return (
        <div className="panel p-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
            <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700 space-y-4 sm:space-y-0">
                <div className="relative w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Search Therapists (Name, ID, Specialty)..."
                        className="form-input ltr:pl-10 rtl:pr-10 border-2 border-green-200 dark:border-gray-600 rounded-lg py-2 w-full sm:w-80 focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100 transition duration-150 ease-in-out"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <IconSearch className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-green-400 w-5 h-5" />
                </div>

                <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                    <div className="relative">
                        <select
                            className="form-select border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-4 focus:border-green-500 appearance-none dark:bg-gray-700 dark:text-gray-100 pr-8 cursor-pointer shadow-sm"
                        >
                            <option value="">Filter by Specialty</option>
                            <option value="Physiotherapist">Physiotherapist</option>
                            <option value="Occupational Therapist">Occupational Therapist</option>
                            <option value="Speech Therapist">Speech Therapist</option>
                            <option value="Psychotherapist">Psychotherapist</option>
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
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider dark:text-gray-300">Employee ID</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider dark:text-gray-300">Therapist Name</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider dark:text-gray-300">Specialty</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider dark:text-gray-300">Email Address</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider dark:text-gray-300">Schedule</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider dark:text-gray-300">Current Status</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider dark:text-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100 dark:bg-gray-800 dark:divide-gray-700">
                        {currentItems.map((therapist) => (
                            <tr key={therapist.id} className="hover:bg-green-50/50 dark:hover:bg-gray-700/50 transition duration-150">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-semibold text-green-700 dark:text-green-400">{therapist.employeeId}</div>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-normal font-semibold text-gray-900 dark:text-white">{therapist.name}</div>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">{therapist.specialty}</div>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{therapist.email}</div>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-green-700 dark:text-green-400 font-semibold">{therapist.schedule}</div>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={therapist.status} />
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    <div className="flex items-center justify-center space-x-4">
                                        <button
                                            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition"
                                            title="View Profile"
                                            onClick={() => handleView(therapist)}
                                        >
                                            <IconEye className="w-5 h-5" />
                                        </button>
                                        <button
                                            className="text-amber-500 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition"
                                            title="Edit Details"
                                            onClick={() => handleEdit(therapist)}
                                        >
                                            <IconEdit className="w-5 h-5" />
                                        </button>
                                        <button
                                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition"
                                            title="Dismiss Therapist"
                                            onClick={() => handleDelete(therapist)}
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
                    Showing {indexOfFirstItem + 1} to {indexOfLastItem > filteredTherapists.length ? filteredTherapists.length : indexOfLastItem} of {filteredTherapists.length} results
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

            {/* --- Therapist Modal Integration (Requires a TherapistModal component) --- */}
            {/* <TherapistModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                therapistData={selectedTherapist} // Pass selectedTherapist directly
                mode={modalMode}
            />
            */}
        </div>
    );
};

export default TherapistTable;