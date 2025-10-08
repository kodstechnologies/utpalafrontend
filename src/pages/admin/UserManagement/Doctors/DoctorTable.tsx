import { SetStateAction, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import IconEye from '../../../../components/Icon/IconEye';
import IconEdit from '../../../../components/Icon/IconEdit';
import IconTrash from '../../../../components/Icon/IconTrash';
import IconDownload from '../../../../components/Icon/IconDownload';
import IconSearch from '../../../../components/Icon/IconSearch';


type StatusBadgeProps = {
    status: string;
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
    let colorClass = '';
    switch (status) {
        case 'Active':
            colorClass = 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100';
            break;
        case 'Inactive':
            colorClass = 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100';
            break;
        case 'Pending':
            colorClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100';
            break;
        default:
            colorClass = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
    }
    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
            {status}
        </span>
    );
};

const DoctorTable = () => { // Renamed from 'Table' to 'DoctorTable' for clarity
    const navigate = useNavigate();

    // Mock data matching the image structure
    const [doctorsData] = useState([
        { id: 1, name: 'Dr. Anya Sharma', email: 'anya.s@utpala.com', specialization: 'Cardiology', status: 'Active' },
        { id: 2, name: 'Dr. Rahul Verma', email: 'rahul.v@utpala.com', specialization: 'Pediatrics', status: 'Active' },
        { id: 3, name: 'Dr. Priya Singh', email: 'priya.s@utpala.com', specialization: 'Dermatology', status: 'Inactive' },
        { id: 4, name: 'Dr. Alok Kumar', email: 'alok.k@utpala.com', specialization: 'Neurology', status: 'Active' },
        { id: 5, name: 'Dr. Maya Devi', email: 'maya.d@utpala.com', specialization: 'Oncology', status: 'Pending' },
    ]);

    // Pagination logic (kept simple, assuming all 5 items are displayed for simplicity)
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Adjust as needed
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = doctorsData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(doctorsData.length / itemsPerPage);

    const paginate = (pageNumber: SetStateAction<number>) => setCurrentPage(pageNumber);

    return (
        <div className="panel p-0">
            {/* 1. Search, Filter, and Export Bar (Header) */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 space-y-3 sm:space-y-0">
                
                {/* Search Input */}
                <div className="relative w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Search Doctors..."
                        className="form-input ltr:pl-10 rtl:pr-10 border border-gray-300 rounded-md py-2 w-full sm:w-64 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                    <IconSearch className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
                
                {/* Filter and Export Buttons */}
                <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                    
                    {/* Filter by Status Dropdown */}
                    <div className="relative">
                        <select 
                            className="form-select border border-gray-300 rounded-md py-2 px-4 focus:border-blue-500 appearance-none dark:bg-gray-800 dark:border-gray-700 dark:text-white pr-8"
                        >
                            <option value="">Filter by status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Pending">Pending</option>
                        </select>
                        {/* Custom down arrow for the select input */}
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                    
                    {/* Export Button */}
                    <button 
                        type="button" 
                        className="btn flex items-center bg-gray-100 text-gray-700 border border-gray-300 rounded-md py-2 px-3 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    >
                        <IconDownload className="w-4 h-4 mr-1" />
                        Export
                    </button>
                </div>
            </div>

            {/* 2. Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Specialization</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Status</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                        {currentItems.map((doctor) => (
                            <tr key={doctor.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{doctor.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{doctor.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{doctor.specialization}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={doctor.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    <div className="flex items-center justify-center space-x-3">
                                        <button className="text-gray-400 hover:text-blue-600" title="View">
                                            <IconEye className="w-4 h-4" />
                                        </button>
                                        <button className="text-gray-400 hover:text-yellow-600" title="Edit">
                                            <IconEdit className="w-4 h-4" />
                                        </button>
                                        <button className="text-gray-400 hover:text-red-600" title="Delete">
                                            <IconTrash className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 3. Pagination (Footer) */}
            <div className="py-4 px-6 flex justify-between items-center border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    Showing 1 to {currentItems.length} of {doctorsData.length} results
                </div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    {/* Previous Button */}
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        Previous
                    </button>
                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => paginate(i + 1)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium 
                                ${currentPage === i + 1 
                                    ? 'z-10 bg-blue-500 border-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:border-blue-600' 
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    {/* Next Button */}
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        Next
                    </button>
                </nav>
            </div>
        </div>
    );
};

export default DoctorTable;















