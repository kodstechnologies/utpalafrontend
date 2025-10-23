import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useMemo, ReactNode } from 'react';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { IRootState } from '../../../store';
import IconEye from '../../../components/Icon/IconEye';
import { useNavigate } from 'react-router-dom';
import Table, { Column } from '../../../components/Table/Table';
import IconSearch from '../../../components/Icon/IconSearch';
import ProgressModal from './ProgressModal';

interface Patient {
    id: number;
    name: string;
    age: number;
    gender: string;
    prakruti: string;
    vikruti: string;
    agniType: string;
    condition: string;
    treatmentType: string;
    lastVisit: string;
    nextVisit: string;
    // paymentStatus: 'Paid' | 'Pending';
}

const MyPatients = () => {
    const dispatch = useDispatch();
    type TreatmentStatus = 'Pending' | 'Active' | 'Completed';
type ActiveTreatmentsMap = Record<number, TreatmentStatus>;
   const [patientsData] = useState<Patient[]>([
    {
        id: 1,
        name: 'Jay Sharma',
        age: 30,
        gender: 'Male',
        prakruti: 'Vata-Pitta',
        vikruti: 'Vata Imbalance',
        agniType: 'Tikshna',
        condition: 'Diabetes',
        treatmentType: 'Panchakarma - Basti',
        lastVisit: '2025-09-23',
        nextVisit: '2025-10-15',
        // paymentStatus: 'Paid'
    },
    {
        id: 2,
        name: 'Vijay Sharma',
        age: 35,
        gender: 'Male',
        prakruti: 'Kapha',
        vikruti: 'Kapha Imbalance',
        agniType: 'Manda',
        condition: 'Hypertension',
        treatmentType: 'Shamana - Herbal Decoction',
        lastVisit: '2025-09-19',
        nextVisit: '2025-10-10',
        // paymentStatus: 'Pending'
    },
    {
        id: 3,
        name: 'Ajay Sharma',
        age: 29,
        gender: 'Male',
        prakruti: 'Kapha',
        vikruti: 'Kapha Imbalance',
        agniType: 'Manda',
        condition: 'Obesity',
        treatmentType: 'Shamana - Herbal Powder',
        lastVisit: '2025-09-18',
        nextVisit: '2025-10-12',
        // paymentStatus: 'Pending'
    },
    {
        id: 4,
        name: 'Sonia Mehta',
        age: 26,
        gender: 'Female',
        prakruti: 'Pitta-Kapha',
        vikruti: 'Pitta Imbalance',
        agniType: 'Tikshna',
        condition: 'Skin Allergy',
        treatmentType: 'Rasayana - Herbal Tonic',
        lastVisit: '2025-09-25',
        nextVisit: '2025-10-17',
        // paymentStatus: 'Paid'
    },
    {
        id: 5,
        name: 'Rahul Verma',
        age: 45,
        gender: 'Male',
        prakruti: 'Vata',
        vikruti: 'Vata Imbalance',
        agniType: 'Vishama',
        condition: 'Arthritis',
        treatmentType: 'Panchakarma - Abhyanga',
        lastVisit: '2025-09-10',
        nextVisit: '2025-10-08',
        // paymentStatus: 'Paid'
    },
    {
        id: 6,
        name: 'Priya Nair',
        age: 38,
        gender: 'Female',
        prakruti: 'Pitta',
        vikruti: 'Pitta Imbalance',
        agniType: 'Tikshna',
        condition: 'Migraine',
        treatmentType: 'Shamana - Nasya Therapy',
        lastVisit: '2025-09-30',
        nextVisit: '2025-10-18',
        // paymentStatus: 'Pending'
    },
    {
        id: 7,
        name: 'Rohit Deshmukh',
        age: 42,
        gender: 'Male',
        prakruti: 'Vata-Kapha',
        vikruti: 'Kapha Imbalance',
        agniType: 'Manda',
        condition: 'Sinusitis',
        treatmentType: 'Panchakarma - Shirodhara',
        lastVisit: '2025-09-28',
        nextVisit: '2025-10-16',
        // paymentStatus: 'Paid'
    },
    {
        id: 8,
        name: 'Neha Kulkarni',
        age: 32,
        gender: 'Female',
        prakruti: 'Pitta-Vata',
        vikruti: 'Vata Imbalance',
        agniType: 'Vishama',
        condition: 'Anxiety & Insomnia',
        treatmentType: 'Panchakarma - Shiro Abhyanga',
        lastVisit: '2025-09-20',
        nextVisit: '2025-10-14',
        // paymentStatus: 'Pending'
    },
    {
        id: 9,
        name: 'Arjun Patel',
        age: 50,
        gender: 'Male',
        prakruti: 'Kapha-Vata',
        vikruti: 'Kapha Imbalance',
        agniType: 'Manda',
        condition: 'Respiratory Disorder',
        treatmentType: 'Shamana - Herbal Decoction',
        lastVisit: '2025-09-12',
        nextVisit: '2025-10-09',
        // paymentStatus: 'Paid'
    },
    {
        id: 10,
        name: 'Kavita Joshi',
        age: 41,
        gender: 'Female',
        prakruti: 'Pitta',
        vikruti: 'Pitta Imbalance',
        agniType: 'Tikshna',
        condition: 'Acidity',
        treatmentType: 'Shamana - Herbal Churna',
        lastVisit: '2025-09-29',
        nextVisit: '2025-10-19',
        // paymentStatus: 'Pending'
    },
    {
        id: 11,
        name: 'Nikhil Reddy',
        age: 37,
        gender: 'Male',
        prakruti: 'Vata',
        vikruti: 'Vata Imbalance',
        agniType: 'Vishama',
        condition: 'Lower Back Pain',
        treatmentType: 'Panchakarma - Kati Basti',
        lastVisit: '2025-09-21',
        nextVisit: '2025-10-13',
        // paymentStatus: 'Paid'
    },
    {
        id: 12,
        name: 'Rina Shah',
        age: 29,
        gender: 'Female',
        prakruti: 'Kapha-Pitta',
        vikruti: 'Kapha Imbalance',
        agniType: 'Manda',
        condition: 'PCOD',
        treatmentType: 'Shamana - Herbal Tablets',
        lastVisit: '2025-09-26',
        nextVisit: '2025-10-20',
        // paymentStatus: 'Pending'
    }
]);

    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [treatmentFilter, setTreatmentFilter] = useState('');
    const [activeTreatments, setActiveTreatments] = useState<ActiveTreatmentsMap>({ 3: 'Completed' });
    const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
    const [selectedPatientForProgress, setSelectedPatientForProgress] = useState<Patient | null>(null);

    const handleViewProgress = (patient: Patient) => {
        setSelectedPatientForProgress(patient);
        setIsProgressModalOpen(true);
    };

    const handleCloseProgressModal = () => setIsProgressModalOpen(false);

     const handleStartStopTreatment = (patientId: number, currentStatus: TreatmentStatus) => {
        if (currentStatus === 'Pending') {
            // Start Treatment -> Active
            setActiveTreatments((prev) => ({ ...prev, [patientId]: 'Active' }));
            // Navigate to the prescription page after starting
            navigate(`/patient-examination/${patientId}`);
        } else if (currentStatus === 'Active') {
            // Stop Treatment -> Completed
            setActiveTreatments((prev) => ({ ...prev, [patientId]: 'Completed' }));
            // Log completion for mock purposes
            console.log(`Treatment for Patient ${patientId} marked as completed.`);
        }
    };
    useEffect(() => {
        dispatch(setPageTitle('My Patients'));
    });

    const filteredData = useMemo(() => {
        return patientsData
            .filter((patient) => patient.name.toLowerCase().includes(search.toLowerCase()))
            .filter((patient) => (treatmentFilter ? patient.treatmentType.toLowerCase().includes(treatmentFilter.toLowerCase()) : true));
    }, [patientsData, search, treatmentFilter]);

    const columns: Column<Patient>[] = useMemo(
        () => [
            {
                Header: 'Patient Name',
                accessor: 'name',
                Cell: ({ row }) => (
                    <Link to={`/patients/${row.id}`} className="text-green-500 hover:underline font-semibold">
                        {row.name}
                    </Link>
                ),
            },
            { Header: 'Age', accessor: 'age' },
            { Header: 'Prakruti', accessor: 'prakruti' },
            { Header: 'Vikruti', accessor: 'vikruti' },
            { Header: 'Condition', accessor: 'condition' },
            { Header: 'Treatment Type', accessor: 'treatmentType' },
            { Header: 'Last Visit', accessor: 'lastVisit' },
            // {
            //     Header: 'Payment',
            //     accessor: 'paymentStatus',
            //     Cell: ({ value }) => (
            //         <span className={`px-2 py-1 rounded-full text-xs ${value === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
            //             {value}
            //         </span>
            //     ),
            // },
        ],
        []
    );

    // const renderActions = (patient: Patient): ReactNode => (
    //     <div className="flex items-center justify-center gap-4">
    //         <Link to={`/patients/${patient.id}`} className="text-blue-600 hover:text-blue-800" title="View Patient Details">
    //             <IconEye />
    //         </Link>
    //         <button type="button" onClick={() => navigate(`/prescription?patientId=${patient.id}`)} className="btn btn-sm btn-outline-green whitespace-nowrap">
    //             Start Treatment
    //         </button>
    //     </div>
    // );

    const renderActions = (patient: Patient): ReactNode => {
        // Determine the current local status. Default is 'Pending'.
        const status: TreatmentStatus = activeTreatments[patient.id] || 'Pending';

        let buttonText = 'Start Treatment';
        let buttonClass = 'btn-outline-success';
        let isDisabled = false;

        return (
            <div className="flex items-center justify-center gap-4">
                <Link to={`/patients/${patient.id}`} className="text-blue-600 hover:text-blue-800" title="View Patient Details">
                    <IconEye />
                </Link>
                {status === 'Completed' ? (
                    <button type="button" onClick={() => handleViewProgress(patient)} className="btn btn-sm btn-outline-info whitespace-nowrap">
                        View Progress
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={() => handleStartStopTreatment(patient.id, status)}
                        className={`btn btn-sm whitespace-nowrap ${status === 'Active' ? 'btn-danger' : 'btn-outline-success'}`}
                        disabled={isDisabled}
                    >
                        {status === 'Active' ? 'Stop Treatment' : 'Start Treatment'}
                    </button>
                )}
            </div>
        );
    };

    const renderTopContent = (): ReactNode => (
        <>
            <div className="relative">
                <input type="text" placeholder="Search Patients..." value={search} onChange={(e) => setSearch(e.target.value)} className="form-input ltr:pl-10 rtl:pr-10" />
                <IconSearch className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2" />
            </div>
            <div>
                <select value={treatmentFilter} onChange={(e) => setTreatmentFilter(e.target.value)} className="form-select">
                    <option value="">All Treatment Types</option>
                    <option value="Panchakarma">Panchakarma</option>
                    <option value="Shamana">Shamana</option>
                    <option value="Rasayana">Rasayana</option>
                </select>
            </div>
        </>
    );

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/" className="text-green-500 hover:underline">
                        Dashboard
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>My Patients</span>
                </li>
            </ul>

            <div className="pt-5">
                <Table<Patient>
                    columns={columns}
                    data={filteredData}
                    actions={renderActions}
                    topContent={renderTopContent()}
                    itemsPerPage={10}
                />
            </div>
            {selectedPatientForProgress && (
                <ProgressModal
                    isOpen={isProgressModalOpen}
                    onClose={handleCloseProgressModal}
                    patientName={selectedPatientForProgress.name}
                />
            )}
        </div>
    );
};

export default MyPatients;
