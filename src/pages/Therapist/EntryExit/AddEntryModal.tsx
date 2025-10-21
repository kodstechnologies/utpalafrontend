import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { EntryExitRecord } from './EntryExit';

interface AddEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Partial<EntryExitRecord>) => void;
    initialData: Partial<EntryExitRecord>;
    mode: 'create' | 'edit';
}

const allTherapists = ['Dr. Meena', 'Dr. Rohan', 'Dr. Priya', 'Dr. Amit'];

const AddEntryModal: React.FC<AddEntryModalProps> = ({ isOpen, onClose, onSave, initialData, mode }) => {
    const [formData, setFormData] = useState<Partial<EntryExitRecord>>({});
    const [selectedTherapists, setSelectedTherapists] = useState<string[]>([]);
    const [therapistSearch, setTherapistSearch] = useState('');
    const [isTherapistDropdownOpen, setIsTherapistDropdownOpen] = useState(false);
    const therapistInputRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setFormData(initialData);
        setSelectedTherapists(initialData.therapistNames || []);
    }, [initialData, isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (therapistInputRef.current && !therapistInputRef.current.contains(event.target as Node)) {
                setIsTherapistDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    const handleTherapistSelect = (therapist: string) => {
        if (!selectedTherapists.includes(therapist)) {
            const newTherapists = [...selectedTherapists, therapist];
            setSelectedTherapists(newTherapists);
            setFormData(prev => ({ ...prev, therapistNames: newTherapists }));
        }
        setTherapistSearch('');
        setIsTherapistDropdownOpen(false);
    };

    const handleTherapistRemove = (therapist: string) => {
        const newTherapists = selectedTherapists.filter(t => t !== therapist);
        setSelectedTherapists(newTherapists);
        setFormData(prev => ({ ...prev, therapistNames: newTherapists }));
    };

    const availableTherapists = allTherapists.filter(
        t => !selectedTherapists.includes(t) && t.toLowerCase().includes(therapistSearch.toLowerCase())
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-xl">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h3 className="text-xl font-semibold">{mode === 'edit' ? 'Edit Entry' : 'Add New Entry'}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Patient Name</label>
                            <select
                                value={formData.patientName || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
                                className="form-select"
                                required
                            >
                                <option value="">Select Patient</option>
                                <option>John Doe</option>
                                <option>Jane Smith</option>
                                <option>Peter Pan</option>
                            </select>
                        </div>

                        <div ref={therapistInputRef} className="relative">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Therapists</label>
                            <div className="form-input flex flex-wrap items-center gap-2 p-2 min-h-[40px]">
                                {selectedTherapists.map(therapist => (
                                    <span key={therapist} className="flex items-center gap-1 bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                                        {therapist}
                                        <button type="button" onClick={() => handleTherapistRemove(therapist)} className="text-green-600 hover:text-green-800">
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                                <input
                                    type="text"
                                    value={therapistSearch}
                                    onChange={(e) => setTherapistSearch(e.target.value)}
                                    onFocus={() => setIsTherapistDropdownOpen(true)}
                                    placeholder="Select therapists..."
                                    className="flex-grow bg-transparent border-none focus:ring-0 p-0 text-sm"
                                />
                            </div>
                            {isTherapistDropdownOpen && availableTherapists.length > 0 && (
                                <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
                                    {availableTherapists.map(therapist => (
                                        <li
                                            key={therapist}
                                            onClick={() => handleTherapistSelect(therapist)}
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                        >
                                            {therapist}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Entry Time</label>
                            <input
                                type="datetime-local"
                                value={formData.entryTime ? new Date(formData.entryTime).toISOString().slice(0, 16) : ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, entryTime: e.target.value }))}
                                className="form-input"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-700 text-white font-semibold rounded-lg shadow-md hover:bg-green-800"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEntryModal;
