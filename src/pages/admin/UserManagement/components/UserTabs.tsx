import React from 'react';
import { Link, useParams } from 'react-router-dom';

const UserTabs = () => {
    const { userType } = useParams();

    const userTypes = ['Doctors', 'Nurses', 'Receptionists', 'Pharmacists', 'Therapists', 'Patients'];

    const activeTab = userTypes.find(t => t.toLowerCase() === userType) || 'Doctors';


    return (
        <div className="flex rounded-lg bg-white shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 overflow-x-auto">
            {userTypes.map((type) => (
                <Link
                    key={type}
                    to={`/user-management/${type.toLowerCase()}`}
                    className={`
                        py-2 px-4 text-sm font-semibold rounded-md transition-colors duration-150
                        border-r border-gray-200 dark:border-gray-700 last:border-r-0
                        ${activeTab === type
                            ? 'bg-green-600 text-white'
                            : 'text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-blue-400'
                        }
                        whitespace-nowrap
                    `}
                >
                    {type}
                </Link>
            ))}
        </div>
    );
};

export default UserTabs;