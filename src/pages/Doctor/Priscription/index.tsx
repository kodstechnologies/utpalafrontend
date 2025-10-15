import React, { useEffect, useState, useMemo, ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setPageTitle } from '../../../store/themeConfigSlice';
import Table, { Column } from '../../../components/Table/Table';
import IconTrash from '../../../components/Icon/IconTrash';

interface PrescriptionData {
    id: number;
    patientName: string;
    medicineName: string;
    medicineType: string;
    dosage: string;
    intakeTime: string;
    specialInstructions: string;
}

const Prescription = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Prescription'));
    });
    const [search, setSearch] = useState('');

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

    // 🌿 Ayurvedic-style sample prescriptions
    const [recentPrescriptions, setRecentPrescriptions] = useState<PrescriptionData[]>([
        {
            id: 1,
            patientName: 'Rohit Sharma',
            medicineName: 'Triphala Churna',
            medicineType: 'churna',
            dosage: 'Morning, Evening',
            intakeTime: 'before_food',
            specialInstructions: 'Take with warm water for better digestion.',
        },
        {
            id: 2,
            patientName: 'Sneha Patil',
            medicineName: 'Ashwagandha Vati',
            medicineType: 'vati',
            dosage: 'Morning, Night',
            intakeTime: 'after_food',
            specialInstructions: 'Helps in improving strength and immunity.',
        },
        {
            id: 3,
            patientName: 'Aarav Deshmukh',
            medicineName: 'Brahmi Ghrita',
            medicineType: 'taila',
            dosage: 'Morning',
            intakeTime: 'with_ghee',
            specialInstructions: 'Improves focus and memory power.',
        },
        {
            id: 4,
            patientName: 'Priya Nair',
            medicineName: 'Amla Rasayana',
            medicineType: 'leha',
            dosage: 'Morning',
            intakeTime: 'after_food',
            specialInstructions: 'Rich in Vitamin C, boosts immunity.',
        },
        {
            id: 5,
            patientName: 'Vikas Kumar',
            medicineName: 'Guduchi Kwatha',
            medicineType: 'kwatha',
            dosage: 'Morning, Evening',
            intakeTime: 'before_food',
            specialInstructions: 'Effective in fever and detoxification.',
        },
        {
            id: 6,
            patientName: 'Rina Joshi',
            medicineName: 'Shatavari Churna',
            medicineType: 'churna',
            dosage: 'Morning, Evening',
            intakeTime: 'after_food',
            specialInstructions: 'Helps in hormonal balance and vitality.',
        },
    ]);

    const filteredData = useMemo(() => {
        return recentPrescriptions.filter(p =>
            p.patientName.toLowerCase().includes(search.toLowerCase()) ||
            p.medicineName.toLowerCase().includes(search.toLowerCase())
        );
    }, [recentPrescriptions, search]);

    const handleDosageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setDosage((prev) => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newPrescription: PrescriptionData = {
            id: Date.now(),
            patientName,
            medicineName,
            medicineType,
            dosage: Object.entries(dosage)
                .filter(([, value]) => value)
                .map(([key]) => key)
                .join(', ') || 'Not specified',
            intakeTime,
            specialInstructions,
        };
        setRecentPrescriptions((prev) => [newPrescription, ...prev]);

        // ✅ Reset form fields after save
        handleCancel();
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

    const columns: Column<PrescriptionData>[] = useMemo(() => [
        { Header: 'Patient', accessor: 'patientName' },
        { Header: 'Medicine', accessor: 'medicineName' },
        { Header: 'Type', accessor: 'medicineType', Cell: ({ value }) => <span className="capitalize">{value}</span> },
        { Header: 'Dosage', accessor: 'dosage', Cell: ({ value }) => <span className="capitalize">{value}</span> },
        { Header: 'Intake', accessor: 'intakeTime', Cell: ({ value }) => <span className="capitalize">{value.replace('_', ' ')}</span> },
        { Header: 'Instructions', accessor: 'specialInstructions' },
    ], []);

    const handleRemovePrescription = (id: number) => {
        setRecentPrescriptions((prev) => prev.filter((p) => p.id !== id));
    };

    const renderActions = (prescription: PrescriptionData): ReactNode => (
        <button
            type="button"
            onClick={() => handleRemovePrescription(prescription.id)}
            className="text-red-600 hover:text-red-800"
            title="Remove Prescription"
        >
            <IconTrash className="w-5 h-5" />
        </button>
    );

    const renderTopContent = (): ReactNode => (
        <div className="flex items-center justify-between w-full">
            <h5 className="font-semibold text-lg dark:text-white-light">Recent Prescriptions</h5>
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search..."
                    className="form-input ltr:pr-10 rtl:pl-10"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        </div>
    );

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
                    <Table<PrescriptionData>
                        columns={columns}
                        data={filteredData}
                        actions={renderActions}
                        topContent={renderTopContent()}
                        itemsPerPage={5}
                    />
                )}
            </div>
        </div>
    );
};

export default Prescription;
