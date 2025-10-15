import React, { useEffect, useState, useMemo } from 'react';

// Required for PDF Download functionality provided by the user's original code
// These scripts must be loaded globally for the component's download logic to work in the environment.
// eslint-disable-next-line
const Html2CanvasScript = <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>;
// eslint-disable-next-line
const JsPDFScript = <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>;


// --- Icon Components (Replacing External Imports) ---
const IconSend = (props) => (
    <svg {...props} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);
const IconPrinter = (props) => (
    <svg {...props} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
);
const IconDownload = (props) => (
    <svg {...props} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
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
    { key: 'unitPrice', label: 'Unit Price (INR)', class: 'ltr:text-left rtl:text-right' },
    { key: 'total', label: 'Total (INR)', class: 'ltr:text-right rtl:text-left' },
];

// Fixed rates for calculation
const DISCOUNT_RATE = 0.10; // 10%
const TAX_RATE = 0.05; // 5%

const App = () => {
    // State for the editable items list
    const [items, setItems] = useState(initialItemsData);
    // State for the editable deposit amount
    const [deposit, setDeposit] = useState(0); 

    useEffect(() => {
        document.title = 'Invoice Preview';
    }, []);

    // Dynamic calculation of all financial summaries
    const { subtotal, totalPayable, discount, tax, amountDue } = useMemo(() => {
        // 1. Calculate Subtotal dynamically from items state
        const calculatedSubtotal = items.reduce((sum, item) => sum + item.total, 0);

        // 2. Calculate Discount and Tax
        const calculatedDiscount = calculatedSubtotal * DISCOUNT_RATE;
        const calculatedTax = calculatedSubtotal * TAX_RATE;
        
        // 3. Calculate Total Payable (Total Amount)
        const calculatedTotalPayable = calculatedSubtotal - calculatedDiscount + calculatedTax;

        // 4. Calculate Amount Due (Pending)
        const amountPaid = parseFloat(deposit) || 0; 
        
        // Ensure amountPaid does not exceed the total payable amount
        const actualAmountPaid = Math.min(amountPaid, calculatedTotalPayable);
        
        const calculatedAmountDue = calculatedTotalPayable - actualAmountPaid;

        return {
            subtotal: calculatedSubtotal,
            discount: calculatedDiscount,
            tax: calculatedTax,
            totalPayable: calculatedTotalPayable,
            amountDue: calculatedAmountDue,
        };
    }, [deposit, items]); // Recalculate whenever deposit or items change

    /**
     * Handles changes to the quantity input field for a specific item.
     * @param {number} id - The ID of the item to update.
     * @param {string} newQuantityValue - The new quantity value from the input field.
     */
    const handleQuantityChange = (id, newQuantityValue) => {
        // Convert input value to a number, defaulting to 0 if invalid or empty
        const quantityAsNumber = parseFloat(newQuantityValue) || 0;
        // Ensure quantity is not negative
        const quantity = Math.max(0, quantityAsNumber); 

        setItems(prevItems =>
            prevItems.map(item => {
                if (item.id === id) {
                    // Recalculate the item's total based on the new quantity
                    const total = quantity * item.unitPrice;
                    return { ...item, quantity, total };
                }
                return item;
            })
        );
    };

    // --- Utility Functions ---

    const exportTable = () => {
        // This function now correctly triggers the print media query
        window.print();
    };

    const downloadInvoice = () => {
        const invoicePanel = document.querySelector('.invoice-container');
        // @ts-ignore
        if (invoicePanel && typeof html2canvas !== 'undefined' && typeof window.jspdf !== 'undefined') {
            const downloadButton = document.getElementById('download-btn');
            const originalText = downloadButton.innerHTML;
            downloadButton.innerHTML = 'Generating PDF...';
            downloadButton.disabled = true;

            // @ts-ignore
            html2canvas(invoicePanel, {
                scale: 2,
            }).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                
                // jspdf is available under the global name jsPDF (from UMD bundle)
                // @ts-ignore
                const { jsPDF } = window;
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save('pharmacy-invoice.pdf');

                // Restore button state
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

    // Helper to format currency
    const formatCurrency = (amount) => {
        // Ensure amount is treated as a number and rounded to 2 decimal places
        // Fallback to 0 if amount is null or undefined
        return `INR ${(amount || 0).toFixed(2)}`;
    };

    const handleDepositChange = (e) => {
        const value = e.target.value;
        // Allows empty string for temporary user input state
        setDeposit(value === '' ? '' : Math.max(0, parseFloat(value) || 0));
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 font-inter">
            {/* INJECTING GLOBAL PRINT STYLES
                This media query ensures only the content inside .invoice-container is printed. 
            */}
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    /* Hide the main wrapper's background and padding */
                    .min-h-screen {
                        padding: 0 !important;
                        background-color: white !important;
                    }
                    /* Hide everything in the body by default */
                    body > div { 
                        visibility: hidden;
                    }
                    /* Re-show the main container wrapper */
                    .min-h-screen {
                        visibility: visible;
                    }
                    /* Position the invoice container at the top left and expand it */
                    .invoice-container {
                        visibility: visible !important;
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        /* Remove screen-only styles like shadow and border */
                        box-shadow: none !important;
                        border: none !important;
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    /* Ensure all text/elements inside the invoice are visible */
                    .invoice-container * {
                        visibility: visible;
                    }
                    /* Fix for inputs not showing value when printing */
                    input[type="number"] {
                        border: none !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                }
            `}} />


            {/* Header and Action Buttons (Hides using Tailwind's print:hidden utility) */}
            <div className="flex flex-col sm:flex-row sm:justify-end items-center gap-4 mb-6 print:hidden">
                <div className="flex gap-3">
                    <button type="button" className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-150">
                        <IconSend />
                        Save Invoice
                    </button>
                    <button type="button" className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow-md hover:bg-gray-300 transition duration-150" onClick={exportTable}>
                        <IconPrinter />
                        Print Invoice
                    </button>
                    <button id="download-btn" type="button" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-150" onClick={downloadInvoice}>
                        <IconDownload />
                        Download PDF
                    </button>
                </div>
            </div>

            {/* Invoice Container - The part to be printed/downloaded */}
            <div id="invoice-preview" className="invoice-container panel bg-white p-6 md:p-10 rounded-xl shadow-lg border border-gray-200">
                
                {/* Invoice Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Invoice Details</h1>
                    <p className="text-sm text-gray-500">
                        Invoice #<span className="font-semibold text-red-500">UTP001-2024-001</span> generated from Prescription #<span className="font-semibold text-red-500">RX-12345</span>
                    </p>
                </div>

                {/* Patient, Doctor, and Payment Summary Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
                    
                    {/* Patient and Doctor Info */}
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        
                        {/* Patient Information */}
                        <div className="p-4 border border-gray-200 rounded-lg">
                            <h2 className="text-lg font-semibold text-gray-800 mb-3">Patient Information</h2>
                            <div className="space-y-1 text-gray-600 text-sm">
                                <div><span className="font-medium text-gray-700">Name:</span> {patientInfo.name}</div>
                                <div><span className="font-medium text-gray-700">Address:</span> {patientInfo.address}</div>
                                <div><span className="font-medium text-gray-700">Phone:</span> {patientInfo.phone}</div>
                                <div><span className="font-medium text-gray-700">Email:</span> {patientInfo.email}</div>
                            </div>
                        </div>

                        {/* Doctor Information */}
                        <div className="p-4 border border-gray-200 rounded-lg">
                            <h2 className="text-lg font-semibold text-gray-800 mb-3">Doctor Information</h2>
                            <div className="space-y-1 text-gray-600 text-sm">
                                <div><span className="font-medium text-gray-700">Name:</span> {doctorInfo.name}</div>
                                <div><span className="font-medium text-gray-700">License:</span> {doctorInfo.license}</div>
                                <div><span className="font-medium text-gray-700">Phone:</span> {doctorInfo.phone}</div>
                                <div><span className="font-medium text-gray-700">Clinic:</span> {doctorInfo.clinic}</div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Summary Block */}
                    <div className="lg:col-span-1 p-6 bg-green-50/70 border border-green-200 rounded-xl">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Summary</h2>
                        <div className="space-y-3">
                            {/* Subtotal */}
                            <div className="flex justify-between items-center text-gray-700">
                                <div>Subtotal:</div>
                                <div className="font-semibold">{formatCurrency(subtotal)}</div>
                            </div>
                            {/* Discount */}
                            <div className="flex justify-between items-center text-gray-700">
                                <div>Discount ({DISCOUNT_RATE * 100}%):</div>
                                <div className="font-semibold text-red-600">- {formatCurrency(discount)}</div>
                            </div>
                            {/* Tax */}
                            <div className="flex justify-between items-center text-gray-700">
                                <div>Tax ({TAX_RATE * 100}%):</div>
                                <div className="font-semibold text-green-600">+ {formatCurrency(tax)}</div>
                            </div>
                            
                            <div className="border-t border-gray-300 my-4"></div>

                            {/* Total Payable (Amount before deposit) */}
                            <div className="flex justify-between items-center text-sm font-bold text-gray-900">
                                <div>Total Payable:</div>
                                <div className="text-sm text-indigo-700">{formatCurrency(totalPayable)}</div>
                            </div>
                            
                            <div className="border-t border-dashed border-gray-300 my-4"></div>

                            {/* Amount Paid (Deposit) - Editable */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-gray-700">
                                <label htmlFor="deposit" className="font-medium text-gray-800 mb-1 sm:mb-0 whitespace-nowrap">Amount Paid (Deposit):</label>
                                <input
                                    id="deposit"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    // Use deposit state directly, only show empty string if exactly 0 and type is number.
                                    value={deposit === 0 && deposit !== '' ? '' : deposit} 
                                    onChange={handleDepositChange}
                                    placeholder={formatCurrency(0)}
                                    className="w-full sm:w-1/2 p-2 border border-gray-300 rounded-lg text-right font-bold focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            <div className="border-t border-gray-300 my-4"></div>

                            {/* Amount Due (Pending) - Calculated */}
                            <div className="flex justify-between items-center text-sm font-bold text-gray-900">
                                <div>Amount Due (Pending):</div>
                                <div className={`text-sm ${amountDue > 0 ? 'text-red-600' : 'text-green-700'}`}>
                                    {formatCurrency(amountDue)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Medicines Dispensed Table */}
                <h2 className="text-lg font-semibold text-gray-800 mt-10 mb-4">Medicines Dispensed</h2>
                <div className="table-responsive mt-2">
                    <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                                {columns.map((column) => (
                                    <th key={column.key} className={`py-3 px-6 text-left ${column?.class || ''}`}>
                                        {column.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white text-gray-700 text-sm font-light divide-y divide-gray-200">
                            {items.map((item) => (
                                <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-3 px-6 text-left whitespace-nowrap">
                                        {item.medicine}
                                    </td>
                                    {/* Editable Quantity Field */}
                                    <td className="py-3 px-6 text-left">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                min="0"
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                                className="w-20 p-1 border border-gray-300 rounded-md text-center font-medium focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap">
                                                {item.tag}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-6 text-left">
                                        {formatCurrency(item.unitPrice)}
                                    </td>
                                    <td className="py-3 px-6 text-right font-medium">
                                        {formatCurrency(item.total)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Note/Signature Section */}
                <div className="mt-10 pt-4 border-t border-gray-200 text-sm text-gray-500">
                    <p>Thank you for your business. Payment can be settled using cash, card, or UPI. Amount Due: <span className="font-semibold text-red-600">{formatCurrency(amountDue)}</span></p>
                </div>
            </div>
        </div>
    );
};

export default App;
