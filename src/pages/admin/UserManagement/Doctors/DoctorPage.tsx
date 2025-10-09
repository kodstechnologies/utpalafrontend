import React from 'react';
import DoctorTable from './DoctorTable';
import { useNavigate } from 'react-router-dom';


const DoctorsPage = () => {
    const navigate = useNavigate()
    return (

        <DoctorTable navigate={navigate} />

    );
};

export default DoctorsPage;