import { useEffect, useState, useMemo, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { Dialog, Transition } from '@headlessui/react';
import { setPageTitle } from '../../../store/themeConfigSlice';
import Table, { Column } from '../../../components/Table/Table';
import IconMessage from '../../../components/Icon/IconMessage';
import GlobalModal, { FieldConfig } from '../../../components/Modal/GlobalModal';
import IconEye from '../../../components/Icon/IconEye';
import IconPlus from '../../../components/Icon/IconPlus';

// --- Type Definitions ---
interface AppointmentPatient {
    id: string;
    name: string;
    appointmentDateTime: string;
    doctor: string;
    contact: string;
    disease: string;
    status: 'Pending' | 'Confirmed' | 'Cancelled';
}

interface RegisteredPatient {
    id: string;
    name: string;
    registeredDate: string;
    contact: string;
    gender: 'Male' | 'Female' | 'Other';
    age: number;
    address: string;
    email: string;
    preferredDate?: string;
    preferredTime?: string;
    lastConsultedBy: string;
    disease: string;
    lastTreatment: string;
}

interface TherapySession {
    id: number;
    patientName: string;
    therapistName: string;
    treatment: string;
    sessionDateTime: string;
    status: 'Scheduled' | 'Completed';
}

// --- Mock Data ---
const mockAppointments: AppointmentPatient[] = [
    { id: 'P001', name: 'Ravi Kumar', appointmentDateTime: '2024-07-28 10:00 AM', doctor: 'Dr. Priya Singh', contact: '+919876543210', disease: 'Arthritis', status: 'Confirmed' },
    { id: 'P002', name: 'Sunita Sharma', appointmentDateTime: '2024-07-28 11:30 AM', doctor: 'Dr. Anjali Verma', contact: '+919123456789', disease: 'Migraine', status: 'Pending' },
    { id: 'P004', name: 'Vijay Singh', appointmentDateTime: '2024-07-28 12:00 PM', doctor: 'Dr. Priya Singh', contact: '+919876543211', disease: 'Hypertension', status: 'Pending' },
];

const mockAllPatients: RegisteredPatient[] = [
    { id: 'P001', name: 'Ravi Kumar', registeredDate: '2024-07-20', contact: '+919876543210', gender: 'Male', age: 45, address: '123 MG Road, Bangalore', email: 'ravi.k@example.com', lastConsultedBy: 'Dr. Priya Singh', disease: 'Arthritis', lastTreatment: 'Physiotherapy' },
    { id: 'P002', name: 'Sunita Sharma', registeredDate: '2024-07-21', contact: '+919123456789', gender: 'Female', age: 38, address: '456 Koramangala, Bangalore', email: 'sunita.s@example.com', lastConsultedBy: 'Dr. Anjali Verma', disease: 'Migraine', lastTreatment: 'Panchakarma' },
    { id: 'P003', name: 'Amit Patel', registeredDate: '2024-07-22', contact: '+919988776655', gender: 'Male', age: 52, address: '789 Indiranagar, Bangalore', email: 'amit.p@example.com', lastConsultedBy: 'Dr. Priya Singh', disease: 'Diabetes', lastTreatment: 'Diet Plan' },
];

const mockTherapySessions: TherapySession[] = [
    { id: 1, patientName: 'Ravi Kumar', therapistName: 'Mr. Anand', treatment: 'Physiotherapy', sessionDateTime: '2024-07-29 03:00 PM', status: 'Scheduled' },
    { id: 2, patientName: 'Sunita Sharma', therapistName: 'Ms. Geeta', treatment: 'Panchakarma', sessionDateTime: '2024-07-30 10:00 AM', status: 'Scheduled' },
];

// Mock data for dropdowns
const mockDoctors = ['Dr. Priya Singh', 'Dr. Anjali Verma'];
const mockTherapists = ['Mr. Anand', 'Ms. Geeta', 'Mr. Suresh'];
const mockDiseases = ['Arthritis', 'Migraine', 'Diabetes', 'Hypertension'];
const mockTreatments = ['Physiotherapy', 'Panchakarma', 'Diet Plan', 'Yoga'];


// --- Modal Field Configuration for New Patient ---
const newPatientFields: FieldConfig[] = [
    { name: 'name', label: 'Patient Name', type: 'text', required: true },
    { name: 'contact', label: 'Contact Number', type: 'text', required: true },
    { name: 'gender', label: 'Gender', type: 'select', required: true, options: ['Male', 'Female', 'Other'] },
    { name: 'age', label: 'Age', type: 'number', required: true },
    { name: 'address', label: 'Address', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'preferredDate', label: 'Preferred Date', type: 'date', required: true },
    { name: 'preferredTime', label: 'Preferred Time', type: 'time', required: true },
    { name: 'disease', label: 'Initial Diagnosis/Disease', type: 'text' },
];

const ReceptionistAppointments = () => {
    const dispatch = useDispatch();
    const [appointments, setAppointments] = useState<AppointmentPatient[]>(mockAppointments);
    const [therapySessions, setTherapySessions] = useState<TherapySession[]>(mockTherapySessions);
    const [activeTab, setActiveTab] = useState<'appointments' | 'allPatients' | 'therapists'>('allPatients');
    const [allPatients, setAllPatients] = useState<RegisteredPatient[]>(mockAllPatients);

    // Modal States
    const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
    const [isScheduleAppointmentModalOpen, setIsScheduleAppointmentModalOpen] = useState(false);
    const [isScheduleTherapyModalOpen, setIsScheduleTherapyModalOpen] = useState(false);
    // --- MODIFICATION: State for Reschedule Modal ---
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
    const [appointmentToReschedule, setAppointmentToReschedule] = useState<AppointmentPatient | null>(null);
    // --- MODIFICATION: State for View Patient Modal ---
    const [isViewPatientModalOpen, setIsViewPatientModalOpen] = useState(false);
    const [patientToView, setPatientToView] = useState<RegisteredPatient | null>(null);


    // State for forms
    const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        search: '',
        gender: '',
        disease: '',
        treatment: '',
    });
    const [selectedPatient, setSelectedPatient] = useState<{ name: string; contact: string } | null>(null);
    const [patientToSchedule, setPatientToSchedule] = useState<RegisteredPatient | null>(null);
    const [newAppointment, setNewAppointment] = useState({ doctor: '', date: '', time: '' });
    const [newTherapySession, setNewTherapySession] = useState({ patientId: '', therapistName: '', treatment: '', date: '', time: '' });
    const [rescheduleData, setRescheduleData] = useState({ date: '', time: '' });


    useEffect(() => {
        dispatch(setPageTitle('Manage Appointments'));
    }, [dispatch]);

    const handleSendMessageClick = (patient: { name: string; contact: string }) => {
        setSelectedPatient(patient);
        setIsWhatsAppModalOpen(true);
    };

    const handleSendWhatsApp = (type: 'form' | 'reminder') => {
        if (!selectedPatient) return;

        const phoneNumber = selectedPatient.contact.replace(/\D/g, ''); // Remove non-digit characters
        let message = '';

        if (type === 'form') {
            const formUrl = `${window.location.origin}/patient-registration-form`;
            message = `Hello ${selectedPatient.name}, please fill out your registration form here: ${formUrl}`;
        } else {
            message = `Hello ${selectedPatient.name}, this is a reminder for your upcoming appointment.`;
        }

        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        setIsWhatsAppModalOpen(false);
    };

    const handleConfirmAppointment = (patientId: string) => {
        // In a real app, this would be an API call to update the status
        setAppointments(prev =>
            prev.map(apt => apt.id === patientId ? { ...apt, status: 'Confirmed' } : apt)
        );
        console.log(`Confirmed appointment for patient ID: ${patientId}`);
    };

    const handleCancelAppointment = (patientId: string) => {
        // In a real app, this would be an API call to update the status
        if (window.confirm('Are you sure you want to cancel this appointment?')) {
            setAppointments(prev =>
                prev.map(apt => apt.id === patientId ? { ...apt, status: 'Cancelled' } : apt)
            );
            console.log(`Cancelled appointment for patient ID: ${patientId}`);
        }
    };

    const handleScheduleAppointmentClick = (patient: RegisteredPatient) => {
        setPatientToSchedule(patient);
        setIsScheduleAppointmentModalOpen(true);
    };

    // --- MODIFICATION: Handler for View Patient Modal ---
    const handleViewPatientClick = (patient: RegisteredPatient) => {
        setPatientToView(patient);
        setIsViewPatientModalOpen(true);
    };

    // --- MODIFICATION: Handlers for Reschedule Modal ---
    const handleRescheduleClick = (appointment: AppointmentPatient) => {
        setAppointmentToReschedule(appointment);
        const [date, time, ampm] = appointment.appointmentDateTime.split(' ');
        setRescheduleData({ date, time: `${time} ${ampm}` });
        setIsRescheduleModalOpen(true);
    };

    const handleRescheduleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!appointmentToReschedule || !rescheduleData.date || !rescheduleData.time) {
            alert('Please select a new date and time.');
            return;
        }
        setAppointments(prev =>
            prev.map(apt =>
                apt.id === appointmentToReschedule.id
                    ? { ...apt, appointmentDateTime: `${rescheduleData.date} ${rescheduleData.time}` }
                    : apt
            )
        );
        setIsRescheduleModalOpen(false);
        alert(`Appointment for ${appointmentToReschedule.name} has been rescheduled.`);
    };
    const handleScheduleAppointmentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!patientToSchedule || !newAppointment.doctor || !newAppointment.date || !newAppointment.time) {
            alert('Please fill all fields.');
            return;
        }
        const newApt: AppointmentPatient = {
            id: patientToSchedule.id,
            name: patientToSchedule.name,
            contact: patientToSchedule.contact,
            disease: patientToSchedule.disease,
            appointmentDateTime: `${newAppointment.date} ${newAppointment.time}`,
            doctor: newAppointment.doctor,
            status: 'Pending',
        };
        setAppointments(prev => [newApt, ...prev]);
        setIsScheduleAppointmentModalOpen(false);
        setNewAppointment({ doctor: '', date: '', time: '' });
        alert(`Appointment scheduled for ${patientToSchedule.name}.`);
    };

    const handleScheduleTherapySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const patient = mockAllPatients.find(p => p.id === newTherapySession.patientId);
        if (!patient) {
            alert('Patient not found');
            return;
        }
        const newSession: TherapySession = {
            id: therapySessions.length + 1,
            patientName: patient.name,
            therapistName: newTherapySession.therapistName,
            treatment: newTherapySession.treatment,
            sessionDateTime: `${newTherapySession.date} ${newTherapySession.time}`,
            status: 'Scheduled',
        };
        setTherapySessions(prev => [newSession, ...prev]);
        setIsScheduleTherapyModalOpen(false);
        setNewTherapySession({ patientId: '', therapistName: '', treatment: '', date: '', time: '' });
        alert(`Therapy session scheduled for ${patient.name}.`);
    };

    const handleSaveNewPatient = (formData: any) => {
        const newPatient: RegisteredPatient = {
            id: `P${String(allPatients.length + 1).padStart(3, '0')}`,
            name: formData.name,
            contact: formData.contact,
            age: parseInt(formData.age, 10),
            address: formData.address,
            email: formData.email,
            preferredDate: formData.preferredDate,
            preferredTime: formData.preferredTime,
            gender: formData.gender,
            disease: formData.disease || 'N/A',
            registeredDate: new Date().toISOString().slice(0, 10),
            lastConsultedBy: 'N/A',
            lastTreatment: 'N/A',
        };

        setAllPatients(prev => [newPatient, ...prev]);
        setIsAddPatientModalOpen(false);
        alert(`Patient ${newPatient.name} has been registered successfully!`);
    };


    const appointmentColumns: Column<AppointmentPatient>[] = useMemo(() => [
        { Header: 'Patient Name', accessor: 'name', Cell: ({ value }) => <div className="font-semibold">{value}</div> },
        { Header: 'Appointment', accessor: 'appointmentDateTime' },
        { Header: 'Doctor', accessor: 'doctor' },
        { Header: 'Contact', accessor: 'contact' },
        { Header: 'Disease', accessor: 'disease' },
    ], []);

    const allPatientsColumns: Column<RegisteredPatient>[] = useMemo(() => [
        { Header: 'Patient Name', accessor: 'name', Cell: ({ value }) => <div className="font-semibold">{value}</div> },
        { Header: 'Gender', accessor: 'gender' },
        { Header: 'Contact', accessor: 'contact' },
        { Header: 'Age', accessor: 'age' },
        { Header: 'Email', accessor: 'email' },
        { Header: 'Address', accessor: 'address' },
        { Header: 'Registered On', accessor: 'registeredDate' },
    ], []);

    const therapySessionColumns: Column<TherapySession>[] = useMemo(() => [
        { Header: 'Patient Name', accessor: 'patientName', Cell: ({ value }) => <div className="font-semibold">{value}</div> },
        { Header: 'Therapist', accessor: 'therapistName' },
        { Header: 'Treatment', accessor: 'treatment' },
        { Header: 'Session Time', accessor: 'sessionDateTime' },
    ], []);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const filteredPatients = useMemo(() => {
        return allPatients.filter(patient => {
            return (
                (filters.search === '' || patient.name.toLowerCase().includes(filters.search.toLowerCase()) || patient.id.toLowerCase().includes(filters.search.toLowerCase())) &&
                (filters.gender === '' || patient.gender === filters.gender) &&
                (filters.disease === '' || patient.disease === filters.disease) &&
                (filters.treatment === '' || patient.lastTreatment === filters.treatment)
            );
        });
    }, [filters, allPatients]);
    const renderAppointmentActions = (appointment: AppointmentPatient) => (
        <div className="flex items-center gap-2">
            {appointment.status === 'Pending' && (
                <button type="button" className="btn btn-primary btn-sm" onClick={() => handleConfirmAppointment(appointment.id)}>
                    Confirm
                </button>
            )}
            {appointment.status === 'Confirmed' && (
                <button type="button" className="btn btn-danger btn-sm" onClick={() => handleCancelAppointment(appointment.id)}>
                    Cancel
                </button>
            )}
            {appointment.status !== 'Cancelled' && (
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => handleRescheduleClick(appointment)}>Reschedule</button>
            )}
            <button type="button" className="btn btn-outline-success btn-sm" onClick={() => handleSendMessageClick(appointment)}>
                <IconMessage className="w-4 h-4" />
            </button>
        </div>
    );

    const renderAllPatientsActions = (patient: RegisteredPatient) => (
        <div className="flex items-center gap-2">
            <button type="button" className="btn btn-outline-info btn-sm" onClick={() => handleViewPatientClick(patient)}>
                <IconEye className="w-4 h-4" />
            </button>
            {/* Add actions specific to the "All Patients" table here, e.g., schedule new appointment */}
            <button type="button" className="btn btn-outline-success btn-sm" onClick={() => handleSendMessageClick(patient)}>
                <IconMessage className="w-4 h-4" />
            </button>
            <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => handleScheduleAppointmentClick(patient)}>
                Schedule
            </button>
        </div>
    );

    return (
        <>
            <div className="panel">
                <div className="flex items-center justify-between mb-5">
                    <h1 className="text-xl font-bold">Scheduling</h1>
                </div>
                <div className="mb-5">
                    <div className="flex border-b border-gray-200 dark:border-gray-700">
                        <button type="button" className={`px-4 py-2 -mb-px ${activeTab === 'allPatients' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`} onClick={() => setActiveTab('allPatients')}>
                            All Registered Patients
                        </button>
                        <button type="button" className={`px-4 py-2 -mb-px ${activeTab === 'appointments' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`} onClick={() => setActiveTab('appointments')}>
                            Upcoming Appointments
                        </button>
                        <button type="button" className={`px-4 py-2 -mb-px ${activeTab === 'therapists' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`} onClick={() => setActiveTab('therapists')}>
                            Therapist Sessions
                        </button>
                    </div>
                </div>

                {activeTab === 'appointments' && (
                    <Table<AppointmentPatient> columns={appointmentColumns} data={appointments} actions={renderAppointmentActions} itemsPerPage={10} />
                )}

                {activeTab === 'allPatients' && (
                    <>
                        <div className="flex justify-end gap-4 mb-5">
                            <button type="button" className="btn btn-primary w-full sm:w-auto" onClick={() => setIsAddPatientModalOpen(true)}>
                                <IconPlus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                Register New Patient
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-5 border-t border-gray-200 dark:border-gray-700 pt-5">
                            <input type="text" name="search" placeholder="Search by Name/ID..." className="form-input" value={filters.search} onChange={handleFilterChange} />
                            <select name="gender" className="form-select" value={filters.gender} onChange={handleFilterChange}>
                                <option value="">All Genders</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                            <select name="disease" className="form-select" value={filters.disease} onChange={handleFilterChange}>
                                <option value="">All Diseases</option>
                                {mockDiseases.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                            <select name="treatment" className="form-select" value={filters.treatment} onChange={handleFilterChange}>
                                <option value="">All Treatments</option>
                                {mockTreatments.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <Table<RegisteredPatient> columns={allPatientsColumns} data={filteredPatients} actions={renderAllPatientsActions} itemsPerPage={10} />
                    </>
                )}

                {activeTab === 'therapists' && (
                    <div>
                        <div className="flex justify-end mb-4">
                            <button type="button" className="btn btn-primary" onClick={() => setIsScheduleTherapyModalOpen(true)}>
                                <IconPlus className="w-5 h-5 ltr:mr-2 rtl:ml-2" /> Schedule Therapy
                            </button>
                        </div>
                        <Table<TherapySession> columns={therapySessionColumns} data={therapySessions} itemsPerPage={10} />
                    </div>
                )}
            </div>

            {/* Send WhatsApp Form Modal */}
            <Transition appear show={isWhatsAppModalOpen} as={Fragment}>
                <Dialog as="div" open={isWhatsAppModalOpen} onClose={() => setIsWhatsAppModalOpen(false)} className="relative z-50">
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-[black]/60" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                                    Send Message via WhatsApp
                                </Dialog.Title>
                                <div className="mt-4">
                                    <p>Send a message to <strong>{selectedPatient?.name}</strong>. You can send a data collection form link or an appointment reminder.</p>
                                    <div className="mt-4">
                                        <label htmlFor="whatsappNumber">WhatsApp Number</label>
                                        <input id="whatsappNumber" type="text" value={selectedPatient?.contact || ''} className="form-input mt-1" readOnly />
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end gap-4">
                                    <button type="button" className="btn btn-outline-danger" onClick={() => setIsWhatsAppModalOpen(false)}>Cancel</button>
                                    <button type="button" className="btn btn-success" onClick={() => handleSendWhatsApp('form')}>Send Form Link</button>
                                    <button type="button" className="btn btn-info" onClick={() => handleSendWhatsApp('reminder')}>Send Reminder</button>
                                </div>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* Schedule Appointment Modal */}
            <Transition appear show={isScheduleAppointmentModalOpen} as={Fragment}>
                <Dialog as="div" open={isScheduleAppointmentModalOpen} onClose={() => setIsScheduleAppointmentModalOpen(false)} className="relative z-50">
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-[black]/60" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                                    Schedule Appointment for {patientToSchedule?.name}
                                </Dialog.Title>
                                <form onSubmit={handleScheduleAppointmentSubmit} className="mt-6 space-y-5">
                                    <div>
                                        <label htmlFor="doctor">Doctor</label>
                                        <select id="doctor" name="doctor" value={newAppointment.doctor} onChange={(e) => setNewAppointment(p => ({ ...p, doctor: e.target.value }))} className="form-select mt-1" required>
                                            <option value="">Select Doctor</option>
                                            {mockDoctors.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div><label htmlFor="date">Date</label><input id="date" type="date" value={newAppointment.date} onChange={(e) => setNewAppointment(p => ({ ...p, date: e.target.value }))} className="form-input mt-1" required /></div>
                                        <div><label htmlFor="time">Time</label><input id="time" type="time" value={newAppointment.time} onChange={(e) => setNewAppointment(p => ({ ...p, time: e.target.value }))} className="form-input mt-1" required /></div>
                                    </div>
                                    <div className="mt-6 flex justify-end gap-4">
                                        <button type="button" className="btn btn-outline-danger" onClick={() => setIsScheduleAppointmentModalOpen(false)}>Cancel</button>
                                        <button type="submit" className="btn btn-primary">Schedule</button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* --- MODIFICATION: Reschedule Appointment Modal --- */}
            <Transition appear show={isRescheduleModalOpen} as={Fragment}>
                <Dialog as="div" open={isRescheduleModalOpen} onClose={() => setIsRescheduleModalOpen(false)} className="relative z-50">
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-[black]/60" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                                    Reschedule for {appointmentToReschedule?.name}
                                </Dialog.Title>
                                <form onSubmit={handleRescheduleSubmit} className="mt-6 space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div><label htmlFor="rescheduleDate">New Date</label><input id="rescheduleDate" type="date" value={rescheduleData.date} onChange={(e) => setRescheduleData(p => ({ ...p, date: e.target.value }))} className="form-input mt-1" required /></div>
                                        <div><label htmlFor="rescheduleTime">New Time</label><input id="rescheduleTime" type="time" value={rescheduleData.time} onChange={(e) => setRescheduleData(p => ({ ...p, time: e.target.value }))} className="form-input mt-1" required /></div>
                                    </div>
                                    <div className="mt-6 flex justify-end gap-4">
                                        <button type="button" className="btn btn-outline-danger" onClick={() => setIsRescheduleModalOpen(false)}>Cancel</button>
                                        <button type="submit" className="btn btn-primary">Reschedule</button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* Schedule Therapy Session Modal */}
            <Transition appear show={isScheduleTherapyModalOpen} as={Fragment}>
                <Dialog as="div" open={isScheduleTherapyModalOpen} onClose={() => setIsScheduleTherapyModalOpen(false)} className="relative z-50">
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-[black]/60" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                                    Schedule Therapy Session
                                </Dialog.Title>
                                <form onSubmit={handleScheduleTherapySubmit} className="mt-6 space-y-5">
                                    <div>
                                        <label htmlFor="patientId">Patient</label>
                                        <select id="patientId" name="patientId" value={newTherapySession.patientId} onChange={(e) => setNewTherapySession(p => ({ ...p, patientId: e.target.value }))} className="form-select mt-1" required>
                                            <option value="">Select Patient</option>
                                            {mockAllPatients.map(p => <option key={p.id} value={p.id}>{p.name} ({p.id})</option>)}
                                        </select>
                                    </div>
                                    <div><label htmlFor="therapistName">Therapist</label><select id="therapistName" name="therapistName" value={newTherapySession.therapistName} onChange={(e) => setNewTherapySession(p => ({ ...p, therapistName: e.target.value }))} className="form-select mt-1" required><option value="">Select Therapist</option>{mockTherapists.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                                    <div><label htmlFor="treatment">Treatment</label><input id="treatment" type="text" name="treatment" value={newTherapySession.treatment} onChange={(e) => setNewTherapySession(p => ({ ...p, treatment: e.target.value }))} className="form-input mt-1" placeholder="e.g., Physiotherapy" required /></div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div><label htmlFor="therapyDate">Date</label><input id="therapyDate" type="date" name="date" value={newTherapySession.date} onChange={(e) => setNewTherapySession(p => ({ ...p, date: e.target.value }))} className="form-input mt-1" required /></div>
                                        <div><label htmlFor="therapyTime">Time</label><input id="therapyTime" type="time" name="time" value={newTherapySession.time} onChange={(e) => setNewTherapySession(p => ({ ...p, time: e.target.value }))} className="form-input mt-1" required /></div>
                                    </div>
                                    <div className="mt-6 flex justify-end gap-4">
                                        <button type="button" className="btn btn-outline-danger" onClick={() => setIsScheduleTherapyModalOpen(false)}>Cancel</button>
                                        <button type="submit" className="btn btn-primary">Schedule Session</button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* Add New Patient Modal */}
            <GlobalModal
                isOpen={isAddPatientModalOpen}
                onClose={() => setIsAddPatientModalOpen(false)}
                mode="create"
                title="New Patient Registration"
                fields={newPatientFields}
                onSave={handleSaveNewPatient}
            />

            {/* --- MODIFICATION: View Patient Details Modal --- */}
            {patientToView && (
                <GlobalModal
                    isOpen={isViewPatientModalOpen}
                    onClose={() => setIsViewPatientModalOpen(false)}
                    mode="edit" // 'edit' mode makes fields read-only by default in your GlobalModal
                    title="Patient Details"
                    fields={newPatientFields}
                    initialData={patientToView}
                    onSave={() => setIsViewPatientModalOpen(false)} // No-op save, just closes modal
                />
            )}
        </>
    );
};

export default ReceptionistAppointments;
