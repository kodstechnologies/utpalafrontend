import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import Table, { Column } from '../../../components/Table/Table';
import IconMessage from '../../../components/Icon/IconMessage';

// --- Mock Data (assuming this data is available) ---
interface RegisteredPatient {
    id: string;
    name: string;
    contact: string;
    gender: 'Male' | 'Female' | 'Other';
    age: number;
    disease: string;
    lastTreatment: string;
    doctorName: string;
    appointmentDate: string;
    appointmentTime: string;
}

const mockAllPatients: RegisteredPatient[] = [
    { id: 'P001', name: 'Ravi Kumar', contact: '+919876543210', gender: 'Male', age: 45, disease: 'Arthritis', lastTreatment: 'Physiotherapy', doctorName: 'Dr. Priya Singh', appointmentDate: '2024-08-01', appointmentTime: '10:00 AM' },
    { id: 'P002', name: 'Sunita Sharma', contact: '+919123456789', gender: 'Female', age: 38, disease: 'Migraine', lastTreatment: 'Panchakarma', doctorName: 'Dr. Anjali Verma', appointmentDate: '2024-08-01', appointmentTime: '11:30 AM' },
    { id: 'P003', name: 'Amit Patel', contact: '+919988776655', gender: 'Male', age: 52, disease: 'Diabetes', lastTreatment: 'Diet Plan', doctorName: 'Dr. Priya Singh', appointmentDate: '2024-08-02', appointmentTime: '09:00 AM' },
    { id: 'P004', name: 'Vijay Singh', contact: '+919876543211', gender: 'Male', age: 55, disease: 'Hypertension', lastTreatment: 'Yoga', doctorName: 'Dr. Priya Singh', appointmentDate: '2024-08-02', appointmentTime: '12:00 PM' },
    { id: 'P005', name: 'Priya Nair', contact: '+919876543212', gender: 'Female', age: 42, disease: 'Migraine', lastTreatment: 'Panchakarma', doctorName: 'Dr. Anjali Verma', appointmentDate: '2024-08-03', appointmentTime: '02:00 PM' },
];

const mockDiseases = ['Arthritis', 'Migraine', 'Diabetes', 'Hypertension'];
const mockTreatments = ['Physiotherapy', 'Panchakarma', 'Diet Plan', 'Yoga'];

// --- MODIFICATION: Add mock message templates ---
const mockTemplates = [
    { id: '1', title: 'Appointment Reminder', content: 'Hello {{patientName}}, this is a friendly reminder for your upcoming appointment. We look forward to seeing you!' },
    { id: '2', title: 'Promotional Offer', content: 'Hello {{patientName}}, we are running a special 20% discount on all Panchakarma treatments this month. Book now to avail the offer!' },
    { id: '3', title: 'Follow-up Check', content: 'Hello {{patientName}}, we hope you are feeling better after your last treatment. Please let us know if you have any questions or need further assistance.' },
];

const WhatsAppMarketing = () => {
    const dispatch = useDispatch();
    const [filters, setFilters] = useState({
        gender: '',
        disease: '',
        treatment: '',
    });
    const [selectedPatientIds, setSelectedPatientIds] = useState<string[]>([]);
    const [message, setMessage] = useState('');
    const [selectedTemplateId, setSelectedTemplateId] = useState('');

    useEffect(() => {
        dispatch(setPageTitle('WhatsApp Marketing'));
    }, [dispatch]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const filteredPatients = useMemo(() => {
        return mockAllPatients.filter(patient => {
            return (
                (filters.gender === '' || patient.gender === filters.gender) &&
                (filters.disease === '' || patient.disease === filters.disease) &&
                (filters.treatment === '' || patient.lastTreatment === filters.treatment)
            );
        });
    }, [filters]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedPatientIds(filteredPatients.map(p => p.id));
        } else {
            setSelectedPatientIds([]);
        }
    };

    const handleSelectOne = (patientId: string) => {
        setSelectedPatientIds(prev =>
            prev.includes(patientId)
                ? prev.filter(id => id !== patientId)
                : [...prev, patientId]
        );
    };

    const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const templateId = e.target.value;
        setSelectedTemplateId(templateId);
        if (templateId) {
            const template = mockTemplates.find(t => t.id === templateId);
            if (template) {
                setMessage(template.content);
            }
        } else {
            setMessage('');
        }
    };

    const handleSendSingleMessage = (patient: RegisteredPatient) => {
        if (!message.trim()) {
            alert('Please compose a message in the text area below before sending.');
            return;
        }
        const phoneNumber = patient.contact.replace(/\D/g, '');
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleSendMessage = () => {
        if (selectedPatientIds.length === 0) {
            alert('Please select at least one patient.');
            return;
        }
        if (!message.trim()) {
            alert('Please enter a message to send.');
            return;
        }

        const selectedContacts = mockAllPatients
            .filter(p => selectedPatientIds.includes(p.id))
            .map(p => p.contact.replace(/\D/g, ''));

        // For demonstration, we'll just log the action.
        // In a real app, you would loop through contacts and use the WhatsApp API.
        console.log(`Sending message: "${message}" to ${selectedContacts.length} contacts:`, selectedContacts);
        alert(`Message queued for ${selectedContacts.length} patients.`);

        // Optional: Open a WhatsApp link for the first user as a demo
        if (selectedContacts.length > 0) {
            const whatsappUrl = `https://wa.me/${selectedContacts[0]}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        }
    };

    const columns: Column<RegisteredPatient>[] = useMemo(() => [
        {
            Header: (
                'Check'
            ),
            accessor: 'id', // This accessor is used for internal table logic, not directly displayed
            Cell: ({ row }) => (
 <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={selectedPatientIds.includes(row.id)}
                    onChange={() => handleSelectOne(row.id)}
                />
            ),
            width: 50,
        },
 { Header: 'Name', accessor: 'name', Cell: ({ value }: { value: string }) => <div className="font-semibold">{value}</div> },
        { Header: 'Age', accessor: 'age' },
        { Header: 'Complain', accessor: 'disease' },
        { Header: 'Appointment Date', accessor: 'appointmentDate' },
        { Header: 'Appointment Time', accessor: 'appointmentTime' },
        { Header: 'Doctor Name', accessor: 'doctorName' },
        // {
        //     Header: 'Action',
        //     accessor: 'id',
        //     Cell: ({ row }) => (
        //         <button type="button" className="btn btn-sm btn-outline-success" onClick={() => handleSendSingleMessage(row)}>
        //             Send
        //         </button>
        //     ),
        //     width: 100,
        // }
    ], [selectedPatientIds, filteredPatients, message]);

    return (
        <div className="space-y-6">
            <div className="panel">
                <h1 className="text-xl font-bold mb-4">WhatsApp Marketing Campaign</h1>
                
                {/* Filters Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-5 border-t border-gray-200 dark:border-gray-700 pt-5">
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

                {/* Patient Table */}
                <div className="table-responsive">
                    <Table<RegisteredPatient>
                        columns={columns}
                        data={filteredPatients}
                        itemsPerPage={10}
                    />
                </div>
            </div>

            {/* Message Composition Section */}
            <div className="panel">
                <h2 className="text-lg font-semibold mb-4">Compose Message</h2>
                {/* --- MODIFICATION: Added Template Dropdown --- */}
                <div className="mb-4">
                    <label htmlFor="templateSelect" className="form-label mb-1 block">Select a Message Template (Optional)</label>
                    <select id="templateSelect" className="form-select" value={selectedTemplateId} onChange={handleTemplateChange}>
                        <option value="">-- Custom Message --</option>
                        {mockTemplates.map(template => (
                            <option key={template.id} value={template.id}>{template.title}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <textarea
                            rows={5}
                            className="form-textarea w-full"
                            placeholder="Enter your WhatsApp message here or select a template..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        ></textarea>
                        <p className="text-xs text-gray-500 mt-2">
                        </p>
                    </div>
                    <div className="flex flex-col justify-between items-start md:items-end bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                        <div>
                            <div className="text-lg font-bold text-blue-500">
                                {selectedPatientIds.length}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Patients Selected
                            </div>
                        </div>
                        <button
                            type="button"
                            className="btn btn-primary w-full mt-4"
                            onClick={handleSendMessage}
                            disabled={selectedPatientIds.length === 0 || !message.trim()}
                        >
                            <IconMessage className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                            Send Message
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhatsAppMarketing;