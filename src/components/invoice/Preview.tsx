import React, { useEffect, useState, useMemo } from 'react';

// Required for PDF Download functionality provided by the user's original code
// These scripts must be loaded globally for the component's download logic to work in the environment.
// eslint-disable-next-line
const Html2CanvasScript = <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>;
// eslint-disable-next-line
const JsPDFScript = <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>;


// --- Icon Components (Replacing External Imports) ---
const IconSend = (props) => (
    <svg {...props} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);
const IconPrinter = (props) => (
    <svg {...props} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
);
const IconDownload = (props) => (
    <svg {...props} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
);

// --- Static Data ---
const patientInfo = {
    name: 'Aarav Sharma',
    address: '123 Health Lane, New Delhi, 110001',
    phone: '+91 98765 43210',
    email: 'aarav.sharma@example.com',
};

const doctorInfo = {
    name: 'Dr. Priya Singh',
    license: 'D-45678',
    phone: '+91 99887 76655',
    clinic: 'MediCare Clinic',
};

// Item data used for initializing the dynamic state
const initialItemsData = [
    { id: 1, medicine: 'PainRelief 500mg', quantity: 20, unitPrice: 5.50, total: 110.00, tag: 'tablets' },
    { id: 2, medicine: 'Vitaboost Syrup', quantity: 1, unitPrice: 120.00, total: 120.00, tag: 'bottle (100ml)' },
    { id: 3, medicine: 'Antacid Tablets', quantity: 10, unitPrice: 3.20, total: 32.00, tag: 'tablets' },
    { id: 4, medicine: 'Healing Balm', quantity: 1, unitPrice: 85.00, total: 85.00, tag: 'tube (50g)' },
];

const columns = [
    { key: 'medicine', label: 'Medicine' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'unitPrice', label: 'Unit Price' },
    { key: 'total', label: 'Total' },
];

// Fixed rates for calculation
const DISCOUNT_RATE = 0.10; // 10%
const TAX_RATE = 0.05; // 5%

const App = () => {
    const [items, setItems] = useState(initialItemsData);
    const [deposit, setDeposit] = useState(0);

    useEffect(() => {
        document.title = 'Pharmacy Invoice';
    }, []);

    // Helper to format currency
    const formatCurrency = (amount) => {
        return `INR ${(amount || 0).toFixed(2)}`;
    };

    // Dynamic calculation of all financial summaries
    const { subtotal, totalPayable, discount, tax, amountDue } = useMemo(() => {
        const calculatedSubtotal = items.reduce((sum, item) => sum + item.total, 0);
        const calculatedDiscount = calculatedSubtotal * DISCOUNT_RATE;
        const calculatedTax = calculatedSubtotal * TAX_RATE;
        const calculatedTotalPayable = calculatedSubtotal - calculatedDiscount + calculatedTax;

        const amountPaid = parseFloat(deposit) || 0;
        const actualAmountPaid = Math.min(amountPaid, calculatedTotalPayable);
        const calculatedAmountDue = calculatedTotalPayable - actualAmountPaid;

        return {
            subtotal: calculatedSubtotal,
            discount: calculatedDiscount,
            tax: calculatedTax,
            totalPayable: calculatedTotalPayable,
            amountDue: calculatedAmountDue,
        };
    }, [deposit, items]);

    const handleQuantityChange = (id, newQuantityValue) => {
        const quantityAsNumber = parseFloat(newQuantityValue) || 0;
        const quantity = Math.max(0, quantityAsNumber);

        setItems(prevItems =>
            prevItems.map(item => {
                if (item.id === id) {
                    const total = quantity * item.unitPrice;
                    return { ...item, quantity, total };
                }
                return item;
            })
        );
    };

    const handleDepositChange = (e) => {
        const value = e.target.value;
        setDeposit(value === '' ? '' : Math.max(0, parseFloat(value) || 0));
    };


    // --- Utility Functions for Export ---
    const exportTable = () => {
        window.print();
    };

    const downloadInvoice = () => {
        const invoicePanel = document.querySelector('.invoice-container');
        // @ts-ignore
        if (invoicePanel && typeof html2canvas !== 'undefined' && typeof window.jspdf !== 'undefined') {
            const downloadButton = document.getElementById('download-btn-bottom');
            const originalText = downloadButton.innerHTML;
            downloadButton.innerHTML = 'Generating PDF...';
            downloadButton.disabled = true;

            // @ts-ignore
            html2canvas(invoicePanel, { scale: 2 }).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                // @ts-ignore
                const { jsPDF } = window;
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save('pharmacy-invoice.pdf');

                downloadButton.innerHTML = originalText;
                downloadButton.disabled = false;
            }).catch((error) => {
                console.error('PDF generation failed:', error);
                downloadButton.innerHTML = 'Error Generating PDF';
                setTimeout(() => {
                    downloadButton.innerHTML = originalText;
                    downloadButton.disabled = false;
                }, 3000);
            });
        } else {
            console.error('Dependencies (html2canvas, jspdf) or invoice container missing for PDF download.');
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-inter">
            {/* INJECTING GLOBAL PRINT STYLES */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    /* Standard print media query reset for clean printing */
                    .min-h-screen { padding: 0 !important; background-color: white !important; }
                    body > div { visibility: hidden; }
                    .min-h-screen, .invoice-container { visibility: visible !important; }
                    .invoice-container {
                        position: absolute; left: 0; top: 0; width: 100%;
                        box-shadow: none !important; border: none !important;
                        padding: 30px !important; margin: 0 !important;
                    }
                    .invoice-container * { visibility: visible; }
                    input[type="number"] {
                        border: none !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                        text-align: right !important; 
                        padding: 0 !important;
                        background-color: transparent !important;
                        font-weight: normal !important;
                        color: black !important;
                    }
                    .print\\:hidden { display: none !important; }
                    .invoice-table-row { page-break-inside: avoid; }
                }
            `}} />


            {/* Invoice Container - The part to be printed/downloaded */}
            <div id="invoice-preview" className="invoice-container bg-white p-6 md:p-12 mx-auto max-w-4xl border border-gray-300 rounded-lg shadow-lg">

                {/* --- Invoice Header --- */}
                <div className="flex justify-between items-start border-b pb-4 mb-8 border-gray-300">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-800">INVOICE</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Invoice #<span className="font-semibold text-gray-700">UTP001-2024-001</span>
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-semibold text-gray-700">MediCare Clinic Pharmacy</p>
                        <p className="text-sm text-gray-500">New Delhi, India</p>
                        <p className="text-sm text-gray-500 mt-2">Date: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                    </div>
                </div>

                {/* --- Patient and Doctor Info --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">

                    {/* Patient Information */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-800 mb-2 uppercase tracking-wider border-b border-gray-200 pb-1">Bill To</h3>
                        <div className="space-y-1 text-gray-600 text-sm">
                            <div className="font-semibold text-gray-800">{patientInfo.name}</div>
                            <div>{patientInfo.address}</div>
                            <div>P: {patientInfo.phone}</div>
                            <div>E: {patientInfo.email}</div>
                        </div>
                    </div>

                    {/* Doctor/Source Information */}
                    <div className="text-left sm:text-right">
                        <h3 className="text-sm font-bold text-gray-800 mb-2 uppercase tracking-wider border-b border-gray-200 pb-1">Prescribed By</h3>
                        <div className="space-y-1 text-gray-600 text-sm">
                            <div className="font-semibold text-gray-800">{doctorInfo.name}</div>
                            <div>{doctorInfo.clinic}</div>
                            <div>License: {doctorInfo.license}</div>
                            <div>P: {doctorInfo.phone}</div>
                        </div>
                    </div>
                </div>

                {/* --- Medicines Dispensed Table --- */}
                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-1">Order Details</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                            <tr className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold tracking-wider">
                                {columns.map((column) => (
                                    <th key={column.key} className={`py-3 px-6 text-left ${column.key === 'total' ? 'text-right' : ''}`}>
                                        {column.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white text-gray-700 text-sm font-light divide-y divide-gray-100">
                            {items.map((item) => (
                                <tr key={item.id} className="invoice-table-row">
                                    {/* Medicine */}
                                    <td className="py-3 px-6 text-left whitespace-normal font-medium text-gray-800">
                                        {item.medicine}
                                        <span className="block text-xs text-gray-500 italic">({item.tag})</span>
                                    </td>
                                    {/* Editable Quantity Field */}
                                    <td className="py-3 px-6 text-left">
                                        <input
                                            type="number"
                                            min="0"
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                            className="w-16 p-1 border border-gray-300 rounded text-center font-bold text-sm bg-white focus:ring-1 focus:ring-blue-500 print:w-auto print:text-right"
                                        />
                                    </td>
                                    {/* Unit Price */}
                                    <td className="py-3 px-6 text-left whitespace-nowrap">
                                        {formatCurrency(item.unitPrice)}
                                    </td>
                                    {/* Total */}
                                    <td className="py-3 px-6 text-right whitespace-nowrap font-bold text-gray-900">
                                        {formatCurrency(item.total)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* --- Totals and Summary --- */}
                <div className="flex justify-end mt-8">
                    <div className="w-full sm:w-96">
                        <div className="space-y-2 text-sm text-gray-700">
                            {/* Subtotal */}
                            <div className="flex justify-between items-center border-b border-dashed pb-1">
                                <div>Subtotal:</div>
                                <div className="font-semibold">{formatCurrency(subtotal)}</div>
                            </div>
                            {/* Discount */}
                            <div className="flex justify-between items-center">
                                <div>Discount ({DISCOUNT_RATE * 100}%):</div>
                                <div className="font-semibold text-red-600">- {formatCurrency(discount)}</div>
                            </div>
                            {/* Tax */}
                            <div className="flex justify-between items-center">
                                <div>Tax ({TAX_RATE * 100}%):</div>
                                <div className="font-semibold text-green-600">+ {formatCurrency(tax)}</div>
                            </div>

                            <div className="border-t border-gray-400 pt-3 mt-3"></div>

                            {/* Total Payable (Gross Amount) */}
                            <div className="flex justify-between items-center text-base font-bold text-gray-900">
                                <div>Total Payable:</div>
                                <div className="text-gray-900">{formatCurrency(totalPayable)}</div>
                            </div>

                            {/* Amount Paid (Deposit) - Editable */}
                            <div className="flex justify-between items-center pt-2">
                                <label htmlFor="deposit" className="font-semibold text-gray-800 whitespace-nowrap">Amount Paid:</label>
                                <input
                                    id="deposit"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={deposit === 0 && deposit !== '' ? '' : deposit}
                                    onChange={handleDepositChange}
                                    placeholder={formatCurrency(0).replace('INR ', '')}
                                    className="w-1/2 p-1 border border-gray-400 rounded text-right font-bold text-gray-800 focus:ring-1 focus:ring-blue-500 bg-white"
                                />
                            </div>

                            <div className="border-t border-double border-gray-600 pt-4 mt-4"></div>

                            {/* Amount Due (Pending) - Calculated */}
                            <div className="flex justify-between items-center text-xl font-extrabold text-gray-900">
                                <div>AMOUNT DUE:</div>
                                <div className={`${amountDue > 0 ? 'text-red-600' : 'text-green-700'}`}>
                                    {formatCurrency(amountDue)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Notes and Signature Section --- */}
                <div className="mt-12 pt-4 border-t border-gray-300">
                    <h3 className="text-sm font-bold text-gray-800 mb-2 uppercase">Thank You</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        Payment can be settled using cash, card, or UPI. This invoice is valid for 30 days. For any issues, please contact our support team.
                    </p>
                    <div className="mt-8 flex justify-end">
                        <div className="text-right">
                            <div className="mt-1 h-12 w-48 border-b-2 border-dashed border-gray-400 inline-block"></div>
                            <p className="text-sm font-semibold text-gray-800 mt-1">Authorized Signatory</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Action Bar at the Bottom (Hides on print) --- */}
            <div className="flex justify-center gap-4 mt-8 print:hidden">
                <button type="button" className="flex items-center gap-2 px-6 py-2 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-800 transition duration-150 font-medium">
                    <IconSend className="text-white" />
                    Save & Email
                </button>
                <button type="button" className="flex items-center gap-2 px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-md hover:bg-gray-100 transition duration-150 font-medium" onClick={exportTable}>
                    <IconPrinter className="text-gray-700" />
                    Print Invoice
                </button>
                <button id="download-btn-bottom" type="button" className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-150 font-medium" onClick={downloadInvoice}>
                    <IconDownload className="text-white" />
                    Download PDF
                </button>
            </div>
        </div>
    );
};

export default App;