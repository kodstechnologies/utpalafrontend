import React from 'react';
import Modal from 'react-modal';
import IconX from '../../../components/Icon/IconX';
import TherapyProgress from '../../Therapist/TherapySessions/TherapyProgress';

interface ProgressModalProps {
    isOpen: boolean;
    onClose: () => void;
    patientName: string;
}

const ProgressModal: React.FC<ProgressModalProps> = ({ isOpen, onClose, patientName }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Treatment Progress"
            overlayClassName="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            className="bg-white dark:bg-gray-900 rounded-xl shadow-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto outline-none"
            ariaHideApp={false}
        >
            <div className="p-6">
                <div className="flex justify-between items-center mb-6 border-b pb-4 dark:border-gray-700">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white"></h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors">
                        <IconX className="w-6 h-6" />
                    </button>
                </div>
                <div className="space-y-8">
                    <TherapyProgress />
                </div>
            </div>
        </Modal>
    );
};

export default ProgressModal;