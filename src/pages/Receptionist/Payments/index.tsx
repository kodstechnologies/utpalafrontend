import { useEffect, useState, useMemo, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { Dialog, Transition } from '@headlessui/react';
import { setPageTitle } from '../../../store/themeConfigSlice';
import Table, { Column } from '../../../components/Table/Table';
import IconPlus from '../../../components/Icon/IconPlus';

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
const mockInitialTransactions: PaymentTransaction[] = [
    { id: 1, date: '2024-07-28', description: 'Consultation Fee - Ravi Kumar', type: 'Credit', amount: 500, paymentMethod: 'Online' },
    { id: 2, date: '2024-07-28', description: 'Office Supplies Purchase', type: 'Debit', amount: 1200, paymentMethod: 'Card' },
    { id: 3, date: '2024-07-29', description: 'Therapy Session - Sunita Sharma', type: 'Credit', amount: 1500, paymentMethod: 'Cash' },
];

const paymentMethods = ['Cash', 'Online', 'Card'];

const ReceptionistPayments = () => {
    const dispatch = useDispatch();
    const [transactions, setTransactions] = useState<PaymentTransaction[]>(mockInitialTransactions);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTransaction, setNewTransaction] = useState({
        date: new Date().toISOString().split('T')[0],
        description: '',
        type: 'Credit' as 'Credit' | 'Debit',
        amount: '',
        paymentMethod: 'Cash' as 'Cash' | 'Online' | 'Card',
    });

    useEffect(() => {
        dispatch(setPageTitle('Payment Management'));
    }, [dispatch]);

    const handleAddTransaction = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would be an API call to save the transaction.
        const newEntry: PaymentTransaction = {
            id: transactions.length + 1,
            ...newTransaction,
            amount: parseFloat(newTransaction.amount),
        };
        setTransactions(prev => [newEntry, ...prev]);
        console.log('New transaction added:', newEntry);
        setIsModalOpen(false);
        // Reset form
        setNewTransaction({
            date: new Date().toISOString().split('T')[0],
            description: '',
            type: 'Credit',
            amount: '',
            paymentMethod: 'Cash',
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewTransaction(prev => ({ ...prev, [name]: value }));
    };

    const columns: Column<PaymentTransaction>[] = useMemo(() => [
        { Header: 'Date', accessor: 'date' },
        { Header: 'Description / Reason', accessor: 'description' },
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
            Cell: ({ value }) => <div className="text-center font-semibold">{value.toFixed(2)}</div>,
        },
    ], []);

    return (
        <>
            <div className="panel">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                    <h1 className="text-xl font-bold">Payment Management</h1>
                    <button type="button" className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                        <IconPlus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                        Add Transaction
                    </button>
                </div>
                <Table<PaymentTransaction> columns={columns} data={transactions} itemsPerPage={10} />
            </div>

            {/* Add Transaction Modal */}
            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-[black]/60" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Record New Transaction</Dialog.Title>
                                <form onSubmit={handleAddTransaction} className="mt-6 space-y-5">
                                    <div>
                                        <label htmlFor="date">Date</label>
                                        <input id="date" type="date" name="date" value={newTransaction.date} onChange={handleInputChange} className="form-input mt-1" required />
                                    </div>
                                    <div>
                                        <label htmlFor="description">Description / Reason</label>
                                        <input id="description" type="text" name="description" value={newTransaction.description} onChange={handleInputChange} className="form-input mt-1" placeholder="e.g., Consultation Fee for John Doe" required />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="type">Type</label>
                                            <select id="type" name="type" value={newTransaction.type} onChange={handleInputChange} className="form-select mt-1" required>
                                                <option>Credit</option>
                                                <option>Debit</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="amount">Amount (INR)</label>
                                            <input id="amount" type="number" name="amount" value={newTransaction.amount} onChange={handleInputChange} className="form-input mt-1" placeholder="e.g., 500" required />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="paymentMethod">Payment Method</label>
                                        <select id="paymentMethod" name="paymentMethod" value={newTransaction.paymentMethod} onChange={handleInputChange} className="form-select mt-1" required>
                                            {paymentMethods.map(m => (
                                                <option key={m}>{m}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mt-6 flex justify-end gap-4">
                                        <button type="button" className="btn btn-outline-danger" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                        <button type="submit" className="btn btn-primary">Save Transaction</button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};

export default ReceptionistPayments;
