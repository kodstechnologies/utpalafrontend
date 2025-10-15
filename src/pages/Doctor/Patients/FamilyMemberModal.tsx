import React from 'react';
import Modal from '../../../components/Modal'; // Assuming a generic Modal component exists

interface FamilyMember {
    id: number;
    relation: string;
    name: string;
    age: number;
    image: string;
    condition: string;
}

interface FamilyMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    member: FamilyMember | null;
}

const FamilyMemberModal: React.FC<FamilyMemberModalProps> = ({ isOpen, onClose, member }) => {
    if (!isOpen || !member) {
        return null;
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`${member.relation} - ${member.name}`}>
            <div className="p-5">
                <div className="flex flex-col items-center sm:flex-row sm:items-start sm:gap-5">
                    <img
                        src={member.image}
                        alt={member.name}
                        className="w-24 h-24 rounded-full object-cover mb-4 sm:mb-0"
                    />
                    <div className="text-center sm:text-left">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{member.name}</h3>
                        <p className="text-gray-500 dark:text-gray-400">{member.relation}</p>
                        <div className="mt-4 space-y-2 text-gray-700 dark:text-gray-300">
                            <p>
                                <strong>Age:</strong> {member.age}
                            </p>
                            <p>
                                <strong>Condition:</strong> {member.condition}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-outline-danger"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default FamilyMemberModal;