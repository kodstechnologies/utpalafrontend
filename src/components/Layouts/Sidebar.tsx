import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { toggleSidebar } from '../../store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { IRootState } from '../../store';
import { useState, useEffect } from 'react';
import IconCaretsDown from '../Icon/IconCaretsDown';
import IconCaretDown from '../Icon/IconCaretDown';
import IconMenuDashboard from '../Icon/Menu/IconMenuDashboard';
import IconMenuUsers from '../Icon/Menu/IconMenuUsers';
import IconMenuPages from '../Icon/Menu/IconMenuPages';
import IconUsers from '../Icon/IconUsers';
import IconUser from '../Icon/IconUser';
import IconClock from '../Icon/IconClock';
import IconSettings from '../Icon/IconSettings';
import IconMenuNotes from '../Icon/Menu/IconMenuNotes';
import IconMenuMailbox from '../Icon/Menu/IconMenuMailbox';
import IconMenuScrumboard from '../Icon/Menu/IconMenuScrumboard';
import IconMenuContacts from '../Icon/Menu/IconMenuContacts';
import IconMenuInvoice from '../Icon/Menu/IconMenuInvoice';
import IconMenuCalendar from '../Icon/Menu/IconMenuCalendar';
import IconMinus from '../Icon/IconMinus';
import IconMenuComponents from '../Icon/Menu/IconMenuComponents';
import IconMenuForms from '../Icon/Menu/IconMenuForms';

const Sidebar = () => {
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const location = useLocation();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const toggleMenu = (value: string) => {
        setCurrentMenu((oldValue) => {
            return oldValue === value ? '' : value;
        });
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

    useEffect(() => {
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);
    const userrole: string = 'admin'; // This should be fetched from user state or context
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
                                    <button type="button" className={`${currentMenu === 'dashboard' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('dashboard')}>
                                        <div className="flex items-center">
                                            <IconMenuDashboard
                                                className="group-hover:!text-primary shrink-0" />
                                            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark"><NavLink to="/">{t('dashboard')}</NavLink></span>
                                        </div>


                                    </button>

                                </li>

                                <li className="menu nav-item">
                                    <button type="button" className={`${currentMenu === 'component' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('User Management')}>
                                        <div className="flex items-center">
                                            <IconUsers className="group-hover:!text-primary shrink-0" />
                                            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('User Management')}</span>
                                        </div>

                                        <div className={currentMenu !== 'User Management' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                            <IconCaretDown />
                                        </div>
                                    </button>

                                    <AnimateHeight duration={300} height={currentMenu === 'User Management' ? 'auto' : 0}>
                                        <ul className="sub-menu text-gray-500">
                                            <li>
                                                <NavLink to="/user-management/doctor">{t('Doctors')}</NavLink>
                                            </li>
                                            <li>
                                                <NavLink to="/components/accordions">{t('Nurses')}</NavLink>
                                            </li>
                                            <li>
                                                <NavLink to="/components/modals">{t('Receptionsists')}</NavLink>
                                            </li>
                                            <li>
                                                <NavLink to="/components/cards">{t('Pharmacists')}</NavLink>
                                            </li>
                                            <li>
                                                <NavLink to="/components/carousel">{t('Therapists')}</NavLink>
                                            </li>
                                            <li>
                                                <NavLink to="/components/countdown">{t('Patients')}</NavLink>
                                            </li>

                                        </ul>
                                    </AnimateHeight>
                                </li>



                                <h2 className="py-3 px-7 flex items-center uppercase font-extrabold bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] -mx-4 mb-1">
                                    <IconMinus className="w-4 h-5 flex-none hidden" />
                                    <span>{t('apps')}</span>
                                </h2>

                                <li className="nav-item">
                                    <ul>

                                        <li className="nav-item">
                                            <NavLink to="/apps/mailbox" className="group">
                                                <div className="flex items-center">
                                                    <IconMenuMailbox className="group-hover:!text-primary shrink-0" />
                                                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('mailbox')}</span>
                                                </div>
                                            </NavLink>
                                        </li>

                                        <li className="nav-item">
                                            <NavLink to="/apps/notes" className="group">
                                                <div className="flex items-center">
                                                    <IconMenuNotes className="group-hover:!text-primary shrink-0" />
                                                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('notes')}</span>
                                                </div>
                                            </NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink to="/apps/scrumboard" className="group">
                                                <div className="flex items-center">
                                                    <IconMenuScrumboard className="group-hover:!text-primary shrink-0" />
                                                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('scrumboard')}</span>
                                                </div>
                                            </NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink to="/apps/contacts" className="group">
                                                <div className="flex items-center">
                                                    <IconMenuContacts className="group-hover:!text-primary shrink-0" />
                                                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('contacts')}</span>
                                                </div>
                                            </NavLink>
                                        </li>

                                        <li className="menu nav-item">
                                            <button type="button" className={`${currentMenu === 'invoice' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('invoice')}>
                                                <div className="flex items-center">
                                                    <IconMenuInvoice className="group-hover:!text-primary shrink-0" />
                                                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('invoice')}</span>
                                                </div>

                                                <div className={currentMenu !== 'invoice' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                                    <IconCaretDown />
                                                </div>
                                            </button>

                                            <AnimateHeight duration={300} height={currentMenu === 'invoice' ? 'auto' : 0}>
                                                <ul className="sub-menu text-gray-500">
                                                    <li>
                                                        <NavLink to="/apps/invoice/list">{t('list')}</NavLink>
                                                    </li>
                                                    <li>
                                                        <NavLink to="/apps/invoice/preview">{t('preview')}</NavLink>
                                                    </li>
                                                    <li>
                                                        <NavLink to="/apps/invoice/add">{t('add')}</NavLink>
                                                    </li>
                                                    <li>
                                                        <NavLink to="/apps/invoice/edit">{t('edit')}</NavLink>
                                                    </li>
                                                </ul>
                                            </AnimateHeight>
                                        </li>

                                        <li className="nav-item">
                                            <NavLink to="/apps/calendar" className="group">
                                                <div className="flex items-center">
                                                    <IconMenuCalendar className="group-hover:!text-primary shrink-0" />
                                                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('calendar')}</span>
                                                </div>
                                            </NavLink>
                                        </li>
                                    </ul>
                                </li>

                                <h2 className="py-3 px-7 flex items-center uppercase font-extrabold bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] -mx-4 mb-1">
                                    <IconMinus className="w-4 h-5 flex-none hidden" />
                                    <span>{t('user_interface')}</span>
                                </h2>



                                <li className="menu nav-item">
                                    <button type="button" className={`${currentMenu === 'Patient Profiles' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('Patient Profiles')}>
                                        <div className="flex items-center">
                                            <IconUser
                                                className="group-hover:!text-primary shrink-0" />
                                            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark"><NavLink to="/Patient-Profiles">{t('Patient Profiles')}</NavLink></span>
                                        </div>


                                    </button>

                                </li>

                                <li className="menu nav-item">
                                    <button type="button" className={`${currentMenu === 'Activity Logs' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('Activity Logs')}>
                                        <div className="flex items-center">
                                            <IconClock
                                                className="group-hover:!text-primary shrink-0" />
                                            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark"><NavLink to="/Patient-Profiles">{t('Activity Logs')}</NavLink></span>
                                        </div>


                                    </button>

                                </li>


                            </ul>
                        )}
                        {userrole === 'doctor' && (
                            <ul className="relative font-semibold space-y-0.5 p-4 py-0">
                                <li className="menu nav-item">
                                    <button type="button" className={`${currentMenu === 'dashboard' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('dashboard')}>
                                        <div className="flex items-center">
                                            <IconMenuDashboard className="group-hover:!text-primary shrink-0" />
                                            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark"><NavLink to="/">{t('dashboard')}</NavLink></span>
                                        </div>
                                    </button>
                                </li>
                                <li className="menu nav-item">
                                    <NavLink to="/my-patients" className="nav-link group">
                                        <div className="flex items-center">
                                            <IconMenuUsers className="group-hover:!text-primary shrink-0" />
                                            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('My Patients')}</span>
                                        </div>
                                    </NavLink>
                                </li>
                                <li className="menu nav-item">
                                    <NavLink to="/prescription" className="nav-link group">
                                        <div className="flex items-center">
                                            <IconMenuForms className="group-hover:!text-primary shrink-0" />
                                            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Prescription')}</span>
                                        </div>
                                    </NavLink>
                                </li>
                                <li className="menu nav-item">
                                    <NavLink to="/settings" className="nav-link group">
                                        <div className="flex items-center">
                                            <IconMenuPages className="group-hover:!text-primary shrink-0" />
                                            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('settings')}</span>
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
