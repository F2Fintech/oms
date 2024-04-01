import React from 'react';
import { useNavigate } from 'react-router-dom';

function OpsAssignTo() {
    const navigate = useNavigate();

    const handleNishaClick = () => {
        navigate('/opsassign/nisha');
    };

    return (
        <div>
            <h1>OpsAssignTo Page</h1>
            <button onClick={handleNishaClick}>Go to Nisha</button>
        </div>
    );
}

export default OpsAssignTo;
