import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

// Icons
import IconMail from "../../../../components/Icon/IconMail";
import IconPhone from "../../../../components/Icon/IconPhone";
import IconCalendar from "../../../../components/Icon/IconCalendar";
import IconUser from "../../../../components/Icon/IconUser";
import IconEdit from "../../../../components/Icon/IconEdit";
import IconDownload from "../../../../components/Icon/IconDownload";
import IconHome from "../../../../components/Icon/IconHome";
import IconListCheck from "../../../../components/Icon/IconListCheck";
import NoDataFound from "../../../../components/NoDataFound";

// --- Data Types and Dummy Data ---
interface Nurse {
  id: number;
  name: string;
  email: string;
  department: string;
  status: "Active" | "On Leave" | "Inactive" | "Training";
  shift: string;
  joiningDate: string;
  phone: string;
  experience: string;
  gender?: string;
}

const DUMMY_NURSES: Nurse[] = [
  {
    id: 1,
    name: "Nurse Priya Menon",
    email: "priya.menon@veda.com",
    department: "Emergency Care",
    status: "Active",
    shift: "Morning",
    joiningDate: "2018-06-12",
    phone: "(91) 98877 11223",
    experience: "7 Years",
    gender: "Female",
  },
  {
    id: 2,
    name: "Nurse Ankit Sharma",
    email: "ankit.sharma@veda.com",
    department: "ICU",
    status: "On Leave",
    shift: "Night",
    joiningDate: "2020-03-05",
    phone: "(91) 97654 33221",
    experience: "4 Years",
    gender: "Male",
  },
];

// --- Helper Components ---
const StatusBadge = ({ status }: { status: Nurse["status"] }) => {
  const colorMap: Record<Nurse["status"], string> = {
    Active: "bg-green-600 text-white dark:bg-green-800 dark:text-green-100",
    "On Leave": "bg-blue-500 text-white dark:bg-blue-700 dark:text-blue-100",
    Inactive: "bg-red-400 text-white dark:bg-red-700 dark:text-red-100",
    Training: "bg-amber-400 text-amber-900 dark:bg-amber-600 dark:text-amber-100",
  };
  return (
    <span
      className={`px-3 py-1 text-sm font-semibold rounded-full shadow-sm ${colorMap[status]}`}
    >
      {status}
    </span>
  );
};

const DetailItem = ({
  icon,
  label,
  value,
  largeText = false,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  largeText?: boolean;
}) => (
  <div className="flex flex-col p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition duration-150 hover:shadow-md">
    <div className="flex items-center space-x-2 mb-1">
      {icon && <div className="text-green-600 dark:text-green-400">{icon}</div>}
      <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400">
        {label}
      </p>
    </div>
    <p
      className={`font-bold text-gray-900 dark:text-white ${
        largeText ? "text-xl" : "text-base"
      }`}
    >
      {value}
    </p>
  </div>
);

// --- Tab Content Components ---
const NurseGeneralInfoTab = ({ nurse }: { nurse: Nurse }) => (
  <div className="space-y-6">
    <h3 className="text-xl font-bold text-gray-800 dark:text-white border-b pb-3 mb-4 border-gray-200 dark:border-gray-700">
      Contact & Personal Details
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DetailItem icon={<IconMail className="w-5 h-5" />} label="Email Address" value={nurse.email} />
      <DetailItem icon={<IconPhone className="w-5 h-5" />} label="Phone Number" value={nurse.phone} />
      <DetailItem icon={<IconUser className="w-5 h-5" />} label="Gender" value={nurse.gender || "N/A"} />
    </div>
  </div>
);

const NurseProfessionalDetailsTab = ({ nurse }: { nurse: Nurse }) => (
  <div className="space-y-6">
    <h3 className="text-xl font-bold text-gray-800 dark:text-white border-b pb-3 mb-4 border-gray-200 dark:border-gray-700">
      Employment & Credentials
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DetailItem icon={<IconUser className="w-5 h-5" />} label="Department" value={nurse.department} largeText={true} />
      <DetailItem icon={<IconUser className="w-5 h-5" />} label="Shift" value={nurse.shift} largeText={true} />
      <DetailItem icon={<IconUser className="w-5 h-5" />} label="Experience" value={nurse.experience} />
      <DetailItem icon={<IconCalendar className="w-5 h-5" />} label="Joining Date" value={nurse.joiningDate} />
    </div>

    <div className="mt-6">
      <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Status Overview</h4>
      <div className="p-5 border border-green-200 dark:border-green-800 rounded-lg bg-green-50 dark:bg-gray-700 shadow-inner flex items-center space-x-4">
        <p className="text-sm font-semibold text-green-700 dark:text-green-300">Current Status:</p>
        <StatusBadge status={nurse.status} />
      </div>
    </div>

    <div>
      <h4 className="text-lg font-semibold text-gray-800 dark:text-white mt-8 mb-3">Summary</h4>
      <div className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-5 rounded-lg border border-gray-200 dark:border-gray-600">
        <p className="leading-relaxed">
          {nurse.name} has been an essential part of the <b>{nurse.department}</b> team for <b>{nurse.experience}</b>. Known for a compassionate and patient-first approach, {nurse.name.split(" ")[1]} ensures the highest standard of care during the {nurse.shift.toLowerCase()} shift.
        </p>
      </div>
    </div>
  </div>
);

// --- Main Component ---
const NurseProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"general" | "professional">("general");

  const nurse = DUMMY_NURSES.find((n) => n.id === parseInt(id || "0"));

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length > 1
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0][0].toUpperCase();
  };

  // Theme colors matching ReceptionistProfile
  const primaryColor = "text-green-600";
  const primaryHover = "hover:text-green-700";
  const avatarBg = "bg-green-100";
  const avatarBorder = "border-green-500";
  const avatarText = "text-green-700";
  const tabActiveClasses = `border-b-4 border-green-600 font-bold ${primaryColor}`;
  const tabInactiveClasses = "border-b-4 border-transparent text-gray-500 hover:text-green-600";

  if (!nurse) {
    return (
      <div className="min-h-[calc(100vh-100px)] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <NoDataFound />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Breadcrumbs */}
      <div className="bg-gray-50 dark:bg-gray-900 py-2 mb-4">
        <ul className="flex space-x-2 text-sm font-medium">
          <li>
            <Link to="/user-management/nurses" className={`${primaryColor} ${primaryHover}`}>
              User Management
            </Link>
          </li>
          <li className="before:content-['/'] before:mx-2 text-gray-500 dark:text-gray-400">
            <Link to="/user-management/nurses" className={`${primaryColor} ${primaryHover}`}>
              Nurses
            </Link>
          </li>
          <li className="before:content-['/'] before:mx-2 text-gray-500 dark:text-gray-400">
            Profile: {nurse.id}
          </li>
        </ul>
      </div>

      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-gray-200 dark:border-gray-700 bg-green-50 dark:bg-gray-900/50">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-5">
              <div
                className={`w-24 h-24 rounded-full ${avatarBg} ${avatarText} flex items-center justify-center text-4xl font-extrabold border-4 ${avatarBorder} shadow-lg`}
              >
                {getInitials(nurse.name)}
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">{nurse.name}</h1>
                <div className="flex items-center space-x-3 mt-1">
                  <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">{nurse.department}</p>
                  <span className="text-gray-400 dark:text-gray-600">•</span>
                  <p className={`text-lg font-semibold ${primaryColor}`}>Shift: {nurse.shift}</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-4 sm:mt-0">
              <button title="Edit Nurse" className="p-3 bg-amber-500 text-white hover:bg-amber-600 rounded-full">
                <IconEdit className="w-5 h-5" />
              </button>
              <button title="Download Profile" className="p-3 bg-green-500 text-white hover:bg-green-600 rounded-full">
                <IconDownload className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 sm:px-8">
          <div className="flex space-x-6 -mb-px">
            <button
              onClick={() => setActiveTab("general")}
              className={`py-4 px-1 text-sm font-medium ${activeTab === "general" ? tabActiveClasses : tabInactiveClasses}`}
            >
              <IconHome className="w-5 h-5 inline mr-2" /> General Info
            </button>
            <button
              onClick={() => setActiveTab("professional")}
              className={`py-4 px-1 text-sm font-medium ${activeTab === "professional" ? tabActiveClasses : tabInactiveClasses}`}
            >
              <IconListCheck className="w-5 h-5 inline mr-2" /> Professional Details
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8 min-h-[400px]">
          {activeTab === "general" ? <NurseGeneralInfoTab nurse={nurse} /> : <NurseProfessionalDetailsTab nurse={nurse} />}
        </div>
      </div>
    </div>
  );
};

export default NurseProfile;
