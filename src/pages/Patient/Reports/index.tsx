import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';

// --- ICONS ---
const IconFile: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const IconDownload: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
);

// --- DATA TYPES & MOCK DATA ---
interface Report {
    id: string;
    name: string;
    type: string; // e.g., 'Blood Test', 'X-Ray'
    uploadDate: string;
    consultationId: string;
    consultationDate: string;
    doctorName: string;
    fileUrl: string; // Mock URL for download
}

const mockReports: Report[] = [
    {
        id: 'REP-001',
        name: 'Complete Blood Count (CBC)',
        type: 'Blood Test',
        uploadDate: '2024-05-22',
        consultationId: 'CON-001',
        consultationDate: '2024-05-20',
        doctorName: 'Dr. Priya Singh',
        fileUrl: '/path/to/report-cbc.pdf',
    },
    {
        id: 'REP-002',
        name: 'Chest X-Ray Report',
        type: 'Radiology',
        uploadDate: '2024-05-21',
        consultationId: 'CON-001',
        consultationDate: '2024-05-20',
        doctorName: 'Dr. Priya Singh',
        fileUrl: '/path/to/report-xray.pdf',
    },
    {
        id: 'REP-003',
        name: 'Lipid Profile',
        type: 'Blood Test',
        uploadDate: '2024-03-12',
        consultationId: 'CON-003',
        consultationDate: '2024-03-10',
        doctorName: 'Dr. Priya Singh',
        fileUrl: '/path/to/report-lipid.pdf',
    },
];

const PatientReports: React.FC = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Reports & Investigations'));
    }, [dispatch]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Reports & Investigations</h1>
            </div>

            <div className="space-y-4">
                {mockReports.map((report) => (
                    <div key={report.id} className="panel">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                    <IconFile className="w-7 h-7 text-gray-500" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 dark:text-white">{report.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Uploaded on {new Date(report.uploadDate).toLocaleDateString()} for consultation on {new Date(report.consultationDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 sm:mt-0">
                                <a href={report.fileUrl} download className="btn btn-outline-primary flex items-center gap-2">
                                    <IconDownload />
                                    Download
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PatientReports;