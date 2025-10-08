
type AdminDashboardStatsCardProps = {
    title: string;
    count: any;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>> | React.ComponentType<{ className?: string }>;
};

export const AdminDashboardStatsCard = ({ title, count, icon: IconComponent }: AdminDashboardStatsCardProps) => {
    return (
        <div className="panel p-4 sm:p-6">
            <div className="flex items-center justify-between">

                <div className="flex items-center min-w-0 pr-2 sm:pr-4">
                    <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 shrink-0 ltr:mr-2 rtl:ml-2 text-blue-500" />
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