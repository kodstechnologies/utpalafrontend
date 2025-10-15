import React, { useMemo, useState, useEffect,useCallback } from 'react';
// Assuming your generic Table component is imported from a utility path.
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { ChevronLeft, ChevronRight, CalendarDays, Clock, User } from 'lucide-react';

// --- Type Definitions ---
interface CalendarDay {
  day: number;
  isCurrentMonth: boolean;
}

interface StatusMessage {
  text: string;
  type: 'success' | 'error' | 'info' | '';
}

// Mock list of available time slots
const MOCK_TIME_SLOTS: string[] = [
  '09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM',
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
];

// Helper function to get days in a month
const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

// Helper function to get the starting day of the month (0=Sunday, 6=Saturday)
const getStartDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

const App: React.FC = () => {
  // State for the currently viewed month/year in the calendar
  const [currentDate, setCurrentDate] = useState<Date>(new Date()); // Default to today's date
  // State for the user's selected date (Date object)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  // State for the user's selected time slot (string)
  const [selectedTime, setSelectedTime] = useState<string>('');
  // State for the appointment notes (string)
  const [notes, setNotes] = useState<string>('');
  // State for the user search query
  const [searchQuery, setSearchQuery] = useState<string>('');
  // State for the status message (e.g., success/error)
  const [statusMessage, setStatusMessage] = useState<StatusMessage>({ text: '', type: '' });

  const currentYear: number = currentDate.getFullYear();
  const currentMonth: number = currentDate.getMonth();

  // Memoize today's date normalized to midnight for accurate comparison
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // Memoize the calendar days for the current view
  const calendarDays: CalendarDay[] = useMemo(() => {
    const daysInMonth: number = getDaysInMonth(currentYear, currentMonth);
    const startDay: number = getStartDayOfMonth(currentYear, currentMonth);
    const daysArray: CalendarDay[] = [];
     const dispatch = useDispatch();
    
        useEffect(() => {
            dispatch(setPageTitle('Schedule Appointment'));
        }, [dispatch]);

    // Calculate days from previous month to fill the first row
    const prevMonthDays: number = getDaysInMonth(currentYear, currentMonth - 1);
    for (let i = startDay - 1; i >= 0; i--) {
      daysArray.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
      });
    }

    // Days of the current month
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push({
        day: i,
        isCurrentMonth: true,
      });
    }

    // Calculate days from next month to fill the grid (up to 42 cells total)
    let nextDay = 1;
    while (daysArray.length < 42) {
      daysArray.push({
        day: nextDay++,
        isCurrentMonth: false,
      });
    }

    return daysArray;
  }, [currentYear, currentMonth]);

  // Handle month navigation
  const navigateMonth = useCallback((direction: number) => {
    setStatusMessage({ text: '', type: '' });
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + direction);
      return newDate;
    });
  }, []);

  // Handle day click
  const handleDayClick = useCallback((dayNum: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return; // Only allow selection in the current month

    const newSelectedDate = new Date(currentYear, currentMonth, dayNum);
    newSelectedDate.setHours(0, 0, 0, 0); // Normalize for comparison

    // --- PAST DATE PREVENTION LOGIC ---
    if (newSelectedDate < today) {
        setStatusMessage({ text: 'Cannot schedule appointments for past dates.', type: 'error' });
        // Optional: clear selection if they try to click a past date
        if (selectedDate && newSelectedDate.getTime() === selectedDate.getTime()) {
             setSelectedDate(null);
        }
        return;
    }

    setSelectedDate(newSelectedDate);
    // Clear time slot selection when date changes
    setSelectedTime('');
    setStatusMessage({ text: '', type: '' });
  }, [currentYear, currentMonth, today, selectedDate]);

  // Handle form submission
  const handleScheduleAppointment = () => {
    if (!selectedDate || !selectedTime) {
      setStatusMessage({ text: 'Please select both a date and a time.', type: 'error' });
      return;
    }

    // Check if a patient was identified (optional but helpful)
    if (searchQuery.trim() === '') {
        setStatusMessage({ text: 'Warning: Patient/User field is empty.', type: 'info' });
        // If mandatory, you would return here instead of proceeding
    }

    const appointmentDetails = {
      patient: searchQuery.trim() || 'Unknown Patient',
      date: selectedDate.toLocaleDateString(),
      time: selectedTime,
      notes: notes.trim() || 'No specific notes.',
      timestamp: new Date().toISOString(),
    };

    console.log('--- Scheduling Appointment ---', appointmentDetails);
    // In a real application, you would send this to a Firestore/API endpoint.

    // Show success message
    setStatusMessage({
      text: `Appointment scheduled for ${appointmentDetails.patient} on ${appointmentDetails.date} at ${appointmentDetails.time}.`,
      type: 'success'
    });
    // Clear the form after a successful schedule
    handleClearForm();
  };

  // Handle form clear
  const handleClearForm = () => {
    setSelectedDate(null);
    setSelectedTime('');
    setNotes('');
    setSearchQuery('');
    setStatusMessage({ text: '', type: '' });
  };

  const formattedMonth: string = currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  const selectedDateString: string = selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'Select Date';
  const isDateSelected: boolean = selectedDate !== null;

  // Render the calendar header
  const CalendarHeader: React.FC = () => (
    <div className="flex justify-between items-center p-3 border-b border-gray-100">
      <button
        onClick={() => navigateMonth(-1)}
        className="p-1 rounded-full text-gray-500 hover:bg-gray-100 transition"
        aria-label="Previous Month"
      >
        <ChevronLeft size={20} />
      </button>
      <div className="font-semibold text-gray-800 text-lg">
        {formattedMonth}
      </div>
      <button
        onClick={() => navigateMonth(1)}
        className="p-1 rounded-full text-gray-500 hover:bg-gray-100 transition"
        aria-label="Next Month"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );

  // Render the calendar grid
  const CalendarGrid: React.FC = () => (
    <>
      {/* Day Headers (Su, Mo, Tu...) */}
      <div className="grid grid-cols-7 text-xs font-medium text-gray-500 uppercase p-2 pt-0">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day: string) => (
          <div key={day} className="text-center py-2">{day}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 p-2 pt-0 gap-y-2">
        {calendarDays.map((dayObj: CalendarDay, index: number) => {

          // Determine the actual date for comparison
          const calendarDayDate = new Date(currentYear, currentMonth, dayObj.day);
          calendarDayDate.setHours(0, 0, 0, 0); // Normalize to midnight

          // --- PAST DATE CHECK ---
          const isPastDate: boolean = dayObj.isCurrentMonth && calendarDayDate < today;

          const isSelected: boolean = selectedDate
            ? dayObj.isCurrentMonth && selectedDate.getDate() === dayObj.day && selectedDate.getMonth() === currentMonth
            : false;

          const isToday: boolean = dayObj.isCurrentMonth &&
            dayObj.day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear();

          const baseClasses: string = `w-full aspect-square flex items-center justify-center rounded-full text-sm font-medium transition cursor-pointer`;
          let classes: string = '';

          if (dayObj.isCurrentMonth) {
            if (isPastDate) {
                // Style for past dates (disabled, grayed out)
                classes = 'text-gray-400 bg-gray-50 cursor-not-allowed';
            } else if (isSelected) {
              // Selected day style (Green background)
              classes = 'bg-green-600 text-white shadow-lg hover:bg-green-700';
            } else if (isToday) {
              // Today's date (Green border)
              classes = 'text-gray-900 border-2 border-green-500 hover:bg-green-50';
            } else {
              // Normal future day
              classes = 'text-gray-800 hover:bg-gray-100';
            }
          } else {
            // Day from previous/next month (Dimmed)
            classes = 'text-gray-400 cursor-not-allowed';
          }

          return (
            <div key={index} className="flex justify-center items-center">
              <button
                onClick={() => handleDayClick(dayObj.day, dayObj.isCurrentMonth)}
                // Disabled if not current month OR if it's a past date
                disabled={!dayObj.isCurrentMonth || isPastDate}
                className={`${baseClasses} ${classes}`}
                aria-label={`Select ${dayObj.day} of ${formattedMonth}`}
              >
                {dayObj.day}
              </button>
            </div>
          );
        })}
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-[Inter]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 flex items-center">
          <CalendarDays className="mr-3 text-green-600" size={30} />
          Schedule Appointment
        </h1>

        {/* Status Message Area */}
        {statusMessage.text && (
          <div
            className={`p-4 mb-6 rounded-xl font-medium ${
              statusMessage.type === 'success' ? 'bg-green-100 text-green-800' :
              statusMessage.type === 'info' ? 'bg-blue-100 text-blue-800' :
              'bg-red-100 text-red-800'
            }`}
            role="alert"
          >
            {statusMessage.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 1. Calendar Card */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Date</h2>
            <div className="w-full max-w-lg mx-auto">
              <CalendarHeader />
              <CalendarGrid />
            </div>
          </div>

          {/* 2. Appointment Details Form */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Appointment Details</h2>

            {/* Patient/User Search */}
            <div className="mb-6">
              <label htmlFor="userSearch" className="block text-sm font-medium text-gray-700 mb-2">
                Patient/User Name or ID
              </label>
              <div className="relative">
                <input
                  id="userSearch"
                  type="text"
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setSearchQuery(e.target.value);
                    setStatusMessage({ text: '', type: '' });
                  }}
                  placeholder="e.g., Jane Doe or P1001"
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition"
                />
                <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Selected Date Display/Input */}
            <div className="mb-6">
              <label htmlFor="selectedDateInput" className="block text-sm font-medium text-gray-700 mb-2">
                Selected Date
              </label>
              <div className={`flex items-center w-full p-3 border ${isDateSelected ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'} rounded-lg transition`}>
                <CalendarDays className={`mr-2 ${isDateSelected ? 'text-green-600' : 'text-gray-500'}`} size={20} />
                <span className={`font-medium ${isDateSelected ? 'text-green-800' : 'text-gray-500'}`}>
                  {selectedDateString}
                </span>
              </div>
            </div>

            {/* Time Slot Selector */}
            <div className="mb-6">
              <label htmlFor="selectTime" className="block text-sm font-medium text-gray-700 mb-2">
                Select Time Slot
              </label>
              <select
                id="selectTime"
                value={selectedTime}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setSelectedTime(e.target.value);
                  setStatusMessage({ text: '', type: '' });
                }}
                disabled={!isDateSelected}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition disabled:bg-gray-100 disabled:text-gray-500 appearance-none bg-white pr-8"
                style={{ backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="%234B5563"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5em 1.5em' }}
              >
                <option value="" disabled>
                  {isDateSelected ? 'Choose an available time...' : 'Select a date first'}
                </option>
                {MOCK_TIME_SLOTS.map((time: string) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500 flex items-center">
                <Clock size={14} className="mr-1" />
                Time slots are mock data for demonstration.
              </p>
            </div>

            {/* Notes Textarea */}
            <div className="mb-8">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notes / Purpose of Visit
              </label>
              <textarea
                id="notes"
                rows={4}
                value={notes}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
                placeholder="Any specific instructions or reminders for the provider..."
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition resize-none"
              ></textarea>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleClearForm}
                className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold transition shadow-sm"
              >
                Clear Form
              </button>
              <button
                onClick={handleScheduleAppointment}
                disabled={!isDateSelected || !selectedTime}
                className="px-6 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-green-300 font-semibold transition shadow-md"
              >
                Schedule Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
