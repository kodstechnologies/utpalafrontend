import React, { useState } from "react";
import { Edit2, Check, X, ArrowRight, DollarSign, List, Zap, Bed, Droplet, Utensils, Users, Shield } from "lucide-react";

// --- Type Definitions ---
type WardCategory = {
    id: number;
    name: string;
    consultation: number;
    therapy: number;
    food: number;
    ward: number;
    benefits: { icon: React.ElementType; text: string }[]; // Updated benefits structure
};

// --- Initial Data ---
const initialData: WardCategory[] = [
    {
        id: 1,
        name: "General Ward",
        consultation: 500,
        therapy: 200,
        food: 100,
        ward: 1000,
        benefits: [
            { icon: Users, text: "Shared Room (4-6 beds)" },
            { icon: Bed, text: "Standard Bed & Facilities" },
            { icon: Utensils, text: "Basic Meal Plan" },
            { icon: Shield, text: "Essential Nursing Care" },
        ],
    },
    {
        id: 2,
        name: "Special Ward",
        consultation: 1000,
        therapy: 500,
        food: 300,
        ward: 3000,
        benefits: [
            { icon: Bed, text: "Private AC Room" },
            { icon: Droplet, text: "Advanced Therapy Access" },
            { icon: Utensils, text: "Custom Diet Plan (Consultant Approved)" },
            { icon: Shield, text: "Dedicated Nursing Attention" },
            { icon: Users, text: "One Visitor Pass" },
        ],
    },
    {
        id: 3,
        name: "Deluxe Suite",
        consultation: 2000,
        therapy: 1000,
        food: 500,
        ward: 5000,
        benefits: [
            { icon: Zap, text: "Luxury Suite with Lounge Area" },
            { icon: Shield, text: "24/7 Personal Attendant & Nurse" },
            { icon: Droplet, text: "Specialist & High-Frequency Consultations" },
            { icon: Utensils, text: "Gourmet Meal Service (A la carte)" },
        ],
    },
];

// --- Component Definition ---
const WardCategoryManagement = () => {
    const [categories, setCategories] = useState<WardCategory[]>(initialData);
    const [editingCell, setEditingCell] = useState<{ rowId: number; field: keyof Omit<WardCategory, 'id' | 'name' | 'benefits'> } | null>(null);
    const [tempValue, setTempValue] = useState<number>(0);
    const [activeView, setActiveView] = useState<Record<number, 'benefits' | 'prices'>>({});

    // --- Utility Functions ---

    const handleEdit = (rowId: number, field: keyof Omit<WardCategory, 'id' | 'name' | 'benefits'>, value: number) => {
        setActiveView((prev) => ({ ...prev, [rowId]: 'prices' }));
        setEditingCell({ rowId, field });
        setTempValue(value);
    };

    const handleSave = () => {
        if (editingCell) {
            setCategories((prev) =>
                prev.map((row) =>
                    row.id === editingCell.rowId ? { ...row, [editingCell.field]: tempValue } : row
                )
            );
            setEditingCell(null);
        }
    };

    const handleCancel = () => setEditingCell(null);

    const toggleCardView = (id: number) => {
        setActiveView((prev) => ({
            ...prev,
            [id]: prev[id] === 'prices' ? 'benefits' : 'prices',
        }));
        if (editingCell?.rowId === id) {
            setEditingCell(null);
        }
    };

    const formatFieldName = (field: keyof Omit<WardCategory, 'id' | 'name' | 'benefits'>) => {
        switch (field) {
            case "ward": return "Ward (Daily) Charge";
            case "consultation": return "Consultation Rate";
            case "therapy": return "Therapy Session Rate";
            case "food": return "Food (Daily) Charge";
            default: return "";
        }
    };

    const isEditing = (cardId: number, field: keyof Omit<WardCategory, 'id' | 'name' | 'benefits'>) =>
        editingCell?.rowId === cardId && editingCell?.field === field;

    // --- Render Functions ---

    const renderPriceContent = (card: WardCategory) => (
        <div className="space-y-4 w-full"> {/* Added w-full */}
            <h4 className="text-lg font-bold text-gray-800 border-b pb-2 mb-2">Price Matrix (₹)</h4>
            {(["ward", "consultation", "therapy", "food"] as (keyof Omit<WardCategory, 'id' | 'name' | 'benefits'>)[]).map((field) => (
                <div
                    key={field}
                    className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                >
                    <span className="text-sm font-medium text-gray-600">
                        {formatFieldName(field)}:
                    </span>
                    {isEditing(card.id, field) ? (
                        <div className="flex items-center space-x-2">
                            <input
                                type="number"
                                value={tempValue}
                                onChange={(e) => setTempValue(Number(e.target.value))}
                                className="w-24 px-2 py-1 border rounded-lg text-lg font-bold text-gray-900 focus:ring-indigo-500"
                                autoFocus
                            />
                            <button onClick={handleSave} className="p-1 rounded-full text-white bg-green-500 hover:bg-green-600 transition" title="Save">
                                <Check size={16} />
                            </button>
                            <button onClick={handleCancel} className="p-1 rounded-full text-white bg-red-500 hover:bg-red-600 transition" title="Cancel">
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <span className="text-xl font-bold text-indigo-600">
                                ₹{card[field].toLocaleString("en-IN")}
                            </span>
                            <button
                                onClick={() => handleEdit(card.id, field, card[field] as number)}
                                className="text-gray-400 hover:text-indigo-600 p-1 rounded-full hover:bg-indigo-50 transition"
                                title="Edit Rate"
                            >
                                <Edit2 size={16} />
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );

    const renderBenefitsContent = (card: WardCategory) => (
        <ul className="space-y-3 w-full"> {/* Added w-full */}
            <h4 className="text-lg font-bold text-gray-800 border-b pb-2 mb-2">Key Benefits</h4>
            {card.benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                    <li key={index} className="flex items-start space-x-3 text-gray-600">
                        <Icon className="flex-shrink-0 w-5 h-5 text-teal-500 mt-1" />
                        <span className="text-base">{benefit.text}</span>
                    </li>
                );
            })}
        </ul>
    );

    // --- Main Render ---

    return (
        <div className="p-4 md:p-6  bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {categories.map((card) => {
                        const isPricesView = activeView[card.id] === 'prices';
                        const cardBg = isPricesView ? "bg-white border-indigo-200 shadow-xl ring-2 ring-indigo-100" : "bg-white/90 border-gray-200 shadow-lg hover:shadow-xl";

                        return (
                            <div
                                key={card.id}
                                className={`flex flex-col rounded-3xl border transition-all duration-500 ease-in-out transform hover:scale-[1.02] ${cardBg}`}
                            >
                                {/* Card Header */}
                                <div className="p-6 text-center border-b border-gray-100">
                                    <Zap className={`w-8 h-8 mx-auto ${isPricesView ? 'text-indigo-600' : 'text-teal-500'} transition-colors duration-500`} />
                                    <h3 className="text-2xl font-extrabold text-gray-900 mt-2">{card.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Daily Ward Charge: <span className="font-bold text-indigo-500">₹{card.ward.toLocaleString("en-IN")}</span>
                                    </p>
                                </div>

                                {/* Card Content (Benefits or Prices) - Fixed height for smooth animation */}
                                <div className="p-6 flex-grow relative overflow-hidden h-64 md:h-72">
                                    {/* Benefits Content */}
                                    <div
                                        className={`absolute p-6 top-0 left-0 right-0 bottom-0 transition-all duration-700 transform ${isPricesView ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"
                                            }`}
                                    >
                                        {renderBenefitsContent(card)}
                                    </div>

                                    {/* Prices Content */}
                                    <div
                                        className={`absolute p-6 top-0 left-0 right-0 bottom-0 transition-all duration-700 transform ${isPricesView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full"
                                            }`}
                                    >
                                        {renderPriceContent(card)}
                                    </div>
                                </div>

                                {/* Footer Button */}
                                <div className="p-6 border-t border-gray-100">
                                    <button
                                        onClick={() => toggleCardView(card.id)}
                                        className={`w-full flex justify-center items-center py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-md ${isPricesView
                                            ? "bg-teal-500 text-white hover:bg-teal-600"
                                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                                            }`}
                                    >
                                        {isPricesView ? (
                                            <>
                                                <List size={20} className="mr-2" /> View Benefits
                                            </>
                                        ) : (
                                            <>
                                                <DollarSign size={20} className="mr-2" /> View & Edit Prices
                                            </>
                                        )}
                                        <ArrowRight size={18} className="ml-2" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default WardCategoryManagement;