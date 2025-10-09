import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setPageTitle } from '../../../store/themeConfigSlice';

const Prescription = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Create Prescription'));
    });

    const [patientName, setPatientName] = useState('');
    const [medicineName, setMedicineName] = useState('');
    const [medicineType, setMedicineType] = useState('');
    const [dosage, setDosage] = useState({
        morning: false,
        afternoon: false,
        evening: false,
    });
    const [intakeTime, setIntakeTime] = useState('');
    const [specialInstructions, setSpecialInstructions] = useState('');

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // 🌿 Ayurvedic-style sample prescriptions
    const [recentPrescriptions, setRecentPrescriptions] = useState<any[]>([
        {
            patientName: 'Rohit Sharma',
            medicineName: 'Triphala Churna',
            medicineType: 'churna',
            dosage: 'Morning, Evening',
            intakeTime: 'before_food',
            specialInstructions: 'Take with warm water for better digestion.',
        },
        {
            patientName: 'Sneha Patil',
            medicineName: 'Ashwagandha Vati',
            medicineType: 'vati',
            dosage: 'Morning, Night',
            intakeTime: 'after_food',
            specialInstructions: 'Helps in improving strength and immunity.',
        },
        {
            patientName: 'Aarav Deshmukh',
            medicineName: 'Brahmi Ghrita',
            medicineType: 'taila',
            dosage: 'Morning',
            intakeTime: 'with_ghee',
            specialInstructions: 'Improves focus and memory power.',
        },
        {
            patientName: 'Priya Nair',
            medicineName: 'Amla Rasayana',
            medicineType: 'leha',
            dosage: 'Morning',
            intakeTime: 'after_food',
            specialInstructions: 'Rich in Vitamin C, boosts immunity.',
        },
        {
            patientName: 'Vikas Kumar',
            medicineName: 'Guduchi Kwatha',
            medicineType: 'kwatha',
            dosage: 'Morning, Evening',
            intakeTime: 'before_food',
            specialInstructions: 'Effective in fever and detoxification.',
        },
        {
            patientName: 'Rina Joshi',
            medicineName: 'Shatavari Churna',
            medicineType: 'churna',
            dosage: 'Morning, Evening',
            intakeTime: 'after_food',
            specialInstructions: 'Helps in hormonal balance and vitality.',
        },
    ]);

    const handleDosageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setDosage((prev) => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newPrescription = {
            patientName,
            medicineName,
            medicineType,
            dosage: Object.entries(dosage)
                .filter(([, value]) => value)
                .map(([key]) => key)
                .join(', '),
            intakeTime,
            specialInstructions,
        };
        setRecentPrescriptions((prev) => [newPrescription, ...prev]);

        // ✅ Reset form fields after save
        handleCancel();

        // ✅ Reset pagination to first page
        setCurrentPage(1);
    };

    const handleRemovePrescription = (indexToRemove: number) => {
        setRecentPrescriptions((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleCancel = () => {
        setPatientName('');
        setMedicineName('');
        setMedicineType('');
        setDosage({
            morning: false,
            afternoon: false,
            evening: false,
        });
        setIntakeTime('');
        setSpecialInstructions('');
    };

    // Pagination logic
    const totalPages = Math.ceil(recentPrescriptions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = recentPrescriptions.slice(startIndex, startIndex + itemsPerPage);

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/" className="text-primary hover:underline">
                        Dashboard
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Prescription</span>
                </li>
            </ul>

            <div className="pt-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Panel - Create Prescription */}
                <div className="panel">
                    <div className="flex items-center justify-between mb-5">
                        <h5 className="font-semibold text-lg dark:text-white-light">Create Prescription</h5>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="patientId">Patient Name</label>
                            <input
                                id="patientId"
                                type="text"
                                placeholder="Enter Patient Name"
                                className="form-input"
                                value={patientName}
                                onChange={(e) => setPatientName(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="medicineType">Medicine Type</label>
                            <select
                                id="medicineType"
                                className="form-select"
                                value={medicineType}
                                onChange={(e) => setMedicineType(e.target.value)}
                                required
                            >
                                <option value="">Select Type</option>
                                <option value="vati">Vati (Tablet)</option>
                                <option value="churna">Churna (Powder)</option>
                                <option value="kwatha">Kwatha (Decoction)</option>
                                <option value="taila">Taila (Oil)</option>
                                <option value="leha">Leha (Paste)</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="medicineName">Medicine Name</label>
                            <input
                                id="medicineName"
                                type="text"
                                placeholder="Enter Medicine Name"
                                className="form-input"
                                value={medicineName}
                                onChange={(e) => setMedicineName(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label>Dosage</label>
                            <div className="flex gap-4">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="morning"
                                        checked={dosage.morning}
                                        onChange={handleDosageChange}
                                        className="form-checkbox"
                                    />
                                    <span>Pratahkal (Morning)</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="afternoon"
                                        checked={dosage.afternoon}
                                        onChange={handleDosageChange}
                                        className="form-checkbox"
                                    />
                                    <span>Madhyahn (Afternoon)</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="evening"
                                        checked={dosage.evening}
                                        onChange={handleDosageChange}
                                        className="form-checkbox"
                                    />
                                    <span>Sayankal (Evening)</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="intakeTime">Intake Time</label>
                            <select
                                id="intakeTime"
                                className="form-select"
                                value={intakeTime}
                                onChange={(e) => setIntakeTime(e.target.value)}
                                required
                            >
                                <option value="">Select Intake Time</option>
                                <option value="before_food">Before Food</option>
                                <option value="after_food">After Food</option>
                                <option value="with_honey">With Honey</option>
                                <option value="with_ghee">With Ghee</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="specialInstructions">Special Instructions</label>
                            <textarea
                                id="specialInstructions"
                                rows={3}
                                className="form-textarea"
                                placeholder="Example: Take with honey or warm water after meals"
                                value={specialInstructions}
                                onChange={(e) => setSpecialInstructions(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="flex items-center justify-start gap-4 !mt-6">
                            <button type="submit" className="btn btn-primary">
                                Save Prescription
                            </button>
                            <button type="button" className="btn btn-danger" onClick={handleCancel}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Panel - Recent Prescriptions */}
                {recentPrescriptions.length > 0 && (
                    <div className="panel">
                        <div className="flex items-center justify-between mb-5">
                            <h5 className="font-semibold text-lg dark:text-white-light">Recent Prescriptions</h5>
                        </div>
                        <div className="table-responsive">
                            <table className="table-hover">
                                <thead>
                                    <tr>
                                        <th>Patient</th>
                                        <th>Medicine</th>
                                        <th>Type</th>
                                        <th>Dosage</th>
                                        <th>Intake</th>
                                        <th>Special Instruction</th>
                                        <th className="text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((prescription, index) => (
                                        <tr key={index}>
                                            <td>{prescription.patientName}</td>
                                            <td>{prescription.medicineName}</td>
                                            <td className="capitalize">{prescription.medicineType}</td>
                                            <td className="capitalize">{prescription.dosage}</td>
                                            <td className="capitalize">{prescription.intakeTime.replace('_', ' ')}</td>
                                            <td>{prescription.specialInstructions}</td>
                                            <td className="text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemovePrescription(startIndex + index)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    X
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-4 space-x-2">
                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    disabled={currentPage === 1}
                                    onClick={() => goToPage(currentPage - 1)}
                                >
                                    Prev
                                </button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        className={`btn btn-sm ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline-primary'}`}
                                        onClick={() => goToPage(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    disabled={currentPage === totalPages}
                                    onClick={() => goToPage(currentPage + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Prescription;
