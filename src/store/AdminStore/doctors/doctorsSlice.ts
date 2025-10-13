import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';

// 1. Define the interfaces to match your component's structure
export interface Doctor {
    id: string; // Use string for IDs for consistency with nanoid
    name: string;
    email: string;
    specialization: string;
    status: 'Active' | 'Inactive' | 'On Leave' | 'Pending';
    licenseNumber?: string;
    dob?: string;
    gender?: string;
    department?: string;
    joiningDate?: string;
}

// Data shape coming from the modal form
export type DoctorFormData = Omit<Doctor, 'id' | 'name' | 'status'> & {
    firstName: string;
    lastName: string;
};

interface DoctorsState {
    doctors: Doctor[];
}

// 2. Use your dummy data as the initial state
const initialState: DoctorsState = {
    doctors: [
        // Note: I've converted numeric IDs to strings to be consistent with new entries
        { id: '1', name: 'Dr. Kavita Rao', email: 'k.rao@veda.com', specialization: 'Internal Medicine', status: 'Active', licenseNumber: 'MED-1001', dob: '1985-06-15', gender: 'Female', department: 'General Medicine', joiningDate: '2010-08-01' },
        { id: '2', name: 'Dr. Suresh Verma', email: 's.verma@veda.com', specialization: 'Wellness Therapy', status: 'Active', licenseNumber: 'MED-1002', dob: '1990-11-20', gender: 'Male', department: 'Therapy Unit', joiningDate: '2015-05-10' },
        { id: '3', name: 'Dr. Anjali Puri', email: 'anjali.p@veda.com', specialization: 'Gynecology', status: 'Inactive', licenseNumber: 'MED-1003', dob: '1978-03-05', gender: 'Female', department: 'Women’s Health', joiningDate: '2005-01-20' },
        { id: '4', name: 'Dr. Deepak Sharma', email: 'd.sharma@veda.com', specialization: 'Surgery', status: 'Active', licenseNumber: 'MED-1004', dob: '1995-09-25', gender: 'Male', department: 'Surgical Care', joiningDate: '2018-03-15' },
        { id: '5', name: 'Dr. Preeti Das', email: 'preeti.d@veda.com', specialization: 'Pediatrics', status: 'Pending', licenseNumber: 'MED-1005', dob: '1982-07-12', gender: 'Female', department: 'Child Health', joiningDate: '2012-07-01' },
    ],
};

const doctorsSlice = createSlice({
    name: 'doctors',
    initialState,
    reducers: {
        // CREATE
        addDoctor: {
            reducer(state, action: PayloadAction<Doctor>) {
                state.doctors.unshift(action.payload); // Add to the top of the list
            },
            prepare(formData: DoctorFormData) {
                const fullName = `Dr. ${formData.firstName} ${formData.lastName}`;
                return {
                    payload: {
                        id: nanoid(),
                        name: fullName,
                        email: formData.email,
                        specialization: formData.specialization,
                        licenseNumber: formData.licenseNumber,
                        dob: formData.dob,
                        gender: formData.gender,
                        department: formData.department,
                        joiningDate: formData.joiningDate,
                        status: 'Pending', // New doctors start as 'Pending'
                    } as Doctor,
                };
            },
        },

        // UPDATE
        updateDoctor(state, action: PayloadAction<{ id: string, data: DoctorFormData }>) {
            const { id, data } = action.payload;
            const existingDoctor = state.doctors.find((doctor) => doctor.id === id);
            if (existingDoctor) {
                existingDoctor.name = `Dr. ${data.firstName} ${data.lastName}`;
                existingDoctor.specialization = data.specialization;
                existingDoctor.email = data.email;
                existingDoctor.licenseNumber = data.licenseNumber;
                existingDoctor.dob = data.dob;
                existingDoctor.gender = data.gender;
                existingDoctor.department = data.department;
                existingDoctor.joiningDate = data.joiningDate;
            }
        },

        // DELETE
        deleteDoctor(state, action: PayloadAction<string>) {
            const doctorId = action.payload;
            state.doctors = state.doctors.filter((doctor) => doctor.id !== doctorId);
        },
    },
});

export const { addDoctor, updateDoctor, deleteDoctor } = doctorsSlice.actions;
export default doctorsSlice.reducer;
