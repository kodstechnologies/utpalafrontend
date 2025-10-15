import { useEffect, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import Table, { Column } from '../../../components/Table/Table';
import IconPrinter from '../../../components/Icon/IconPrinter';

// --- Type Definitions ---
interface PaymentTransaction {
    id: number;
    date: string;
    description: string;
    type: 'Credit' | 'Debit';
    amount: number;
    paymentMethod: 'Cash' | 'Online' | 'Card';
}

// --- Mock Data ---
const mockTransactions: PaymentTransaction[] = [
    { id: 1, date: '2024-07-28', description: 'Consultation Fee - Ravi Kumar', type: 'Credit', amount: 500, paymentMethod: 'Online' },
    { id: 2, date: '2024-07-28', description: 'Office Supplies Purchase', type: 'Debit', amount: 1200, paymentMethod: 'Card' },
    { id: 3, date: '2024-07-29', description: 'Therapy Session - Sunita Sharma', type: 'Credit', amount: 1500, paymentMethod: 'Cash' },
    { id: 4, date: '2024-07-29', description: 'Pharmacy Purchase', type: 'Credit', amount: 850, paymentMethod: 'Online' },
    { id: 5, date: '2024-07-30', description: 'Electricity Bill', type: 'Debit', amount: 4500, paymentMethod: 'Online' },
];

const ReceptionistReports = () => {
    const dispatch = useDispatch();
    const [reportData, setReportData] = useState<PaymentTransaction[]>([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        dispatch(setPageTitle('Financial Reports'));
    }, [dispatch]);

    const handleGenerateReport = () => {
        // In a real app, you would fetch this data from an API based on the date range.
        console.log(`Generating report from ${startDate} to ${endDate}`);
        setReportData(mockTransactions); // Using mock data for demonstration
    };

    const columns: Column<PaymentTransaction>[] = useMemo(() => [
        { Header: 'Date', accessor: 'date' },
        { Header: 'Description', accessor: 'description' },
        { Header: 'Payment Method', accessor: 'paymentMethod' },
        {
            Header: 'Type',
            accessor: 'type',
            Cell: ({ value }) => (
                <span className={`badge ${value === 'Credit' ? 'badge-outline-success' : 'badge-outline-danger'}`}>{value}</span>
            ),
        },
        {
            Header: 'Amount (INR)',
            accessor: 'amount',
            Cell: ({ value }) => <div className="text-right font-semibold">{value.toFixed(2)}</div>,
        },
    ], []);

    const totals = useMemo(() => {
        const credit = reportData.filter(t => t.type === 'Credit').reduce((sum, t) => sum + t.amount, 0);
        const debit = reportData.filter(t => t.type === 'Debit').reduce((sum, t) => sum + t.amount, 0);
        return { credit, debit, balance: credit - debit };
    }, [reportData]);

    return (
        <div className="panel">
            <h1 className="text-xl font-bold mb-4">Debit-Credit Consolidated Reports</h1>
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-5 p-4 border rounded-md">
                <div className="w-full sm:w-auto">
                    <label htmlFor="startDate">Start Date</label>
                    <input id="startDate" type="date" className="form-input mt-1" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="w-full sm:w-auto">
                    <label htmlFor="endDate">End Date</label>
                    <input id="endDate" type="date" className="form-input mt-1" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
                <button type="button" className="btn btn-primary sm:mt-6 w-full sm:w-auto" onClick={handleGenerateReport}>
                    Generate Report
                </button>
            </div>

            {reportData.length > 0 && (
                <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Report Details</h2>
                        <button type="button" className="btn btn-outline-primary" onClick={() => window.print()}>
                            <IconPrinter className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                            Print / Save PDF
                        </button>
                    </div>
                    <Table<PaymentTransaction> columns={columns} data={reportData} itemsPerPage={10} />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 p-4 border-t font-semibold">
                        <div className="text-success">Total Credit: ₹{totals.credit.toFixed(2)}</div>
                        <div className="text-danger">Total Debit: ₹{totals.debit.toFixed(2)}</div>
                        <div className={totals.balance >= 0 ? 'text-success' : 'text-danger'}>Balance: ₹{totals.balance.toFixed(2)}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReceptionistReports;
