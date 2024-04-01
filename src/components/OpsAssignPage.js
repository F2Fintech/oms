import React, { useState } from 'react';

// import FurkanOps from './FurkanOps';
// import AnitaOps from './AnitaOps';
// import AnurandhanOps from './AnurandhanOps';
import OpsAssignNisha from './OpsAssignNisha';

const OpsAssignTo = () => {
    const [selectedAssignee, setSelectedAssignee] = useState(null);

    // Define a function to render the appropriate UI based on the selected assignee
    const renderAssigneeUI = () => {
        switch (selectedAssignee) {
            case 'Nisha':
                return <OpsAssignNisha />;
            // case 'Furkan':
            //     return <FurkanOps />;
            // case 'Anita':
            //     return <AnitaOps />;
            // case 'Anurandhan':
            //     return <AnurandhanOps />;
            default:
                return null;
        }
    };

    return (
        <div>
            {/* UI for selecting assignee */}
            <div>
                <button onClick={() => setSelectedAssignee('Nisha')}>Nisha</button>
                {/* <button onClick={() => setSelectedAssignee('Furkan')}>Furkan</button>
                <button onClick={() => setSelectedAssignee('Anita')}>Anita</button>
                <button onClick={() => setSelectedAssignee('Anurandhan')}>Anurandhan</button> */}
            </div>
            
            {/* Render the UI for the selected assignee */}
            {renderAssigneeUI()}
        </div>
    );
};

export default OpsAssignTo;
