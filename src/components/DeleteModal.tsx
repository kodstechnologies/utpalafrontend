import React from "react";

interface DeleteModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm p-6 transform transition-all">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 text-center">
                    Are you sure you want to delete?
                </h2>

                <div className="mt-6 flex justify-center space-x-4">
                    <button
                        onClick={onConfirm}
                        className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 "
                    >
                        Yes
                    </button>
                    <button
                        onClick={onCancel}
                        className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 "
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
