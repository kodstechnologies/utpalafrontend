import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { IRootState } from '../../../store';
import IconEye from '../../../components/Icon/IconEye';


import { useNavigate } from 'react-router-dom';



const MyPatients = () => {
    const dispatch = useDispatch();
   const [patientsData] = useState([
    {
        id: 1,
        name: 'Jay Sharma',
        age: 30,
        gender: 'Male',
        prakruti: 'Vata-Pitta',
        vikruti: 'Vata Imbalance',
        agniType: 'Tikshna',
        condition: 'Diabetes',
        treatmentType: 'Panchakarma - Basti',
        lastVisit: '2025-09-23',
        nextVisit: '2025-10-15',
        paymentStatus: 'Paid'
    },
    {
        id: 2,
        name: 'Vijay Sharma',
        age: 35,
        gender: 'Male',
        prakruti: 'Kapha',
        vikruti: 'Kapha Imbalance',
        agniType: 'Manda',
        condition: 'Hypertension',
        treatmentType: 'Shamana - Herbal Decoction',
        lastVisit: '2025-09-19',
        nextVisit: '2025-10-10',
        paymentStatus: 'Pending'
    },
    {
        id: 3,
        name: 'Ajay Sharma',
        age: 29,
        gender: 'Male',
        prakruti: 'Kapha',
        vikruti: 'Kapha Imbalance',
        agniType: 'Manda',
        condition: 'Obesity',
        treatmentType: 'Shamana - Herbal Powder',
        lastVisit: '2025-09-18',
        nextVisit: '2025-10-12',
        paymentStatus: 'Pending'
    },
    {
        id: 4,
        name: 'Sonia Mehta',
        age: 26,
        gender: 'Female',
        prakruti: 'Pitta-Kapha',
        vikruti: 'Pitta Imbalance',
        agniType: 'Tikshna',
        condition: 'Skin Allergy',
        treatmentType: 'Rasayana - Herbal Tonic',
        lastVisit: '2025-09-25',
        nextVisit: '2025-10-17',
        paymentStatus: 'Paid'
    },
    {
        id: 5,
        name: 'Rahul Verma',
        age: 45,
        gender: 'Male',
        prakruti: 'Vata',
        vikruti: 'Vata Imbalance',
        agniType: 'Vishama',
        condition: 'Arthritis',
        treatmentType: 'Panchakarma - Abhyanga',
        lastVisit: '2025-09-10',
        nextVisit: '2025-10-08',
        paymentStatus: 'Paid'
    },
    {
        id: 6,
        name: 'Priya Nair',
        age: 38,
        gender: 'Female',
        prakruti: 'Pitta',
        vikruti: 'Pitta Imbalance',
        agniType: 'Tikshna',
        condition: 'Migraine',
        treatmentType: 'Shamana - Nasya Therapy',
        lastVisit: '2025-09-30',
        nextVisit: '2025-10-18',
        paymentStatus: 'Pending'
    },
    {
        id: 7,
        name: 'Rohit Deshmukh',
        age: 42,
        gender: 'Male',
        prakruti: 'Vata-Kapha',
        vikruti: 'Kapha Imbalance',
        agniType: 'Manda',
        condition: 'Sinusitis',
        treatmentType: 'Panchakarma - Shirodhara',
        lastVisit: '2025-09-28',
        nextVisit: '2025-10-16',
        paymentStatus: 'Paid'
    },
    {
        id: 8,
        name: 'Neha Kulkarni',
        age: 32,
        gender: 'Female',
        prakruti: 'Pitta-Vata',
        vikruti: 'Vata Imbalance',
        agniType: 'Vishama',
        condition: 'Anxiety & Insomnia',
        treatmentType: 'Panchakarma - Shiro Abhyanga',
        lastVisit: '2025-09-20',
        nextVisit: '2025-10-14',
        paymentStatus: 'Pending'
    },
    {
        id: 9,
        name: 'Arjun Patel',
        age: 50,
        gender: 'Male',
        prakruti: 'Kapha-Vata',
        vikruti: 'Kapha Imbalance',
        agniType: 'Manda',
        condition: 'Respiratory Disorder',
        treatmentType: 'Shamana - Herbal Decoction',
        lastVisit: '2025-09-12',
        nextVisit: '2025-10-09',
        paymentStatus: 'Paid'
    },
    {
        id: 10,
        name: 'Kavita Joshi',
        age: 41,
        gender: 'Female',
        prakruti: 'Pitta',
        vikruti: 'Pitta Imbalance',
        agniType: 'Tikshna',
        condition: 'Acidity',
        treatmentType: 'Shamana - Herbal Churna',
        lastVisit: '2025-09-29',
        nextVisit: '2025-10-19',
        paymentStatus: 'Pending'
    },
    {
        id: 11,
        name: 'Nikhil Reddy',
        age: 37,
        gender: 'Male',
        prakruti: 'Vata',
        vikruti: 'Vata Imbalance',
        agniType: 'Vishama',
        condition: 'Lower Back Pain',
        treatmentType: 'Panchakarma - Kati Basti',
        lastVisit: '2025-09-21',
        nextVisit: '2025-10-13',
        paymentStatus: 'Paid'
    },
    {
        id: 12,
        name: 'Rina Shah',
        age: 29,
        gender: 'Female',
        prakruti: 'Kapha-Pitta',
        vikruti: 'Kapha Imbalance',
        agniType: 'Manda',
        condition: 'PCOD',
        treatmentType: 'Shamana - Herbal Tablets',
        lastVisit: '2025-09-26',
        nextVisit: '2025-10-20',
        paymentStatus: 'Pending'
    }
]);


    const navigate = useNavigate();


    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = patientsData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(patientsData.length / itemsPerPage);

    useEffect(() => {
        dispatch(setPageTitle('My Patients'));
    });
    //bitcoinoption
    const bitcoin: any = {
        series: [
            {
                data: [21, 9, 36, 12, 44, 25, 59, 41, 25, 66],
            },
        ],
        options: {
            chart: {
                height: 45,
                type: 'line',
                sparkline: {
                    enabled: true,
                },
            },
            stroke: {
                width: 2,
            },
            markers: {
                size: 0,
            },
            colors: ['#00ab55'],
            grid: {
                padding: {
                    top: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: () => {
                            return '';
                        },
                    },
                },
            },
            responsive: [
                {
                    breakPoint: 576,
                    options: {
                        chart: {
                            height: 95,
                        },
                        grid: {
                            padding: {
                                top: 45,
                                bottom: 0,
                                left: 0,
                            },
                        },
                    },
                },
            ],
        },
    };

    //ethereumoption
    const ethereum: any = {
        series: [
            {
                data: [44, 25, 59, 41, 66, 25, 21, 9, 36, 12],
            },
        ],
        options: {
            chart: {
                height: 45,
                type: 'line',
                sparkline: {
                    enabled: true,
                },
            },
            stroke: {
                width: 2,
            },
            markers: {
                size: 0,
            },
            colors: ['#e7515a'],
            grid: {
                padding: {
                    top: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: () => {
                            return '';
                        },
                    },
                },
            },
            responsive: [
                {
                    breakPoint: 576,
                    options: {
                        chart: {
                            height: 95,
                        },
                        grid: {
                            padding: {
                                top: 45,
                                bottom: 0,
                                left: 0,
                            },
                        },
                    },
                },
            ],
        },
    };

    //litecoinoption
    const litecoin: any = {
        series: [
            {
                data: [9, 21, 36, 12, 66, 25, 44, 25, 41, 59],
            },
        ],
        options: {
            chart: {
                height: 45,
                type: 'line',
                sparkline: {
                    enabled: true,
                },
            },
            stroke: {
                width: 2,
            },
            markers: {
                size: 0,
            },
            colors: ['#00ab55'],
            grid: {
                padding: {
                    top: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: () => {
                            return '';
                        },
                    },
                },
            },
            responsive: [
                {
                    breakPoint: 576,
                    options: {
                        chart: {
                            height: 95,
                        },
                        grid: {
                            padding: {
                                top: 45,
                                bottom: 0,
                                left: 0,
                            },
                        },
                    },
                },
            ],
        },
    };

    //binanceoption
    const binance: any = {
        series: [
            {
                data: [25, 44, 25, 59, 41, 21, 36, 12, 19, 9],
            },
        ],
        options: {
            chart: {
                height: 45,
                type: 'line',
                sparkline: {
                    enabled: true,
                },
            },
            stroke: {
                width: 2,
            },
            markers: {
                size: 0,
            },
            colors: ['#e7515a'],
            grid: {
                padding: {
                    top: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: () => {
                            return '';
                        },
                    },
                },
            },
            responsive: [
                {
                    breakPoint: 576,
                    options: {
                        chart: {
                            height: 95,
                        },
                        grid: {
                            padding: {
                                top: 45,
                                bottom: 0,
                                left: 0,
                            },
                        },
                    },
                },
            ],
        },
    };

    //tetheroption
    const tether: any = {
        series: [
            {
                data: [21, 59, 41, 44, 25, 66, 9, 36, 25, 12],
            },
        ],
        options: {
            chart: {
                height: 45,
                type: 'line',
                sparkline: {
                    enabled: true,
                },
            },
            stroke: {
                width: 2,
            },
            markers: {
                size: 0,
            },
            colors: ['#00ab55'],
            grid: {
                padding: {
                    top: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: () => {
                            return '';
                        },
                    },
                },
            },
            responsive: [
                {
                    breakPoint: 576,
                    options: {
                        chart: {
                            height: 95,
                        },
                        grid: {
                            padding: {
                                top: 45,
                                bottom: 0,
                                left: 0,
                            },
                        },
                    },
                },
            ],
        },
    };

    //solanaoption
    const solana: any = {
        series: [
            {
                data: [21, -9, 36, -12, 44, 25, 59, -41, 66, -25],
            },
        ],
        options: {
            chart: {
                height: 45,
                type: 'line',
                sparkline: {
                    enabled: true,
                },
            },
            stroke: {
                width: 2,
            },
            markers: {
                size: 0,
            },
            colors: ['#e7515a'],
            grid: {
                padding: {
                    top: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: () => {
                            return '';
                        },
                    },
                },
            },
            responsive: [
                {
                    breakPoint: 576,
                    options: {
                        chart: {
                            height: 95,
                        },
                        grid: {
                            padding: {
                                top: 45,
                                bottom: 0,
                                left: 0,
                            },
                        },
                    },
                },
            ],
        },
    };

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/" className="text-primary hover:underline">
                        Dashboard
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>My Patients</span>
                </li>
            </ul>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 mt-4">
                <div className="card">
                    <div className="card-body p-4">
                        <h3 className="font-bold text-lg mb-2">My Patients</h3>
                    </div>
                </div>
            </div>

            {/* search by name  and filter by treatment type  align at right */}
            <div className="card">
  <div className="card-body p-4">
    {/* Filters and search */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
      <div className="mb-3 sm:mb-0">
        <input
          type="text"
          placeholder="Search by name"
          className="border border-gray-300 rounded-md p-2 mr-2 w-auto"
        />
      </div>
      <div>
        <select className="border border-gray-300 rounded-md p-2">
          <option value="all">All Treatment Types</option>
          <option value="panchakarma">Panchakarma</option>
          <option value="shamana">Shamana</option>
          <option value="rasayana">Rasayana</option>
        </select>
      </div>
    </div>

    {/*  Only table scrolls now */}
<div className="relative">
  <div className="overflow-x-auto custom-scrollbar">
    <table className="min-w-full divide-y divide-gray-200 text-sm">
      <thead className="bg-green-50">
        <tr>
          <th className="px-6 py-3 text-left font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">
            Patient Name
          </th>
          <th className="px-6 py-3 text-left font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">
            Age
          </th>
          <th className="px-6 py-3 text-left font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">
            Prakruti
          </th>
          <th className="px-6 py-3 text-left font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">
            Vikruti
          </th>
          <th className="px-6 py-3 text-left font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">
            Agni Type
          </th>
          <th className="px-6 py-3 text-left font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">
            Condition
          </th>
          <th className="px-6 py-3 text-left font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">
            Treatment Type
          </th>
          <th className="px-6 py-3 text-left font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">
            Last Visit
          </th>
          <th className="px-6 py-3 text-left font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">
            Next Visit
          </th>
          <th className="px-6 py-3 text-left font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">
            Payment
          </th>
          <th className="px-6 py-3 text-center font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {/*  Show only 5 records per page */}
        {currentItems.map((patient) => (
          <tr key={patient.id} className="hover:bg-green-50 transition">
            <td className="px-6 py-4">
              <Link to={`/patients/${patient.id}`} className="text-primary hover:underline font-semibold">
                {patient.name}
              </Link>
            </td>
            <td className="px-6 py-4">{patient.age}</td>
            <td className="px-6 py-4">{patient.prakruti}</td>
            <td className="px-6 py-4">{patient.vikruti}</td>
            <td className="px-6 py-4">{patient.agniType}</td>
            <td className="px-6 py-4">{patient.condition}</td>
            <td className="px-6 py-4">{patient.treatmentType}</td>
            <td className="px-6 py-4">{patient.lastVisit}</td>
            <td className="px-6 py-4">{patient.nextVisit}</td>
            <td className="px-6 py-4">
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  patient.paymentStatus === 'Paid'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {patient.paymentStatus}
              </span>
            </td>
            {/* pass id in view */}
            <td className="px-6 py-4 text-center">
              <div className="flex items-center justify-center gap-4">
                <Link to={`/patients/${patient.id}`} className="text-blue-600 hover:text-blue-800" title="View Patient Details">
                  <IconEye />
                </Link>
                <button type="button" onClick={() => navigate(`/prescription?patientId=${patient.id}`)} className="btn btn-sm btn-outline-green whitespace-nowrap">Start Treatment</button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>



    {/*  Pagination stays fixed, not scrolling */}
   <div className="py-4 flex justify-end">
  <nav
    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
    aria-label="Pagination"
  >
    <button
      onClick={() => paginate(currentPage - 1)}
      disabled={currentPage === 1}
      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
    >
      Previous
    </button>
    {Array.from({ length: totalPages }, (_, i) => (
      <button
        key={i + 1}
        onClick={() => paginate(i + 1)}
        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
          currentPage === i + 1
            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
        }`}
      >
        {i + 1}
      </button>
    ))}
    <button
      onClick={() => paginate(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
    >
      Next
    </button>
  </nav>
</div>

  </div>
</div>

        </div>
    );
};

export default MyPatients;
