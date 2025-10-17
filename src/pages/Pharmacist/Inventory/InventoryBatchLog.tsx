import React, { useMemo, useState } from 'react';
import Table, { Column } from '../../../components/Table/Table';
import GlobalModal, { FieldConfig } from '../../../components/Modal/GlobalModal';

// --- ICONS ---
// Define IconArrowBackward, IconRefresh, and IconPlus (for the add button)
const IconArrowBackward: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 5L8 12L15 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const IconRefresh: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2v4m0 16v-4m-7-5H2m20 0h-3m-1-5.5l-2.5 2.5m-3-1l-2.5 2.5m3-1l2.5 2.5M4 12a8 8 0 1 0 16 0A8 8 0 0 0 4 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const IconPlus: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);


// --- DATA TYPES (Copied for local definition, assuming context separation) ---
type ItemUnit = 'g' | 'ml' | 'units';
type ItemType = 'Internal' | 'External';

type InventoryItem = {
    id: string;
    itemName: string;
    type: ItemType;
    unit: ItemUnit;
    quantity: number;
    expiryDate: string;
    costprice: number;
    sellprice: number;
    status: string;
};

type BatchTransactionType = 'Add Stock' | 'Edit Batch' | 'Initial Stock' | 'Deduction/Usage';

interface InventoryBatchLogEntry {
    transactionId: string;
    itemId: string;
    batchId: string;
    date: string;
    quantityChange: number;
    transactionType: BatchTransactionType;
    newExpiryDate: string;
    costprice: number;
    sellprice: number;
    details: string;
}

// --- MOCK LOG DATA (Simulating the history of transactions) ---
const mockBatchLog: InventoryBatchLogEntry[] = [
    { transactionId: 'TX-001', itemId: 'MED-001', batchId: 'ASH-INIT-A', date: '2023-01-01', quantityChange: 100, transactionType: 'Initial Stock', newExpiryDate: '2025-12-31', costprice: 10, sellprice: 15, details: 'Initial stock entry upon creation.' },
    { transactionId: 'TX-002', itemId: 'MED-002', batchId: 'BRA-202-C', date: '2023-04-15', quantityChange: 45, transactionType: 'Initial Stock', newExpiryDate: '2024-11-30', costprice: 20, sellprice: 25, details: 'Initial purchase batch.' },
    { transactionId: 'TX-003', itemId: 'MED-001', batchId: 'ASH-101-B', date: '2024-03-10', quantityChange: 50, transactionType: 'Add Stock', newExpiryDate: '2026-03-10', costprice: 11, sellprice: 16, details: 'New purchase order received.' },
    { transactionId: 'TX-004', itemId: 'MED-002', batchId: 'BRA-202-C', date: '2024-06-01', quantityChange: -5, transactionType: 'Deduction/Usage', newExpiryDate: '2024-11-30', costprice: 20, sellprice: 25, details: '5 units dispensed for Prescription #123.' },
    { transactionId: 'TX-005', itemId: 'MED-004', batchId: 'ARJ-99-X', date: '2024-09-01', quantityChange: 25, transactionType: 'Initial Stock', newExpiryDate: '2024-10-05', costprice: 30, sellprice: 35, details: 'First stock entry.' },
    { transactionId: 'TX-006', itemId: 'MED-003', batchId: 'TRI-505-A', date: '2023-05-01', quantityChange: 80, transactionType: 'Initial Stock', newExpiryDate: '2024-09-30', costprice: 5, sellprice: 8, details: 'Initial stock of 80 tablets.' },
    { transactionId: 'TX-007', itemId: 'MED-003', batchId: 'TRI-505-A', date: '2024-01-10', quantityChange: -80, transactionType: 'Deduction/Usage', newExpiryDate: '2024-09-30', costprice: 5, sellprice: 8, details: 'Stock fully used or expired and removed.' },
];

interface InventoryBatchLogProps {
    item: InventoryItem;
    onBack: () => void;
}

const getQuantityChangeBadge = (change: number, unit: ItemUnit) => {
    const isPositive = change > 0;
    const colorClass = isPositive
        ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
        : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400';
    const sign = isPositive ? '+' : '';

    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClass}`}>
            {sign}{Math.abs(change)} {unit}
        </span>
    );
};

const getTransactionBadge = (type: BatchTransactionType) => {
    const classes = {
        'Add Stock': 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
        'Initial Stock': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
        'Edit Batch': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400',
        'Deduction/Usage': 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400',
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${classes[type]}`}>{type}</span>;
};

const InventoryBatchLog: React.FC<InventoryBatchLogProps> = ({ item, onBack }) => {
    const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);

    // Filter the global mock log data to show only logs for the selected item
    // Sort by date descending
    const itemLogs = useMemo(() =>
        mockBatchLog
            .filter(log => log.itemId === item.id)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        , [item.id]);

    // Define fields for the batch modal dynamically to include the item's unit
    const batchFields: FieldConfig[] = useMemo(() => [
        { name: 'batchId', label: 'Batch ID', type: 'text', required: true, placeholder: 'e.g., BATCH-003' },
        { name: 'quantity', label: `Quantity (${item.unit})`, type: 'number', required: true, placeholder: 'e.g., 100' },
        { name: 'expiryDate', label: 'Expiry Date', type: 'date', required: true },
        { name: 'costprice', label: 'Cost Price', type: 'number', required: true },
        { name: 'sellprice', label: 'Sell Price', type: 'number', required: true },
        { name: 'details', label: 'Details / Remarks', type: 'textarea', placeholder: 'e.g., Purchase from Supplier X' }
    ], [item.unit]);

    const getInitialBatchData = () => ({
        batchId: '', quantity: '', expiryDate: '', details: '', costprice: 0, sellprice: 0
    });

    const logColumns: Column<InventoryBatchLogEntry>[] = useMemo(() => [
        { Header: 'Date', accessor: 'date' },
        { Header: 'Batch ID', accessor: 'batchId' },
        {
            Header: 'Quantity Change',
            accessor: 'quantityChange',
            Cell: ({ value }) => getQuantityChangeBadge(value, item.unit)
        },
        {
            Header: 'Transaction Type',
            accessor: 'transactionType',
            Cell: ({ value }) => getTransactionBadge(value)
        },
        { Header: 'Batch Expiry Date', accessor: 'newExpiryDate' },
        { Header: 'Details/Remarks', accessor: 'details' },
    ], [item.unit]);

    const handleSaveBatch = (data: any) => {
        // Here you would handle the logic to add the new batch to your state/API
        console.log('Saving new batch:', data);
        setIsBatchModalOpen(false);
    };

    return (
        <div className="panel ">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className='flex items-center gap-3'>
                    <button
                        type="button"
                        onClick={onBack}
                        className="p-2 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                        title="Back to Inventory List"
                    >
                        <IconArrowBackward className="w-6 h-6" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Batch Transaction Log: {item.itemName} ({item.id})
                    </h1>
                </div>

                <div className="flex gap-2">
                    {/* NEW BUTTON: Add New Batch */}
                    <button
                        type="button"
                        onClick={() => setIsBatchModalOpen(true)}
                        className="btn btn-primary flex items-center gap-1"
                        title="Add New Stock Batch"
                    >
                        <IconPlus className="w-5 h-5" />
                        Add New Batch
                    </button>
                    {/* Existing Refresh Button */}
                    <button type="button" className="btn btn-outline-secondary flex items-center gap-1">
                        <IconRefresh className="w-5 h-5" />
                        Refresh Log
                    </button>
                </div>
            </div>

            {/* Item Summary Card */}
            <div className="bg-blue-50 mt-4 dark:bg-blue-950/50 p-4 rounded-lg shadow-inner flex justify-between items-center">
                <div>
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Current Total Stock</p>
                    <p className="font-extrabold text-3xl text-green-600 dark:text-green-400">{item.quantity} {item.unit}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Overall Status</p>
                    <span className="font-bold text-lg">{item.status}</span>
                </div>
            </div>

            {/* Transaction Log Table */}
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white pt-4">Transaction History</h2>
            <div className="pt-2">
                <Table<InventoryBatchLogEntry>
                    columns={logColumns}
                    data={itemLogs.map(log => ({ ...log, id: log.transactionId }))} // Add a unique 'id' property
                    itemsPerPage={10}
                    searchable={true}
                    searchPlaceholder="Search by Batch ID or Details..."
                />
            </div>

            {/* Use GlobalModal for Adding a New Batch */}
            <GlobalModal
                isOpen={isBatchModalOpen}
                onClose={() => setIsBatchModalOpen(false)}
                mode="create"
                title={`New Batch for ${item.itemName}`}
                fields={batchFields}
                initialData={getInitialBatchData()}
                onSave={handleSaveBatch}
            />
        </div>
    );
};

export default InventoryBatchLog;