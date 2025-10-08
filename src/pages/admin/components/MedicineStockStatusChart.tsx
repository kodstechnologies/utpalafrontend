import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const MedicineStockStatusChart = () => {
    const chartSeries = [45, 25, 15, 10, 5];

    const chartOptions: ApexOptions = {
        chart: {
            type: 'donut',
        },
        labels: ['Painkillers', 'Antibiotics', 'Vitamins', 'Supplements', 'Others'],
        colors: ['#3B82F6', '#10B981', '#6B7280', '#F59E0B', '#F97316'],
        dataLabels: {
            enabled: false,
        },

        legend: {
            show: true,
            position: 'bottom',
            horizontalAlign: 'left',
            fontSize: '14px',
            itemMargin: {
                horizontal: 10,
                vertical: 5,
            },
            markers: {
                strokeWidth: 0,
            },
        },

        stroke: {
            show: true,
            width: 0,
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '65%',
                    labels: {
                        show: false,
                    },
                },
            },
        },

        responsive: [
            {
                breakpoint: 768,
                options: {
                    chart: {
                        width: '100%',
                    },
                    legend: {
                        position: 'bottom',
                        horizontalAlign: 'center',
                    },
                },
            },
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: '100%',
                    },
                    legend: {
                        position: 'bottom',
                        horizontalAlign: 'center',
                    },
                },
            },
        ],
    };

    return (
        <div className="grid gap-6 xl:grid-flow-row">
            <div className="panel overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <div className="text-lg font-bold">Medicine Stock Status</div>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center">
                    <div className="w-full md:w-1/2 mx-auto">
                        <Chart
                            options={chartOptions}
                            series={chartSeries}
                            type="donut"
                            height={300}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MedicineStockStatusChart;