import { SetStateAction, useState } from 'react';
import IconEye from '../../../../components/Icon/IconEye';
import IconEdit from '../../../../components/Icon/IconEdit';
import IconTrash from '../../../../components/Icon/IconTrash';
import IconDownload from '../../../../components/Icon/IconDownload';
import IconSearch from '../../../../components/Icon/IconSearch';
import NurseModal from './NurseModal';

interface Nurse extends NurseData {
    name: string;
    id: number;
}

interface NurseData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dob: string;
    gender: 'Male' | 'Female' | 'Other';
    specialization: string;
    licenseNumber: string;
    department: 'Ayurveda' | 'Panchakarma' | 'General' | 'Other';
    joiningDate: string;
    status: 'Active' | 'Inactive' | 'On Leave' | 'Pending';
}


type StatusBadgeProps = {
    status: NurseData['status'];
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

const mapTableDataToModalData = (nurse: Nurse): NurseData => {
    const [title, ...restOfName] = nurse.name.split(' ');
    const firstName = restOfName.slice(0, -1).join(' ');
    const lastName = restOfName.pop() || '';

    return {
        firstName: firstName,
        lastName: lastName,
        email: nurse.email,
        specialization: nurse.specialization,
        status: nurse.status,
        phone: 'N/A',
        dob: '2000-01-01',
        gender: 'Female',
        licenseNumber: `REG-${nurse.id * 100}`,
        department: 'Panchakarma',
        joiningDate: '2022-03-15'
    } as NurseData;
}


const NurseTable = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNurseData, setSelectedNurseData] = useState<NurseData | null>(null);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('edit');

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedNurseData(null);
    };

    const handleEdit = (nurse: Nurse) => {
        setSelectedNurseData(mapTableDataToModalData(nurse));
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleView = (nurse: Nurse) => {
        setSelectedNurseData(mapTableDataToModalData(nurse));
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleDelete = (nurse: Nurse) => {
        if (window.confirm(`Are you sure you want to dismiss ${nurse.name}?`)) {
            console.log(`Dismissing Nurse with ID: ${nurse.id}`);
            // TODO: Add API call to delete
        }
    };


    const [nursesData] = useState<Nurse[]>([
        { id: 1, name: 'Sister Leena Nair', email: 'leena.nair@veda.com', specialization: 'Abhyanga & Shirodhara', status: 'Active' },
        { id: 2, name: 'Nurse Rohan Patel', email: 'rohan.p@veda.com', specialization: 'Vasti & Swedana', status: 'Active' },
        { id: 3, name: 'Sister Anjali Rao', email: 'anjali.r@veda.com', specialization: 'Yoga & Pranayama', status: 'Inactive' },
        { id: 4, name: 'Nurse Dinesh Sharma', email: 'dinesh.s@veda.com', specialization: 'Diet & Lifestyle Counseling', status: 'Active' },
        { id: 5, name: 'Sister Kalyani Devi', email: 'kalyani.d@veda.com', specialization: 'Herbal Preparations', status: 'On Leave' },
        { id: 6, name: 'Nurse Shanti Menon', email: 'shanti.m@veda.com', specialization: 'Abhyanga & Shirodhara', status: 'Pending' },
        { id: 7, name: 'Sister Tanya Kapoor', email: 'tanya.k@veda.com', specialization: 'Marma Therapy', status: 'Active' },
    ] as Nurse[]);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = nursesData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(nursesData.length / itemsPerPage);

    const paginate = (pageNumber: SetStateAction<number>) => setCurrentPage(pageNumber);

    return (
        <div className="panel p-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
            <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700 space-y-4 sm:space-y-0">

                <div className="relative w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Search Nurses..."
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
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider dark:text-gray-300">Name</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider dark:text-gray-300">Contact Email</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider dark:text-gray-300">Panchakarma Expertise</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider dark:text-gray-300">Status</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider dark:text-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100 dark:bg-gray-800 dark:divide-gray-700">
                        {currentItems.map((nurse) => (
                            <tr key={nurse.id} className="hover:bg-green-50/50 dark:hover:bg-gray-700/50 transition duration-150">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-normal font-semibold text-gray-900 dark:text-white">{nurse.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-600 dark:text-gray-400">{nurse.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">{nurse.specialization}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={nurse.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    <div className="flex items-center justify-center space-x-4">
                                        <button
                                            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition"
                                            title="View Profile"
                                            onClick={() => handleView(nurse)}
                                        >
                                            <IconEye className="w-5 h-5" />
                                        </button>
                                        <button
                                            className="text-amber-500 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition"
                                            title="Edit Details"
                                            onClick={() => handleEdit(nurse)}
                                        >
                                            <IconEdit className="w-5 h-5" />
                                        </button>
                                        <button
                                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition"
                                            title="Dismiss Nurse"
                                            onClick={() => handleDelete(nurse)}
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
                    Showing {indexOfFirstItem + 1} to {indexOfLastItem > nursesData.length ? nursesData.length : indexOfLastItem} of {nursesData.length} results
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

            <NurseModal
                isOpen={isModalOpen}
                onClose={closeModal}
                nurseData={selectedNurseData}
                mode={modalMode}
            />
        </div>
    );
};

export default NurseTable;