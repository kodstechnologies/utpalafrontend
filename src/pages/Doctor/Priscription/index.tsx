// file is .tsx and create prescription page for doctor while he will search patient by id and create prescription for that patient fileds are medicine name, dosage(morning-afternoon-evening), intaketime, special instructions and submit button and for now make static and 2 div one form and other for recntly created prescription details
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setPageTitle } from '../../../store/themeConfigSlice';

const Prescription = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Create Prescription'));
    });

    const [patientId, setPatientId] = useState('');
    const [medicineName, setMedicineName] = useState('');
    const [medicineType, setMedicineType] = useState('');
    const [dosage, setDosage] = useState({
        morning: false,
        afternoon: false,
        evening: false,
    });
    const [intakeTime, setIntakeTime] = useState('');
    const [specialInstructions, setSpecialInstructions] = useState('');

    const [recentPrescriptions, setRecentPrescriptions] = useState<any[]>([
        {
            patientId: 'P001',
            medicineName: 'Paracetamol',
            medicineType: 'tablet',
            dosage: 'Morning, Evening',
            intakeTime: 'after_food',
            specialInstructions: 'Take with a full glass of water.',
        },
        {
            patientId: 'P002',
            medicineType: 'tablet',
            medicineName: 'Amoxicillin',
            dosage: 'Morning, Afternoon, Evening',
            intakeTime: 'after_food',
            specialInstructions: 'Complete the full course.',
        },
    ]);

    const handleDosageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setDosage((prev) => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newPrescription = {
            patientId,
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
    };

    const handleRemovePrescription = (indexToRemove: number) => {
        setRecentPrescriptions((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleCancel = () => {
        setPatientId('');
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
                <div className="panel">
                    <div className="flex items-center justify-between mb-5">
                        <h5 className="font-semibold text-lg dark:text-white-light">Create Prescription</h5>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="patientId">Patient ID</label>
                            <input id="patientId" type="text" placeholder="Enter Patient ID" className="form-input" value={patientId} onChange={(e) => setPatientId(e.target.value)} required />
                        </div>
                        <div>
                            <label htmlFor="medicineType">Medicine Type</label>
                            <select id="medicineType" className="form-select" value={medicineType} onChange={(e) => setMedicineType(e.target.value)} required>
                                <option value="">Select Type</option>
                                <option value="tablet">Tablet</option>
                                <option value="oil">Oil</option>
                                <option value="scrum">Scrum</option>
                                {/* <option value="powder">Powder</option> */}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="medicineName">Medicine Name</label>
                            <input id="medicineName" type="text" placeholder="Enter Medicine Name" className="form-input" value={medicineName} onChange={(e) => setMedicineName(e.target.value)} required />
                        </div>
                        
                        <div>
                            <label>Dosage</label>
                            <div className="flex gap-4">
                                <label className="flex items-center space-x-2">
                                    <input type="checkbox" name="morning" checked={dosage.morning} onChange={handleDosageChange} className="form-checkbox" />
                                    <span>Morning</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input type="checkbox" name="afternoon" checked={dosage.afternoon} onChange={handleDosageChange} className="form-checkbox" />
                                    <span>Afternoon</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input type="checkbox" name="evening" checked={dosage.evening} onChange={handleDosageChange} className="form-checkbox" />
                                    <span>Evening</span>
                                </label>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="intakeTime">Intake Time</label>
                            <select id="intakeTime" className="form-select" value={intakeTime} onChange={(e) => setIntakeTime(e.target.value)} required>
                                <option value="">Select Intake Time</option>
                                <option value="before_food">Before Food</option>
                                <option value="after_food">After Food</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="specialInstructions">Special Instructions</label>
                            <textarea
                                id="specialInstructions"
                                rows={3}
                                className="form-textarea"
                                placeholder="Enter Special Instructions"
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
                {recentPrescriptions.length > 0 && (
                    <div className="panel">
                        <div className="flex items-center justify-between mb-5">
                            <h5 className="font-semibold text-lg dark:text-white-light">Recent Prescriptions</h5>
                        </div>
                        <div className="table-responsive">
                            <table className="table-hover">
                                <thead>
                                    <tr>
                                        <th>Medicine Name</th>
                                        <th>Type</th>
                                        <th>Dosage</th>
                                        <th>Intake</th>
                                        <th>Special Instruction</th>
                                        <th className="text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentPrescriptions.map((prescription, index) => (
                                        <tr key={index}>
                                            <td>{prescription.medicineName}</td>
                                            <td className="capitalize">{prescription.medicineType}</td>
                                            <td className="capitalize">{prescription.dosage}</td>
                                            <td className="capitalize">{prescription.intakeTime.replace('_', ' ')}</td>
                                            <td>{prescription.specialInstructions}</td>
                                            <td className="text-center">
                                                <button type="button" onClick={() => handleRemovePrescription(index)} className="text-red-600 hover:text-red-800">
                                                    X
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Prescription;
