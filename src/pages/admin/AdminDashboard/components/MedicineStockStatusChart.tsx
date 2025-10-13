import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const MedicineStockStatusChart = () => {
    const chartSeries = [45, 25, 15, 10, 5];
    const totalStock = chartSeries.reduce((a, b) => a + b, 0);

    const chartOptions: ApexOptions = {
        chart: {
            type: 'donut',
            toolbar: { show: false },
        },
        labels: ['Painkillers', 'Antibiotics', 'Vitamins', 'Supplements', 'Others'],
        colors: ['#3B82F6', '#10B981', '#6B7280', '#F59E0B', '#F97316'],
        dataLabels: {
            enabled: false,
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'light',
                type: 'horizontal',
                shadeIntensity: 0.5,
                gradientToColors: undefined,
                inverseColors: false,
                opacityFrom: 0.85,
                opacityTo: 0.85,
                stops: [0, 100],
            },
        },
        stroke: {
            show: true,
            width: 4,
            colors: ['#fff'],
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '65%',
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontSize: '16px',
                            fontWeight: 600,
                            color: '#374151',
                        },
                        value: {
                            show: true,
                            fontSize: '22px',
                            fontWeight: 700,
                            color: '#111827',
                            formatter: function (val) {
                                return val;
                            },
                        },
                        total: {
                            show: true,
                            label: 'Total',
                            fontSize: '16px',
                            fontWeight: 600,
                            color: '#111827',
                            formatter: function () {
                                return totalStock.toString();
                            },
                        },
                    },
                },
            },
        },
        legend: {
            show: true,
            position: 'bottom',
            horizontalAlign: 'center',
            fontSize: '14px',
            markers: {
                size: 8,
            },
            itemMargin: {
                horizontal: 10,
                vertical: 6,
            },
        },
        responsive: [
            {
                breakpoint: 768,
                options: {
                    chart: { width: '100%' },
                    legend: { position: 'bottom', horizontalAlign: 'center' },
                },
            },
        ],
    };

    return (
        <div className="panel p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-700">
            <div className="mb-6">
                <div className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">Medicine Stock Status</div>
            </div>
            <div className="flex justify-center">
                <Chart options={chartOptions} series={chartSeries} type="donut" height={320} />
            </div>
        </div>
    );
};

export default MedicineStockStatusChart;
