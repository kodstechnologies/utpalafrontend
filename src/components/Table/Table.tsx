import React, { useState, SetStateAction, ReactNode } from 'react';


export interface Column<T> {
    Header: string;
    accessor: keyof T;
    Cell?: ({ value, row }: { value: any; row: T }) => ReactNode;
}

interface TableProps<T extends { id: number | string }> {
    columns: Column<T>[];
    data: T[];
    actions?: (row: T) => ReactNode;
    topContent?: ReactNode;
    itemsPerPage?: number;
}

const Table = <T extends { id: number | string }>({
    columns,
    data,
    actions,
    topContent,
    itemsPerPage = 5,
}: TableProps<T>) => {
    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const paginate = (pageNumber: SetStateAction<number>) => setCurrentPage(pageNumber);

    return (
        <div className="panel p-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
            {topContent && (
                <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700 space-y-4 sm:space-y-0">
                    {topContent}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700">
                            {columns.map((column) => (
                                <th key={String(column.accessor)} className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider dark:text-gray-300">
                                    {column.Header}
                                </th>
                            ))}
                            {actions && <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider dark:text-gray-300">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100 dark:bg-gray-800 dark:divide-gray-700">
                        {currentItems.map((row) => (
                            <tr key={row.id} className="hover:bg-green-50/50 dark:hover:bg-gray-700/50 transition duration-150">
                                {columns.map((column) => {
                                    const value = row[column.accessor];
                                    return (
                                        <td key={String(column.accessor)} className="px-6 py-4 whitespace-nowrap text-sm">
                                            {column.Cell ? column.Cell({ value, row }) : (value as ReactNode)}
                                        </td>
                                    );
                                })}
                                {actions && (
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        <div className="flex items-center justify-center space-x-4">{actions(row)}</div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="py-4 px-6 flex justify-between items-center border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {indexOfFirstItem + 1} to {indexOfLastItem > data.length ? data.length : indexOfLastItem} of {data.length} results
                </div>
                {totalPages > 0 && (
                    <nav className="relative z-0 inline-flex rounded-lg shadow-sm" aria-label="Pagination">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-4 py-2 rounded-l-lg border border-gray-300 bg-white text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 transition"
                        >
                            Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => paginate(i + 1)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition duration-150 ${currentPage === i + 1
                                        ? 'z-10 bg-green-500 border-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:border-green-600'
                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-4 py-2 rounded-r-lg border border-gray-300 bg-white text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 transition"
                        >
                            Next
                        </button>
                    </nav>
                )}
            </div>
        </div>
    );
};

export default Table;