import { SetStateAction, useState } from 'react';

import IconEye from '../../../../components/Icon/IconEye';
import IconEdit from '../../../../components/Icon/IconEdit';
import IconTrash from '../../../../components/Icon/IconTrash';
import IconDownload from '../../../../components/Icon/IconDownload';
import IconSearch from '../../../../components/Icon/IconSearch';

interface Pharmacist {
    id: number;
    name: string;
    email: string;
    role: 'Head Pharmacist' | 'Senior' | 'Junior' | 'Trainee';
    status: 'Active' | 'Inactive' | 'On Leave' | 'Pending';
    licenseNumber: string;
    dob?: string;
    gender?: string;
    section: 'Dispensing' | 'Compounding' | 'Inventory' | 'Clinical';
    joiningDate?: string;
}

type StatusBadgeProps = {
    status: Pharmacist['status'];
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
        case 'Pending':
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

const PharmacistTable = () => {
    const [pharmacistsData] = useState<Pharmacist[]>([
        { id: 1, name: 'Rohan Deshmukh', email: 'rohan.d@pharmacy.com', role: 'Head Pharmacist', status: 'Active', licenseNumber: 'PHM-5001', dob: '1975-06-15', gender: 'Male', section: 'Dispensing', joiningDate: '2005-08-01' },
        { id: 2, name: 'Pooja Tandon', email: 'pooja.t@pharmacy.com', role: 'Senior', status: 'Active', licenseNumber: 'PHM-5002', dob: '1988-11-20', gender: 'Female', section: 'Compounding', joiningDate: '2012-05-10' },
        { id: 3, name: 'Vivek Malhotra', email: 'vivek.m@pharmacy.com', role: 'Junior', status: 'Inactive', licenseNumber: 'PHM-5003', dob: '1995-03-05', gender: 'Male', section: 'Inventory', joiningDate: '2020-01-20' },
        { id: 4, name: 'Sonia Kapoor', email: 'sonia.k@pharmacy.com', role: 'Senior', status: 'On Leave', licenseNumber: 'PHM-5004', dob: '1982-09-25', gender: 'Female', section: 'Clinical', joiningDate: '2014-03-15' },
        { id: 5, name: 'Ajay Sharma', email: 'ajay.s@pharmacy.com', role: 'Trainee', status: 'Pending', licenseNumber: 'PHM-5005', dob: '2000-07-12', gender: 'Male', section: 'Dispensing', joiningDate: '2024-07-01' },
    ] as Pharmacist[]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPharmacist, setSelectedPharmacist] = useState<Pharmacist | null>(null);

    const handleEdit = (pharmacist: Pharmacist) => {
        setSelectedPharmacist(pharmacist);
        setIsModalOpen(true);
        console.log(`Editing Pharmacist: ${pharmacist.name}`);
    };

    const handleView = (pharmacist: Pharmacist) => {
        setSelectedPharmacist(pharmacist);
        setIsModalOpen(true);
        console.log(`Viewing Pharmacist: ${pharmacist.name}`);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPharmacist(null);
    };

    const handleDelete = (pharmacist: Pharmacist) => {
        if (window.confirm(`Are you sure you want to dismiss ${pharmacist.name}?`)) {
            console.log(`Dismissing Pharmacist with ID: ${pharmacist.id}`);
        }
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = pharmacistsData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(pharmacistsData.length / itemsPerPage);
    const paginate = (pageNumber: SetStateAction<number>) => setCurrentPage(pageNumber);

    const modalMode = selectedPharmacist ? 'edit' : 'create';

    return (
        <div className="panel p-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
            <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700 space-y-4 sm:space-y-0">
                <div className="relative w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Search Pharmacists..."
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
                            <option value="Inactive">Inactive</option>
                            <option value="Pending">Pending</option>
                            <option value="On Leave">On Leave</option>
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
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider dark:text-gray-300">Pharmacist Name</th>

                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider dark:text-gray-300">License No.</th>

                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider dark:text-gray-300">Contact Email</th>

                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider dark:text-gray-300">Role</th>

                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider dark:text-gray-300">Section</th>

                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider dark:text-gray-300">Current Status</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider dark:text-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100 dark:bg-gray-800 dark:divide-gray-700">
                        {currentItems.map((pharmacist) => (
                            <tr key={pharmacist.id} className="hover:bg-green-50/50 dark:hover:bg-gray-700/50 transition duration-150">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-normal font-semibold text-gray-900 dark:text-white">{pharmacist.name}</div>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-semibold text-green-700 dark:text-green-400">{pharmacist.licenseNumber}</div>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-600 dark:text-gray-400">{pharmacist.email}</div>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">{pharmacist.role}</div>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">{pharmacist.section}</div>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={pharmacist.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    <div className="flex items-center justify-center space-x-4">
                                        <button
                                            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition"
                                            title="View Profile"
                                            onClick={() => handleView(pharmacist)}
                                        >
                                            <IconEye className="w-5 h-5" />
                                        </button>
                                        <button
                                            className="text-amber-500 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition"
                                            title="Edit Details"
                                            onClick={() => handleEdit(pharmacist)}
                                        >
                                            <IconEdit className="w-5 h-5" />
                                        </button>
                                        <button
                                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition"
                                            title="Dismiss Pharmacist"
                                            onClick={() => handleDelete(pharmacist)}
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
                    Showing {indexOfFirstItem + 1} to {indexOfLastItem > pharmacistsData.length ? pharmacistsData.length : indexOfLastItem} of {pharmacistsData.length} results
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

            {/* // --- Pharmacist Modal Integration (Commented out) --- */}
            {/* <PharmacistModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                pharmacistData={selectedPharmacist ? {
                    name: selectedPharmacist.name,
                    email: selectedPharmacist.email,
                    licenseNumber: selectedPharmacist.licenseNumber,
                    role: selectedPharmacist.role,
                    section: selectedPharmacist.section,
                    dob: selectedPharmacist.dob || '',
                    gender: selectedPharmacist.gender || '',
                    joiningDate: selectedPharmacist.joiningDate || '',
                } : null}
                mode={modalMode}
            />
            */}
        </div>
    );
};

export default PharmacistTable;