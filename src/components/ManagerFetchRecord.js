import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Record.css';

function ManagerFetchRecord() {
  const [managerName, setManagerName] = useState('');
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);

  const managerOptions = [
    'ABHINAV AWAL',
    'DEEPANSHU',
    'F2-FINTECH',
    'HARPREET SINGH',
    'JIYA',
    'NEHA LAKRA',
    'PRASHANT KUMAR',
    'PRADEEP KUMAR',
    'RAJKUMARI',
    'ROZI',
    'SHASHANK SHARMA',
    'SHIVANI',
    'SHUBHAM',
    'SURAJ',
    'TARUN DHIMAN',
    'GROWTH MANAGER'
  ];

  useEffect(() => {
    // Fetch records only if a user is logged in
    if (loggedInUser) {
      fetchRecords();
    }
  }, [loggedInUser]);

  const fetchRecords = async () => {
    try {
      const response = await axios.get(`http://13.232.127.73:5000/api/records/manager/${managerName}`);
      setRecords(response.data);
    } catch (error) {
      setError('Error fetching records');
      console.error('Error fetching records:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!managerName) {
        setError('Please choose a manager.');
        return;
      }

      if (!password) {
        setError('Please provide a password.');
        return;
      }

      const response = await axios.post(`http://13.232.127.73:5000/api/manager/login`, {
        managerName,
        password
      });

      setLoggedInUser(managerName);
    } catch (error) {
      setError('Invalid manager name or password');
      console.error('Error logging in:', error);
    }
  };

  const handleManagerChange = (e) => {
    setManagerName(e.target.value);
  };

  return (
    <div className='track-rec'>
      {!loggedInUser ? (
        <div className='login-form'>
          <h1>Manager Login</h1>
          <form onSubmit={handleSubmit}>
            <select
              value={managerName}
              onChange={handleManagerChange}
            >
              <option value="">Choose Manager</option>
              {managerOptions.map((manager, index) => (
                <option key={index} value={manager}>{manager}</option>
              ))}
            </select>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
          </form>
          {error && <p className='record-err'>{error}</p>}
        </div>
      ) : (
        <div className='track-data'>
          <h1>TRACK BY: { managerName }</h1>
          <table>
            <thead>
              <tr>
                <th>SNO</th>
                <th>Customer Name</th>
                  <th>Employee Name</th>
                  <th>Manager Name</th>
                <th>POC Name</th>
                <th>Login Date</th>
                <th>Login By</th>
                <th>Case Status</th>
                <th>Lender</th>
                <th>Ops Remarks</th>
                <th>Credit Remarks</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr key={index} className={getClassForStatus(record.caseStatus)}>
                  <td>{index + 1}</td>
                  <td>{record.customerName}</td>
                  <td>{record.employeeName}</td>
                  <td>{record.managerName}</td>
                  <td>{record.pocName}</td>
                  <td>{record.loginDate}</td>
                  <td>{record.loginDoneBy}</td>
                  <td>{record.caseStatus}</td>
                  <td>{record.toBeLoggedInFromWhichLender}</td>
                  <td>{record.opsRemarks}</td>
                  <td>{record.creditRemarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function getClassForStatus(caseStatus) {
  switch (caseStatus) {
    case 'DISBURSED':
      return 'disbursed';
    case 'REJECTED':
      return 'rejected';
    case 'HOLD':
      return 'hold';
    case 'DROP':
      return 'drop';
    case 'APPROVED':
      return 'approved';
    default:
      return '';
  }
}

export default ManagerFetchRecord;
