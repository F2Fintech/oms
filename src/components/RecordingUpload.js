import React, { useState } from 'react';
import axios from 'axios';
import './RecordingUpl.css';

function UploadRecordingForm() {
    const [leadId, setLeadId] = useState('');
    const [empName, setEmpName] = useState('');
    const [customerPan, setCustomerPan] = useState('');
    const [audioFile, setAudioFile] = useState(null);
    const [type, setType] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Sample mapping of employee IDs to names
    const employeeIdToNameMap = {
        // 'F2-369-001': 'Amir Alam',
        // 'F2-369-002': 'MUSKAN',
        'F2-369-189': 'MUSKAN',
        'F2-369-190': 'ADITI',

        // Add more mappings as needed
    };

    const handleFileChange = (event) => {
        setAudioFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        try {
            const formData = new FormData();
            formData.append('leadId', leadId);
            formData.append('empName', empName);
            formData.append('customerPan', customerPan);
            formData.append('type', type);
            formData.append('audio', audioFile);

            const response = await axios.post('http://13.232.127.73:5000/rec', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setSuccessMessage('Recording uploaded successfully!');
            setErrorMessage(''); // Reset error message

            setTimeout(() => {
                window.location.reload(); // Reload the page after 2 seconds
            }, 2000);

            console.log(response.data);
        } catch (error) {
            console.error('Error uploading recording:', error);
            if (error.response && error.response.status === 400) {
                setErrorMessage('This Customer PAN does not exist!!');
                setTimeout(() => {
                    window.location.reload(); // Reload the page after 2 seconds
                }, 2000);
            }
        }
    };

    // Generate options for employee ID dropdown
    const generateEmployeeIdOptions = () => {
        const options = [];
        for (let i = 1; i <= 200; i++) {
            const paddedNumber = i.toString().padStart(3, '0');
            options.push(`F2-369-${paddedNumber}`);
        }
        return options.map((option, index) => (
            <option key={index} value={option}>{option}</option>
        ));
    };

    // Handle employee ID change
    const handleEmployeeIdChange = (e) => {
        const selectedEmployeeId = e.target.value;
        setLeadId(selectedEmployeeId); // Update selected employee ID
        // Update employee name based on selected employee ID
        setEmpName(employeeIdToNameMap[selectedEmployeeId] || '');
    };

    return (
        <div className='upload-form-container'>
            <h1>Upload Audio</h1>
           
            <select value={leadId} onChange={handleEmployeeIdChange}>
                <option value="">Select Employee ID</option>
                {generateEmployeeIdOptions()}
            </select>
            <input type="text" required placeholder="Employee Name" value={empName} onChange={(e) => setEmpName(e.target.value)} readOnly />
            <input type="text" required placeholder="Customer PAN" value={customerPan} onChange={(e) => setCustomerPan(e.target.value)} />
            <label>Choose type:</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="Choose">Choose</option>
                <option value="ops">Ops</option>
                <option value="sales">Sales</option>
                <option value="tvr">TVR</option>
            </select>
            <label htmlFor="fileInput">Upload recording:</label>
            <input type="file" onChange={handleFileChange} />
            {/* <label htmlFor="fileInput">Upload TVR Documents:</label>
            <input type="file" onChange={handleFileChange} /> */}
            <button onClick={handleUpload}>Upload Audio</button>
            {successMessage && <p>{successMessage}</p>}
            {errorMessage && <p className="error">{errorMessage}</p>}
        </div>
    );
}

export default UploadRecordingForm;
