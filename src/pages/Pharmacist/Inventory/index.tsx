import React, { useEffect, useMemo, useState, ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
// import { setPageTitle } from '../../../store/themeClassSlice';
import IconListCheck from '../../../components/Icon/IconListCheck';
import Table, { Column } from '../../../components/Table/Table';
import { DashboardCard } from '../../../components/DashboardCard';
import GlobalModal from '../../../components/Modal/GlobalModal';
import IconDollarSign from '../../../components/Icon/IconDollarSign';

// --- NEW COMPONENT IMPORT ---
import InventoryBatchLog, { type InventoryItem as InventoryBatchLogItem } from './InventoryBatchLog';

// --- ICONS (Existing) ---
const IconBox: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M20 7L12 3L4 7V17L12 21L20 17V7Z" stroke="currentColor" strokeWidth="1.5" /><path opacity="0.5" d="M12 12L4 7" stroke="currentColor" strokeWidth="1.5" /><path opacity="0.5" d="M12 12V21" stroke="currentColor" strokeWidth="1.5" /><path opacity="0.5" d="M12 12L20 7" stroke="currentColor" strokeWidth="1.5" /><path opacity="0.5" d="M17 4.5L7 9.5" stroke="currentColor" strokeWidth="1.5" /></svg>
);
const IconAlertTriangle: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12.8718 2.50234C12.4921 1.83358 11.5079 1.83358 11.1282 2.50234L2.12221 18.5316C1.75427 19.1826 2.23838 20 2.99401 20H21.006C21.7616 20 22.2457 19.1826 21.8778 18.5316L12.8718 2.50234Z" stroke="currentColor" strokeWidth="1.5" /><path d="M12 9V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M12 17.01L12.01 16.999" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
);
const IconEdit: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 20h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const IconPill: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M14.1213 2.87868C16.8854 5.64279 16.8854 10.1146 14.1213 12.8787C11.3572 15.6428 6.88543 15.6428 4.12132 12.8787C1.35721 10.1146 1.35721 5.64279 4.12132 2.87868C6.88543 0.114571 11.3572 0.114571 14.1213 2.87868Z" stroke="currentColor" strokeWidth="1.5" /><path opacity="0.5" d="M12.8787 14.1213C15.6428 16.8854 15.6428 21.3572 12.8787 24.1213C10.1146 26.8854 5.64279 26.8854 2.87868 24.1213" stroke="currentColor" strokeWidth="1.5" /></svg>
);
const IconBottle: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M8 22H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M10 2H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M18 11C18 15.4183 15.3137 19 12 19C8.68629 19 6 15.4183 6 11C6 6.58172 8.68629 3 12 3C15.3137 3 18 6.58172 18 11Z" stroke="currentColor" strokeWidth="1.5" /><path opacity="0.5" d="M12 19V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
);


// --- DATA TYPES & MOCK DATA (Existing) ---
type ItemStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';
type ItemType = 'Internal' | 'External';
type ItemUnit = 'g' | 'ml' | 'units';

interface InventoryItem {
    id: string; // unique
    itemName: string;
    type: ItemType;
    category: string;
    quantity: number;
    unit: ItemUnit;
    expiryDate: string;
    status: ItemStatus;
}

interface InventoryBatch {
    batchId: string;
    itemId: string; // Foreign key to InventoryItem
    manufactureDate: string;
    expiryDate: string;
    quantity: number;
}
// ... mockInventory and mockBatches (No Change) ...
const mockInventory: InventoryItem[] = [
    { id: 'MED-001', itemName: 'Ashwagandha Churna', type: 'Internal', category: 'Powder', quantity: 150, unit: 'g', expiryDate: '2025-12-31', status: 'In Stock' },
    { id: 'MED-002', itemName: 'Brahmi Vati', type: 'Internal', category: 'Tablet', quantity: 45, unit: 'units', expiryDate: '2024-11-30', status: 'Low Stock' },
    { id: 'OIL-001', itemName: 'Mahanarayan Oil', type: 'External', category: 'Oil', quantity: 80, unit: 'ml', expiryDate: '2026-01-15', status: 'In Stock' },
    { id: 'MED-003', itemName: 'Triphala Guggulu', type: 'Internal', category: 'Tablet', quantity: 0, unit: 'units', expiryDate: '2024-09-30', status: 'Out of Stock' },
    { id: 'EXT-001', itemName: 'Neem Soap', type: 'External', category: 'Powder', quantity: 200, unit: 'units', expiryDate: '2025-08-20', status: 'In Stock' },
    { id: 'MED-004', itemName: 'Arjuna Ksheera Paka', type: 'Internal', category: 'Powder', quantity: 25, unit: 'ml', expiryDate: '2024-10-05', status: 'Low Stock' },
    { id: 'OIL-002', itemName: 'Kottamchukkadi Thailam', type: 'External', category: 'Oil', quantity: 60, unit: 'ml', expiryDate: '2025-07-22', status: 'In Stock' },
    { id: 'MED-005', itemName: 'Dashamoola Kwath', type: 'Internal', category: 'Powder', quantity: 70, unit: 'g', expiryDate: '2026-06-10', status: 'In Stock' },
    { id: 'MED-006', itemName: 'Guduchi Tablets', type: 'Internal', category: 'Tablet', quantity: 30, unit: 'units', expiryDate: '2024-08-15', status: 'Low Stock' },
    { id: 'OIL-003', itemName: 'Bala Oil', type: 'External', category: 'Oil', quantity: 0, unit: 'ml', expiryDate: '2024-12-31', status: 'Out of Stock' },
    { id: 'EXT-002', itemName: 'Turmeric Soap', type: 'External', category: 'Powder', quantity: 110, unit: 'units', expiryDate: '2025-10-05', status: 'In Stock' },
];

const mockBatches: InventoryBatch[] = [
    { batchId: 'ASH-101-A', itemId: 'MED-001', manufactureDate: '2023-01-01', expiryDate: '2025-12-31', quantity: 100 },
    { batchId: 'ASH-101-B', itemId: 'MED-001', manufactureDate: '2024-03-10', expiryDate: '2026-03-10', quantity: 50 },
    { batchId: 'BRA-202-C', itemId: 'MED-002', manufactureDate: '2023-04-15', expiryDate: '2024-11-30', quantity: 45 },
];
// ... existing FieldConfig, fields, and helper functions (No Change) ...

interface FieldConfig {
    name: string;
    label: string;
    type: string;
    required?: boolean;
    placeholder?: string;
    options?: { value: string; label: string }[];
}
const inventoryFields: FieldConfig[] = [
    { name: 'itemName', label: 'Item Name', type: 'text', required: true, placeholder: 'e.g. Ashwagandha Churna' },
    { name: 'id', label: 'Stock ID', type: 'text', required: true, placeholder: 'Unique Stock ID' },
    {
        name: 'category', label: 'Category', type: 'select', required: true,
        options: [
            { value: 'Oil', label: 'Oil' },
            { value: 'Tablet', label: 'Tablet' },
            { value: 'Powder', label: 'Powder' },
        ]
    },
    {
        name: 'type', label: 'Type', type: 'select', required: true,
        options: [
            { value: 'Internal', label: 'Internal' },
            { value: 'External', label: 'External' },
        ]
    },
    { name: 'quantity', label: 'Initial Quantity', type: 'number', required: true },
    {
        name: 'unit', label: 'Unit', type: 'select', required: true,
        options: [
            { value: 'g', label: 'g' },
            { value: 'ml', label: 'ml' },
            { value: 'units', label: 'units' },
        ]
    },
    { name: 'expiryDate', label: 'Initial Expiry Date', type: 'date', required: true }
];

const batchFields: FieldConfig[] = [
    { name: 'batchId', label: 'Batch Number', type: 'text', required: true, placeholder: 'e.g. ASH-101-C' },
    { name: 'manufactureDate', label: 'Manufacture Date', type: 'date', required: true },
    { name: 'expiryDate', label: 'Expiry Date', type: 'date', required: true },
    { name: 'quantity', label: 'Quantity to Add', type: 'number', required: true },
];


const getInitialInventoryData = (item?: InventoryItem) => ({
    itemName: item?.itemName || '',
    id: item?.id || '',
    category: item?.category || '',
    type: item?.type || 'Internal',
    quantity: item?.quantity?.toString() || '',
    unit: item?.unit || 'g',
    expiryDate: item?.expiryDate || ''
});

const getInitialBatchData = (itemId: string, itemUnit: ItemUnit) => ({
    batchId: '',
    manufactureDate: '',
    expiryDate: '',
    quantity: '',
    itemId: itemId,
    unit: itemUnit,
});

const getStatusBadge = (status: ItemStatus) => {
    const statusClasses = {
        'In Stock': 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
        'Low Stock': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400',
        'Out of Stock': 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400',
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[status]}`}>{status}</span>;
};


const PharmacistInventory: React.FC = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Inventory'));
    }, [dispatch]);

    const [activeTab, setActiveTab] = useState<'all' | 'internal' | 'external'>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
    const [showLogView, setShowLogView] = useState(false);

    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
    const [batches, setBatches] = useState<InventoryBatch[]>(mockBatches);

    const statsData = useMemo(() => [
        { title: 'Total Items', count: inventory.length, icon: IconBox },
        { title: 'Total Stock Value', count: 'Rs.12,450', icon: IconDollarSign },
        { title: 'Items in Low Stock', count: inventory.filter(i => i.status === 'Low Stock').length, icon: IconAlertTriangle },
    ], [inventory]);

    const filteredData = useMemo(() => {
        if (activeTab === 'all') return inventory;
        return inventory.filter(item => item.type.toLowerCase() === activeTab);
    }, [activeTab, inventory]);

    // --- MODAL HANDLERS (ITEM) ---
    const openAddModal = () => {
        setSelectedItem(null);
        setIsModalOpen(true);
    };
    const openEditModal = (item: InventoryItem) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };
    const handleCloseModal = () => setIsModalOpen(false);

    // --- LOG VIEW HANDLERS ---
    const openLogView = (item: InventoryItem) => {
        setSelectedItem(item);
        setShowLogView(true);
    };
    const closeLogView = () => {
        setShowLogView(false);
        setSelectedItem(null);
    };

    // --- MODAL HANDLERS (BATCH) ---
    // This is the function passed to InventoryBatchLog, ensuring type compatibility
    const openAddBatchModal = (item: InventoryItem) => {
        setSelectedItem(item);
        setIsBatchModalOpen(true);
    };
    const handleCloseBatchModal = () => {
        setIsBatchModalOpen(false);
        // If the modal was opened from the Log View, keep the log view open.
        if (!showLogView) setSelectedItem(null);
    };


    // --- SAVE HANDLERS (Existing) ---
    const handleSaveInventory = (form: any) => {
        const quantity = parseInt(form.quantity, 10);
        let status: ItemStatus = 'In Stock';
        if (quantity === 0) status = 'Out of Stock';
        else if (quantity < 50) status = 'Low Stock';

        if (selectedItem) {
            setInventory(inv => inv.map(i =>
                i.id === selectedItem.id
                    ? { ...i, ...form, quantity, status }
                    : i
            ));
        } else {
            setInventory(inv => [...inv, { ...form, quantity, status }]);
        }
        setIsModalOpen(false);
    };

    const handleSaveBatch = (form: any) => {
        if (!selectedItem) return;

        const newQuantity = parseInt(form.quantity, 10);
        const newExpiryDate = form.expiryDate;

        // 1. Update the main inventory item's total quantity and status
        setInventory(inv =>
            inv.map(i => {
                if (i.id === selectedItem.id) {
                    const totalQuantity = i.quantity + newQuantity;
                    let status: ItemStatus = 'In Stock';
                    if (totalQuantity === 0) status = 'Out of Stock';
                    else if (totalQuantity < 50) status = 'Low Stock';

                    const currentBatches = batches.filter(b => b.itemId === selectedItem.id);
                    const allExpiries = [...currentBatches.map(b => b.expiryDate), newExpiryDate].filter(date => date !== 'N/A');
                    const earliestExpiry = allExpiries.length > 0 ? allExpiries.sort()[0] : 'N/A';

                    return { ...i, quantity: totalQuantity, status, expiryDate: earliestExpiry };
                }
                return i;
            })
        );

        // 2. Add the new batch to the batches list
        const newBatch: InventoryBatch = {
            batchId: form.batchId,
            itemId: selectedItem.id,
            manufactureDate: form.manufactureDate,
            expiryDate: newExpiryDate,
            quantity: newQuantity,
        };
        setBatches(b => [...b, newBatch]);

        handleCloseBatchModal();
    };

    const columns: Column<InventoryItem>[] = useMemo(() => [
        { Header: 'Stock ID', accessor: 'id' },
        { Header: 'Item Name', accessor: 'itemName', Cell: ({ value }) => <div className="font-semibold">{value}</div> },
        { Header: 'Type', accessor: 'type' },
        { Header: 'Category', accessor: 'category' },
        { Header: 'Quantity', accessor: 'quantity', Cell: ({ row }) => <span>{row.quantity} {row.unit}</span> },
        { Header: 'Expiry Date', accessor: 'expiryDate' },
        { Header: 'Status', accessor: 'status', Cell: ({ value }) => getStatusBadge(value) }
    ], []);

    const renderActions = (item: InventoryItem): ReactNode => (
        <div className="flex justify-center space-x-2">
            {/* <button
        type="button"
        className="p-1.5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
        onClick={() => openEditModal(item)}
        title="Edit Item Details"
      >
        <IconEdit className="w-5 h-5" />
      </button> */}
            <button
                type="button"
                className="p-1.5 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
                onClick={() => openLogView(item)}
                title="View Batch Log"
            >
                <IconListCheck className="w-5 h-5" />
            </button>
        </div>
    );

    const renderTopContent = (): ReactNode => (
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Stock List</h2>
            <div className="flex gap-3">
                <button type="button" className="btn btn-outline-primary">
                    Generate Report
                </button>
                <button type="button" onClick={openAddModal} className="btn btn-primary flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M11 19v-6H5v-2h6V5h2v6h6v2h-6v6Z" /></svg>
                    Add New Item
                </button>
            </div>
        </div>
    );

    const tabActiveClasses = 'border-b-2 border-green-500 text-green-500 dark:border-primary dark:text-primary';
    const tabInactiveClasses = 'border-b-2 border-transparent text-gray-500 hover:text-green-500 dark:text-gray-400 dark:hover:text-primary';
    const TabButton: React.FC<{ tabId: typeof activeTab; label: string; icon: ReactNode }> = ({ tabId, label, icon }) => {
        const isActive = activeTab === tabId;
        return (
            <button
                onClick={() => setActiveTab(tabId)}
                className={`py-4 px-1 text-sm font-medium focus:outline-none transition duration-150 ease-in-out flex items-center ${isActive ? tabActiveClasses : tabInactiveClasses
                    }`}
            >
                <span className="w-5 h-5 inline ltr:mr-2 rtl:ml-2 align-text-bottom">{icon}</span>
                {label}
            </button>
        );
    };

    return (
        <>
            <div className="">
                {/* CONDITIONAL RENDERING: Show Log View OR Main Dashboard */}
                {showLogView && selectedItem ? (
                    <InventoryBatchLog
                        item={selectedItem as InventoryBatchLogItem} // Cast to the expected type
                        onBack={closeLogView}
                        onAddBatch={openAddBatchModal}
                    />
                ) : (
                    <>
                        {/* Main Dashboard Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {statsData.map((stat) => (
                                <DashboardCard
                                    key={stat.title}
                                    title={stat.title}
                                    count={stat.count}
                                    icon={stat.icon}
                                />
                            ))}
                        </div>

                        {/* Inventory Table Panel */}
                        <div className="panel mt-6">
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                {renderTopContent()}
                            </div>
                            <div className="border-b border-gray-200 dark:border-gray-700 px-6 sm:px-8">
                                <div className="flex space-x-6 -mb-px">
                                    <TabButton tabId="all" label="All Items" icon={<IconListCheck />} />
                                    <TabButton tabId="internal" label="Internal Medicine" icon={<IconPill />} />
                                    <TabButton tabId="external" label="External Medicine" icon={<IconBottle />} />
                                </div>
                            </div>
                            <div className="p-4">
                                <Table<InventoryItem>
                                    columns={columns}
                                    data={filteredData}
                                    actions={renderActions}
                                    itemsPerPage={5}
                                />
                            </div>
                        </div>
                    </>
                )}

                {/* MODAL 1: Add/Edit Inventory Item */}
                <GlobalModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    mode={selectedItem ? 'edit' : 'create'}
                    title={selectedItem ? 'Edit Inventory Item Details' : 'Add New Inventory Item'}
                    fields={inventoryFields as FieldConfig[]}
                    initialData={getInitialInventoryData(selectedItem || undefined)}
                    onSave={handleSaveInventory}
                />

                {/* MODAL 2: Add New Batch (Triggered by the Log View or directly) */}

            </div>
            {isBatchModalOpen && selectedItem && (
                <GlobalModal
                    isOpen={isBatchModalOpen}
                    onClose={handleCloseBatchModal}
                    mode={'create'}
                    title={`Add New Batch for: ${selectedItem.itemName}`}
                    fields={batchFields as FieldConfig[]}
                    initialData={getInitialBatchData(selectedItem.id, selectedItem.unit)}
                    onSave={handleSaveBatch}
                />
            )}
        </>
    );
};

export default PharmacistInventory;