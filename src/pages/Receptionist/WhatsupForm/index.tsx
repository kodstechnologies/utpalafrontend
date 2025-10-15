import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';

const PatientRegistrationForm = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Patient Registration'));
    }, [dispatch]);

    const [formData, setFormData] = useState({
        fullName: '',
        dob: '',
        gender: '',
        contact: '',
        email: '',
        address: '',
        preferredDate: '',
        preferredTime: '',
        notes: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would be an API call to submit the patient's details.
        console.log('Submitting patient details:', formData);
        alert('Thank you! Your details have been submitted. Our receptionist will call you shortly to confirm your appointment.');
        // Here you might redirect to a 'thank you' page or simply clear the form.
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="panel m-6 w-full max-w-lg">
                <div className="flex justify-center mb-6">
                    <img className="w-[150px]" src="/assets/images/logo.webp" alt="logo" />
                </div>
                <h2 className="text-2xl font-bold mb-1 text-center">Patient Registration</h2>
                <p className="text-center text-gray-500 mb-6">Please fill in your details below.</p>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="fullName">Full Name</label>
                        <input id="fullName" name="fullName" type="text" className="form-input" value={formData.fullName} onChange={handleInputChange} required />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label htmlFor="dob">Date of Birth</label>
                            <input id="dob" name="dob" type="date" className="form-input" value={formData.dob} onChange={handleInputChange} required />
                        </div>
                        <div>
                            <label htmlFor="gender">Gender</label>
                            <select id="gender" name="gender" className="form-select" value={formData.gender} onChange={handleInputChange} required>
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label htmlFor="contact">Contact Number</label>
                            <input id="contact" name="contact" type="tel" className="form-input" value={formData.contact} onChange={handleInputChange} required />
                        </div>
                        <div>
                            <label htmlFor="email">Email Address</label>
                            <input id="email" name="email" type="email" className="form-input" value={formData.email} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="address">Address</label>
                        <textarea id="address" name="address" rows={3} className="form-textarea" value={formData.address} onChange={handleInputChange}></textarea>
                    </div>
                    <h3 className="text-lg font-semibold border-t pt-5 mt-5">Appointment Preference</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label htmlFor="preferredDate">Preferred Date</label>
                            <input id="preferredDate" name="preferredDate" type="date" className="form-input" value={formData.preferredDate} onChange={handleInputChange} required />
                        </div>
                        <div>
                            <label htmlFor="preferredTime">Preferred Time Slot</label>
                            <select id="preferredTime" name="preferredTime" className="form-select" value={formData.preferredTime} onChange={handleInputChange} required>
                                <option value="">Select Time</option>
                                <option value="Morning">Morning (9 AM - 12 PM)</option>
                                <option value="Afternoon">Afternoon (1 PM - 4 PM)</option>
                                <option value="Evening">Evening (5 PM - 8 PM)</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-full">
                        Submit Details
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PatientRegistrationForm;