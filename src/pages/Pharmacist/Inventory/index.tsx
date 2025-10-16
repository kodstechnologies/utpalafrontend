import React, { useEffect, useMemo, useState, ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { Dialog, Transition } from '@headlessui/react';
import IconListCheck from '../../../components/Icon/IconListCheck';
import Table, { Column } from '../../../components/Table/Table';
import { DashboardCard } from '../../../components/DashboardCard';

// --- ICONS (Assuming these are available or defined elsewhere) ---
const IconBox: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 7L12 3L4 7V17L12 21L20 17V7Z" stroke="currentColor" strokeWidth="1.5" /><path opacity="0.5" d="M12 12L4 7" stroke="currentColor" strokeWidth="1.5" /><path opacity="0.5" d="M12 12V21" stroke="currentColor" strokeWidth="1.5" /><path opacity="0.5" d="M12 12L20 7" stroke="currentColor" strokeWidth="1.5" /><path opacity="0.5" d="M17 4.5L7 9.5" stroke="currentColor" strokeWidth="1.5" /></svg>
);
const IconDollar: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/><path d="M12 6V18M15 9H9.5C8.39543 9 7.5 9.89543 7.5 11C7.5 12.1046 8.39543 13 9.5 13H14.5C15.6046 13 16.5 13.8954 16.5 15C16.5 16.1046 15.6046 17 14.5 17H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
);
const IconAlertTriangle: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.8718 2.50234C12.4921 1.83358 11.5079 1.83358 11.1282 2.50234L2.12221 18.5316C1.75427 19.1826 2.23838 20 2.99401 20H21.006C21.7616 20 22.2457 19.1826 21.8778 18.5316L12.8718 2.50234Z" stroke="currentColor" strokeWidth="1.5"/><path d="M12 9V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M12 17.01L12.01 16.999" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
);
const IconEdit: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 20h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const IconPill: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.1213 2.87868C16.8854 5.64279 16.8854 10.1146 14.1213 12.8787C11.3572 15.6428 6.88543 15.6428 4.12132 12.8787C1.35721 10.1146 1.35721 5.64279 4.12132 2.87868C6.88543 0.114571 11.3572 0.114571 14.1213 2.87868Z" stroke="currentColor" strokeWidth="1.5" /><path opacity="0.5" d="M12.8787 14.1213C15.6428 16.8854 15.6428 21.3572 12.8787 24.1213C10.1146 26.8854 5.64279 26.8854 2.87868 24.1213" stroke="currentColor" strokeWidth="1.5" /></svg>
);
const IconBottle: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 22H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M10 2H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M18 11C18 15.4183 15.3137 19 12 19C8.68629 19 6 15.4183 6 11C6 6.58172 8.68629 3 12 3C15.3137 3 18 6.58172 18 11Z" stroke="currentColor" strokeWidth="1.5" /><path opacity="0.5" d="M12 19V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// --- DATA TYPES & MOCK DATA ---

type ItemStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';
type ItemType = 'Internal' | 'External';
type ItemUnit = 'g' | 'ml' | 'units';

interface InventoryItem { // Fix: Add 'id' property to satisfy TableProps constraint
    id: string; // Using stockId as the unique identifier
    // stockId: string;
    itemName: string;
    type: ItemType;
    unit: ItemUnit;
    category: string;
    quantity: number;
    expiryDate: string;
    status: ItemStatus;
}

const mockInventory: InventoryItem[] = [
    { id: 'MED-001', itemName: 'Ashwagandha Churna', type: 'Internal', category: 'Herbal Powders', quantity: 150, unit: 'g', expiryDate: '2025-12-31', status: 'In Stock' },
    { id: 'MED-002', itemName: 'Brahmi Vati', type: 'Internal', category: 'Tablets', quantity: 45, unit: 'units', expiryDate: '2024-11-30', status: 'Low Stock' },
    { id: 'OIL-001', itemName: 'Mahanarayan Oil', type: 'External', category: 'Massage Oils', quantity: 80, unit: 'ml', expiryDate: '2026-01-15', status: 'In Stock' },
    { id: 'MED-003', itemName: 'Triphala Guggulu', type: 'Internal', category: 'Tablets', quantity: 0, unit: 'units', expiryDate: '2024-09-30', status: 'Out of Stock' },
    { id: 'EXT-001', itemName: 'Neem Soap', type: 'External', category: 'Cosmetics', quantity: 200, unit: 'units', expiryDate: '2025-08-20', status: 'In Stock' },
    { id: 'MED-004', itemName: 'Arjuna Ksheera Paka', type: 'Internal', category: 'Decoctions', quantity: 25, unit: 'ml', expiryDate: '2024-10-05', status: 'Low Stock' },
    { id: 'OIL-002', itemName: 'Kottamchukkadi Thailam', type: 'External', category: 'Massage Oils', quantity: 60, unit: 'ml', expiryDate: '2025-07-22', status: 'In Stock' },
].map(item => ({ ...item, id: item.id })); // Map mock data to include 'id'

// --- HELPER COMPONENTS ---

const getStatusBadge = (status: ItemStatus) => {
    const statusClasses = {
        'In Stock': 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
        'Low Stock': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400',
        'Out of Stock': 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400',
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full Rs.{statusClasses[status]}`}>{status}</span>;
};

const PharmacistInventory: React.FC = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Inventory'));
    }, [dispatch]);

    const [activeTab, setActiveTab] = useState<'all' | 'internal' | 'external'>('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

    const statsData = [
        { title: 'Total Items', count: mockInventory.length, icon: IconBox },
        { title: 'Total Stock Value', count: 'Rs.12,450', icon: IconDollar },
        { title: 'Items in Low Stock', count: mockInventory.filter(i => i.status === 'Low Stock').length, icon: IconAlertTriangle },
    ];

    const filteredData = useMemo(() => {
        if (activeTab === 'all') return mockInventory;
        return mockInventory.filter(item => item.type.toLowerCase() === activeTab);
    }, [activeTab]);

    const handleEditClick = (item: InventoryItem) => {
        setSelectedItem(item);
        setIsEditModalOpen(true);
    };

    const columns: Column<InventoryItem>[] = useMemo(() => [
        { Header: 'Stock ID', accessor: 'id' },
        { Header: 'Item Name', accessor: 'itemName', Cell: ({ value }) => <div className="font-semibold">{value}</div> },
        { Header: 'Type', accessor: 'type' },
        { Header: 'Category', accessor: 'category' },
        { Header: 'Quantity', accessor: 'quantity', Cell: ({ row }) => <span>{row.quantity} {row.unit}</span> },
        { Header: 'Expiry Date', accessor: 'expiryDate' },
        { Header: 'Status', accessor: 'status', Cell: ({ value }) => getStatusBadge(value) },
    ], []);

    const renderActions = (item: InventoryItem): ReactNode => (
        <div className="flex justify-center">
            <button 
                type="button" 
                className="p-1.5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                onClick={() => handleEditClick(item)}
                title="Edit Item"
            >
                <IconEdit className="w-5 h-5" />
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
                <button type="button" onClick={() => setIsAddModalOpen(true)} className="flex items-center justify-center px-4 py-2 bg-green-700 text-white font-semibold rounded-lg shadow-md hover:bg-green-800 transition-colors duration-150 w-full md:w-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M11 19v-6H5v-2h6V5h2v6h6v2h-6v6Z" /></svg>
                    Add New
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
                className={`py-4 px-1  text-sm font-medium focus:outline-none transition duration-150 ease-in-out flex items-center ${
                    isActive ? tabActiveClasses : tabInactiveClasses
                }`}
            >
                <span className="w-5 h-5 inline ltr:mr-2 rtl:ml-2 align-text-bottom">{icon}</span>
                {label}
            </button>
        );
    };

    return (
        <div className="space-y-6">
            {/* 1. Stat Cards */}
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

            {/* 2. Table Section */}
            <div className="panel p-0">
                {/* Header with Buttons */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    {renderTopContent()}
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700 px-6 sm:px-8">
                    <div className="flex space-x-6 -mb-px">
                        <TabButton tabId="all" label="All Items" icon={<IconListCheck />} />
                        <TabButton tabId="internal" label="Internal Medicine" icon={<IconPill />} />
                        <TabButton tabId="external" label="External Medicine" icon={<IconBottle />} />
                    </div>
                </div>

                {/* Table */}
                <div className="p-4">
                    <Table<InventoryItem>
                        columns={columns}
                        data={filteredData}
                        actions={renderActions}
                        itemsPerPage={5}
                    />
                </div>
            </div>

            {/* Add Inventory Modal */}
            <Transition appear show={isAddModalOpen} as={React.Fragment}>
                <Dialog as="div" open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} className="relative z-50">
                    <Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-[black]/60" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={React.Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                                        Add New Inventory Item
                                    </Dialog.Title>
                                    <div className="mt-4 space-y-4">
                                        <form onSubmit={(e) => e.preventDefault()}>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Item Name</label>
                                                    <input type="text" name="itemName" id="itemName" className="form-input mt-1 block w-full" />
                                                </div>
                                                <div>
                                                    <label htmlFor="stockId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Stock ID</label>
                                                    <input type="text" name="stockId" id="stockId" className="form-input mt-1 block w-full" />
                                                </div>
                                                <div>
                                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                                                    <input type="text" name="category" id="category" className="form-input mt-1 block w-full" />
                                                </div>
                                                <div>
                                                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                                                    <select id="type" name="type" className="form-select mt-1 block w-full">
                                                        <option>Internal</option>
                                                        <option>External</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
                                                    <input type="number" name="quantity" id="quantity" className="form-input mt-1 block w-full" />
                                                </div>
                                                <div>
                                                    <label htmlFor="unit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Unit</label>
                                                    <select id="unit" name="unit" className="form-select mt-1 block w-full">
                                                        <option>g</option>
                                                        <option>ml</option>
                                                        <option>units</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Expiry Date</label>
                                                    <input type="date" name="expiryDate" id="expiryDate" className="form-input mt-1 block w-full" />
                                                </div>
                                            </div>
                                            <div className="mt-6 flex justify-end gap-4">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger"
                                                    onClick={() => setIsAddModalOpen(false)}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary"
                                                    onClick={() => setIsAddModalOpen(false)} // Replace with actual submit logic
                                                >
                                                    Add Item
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* Edit Inventory Modal */}
            <Transition appear show={isEditModalOpen} as={React.Fragment}>
                <Dialog as="div" open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} className="relative z-50">
                    <Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-[black]/60" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={React.Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                                        Edit Inventory Item
                                    </Dialog.Title>
                                    {selectedItem && (
                                        <div className="mt-4 space-y-4">
                                            <form onSubmit={(e) => e.preventDefault()}>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <label htmlFor="edit-itemName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Item Name</label>
                                                        <input type="text" name="itemName" id="edit-itemName" className="form-input mt-1 block w-full" defaultValue={selectedItem.itemName} />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="edit-stockId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Stock ID</label>
                                                        <input type="text" name="stockId" id="edit-stockId" className="form-input mt-1 block w-full" defaultValue={selectedItem.id} readOnly />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                                                        <input type="text" name="category" id="edit-category" className="form-input mt-1 block w-full" defaultValue={selectedItem.category} />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="edit-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                                                        <select id="edit-type" name="type" className="form-select mt-1 block w-full" defaultValue={selectedItem.type}>
                                                            <option>Internal</option>
                                                            <option>External</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label htmlFor="edit-quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
                                                        <input type="number" name="quantity" id="edit-quantity" className="form-input mt-1 block w-full" defaultValue={selectedItem.quantity} />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="edit-unit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Unit</label>
                                                        <select id="edit-unit" name="unit" className="form-select mt-1 block w-full" defaultValue={selectedItem.unit}>
                                                            <option>g</option>
                                                            <option>ml</option>
                                                            <option>units</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label htmlFor="edit-expiryDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Expiry Date</label>
                                                        <input type="date" name="expiryDate" id="edit-expiryDate" className="form-input mt-1 block w-full" defaultValue={selectedItem.expiryDate} />
                                                    </div>
                                                </div>
                                                <div className="mt-6 flex justify-end gap-4">
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-danger"
                                                        onClick={() => setIsEditModalOpen(false)}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary"
                                                        onClick={() => setIsEditModalOpen(false)} // Replace with actual submit logic
                                                    >
                                                        Save Changes
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default PharmacistInventory;
