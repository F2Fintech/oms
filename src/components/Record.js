import React, { useState } from 'react';
import axios from 'axios';
import './Record.css';

function Record() {
  const [employeeIdOfCaseOwner, setEmployeeIdOfCaseOwner] = useState('');
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://13.232.127.73:5000/records/${employeeIdOfCaseOwner}`);
      setRecords(response.data);
    } catch (error) {
      setError('Error fetching records...Please Check you are choosed correct employee id!!');
      console.error('Error fetching records:', error);
    }
  };

  // Function to generate employee ID options
  const generateEmployeeIdOptions = () => {
    
    const options = [];

    // Add roles (SOURCER, CUSTOMER)
    options.push(
      <option key="SOURCER" value="SOURCER">
        SOURCER
      </option>
    );
    
    options.push(
      <option key="CUSTOMER" value="CUSTOMER">
        CUSTOMER
      </option>
    );

    options.push(
      <option key="CHANNEL PARTNER" value="CHANNEL PARTNER">
        CHANNEL PARTNER
      </option>
    );

    options.push(
      <option key="INTERN" value="INTERN">
        INTERN
      </option>
    );
    
    // Add F2-369 employee IDs
    for (let i = 1; i <= 300; i++) {
      const employeeId = `F2-369-${String(i).padStart(3, '0')}`;
      options.push(
        <option key={employeeId} value={employeeId}>
          {employeeId}
        </option>
      );
    }
    
    // Add int-369 employee IDs
    for (let i = 1; i <= 100; i++) {
      const employeeId = `INT-369-${String(i).padStart(3, '0')}`;
      options.push(
        <option key={employeeId} value={employeeId}>
          {employeeId}
        </option>
      );
    }
    
    

    return options;
  };

  return (
    <div className='track-rec'>
      <h1>TRACK RECORDS BY EMPLOYEEID</h1>
      <form onSubmit={handleSubmit}>
        <select
          value={employeeIdOfCaseOwner}
          onChange={(e) => setEmployeeIdOfCaseOwner(e.target.value)}
        >
          <option value="">Choose Employee ID</option>
          {generateEmployeeIdOptions()}
        </select>
        <button className='record-btn' type="submit">Submit</button>
      </form>
      {error  && <p className='record-err'>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>SNO</th>
            <th>Date Of Login</th>
            <th>Customer Name</th>
            <th>Employee Name</th>
            <th>POC Name</th>
            {/*
            <th>City</th>
            <th>Tvr Done By</th>
            <th>Ops Remarks</th> */}
             <th>Login By</th>
            <th>Case Status</th>
            <th>Ops Remarks</th>
            <th>Credit Remarks</th>
            {/* Add more table headers if needed */}
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={index} className={getClassName(record.caseStatus)}>
              <td>{index + 1}</td>
              <td>{record.dateOfLogin}</td>
              <td>{record.customerName}</td>
              <td>{record.employeeName}</td>
              <td>{record.pocName}</td>
              {/*
              <td>{record.state}</td>
              <td>{record.tvrDoneBy}</td>
              <td>{record.opsRemarks}</td> */}
              <td>{record.loginDoneBy}</td>
              <td>{record.caseStatus}</td>
              <td>{record.opsRemarks}</td>
              <td>{record.creditRemarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getClassName(caseStatus) {
  switch (caseStatus) {
    case 'DISBURSED':
    case 'REJECTED':
    case 'DROP':
      return `${caseStatus.toLowerCase()} text-white`;
    case 'HOLD':
      return 'hold';
    case 'APPROVED':
      return 'approved';
    default:
      return '';
  }
}

export default Record;
