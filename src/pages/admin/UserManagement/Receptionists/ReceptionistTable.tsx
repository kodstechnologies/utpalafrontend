import { SetStateAction, useState } from 'react';


import IconEye from '../../../../components/Icon/IconEye';
import IconEdit from '../../../../components/Icon/IconEdit';
import IconTrash from '../../../../components/Icon/IconTrash';
import IconDownload from '../../../../components/Icon/IconDownload';
import IconSearch from '../../../../components/Icon/IconSearch';

interface Receptionist {
    id: number;
    name: string;
    email: string;
    shift: 'Morning' | 'Afternoon' | 'Evening' | 'Full Day';
    status: 'Active' | 'Inactive' | 'On Leave' | 'Training';
    employeeId: string;
    dob?: string;
    gender?: string;
    department: 'Front Desk' | 'Billing' | 'Admissions';
    joiningDate?: string;
}

type StatusBadgeProps = {
    status: Receptionist['status'];
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

const ReceptionistTable = () => {
    const [receptionistsData] = useState<Receptionist[]>([
        { id: 1, employeeId: 'R-001', name: 'Manoj Patel', email: 'manoj.p@veda.com', shift: 'Morning', status: 'Active', department: 'Front Desk', joiningDate: '2021-01-15' },
        { id: 2, employeeId: 'R-002', name: 'Neha Sharma', email: 'neha.s@veda.com', shift: 'Full Day', status: 'On Leave', department: 'Admissions', joiningDate: '2020-05-20' },
        { id: 3, employeeId: 'R-003', name: 'Vijay Kumar', email: 'vijay.k@veda.com', shift: 'Evening', status: 'Inactive', department: 'Billing', joiningDate: '2022-08-01' },
        { id: 4, employeeId: 'R-004', name: 'Priya Reddy', email: 'priya.r@veda.com', shift: 'Morning', status: 'Active', department: 'Front Desk', joiningDate: '2019-03-10' },
        { id: 5, employeeId: 'R-005', name: 'Gopal Krishnan', email: 'gopal.k@veda.com', shift: 'Afternoon', status: 'Training', department: 'Admissions', joiningDate: '2023-11-01' },
    ] as Receptionist[]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReceptionist, setSelectedReceptionist] = useState<Receptionist | null>(null);

    const handleEdit = (receptionist: Receptionist) => {
        setSelectedReceptionist(receptionist);
        setIsModalOpen(true);
        console.log(`Editing receptionist: ${receptionist.name}`);
    };

    const handleView = (receptionist: Receptionist) => {
        setSelectedReceptionist(receptionist);
        setIsModalOpen(true);
        console.log(`Viewing receptionist: ${receptionist.name}`);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedReceptionist(null);
    };

    const handleDelete = (receptionist: Receptionist) => {
        if (window.confirm(`Are you sure you want to dismiss ${receptionist.name}?`)) {
            console.log(`Dismissing Receptionist with ID: ${receptionist.id}`);
        }
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = receptionistsData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(receptionistsData.length / itemsPerPage);
    const paginate = (pageNumber: SetStateAction<number>) => setCurrentPage(pageNumber);

    const modalMode = selectedReceptionist ? 'edit' : 'create';

    return (
        <div className="panel p-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
            <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700 space-y-4 sm:space-y-0">
                <div className="relative w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Search Receptionists (Staff)..."
                        className="form-input ltr:pl-10 rtl:pr-10 border-2 border-green-200 dark:border-gray-600 rounded-lg py-2 w-full sm:w-80 focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100 transition duration-150 ease-in-out"
                    />
                    <IconSearch className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-green-400 w-5 h-5" />
                </div>

                <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                    <div className="relative">
                        <select
                            className="form-select border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-4 focus:border-green-500 appearance-none dark:bg-gray-700 dark:text-gray-100 pr-8 cursor-pointer shadow-sm"
                        >
                            <option value="">Filter by Shift</option>
                            <option value="Morning">Morning</option>
                            <option value="Afternoon">Afternoon</option>
                            <option value="Evening">Evening</option>
                            <option value="Full Day">Full Day</option>
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
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider dark:text-gray-300">Staff Name</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider dark:text-gray-300">Contact Email</th>

                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider dark:text-gray-300">Department</th>

                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider dark:text-gray-300">Shift</th>

                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider dark:text-gray-300">Current Status</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider dark:text-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100 dark:bg-gray-800 dark:divide-gray-700">
                        {currentItems.map((receptionist) => (
                            <tr key={receptionist.id} className="hover:bg-green-50/50 dark:hover:bg-gray-700/50 transition duration-150">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-semibold text-green-700 dark:text-green-400">{receptionist.employeeId}</div>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-normal font-semibold text-gray-900 dark:text-white">{receptionist.name}</div>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-normal font-semibold text-gray-900 dark:text-gray-300">{receptionist.email}</div>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">{receptionist.department}</div>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-green-700 dark:text-green-400 font-semibold">{receptionist.shift}</div>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={receptionist.status} />
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    <div className="flex items-center justify-center space-x-4">
                                        <button
                                            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition"
                                            title="View Profile"
                                            onClick={() => handleView(receptionist)}
                                        >
                                            <IconEye className="w-5 h-5" />
                                        </button>
                                        <button
                                            className="text-amber-500 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition"
                                            title="Edit Details"
                                            onClick={() => handleEdit(receptionist)}
                                        >
                                            <IconEdit className="w-5 h-5" />
                                        </button>
                                        <button
                                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition"
                                            title="Dismiss Receptionist"
                                            onClick={() => handleDelete(receptionist)}
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
                    Showing {indexOfFirstItem + 1} to {indexOfLastItem > receptionistsData.length ? receptionistsData.length : indexOfLastItem} of {receptionistsData.length} results
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

            {/* --- Receptionist Modal Integration (Requires a ReceptionistModal component) --- */}
            {/* <ReceptionistModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                receptionistData={selectedReceptionist} // Pass selectedReceptionist directly
                mode={modalMode}
            />
            */}
        </div>
    );
};

export default ReceptionistTable;