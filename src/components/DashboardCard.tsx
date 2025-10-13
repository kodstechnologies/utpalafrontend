type AdminDashboardStatsCardProps = {
    title: string;
    count: any;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>> | React.ComponentType<{ className?: string }>;
};

export const DashboardCard = ({ title, count, icon: IconComponent }: AdminDashboardStatsCardProps) => {
    return (
        <div className="panel p-4 sm:p-6 rounded-xl shadow-lg bg-gradient-to-r from-green-100 to-green-50 dark:from-gray-800 dark:to-gray-700 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center min-w-0 pr-2 sm:pr-4">
                    <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-green-200 dark:bg-green-700 text-green-600 dark:text-green-300 ltr:mr-3 rtl:ml-3">
                        <IconComponent className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <div className="text-base sm:text-xl font-semibold text-gray-700 dark:text-white-light truncate">
                        {title}
                    </div>
                </div>

                <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white ltr:ml-2 rtl:mr-2 sm:ltr:ml-4 sm:rtl:mr-4 shrink-0">
                    {count}
                </div>
            </div>
        </div>
    );
};
