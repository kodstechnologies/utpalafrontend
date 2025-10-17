import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { toggleSidebar } from '../../store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { IRootState } from '../../store';
import { useState, useEffect, useMemo } from 'react';
import IconCaretsDown from '../Icon/IconCaretsDown';
import IconCaretDown from '../Icon/IconCaretDown';
import IconMenuDashboard from '../Icon/Menu/IconMenuDashboard';
import IconMenuUsers from '../Icon/Menu/IconMenuUsers';
import IconMenuPages from '../Icon/Menu/IconMenuPages';
import IconUsers from '../Icon/IconUsers';
import IconMenuForms from '../Icon/Menu/IconMenuForms';
import { Layers } from 'lucide-react';
import { ClipboardCheck } from "lucide-react";
import { Stethoscope } from "lucide-react";
import { CalendarClock } from "lucide-react";
import { PackagePlus } from "lucide-react";
import IconCalendar from '../Icon/IconCalendar';
import IconMenuInvoice from '../Icon/Menu/IconMenuInvoice';
import IconCreditCard from '../Icon/IconCreditCard';
import IconReport from '../Icon/IconFile';
import IconHeart from '../Icon/IconHeart';
import IconLogout from '../Icon/IconLogout';
import IconNotes from '../Icon/IconNotes';
import IconFile from '../Icon/IconFile';


const Sidebar = () => {
    const [currentMenu, setCurrentMenu] = useState<string | null>(null);
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const location = useLocation();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const toggleMenu = (menu: string) => {
        setCurrentMenu(prev => (prev === menu ? null : menu));
    };


    useEffect(() => {
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }
    }, []);

    const isUserManagementActive = useMemo(
        () => location.pathname.startsWith('/user-management'),
        [location.pathname]
    );

    const isConsultationActive = useMemo(
        () => location.pathname.startsWith('/consultation-scheduling'),
        [location.pathname]
    );

    const isReportsActive = useMemo(
        () => location.pathname.startsWith('/reports-analytics'),
        [location.pathname]
    );


    useEffect(() => {
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);
    const userrole: string = 'therapist'; // This should be fetched from user state or context
    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-50 transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
            >
                <div className="bg-white dark:bg-black h-full">
                    <div className="flex justify-between items-center px-4 py-3">
                        <NavLink to="/" className="main-logo flex items-center shrink-0">
                            <img className="w-[150px] ml-[5px] flex-none" src="/assets/images/logo.webp" alt="logo" />
                            {/* <span className="text-2xl ltr:ml-1.5 rtl:mr-1.5 font-semibold align-middle lg:inline dark:text-white-light">{t('VRISTO')}</span> */}
                        </NavLink>

                        <button
                            type="button"
                            className="collapse-icon w-8 h-8 rounded-full flex items-center hover:bg-gray-500/10 dark:hover:bg-dark-light/10 dark:text-white-light transition duration-300 rtl:rotate-180"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <IconCaretsDown className="m-auto rotate-90" />
                        </button>
                    </div>
                    <PerfectScrollbar className="h-[calc(100vh-80px)] relative">
                        {userrole === 'admin' && (
                            <ul className="relative font-semibold space-y-0.5 p-4 py-0">
                                <li className="menu nav-item">
                                    <NavLink to="/">
                                        <button
                                            type="button"
                                            className={`${currentMenu === 'dashboard' || location.pathname === '/' ? 'active' : ''} nav-link group w-full`}
                                            onClick={() => toggleMenu('dashboard')}
                                        >
                                            <div className="flex items-center">
                                                <IconMenuDashboard
                                                    className={`${currentMenu === 'dashboard' || location.pathname === '/' ? '!text-green-600' : 'group-hover:!text-green-600'} shrink-0`}
                                                />
                                                <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                                                    {t('dashboard')}
                                                </span>
                                            </div>
                                        </button>
                                    </NavLink>
                                </li>

                                <li className="menu nav-item">
                                    <button
                                        type="button"
                                        className={`${currentMenu === 'User Management' ? 'active' : ''} nav-link group w-full`}
                                        onClick={() => toggleMenu('User Management')}
                                    >
                                        <div className="flex items-center">
                                            <IconUsers
                                                className={`${currentMenu === 'User Management' || isUserManagementActive ? '!text-green-600' : 'group-hover:!text-green-600'} shrink-0`}
                                            />
                                            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('User Management')}</span>
                                        </div>

                                        <div className={currentMenu === 'User Management' ? '' : 'rtl:rotate-90 -rotate-90'}>
                                            <IconCaretDown />
                                        </div>
                                    </button>

                                    <AnimateHeight duration={300}
                                        height={currentMenu === 'User Management' ? 'auto' : 0}>
                                        <ul className="sub-menu text-gray-500">
                                            <li>
                                                <NavLink to="/user-management/doctors">{t('Doctors')}</NavLink>
                                            </li>
                                            <li>
                                                <NavLink to="/user-management/nurses">{t('Nurses')}</NavLink>
                                            </li>
                                            <li>
                                                <NavLink to="/user-management/receptionists">{t('Receptionists')}</NavLink>
                                            </li>
                                            <li>
                                                <NavLink to="/user-management/pharmacists">{t('Pharmacists')}</NavLink>
                                            </li>
                                            <li>
                                                <NavLink to="/user-management/therapists">{t('Therapists')}</NavLink>
                                            </li>
                                            <li>
                                                <NavLink to="/user-management/patients">{t('Patients')}</NavLink>
                                            </li>
                                        </ul>
                                    </AnimateHeight>
                                </li>

                                {/* <li className="menu nav-item">
                                    <NavLink to="/ward-category">
                                        <button
                                            type="button"
                                            className={`${currentMenu === 'Ward & Category' || location.pathname === '/ward-category' ? 'active' : ''} nav-link group w-full`}
                                            onClick={() => toggleMenu('Ward & Category')}
                                        >
                                            <div className="flex items-center">
                                                <Layers
                                                    className={`${currentMenu === 'Ward & Category' || location.pathname === '/ward-category' ? '!text-green-600' : 'group-hover:!text-green-600'} shrink-0`}
                                                />
                                                <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                                                    {t('Ward & Category')}
                                                </span>
                                            </div>
                                        </button>
                                    </NavLink>
                                </li> */}

                                <li className="menu nav-item">
                                    <NavLink to="/treatment-therapy">
                                        <button
                                            type="button"
                                            className={`${currentMenu === 'Treatment & Therapy' || location.pathname === '/treatment-therapy' ? 'active' : ''} nav-link group w-full`}
                                            onClick={() => toggleMenu('Treatment & Therapy')}
                                        >
                                            <div className="flex items-center">
                                                <Stethoscope
                                                    className={`${currentMenu === 'Treatment & Therapy' || location.pathname === '/treatment-therapy' ? '!text-green-600' : 'group-hover:!text-green-600'} shrink-0`}
                                                />
                                                <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                                                    {t('Treatment & Therapy')}
                                                </span>
                                            </div>
                                        </button>
                                    </NavLink>
                                </li>

                                <li className="menu nav-item">
                                    <button
                                        type="button"
                                        className={`${currentMenu === 'Consultation & Scheduling' ? 'active' : ''} nav-link group w-full`}
                                        onClick={() => toggleMenu('Consultation & Scheduling')}
                                    >
                                        <div className="flex items-center">
                                            <CalendarClock
                                                className={`${currentMenu === 'Consultation & Scheduling' || isConsultationActive ? '!text-green-600' : 'group-hover:!text-green-600'} shrink-0`}
                                            />
                                            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Consultation & Scheduling')}</span>
                                        </div>

                                        <div className={currentMenu === 'Consultation & Scheduling' ? '' : 'rtl:rotate-90 -rotate-90'}>
                                            <IconCaretDown />
                                        </div>
                                    </button>

                                    <AnimateHeight duration={300}
                                        height={currentMenu === 'Consultation & Scheduling' ? 'auto' : 0}>
                                        <ul className="sub-menu text-gray-500">
                                            <li>
                                                <NavLink to="/consultation-scheduling/slot">{t('Add Slot')}</NavLink>
                                            </li>
                                            <li>
                                                <NavLink to="/consultation-scheduling/doctors">{t('Assign Doctor')}</NavLink>
                                            </li>
                                        </ul>
                                    </AnimateHeight>
                                </li>

                                {/* <li className="menu nav-item">
                                    <NavLink to="/billing-discharge">
                                        <button
                                            type="button"
                                            className={`${currentMenu === 'Billing & Discharge' || location.pathname === '/billing-discharge' ? 'active' : ''} nav-link group w-full`}
                                            onClick={() => toggleMenu('Billing & Discharge')}
                                        >
                                            <div className="flex items-center">
                                                <ClipboardCheck
                                                    className={`${currentMenu === 'Billing & Discharge' || location.pathname === '/billing-discharge' ? '!text-green-600' : 'group-hover:!text-green-600'} shrink-0`}
                                                />
                                                <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                                                    {t('Billing & Discharge')}
                                                </span>
                                            </div>
                                        </button>
                                    </NavLink>
                                </li> */}

                                <li className="menu nav-item">
                                    <NavLink to="/pharmacy-inventory">
                                        <button
                                            type="button"
                                            className={`${currentMenu === 'Pharmacy & Inventory' || location.pathname === '/pharmacy-inventory' ? 'active' : ''} nav-link group w-full`}
                                            onClick={() => toggleMenu('Pharmacy & Inventory')}
                                        >
                                            <div className="flex items-center">
                                                <PackagePlus
                                                    className={`${currentMenu === 'Pharmacy & Inventory' || location.pathname === '/pharmacy-inventory' ? '!text-green-600' : 'group-hover:!text-green-600'} shrink-0`}
                                                />
                                                <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                                                    {t('Pharmacy & Inventory')}
                                                </span>
                                            </div>
                                        </button>
                                    </NavLink>
                                </li>

                                <li className="menu nav-item">
                                    <button
                                        type="button"
                                        className={`${currentMenu === 'Reports & Analytics' ? 'active' : ''} nav-link group w-full`}
                                        onClick={() => toggleMenu('Reports & Analytics')}
                                    >
                                        <div className="flex items-center">
                                            <CalendarClock
                                                className={`${currentMenu === 'Reports & Analytics' || isReportsActive ? '!text-green-600' : 'group-hover:!text-green-600'} shrink-0`}
                                            />
                                            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Reports & Analytics')}</span>
                                        </div>

                                        <div className={currentMenu === 'Reports & Analytics' ? '' : 'rtl:rotate-90 -rotate-90'}>
                                            <IconCaretDown />
                                        </div>
                                    </button>

                                    <AnimateHeight duration={300}
                                        height={currentMenu === 'Reports & Analytics' ? 'auto' : 0}>
                                        <ul className="sub-menu text-gray-500">
                                            <li>
                                                <NavLink to="/reports-analytics/admissions">{t('Admissions Report')}</NavLink>
                                            </li>
                                            <li>
                                                <NavLink to="/reports-analytics/discharges">{t('Discharges Report')}</NavLink>
                                            </li>
                                        </ul>
                                    </AnimateHeight>
                                </li>
                            </ul>
                        )}
                        {userrole === 'doctor' && (
                            <ul className="relative font-semibold space-y-0.5 p-4 py-0">
                                <li className="menu nav-item">
                                    <NavLink to="/">
                                        <button type="button" className={`${currentMenu === 'dashboard' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('dashboard')}>
                                            <div className="flex items-center">
                                                <IconMenuDashboard className="group-hover:!text-green-500 shrink-0" />
                                                <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('dashboard')}</span>
                                            </div>
                                        </button>
                                    </NavLink>
                                </li>
                                <li className="menu nav-item">
                                    <NavLink to="/my-patients" className="nav-link group">
                                        <div className="flex items-center">
                                            <IconMenuUsers className="group-hover:!text-green-500 shrink-0" />
                                            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('My Patients')}</span>
                                        </div>
                                    </NavLink>
                                </li>
                                <li className="menu nav-item">
                                    <NavLink to="/prescription" className="nav-link group">
                                        <div className="flex items-center">
                                            <IconMenuForms className="group-hover:!text-green-500 shrink-0" />
                                            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Prescription')}</span>
                                        </div>
                                    </NavLink>
                                </li>
                                <li className="menu nav-item">
                                    <NavLink to="/treatments" className="nav-link group">
                                        <div className="flex items-center">
                                            <IconMenuPages className="group-hover:!text-green-500 shrink-0" />
                                            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Threatment')}</span>
                                        </div>
                                    </NavLink>
                                </li>
                                <li className="menu nav-item">
                                    <NavLink to="/next-visit" className="nav-link group">
                                        <div className="flex items-center">
                                            <IconCalendar className="group-hover:!text-green-500 shrink-0" />
                                            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Schedule next visit')}</span>
                                        </div>
                                    </NavLink>
                                </li>
                                {/* <li className="menu nav-item">
                                    <NavLink to="/discharge-summary" className="nav-link group">
                                        <div className="flex items-center">
                                            <IconFile className="group-hover:!text-green-500 shrink-0" />
                                            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Discharge Summary')}</span>
                                        </div>
                                    </NavLink>
                                </li> */}


                            </ul>
                        )}
                        {userrole === 'pharmacist' && (
                            <ul className="relative font-semibold space-y-0.5 p-4 py-0">
                                <li className="menu nav-item">
                                    <NavLink to="/">
                                        <button type="button" className={`${currentMenu === 'dashboard' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('dashboard')}>
                                            <div className="flex items-center">
                                                <IconMenuDashboard className="group-hover:!text-green-500 shrink-0" />
                                                <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('dashboard')}</span>
                                            </div>
                                        </button>
                                    </NavLink>
                                </li>
                                <li className="menu nav-item">
                                    <NavLink to="/prescriptions" className="nav-link group">
                                        <div className="flex items-center">
                                            <IconNotes className="group-hover:!text-green-500 shrink-0" />
                                            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Prescriptions')}</span>
                                        </div>
                                    </NavLink>
                                </li>
                                <li className="menu nav-item">
                                    <NavLink to="/inventory" className="nav-link group">
                                        <div className="flex items-center">
                                            <IconCreditCard className="group-hover:!text-green-500 shrink-0" />
                                            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Inventory')}</span>
                                        </div>
                                    </NavLink>
                                </li>
                                <li className="menu nav-item">
                                    <NavLink to="/invoice" className="nav-link group">
                                        <div className="flex items-center">
                                            <IconMenuInvoice className="group-hover:!text-green-500 shrink-0" />
                                            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Invoice')}</span>
                                        </div>
                                    </NavLink>
                                </li>


                            </ul>
                        )}
                        {userrole === 'nurse' && (
                            <ul className="relative font-semibold space-y-0.5 p-4 py-0">
                                <li className="menu nav-item">
                                    <NavLink to="/" className="nav-link group">
                                        <div className="flex items-center">
                                            <IconMenuDashboard className="group-hover:!text-green-500 shrink-0" />
                                            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Dashboard')}</span>
                                        </div>
                                    </NavLink>
                                </li>
                                <li className="menu nav-item">
                                    <NavLink to="/admissions" className="nav-link group">
                                        <div className="flex items-center">
                                            <IconUsers className="group-hover:!text-green-500 shrink-0" />
                                            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Admissions')}</span>
                                        </div>
                                    </NavLink>
                                </li>
                                <li className="menu nav-item">
                                    <NavLink to="/monitoring" className="nav-link group">
                                        <div className="flex items-center">
                                            <IconHeart className="group-hover:!text-green-500 shrink-0" />
                                            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Patient Monitoring')}</span>
                                        </div>
                                    </NavLink>
                                </li>
                                <li className="menu nav-item">
                                    <NavLink to="/discharge" className="nav-link group">
                                        <div className="flex items-center">
                                            <IconLogout className="group-hover:!text-green-500 shrink-0" />
                                            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Discharge Preparation')}</span>
                                        </div>
                                    </NavLink>
                                </li>
                            </ul>
                        )}
                        {userrole === 'patient' && (
                            <ul className="relative font-semibold space-y-0.5 p-4 py-0">
                                <li className="menu nav-item">
                                    <NavLink to="/" className="nav-link group">
                                        <div className="flex items-center">
                                            <IconMenuDashboard className="group-hover:!text-green-500 shrink-0" />
                                            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Dashboard')}</span>
                                        </div>
                                    </NavLink>
                                </li>
                                <li className="menu nav-item">
                                    <NavLink to="/patient/family" className="nav-link group">
                                        <div className="flex items-center">
                                            <IconUsers className="group-hover:!text-green-500 shrink-0" />
                                            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Family Members')}</span>
                                        </div>
                                    </NavLink>
                                </li>
                                <li className="menu nav-item">
                                    <NavLink to="/patient/consultations" className="nav-link group">
                                        <div className="flex items-center">
                                            <IconNotes className="group-hover:!text-green-500 shrink-0" />
                                            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Consultations')}</span>
                                        </div>
                                    </NavLink>
                                </li>
                                <li className="menu nav-item">
                                    <NavLink to="/patient/prescriptions" className="nav-link group">
                                        <div className="flex items-center">
                                            <IconMenuForms className="group-hover:!text-green-500 shrink-0" />
                                            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Prescriptions')}</span>
                                        </div>
                                    </NavLink>
                                </li>
                                <li className="menu nav-item">
                                    <NavLink to="/patient/therapies" className="nav-link group">
                                        <div className="flex items-center">
                                            <IconCalendar className="group-hover:!text-green-500 shrink-0" />
                                            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Therapies')}</span>
                                        </div>
                                    </NavLink>
                                </li>
                                <li className="menu nav-item">
                                    <NavLink to="/patient/reports" className="nav-link group">
                                        <div className="flex items-center">
                                            <IconReport className="group-hover:!text-green-500 shrink-0" />
                                            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Reports & Investigations')}</span>
                                        </div>
                                    </NavLink>
                                </li>
                            </ul>
                        )}
                        {userrole === 'receptionist' && (
                            <ul className="relative font-semibold space-y-0.5 p-4 py-0">
                                <li className="menu nav-item">
                                    <NavLink to="/" className="nav-link group">
                                        <div className="flex items-center">
                                            <IconMenuDashboard className="group-hover:!text-green-500 shrink-0" />
                                            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Dashboard')}</span>
                                        </div>
                                    </NavLink>
                                </li>
                                <li className="menu nav-item">
                                    <NavLink to="/receptionist/appointments" className="nav-link group">
                                        <div className="flex items-center">
                                            <IconUsers className="group-hover:!text-green-500 shrink-0" />
                                            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Appointment')}</span>
                                        </div>
                                    </NavLink>
                                </li>
                                <li className="menu nav-item">
                                    <NavLink to="/receptionist/payments" className="nav-link group">
                                        <div className="flex items-center">
                                            <IconCreditCard className="group-hover:!text-green-500 shrink-0" />
                                            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Payments')}</span>
                                        </div>
                                    </NavLink>
                                </li>
                                <li className="menu nav-item">
                                    <NavLink to="/receptionist/reports" className="nav-link group">
                                        <div className="flex items-center">
                                            <IconMenuForms className="group-hover:!text-green-500 shrink-0" />
                                            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Reports')}</span>
                                        </div>
                                    </NavLink>
                                </li>
                                {/* <li className="menu nav-item">
                                    <NavLink to="/discharge-summary" className="nav-link group">
                                        <div className="flex items-center">
                                            <IconFile className="group-hover:!text-green-500 shrink-0" />
                                            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Discharge Summary')}</span>
                                        </div>
                                    </NavLink>
                                </li> */}
                            </ul>
                        )}
                        {userrole === 'therapist' && (
                            <ul className="relative font-semibold space-y-0.5 p-4 py-0">
                                <li className="menu nav-item">
                                    <NavLink to="/">
                                        <button type="button" className={`${currentMenu === 'dashboard' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('dashboard')}>
                                            <div className="flex items-center">
                                                <IconMenuDashboard className="group-hover:!text-green-500 shrink-0" />
                                                <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('dashboard')}</span>
                                            </div>
                                        </button>
                                    </NavLink>
                                </li>
                                <li className="menu nav-item">
                                    <NavLink to="/therapist/patient-details" className="nav-link group">
                                        <div className="flex items-center">
                                            <IconMenuUsers className="group-hover:!text-green-500 shrink-0" />
                                            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Patients Details')}</span>
                                        </div>
                                    </NavLink>
                                </li>
                            </ul>
                        )}
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
