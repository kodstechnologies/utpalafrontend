import React, { useState, useEffect } from "react";

export type ModalMode = "create" | "edit";

export interface FieldConfig {
    name: string;
    label: string;
    type:
    | "text"
    | "email"
    | "number"
    | "date"
    | "select"
    | "textarea"
    | "file"
    | "checkbox"
    | "checkbox-group"
    | "time";
    options?: (string | { value: string; label: string })[];
    required?: boolean;
    disabledInEdit?: boolean;
    accept?: string;
    customRender?: (
        value: any,
        onChange: (value: any) => void,
        mode: ModalMode
    ) => React.ReactNode;
}

export interface GlobalModalProps<T> {
    isOpen: boolean;
    onClose: () => void;
    mode: ModalMode;
    title: string;
    fields: FieldConfig[];
    initialData?: T;
    onSave: (data: T) => void;
}

const GlobalModal = <T extends Record<string, any>>({
    isOpen,
    onClose,
    mode,
    title,
    fields,
    initialData,
    onSave,
}: GlobalModalProps<T>) => {
    const [formData, setFormData] = useState<T>({} as T);
    const [preview, setPreview] = useState<Record<string, string>>({});

    useEffect(() => {
        if (mode === "edit" && initialData) {
            setFormData(initialData);
        } else {
            const emptyData = fields.reduce((acc, field) => {
                acc[field.name] = field.type === "checkbox" ? false : "";
                return acc;
            }, {} as Record<string, any>);
            setFormData(emptyData as T);
        }
    }, [mode, initialData, isOpen, fields]);

    const handleChange = (
        e:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLSelectElement>
            | React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        const { name, value, type, files, checked } = e.target as any;

        if (type === "file" && files && files[0]) {
            const file = files[0];
            setFormData((prev) => ({ ...prev, [name]: file }));

            // Image preview
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview((prev) => ({ ...prev, [name]: reader.result as string }));
                };
                reader.readAsDataURL(file);
            }
        } else if (type === "checkbox") {
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-3xl p-6 shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {mode === "create" ? `Add ${title}` : `Edit ${title}`}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 max-h-[75vh] overflow-y-auto pr-2"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {fields.map((field) => {
                            const value = formData[field.name];
                            const commonProps = {
                                name: field.name,
                                onChange: handleChange,
                                required: field.required,
                                disabled: field.disabledInEdit && mode === "edit",
                                placeholder : field.label,
                            };

                            // ✅ Custom render (for special fields)
                            if (field.customRender) {
                                return (
                                    <div key={field.name}>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            {field.label}
                                        </label>
                                        {field.customRender(value, (v) =>
                                            setFormData((prev) => ({ ...prev, [field.name]: v }))
                                            , mode)}
                                    </div>
                                );
                            }

                            switch (field.type) {
                                case "select":
                                    return (
                                        <div key={field.name}>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                {field.label}
                                            </label>
                                            <select
                                                {...commonProps}
                                                value={value || ""}
                                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-green-500"
                                            >
                                                {field.options?.map((opt) => (
                                                    typeof opt === 'string' 
                                                        ? <option key={opt} value={opt}>{opt}</option>
                                                        : <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    );

                                case "textarea":
                                    return (
                                        <div key={field.name}>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                {field.label}
                                            </label>
                                            <textarea
                                                {...commonProps}
                                                value={value || ""}
                                                rows={7}
                                                placeholder={commonProps.placeholder}
                                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-green-500"
                                            />
                                        </div>
                                    );

                                case "file":
                                    return (
                                        <div key={field.name}>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                {field.label}
                                            </label>
                                            <input
                                                {...commonProps}
                                                type="file"
                                                accept={field.accept || "image/*"}
                                                className="block w-full text-sm text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 focus:outline-none"
                                            />
                                            {preview[field.name] && (
                                                <img
                                                    src={preview[field.name]}
                                                    alt="Preview"
                                                    className="mt-2 w-24 h-24 object-cover rounded-lg border"
                                                />
                                            )}
                                        </div>
                                    );

                                case "checkbox":
                                    return (
                                        <div
                                            key={field.name}
                                            className="flex items-center space-x-2 mt-6"
                                        >
                                            <input
                                                {...commonProps}
                                                type="checkbox"
                                                checked={!!value}
                                                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                            />
                                            <label className="text-sm text-gray-700 dark:text-gray-300">
                                                {field.label}
                                            </label>
                                        </div>
                                    );
                                    case 'checkbox-group':
        // Renders the checkboxes side-by-side
        return (
            <div key={field.name} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {field.label}
                </label>
                
                {/* Side-by-side layout using flex and gap */}
                <div className="flex flex-wrap gap-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border dark:border-gray-600">
                    {/* Iterate over the options array defined in Prescription.tsx */}
                    {field.options?.map((option) => {
                        if (typeof option === 'string') return null; // Or handle string options if needed
                        return (
                        <div key={option.value} className="flex items-center">
                            <input
                                id={`${field.name}-${option.value}`}
                                type="checkbox"
                                // Access the nested value (e.g., formData.dosage.morning)
                                checked={value && value[option.value as keyof typeof value] || false} 
                                
                                onChange={(e) => {
                                    // 1. Create a temporary, updated dosage object
                                    const newDosageState = {
                                        ...value,
                                        [option.value]: e.target.checked, // This line is causing the error
                                    };
                                    // 2. Call the main handler with the parent name ('dosage')
                                    //    and the new nested object value
                                    handleChange({
                                        target: { name: field.name, value: newDosageState } as HTMLInputElement,
                                    } as React.ChangeEvent<HTMLInputElement>);
                                }}
                                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                            />
                            <label 
                                htmlFor={`${field.name}-${option.value}`} 
                                className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                            >
                                {option.label}
                            </label>
                        </div>
                    )
                    })}
                </div>
            </div>
        );
    
    // ... default case or other field types ...

                                default:
                                    return (
                                        <div key={field.name}>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                {field.label}
                                            </label>
                                            <input
                                                {...commonProps}
                                                type={field.type}
                                                value={value || ""}
                                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-green-500"
                                            />
                                        </div>
                                    );
                            }
                        })}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg shadow-md transition font-medium"
                        >
                            {mode === "create" ? "Add" : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GlobalModal;
