import React, { useState } from 'react';
import IconPlus from '../../../../components/Icon/IconPlus';
import DoctorTable from './DoctorTable';

const DoctorPage = () => {
    const [activeTab, setActiveTab] = useState('Doctors');

    const userTypes = ['Doctors', 'Nurses', 'Receptionists', 'Pharmacists', 'Therapists', 'Patients'];

    return (
        <div className=""> 
            <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white-light">
                User Management
            </h1>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                
                <div className="flex p-1 rounded-lg bg-white shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 overflow-x-auto whitespace-nowrap">
                    {userTypes.map((type) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => setActiveTab(type)}
                            className={`
                                py-2 px-4 text-sm font-semibold rounded-md transition-colors duration-150
                                ${activeTab === type
                                    ? 'bg-white text-gray-800 shadow-md ring-1 ring-gray-200 dark:bg-gray-700 dark:text-white'
                                    : 'text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400'
                                }
                                whitespace-nowrap
                            `}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                <button 
                    type="button" 
                    className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-150 w-full md:w-auto"
                >
                    <IconPlus />
                    <span className="ml-2">Create New Doctor</span>
                </button>
            </div>

            <div className="pt-4">
             <DoctorTable/>
            </div>
        </div>
    );
}

export default DoctorPage;