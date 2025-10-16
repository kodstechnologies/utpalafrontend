import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { Dialog, Transition } from '@headlessui/react';
import IconUserPlus from '../../../components/Icon/IconUserPlus';
import IconUsers from '../../../components/Icon/IconUsers';
import { DashboardCard } from '../../../components/DashboardCard';

// --- ICONS ---
const IconEdit: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 20h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const IconTrash: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 5H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M18 5V2a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M16 5L15.72 19.142A2 2 0 0 1 13.744 21H10.256a2 2 0 0 1-1.977-1.858L8 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
);

// --- DATA TYPES & MOCK DATA ---
interface FamilyMember {
    id: number;
    name: string;
    relation: string;
    phone: string;
    dob: string;
    gender: 'Male' | 'Female' | 'Other';
}

const mockFamilyMembers: FamilyMember[] = [
    { id: 1, name: 'Rohan Sharma', relation: 'Son', phone: '+91 98765 43211', dob: '2010-05-15', gender: 'Male' },
    { id: 2, name: 'Priya Sharma', relation: 'Spouse', phone: '+91 98765 43212', dob: '1985-08-22', gender: 'Female' },
    { id: 3, name: 'Sunita Sharma', relation: 'Mother', phone: '+91 98765 43213', dob: '1960-02-10', gender: 'Female' },
];

const FamilyTree: React.FC = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Family Members'));
    }, [dispatch]);

    const [members, setMembers] = useState<FamilyMember[]>(mockFamilyMembers);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);

    const statsData = [
        { title: 'Total Family Members', count: members.length, icon: IconUsers },
    ];

    const handleEditClick = (member: FamilyMember) => {
        setSelectedMember(member);
        setIsEditModalOpen(true);
    };

    const renderMemberModal = (isEdit = false) => {
        const title = isEdit ? 'Edit Family Member' : 'Add New Family Member';
        const memberData = isEdit ? selectedMember : null;
        const isOpen = isEdit ? isEditModalOpen : isAddModalOpen;
        const closeModal = () => isEdit ? setIsEditModalOpen(false) : setIsAddModalOpen(false);

        return (
            <Transition appear show={isOpen} as={React.Fragment}>
                <Dialog as="div" open={isOpen} onClose={closeModal} className="relative z-50">
                    <Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-[black]/60" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={React.Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                                        {title}
                                    </Dialog.Title>
                                    <div className="mt-4 space-y-4">
                                        <form onSubmit={(e) => e.preventDefault()}>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                                                    <input type="text" name="name" id="name" className="form-input mt-1 block w-full" defaultValue={memberData?.name || ''} />
                                                </div>
                                                <div>
                                                    <label htmlFor="relation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Relation</label>
                                                    <select id="relation" name="relation" className="form-select mt-1 block w-full" defaultValue={memberData?.relation || ''}>
                                                        <option>Spouse</option>
                                                        <option>Son</option>
                                                        <option>Daughter</option>
                                                        <option>Father</option>
                                                        <option>Mother</option>
                                                        <option>Other</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                                                    <input type="tel" name="phone" id="phone" className="form-input mt-1 block w-full" defaultValue={memberData?.phone || ''} />
                                                </div>
                                                <div>
                                                    <label htmlFor="dob" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date of Birth</label>
                                                    <input type="date" name="dob" id="dob" className="form-input mt-1 block w-full" defaultValue={memberData?.dob || ''} />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gender</label>
                                                    <select id="gender" name="gender" className="form-select mt-1 block w-full" defaultValue={memberData?.gender || ''}>
                                                        <option>Male</option>
                                                        <option>Female</option>
                                                        <option>Other</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="mt-6 flex justify-end gap-4">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger"
                                                    onClick={closeModal}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary"
                                                    onClick={closeModal} // Replace with actual submit logic
                                                >
                                                    {isEdit ? 'Save Changes' : 'Add Member'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        );
    };

    return (
        <div className="space-y-6">
            {/* 1. Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {statsData.map((stat) => (
                    <DashboardCard
                        key={stat.title}
                        title={stat.title}
                        count={stat.count}
                        icon={stat.icon}
                    />
                ))}
            </div>

            {/* 2. Profiles Section */}
            <div className="panel">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Family Profiles</h2>
                    {/* <button type="button" onClick={() => setIsAddModalOpen(true)} className="btn btn-primary flex items-center gap-2">
                        <IconUserPlus className="w-5 h-5" />
                        Add New Member
                    </button> */}
                </div>

                {members.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {members.map((member) => (
                            <div key={member.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-5 group">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center border-2 border-primary/30">
                                            <IconUsers className="w-9 h-9 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{member.name}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{member.relation}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button type="button" className="p-1.5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400" onClick={() => handleEditClick(member)} title="Edit Member">
                                            <IconEdit className="w-4 h-4" />
                                        </button>
                                        <button type="button" className="p-1.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400" onClick={() => alert(`Deleting ${member.name}`)} title="Delete Member">
                                            <IconTrash className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-600 dark:text-gray-300">Phone:</span>
                                        <span className="text-gray-800 dark:text-white font-mono">{member.phone}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-600 dark:text-gray-300">DOB:</span>
                                        <span className="text-gray-800 dark:text-white font-mono">{member.dob}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-600 dark:text-gray-300">Gender:</span>
                                        <span className="text-gray-800 dark:text-white font-semibold">{member.gender}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 border-2 border-dashed rounded-lg">
                        <IconUsers className="mx-auto w-12 h-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No family members added</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by adding a new family member.</p>
                    </div>
                )}
            </div>

            {/* Modals */}
            {renderMemberModal(false)}
            {renderMemberModal(true)}
        </div>
    );
};

export default FamilyTree;
