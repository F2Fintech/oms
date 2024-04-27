import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Record.css';

function Record() {
  const [employeeIdOfCaseOwner, setEmployeeIdOfCaseOwner] = useState('');
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    // Fetch records only if a user is logged in
    if (loggedInUser) {
      fetchRecords();
    }
  }, [loggedInUser]);

  const fetchRecords = async () => {
    try {
      const response = await axios.get(`http://13.232.127.73:5000/api/records/${employeeIdOfCaseOwner}`);
      setRecords(response.data);
    } catch (error) {
      setError('Error fetching records');
      console.error('Error fetching records:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!employeeIdOfCaseOwner) {
        setError('Please choose an Employee ID.');
        return;
      }

      if (!password) {
        setError('Please provide a password.');
        return;
      }

      const response = await axios.post(`http://13.232.127.73:5000/api/login`, {
        employeeIdOfCaseOwner,
        password
      });

      setLoggedInUser(employeeIdOfCaseOwner);
    } catch (error) {
      setError('Invalid employee ID or password');
      console.error('Error fetching records:', error);
    }
  };

  const handleEmployeeIdChange = (e) => {
    setEmployeeIdOfCaseOwner(e.target.value);
  };

  const generateEmployeeIdOptions = () => {
    const options = [];
    
    // Add roles (CHANNEL PARTNER, SOURCER, INTERN)
    const roles = ['CHANNEL PARTNER', 'SOURCER', 'INTERN'];
    roles.forEach(role => {
      options.push(
        <option key={role} value={role}>
          {role}
        </option>
      );
    });

    // Add F2-369 employee IDs
    for (let i = 1; i <= 300; i++) {
      const employeeId = `F2-369-${String(i).padStart(3, '0')}`;
      options.push(
        <option key={employeeId} value={employeeId}>
          {employeeId}
        </option>
      );
    }
      
    // Add F3-369 sourcer employee IDs
    for (let i = 1; i <= 20; i++) {
      const employeeId = `F3-369-${String(i).padStart(3, '0')}`;
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
      {!loggedInUser ? (
        <div className='login-form'>
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            <select
              value={employeeIdOfCaseOwner}
              onChange={handleEmployeeIdChange}
            >
              <option value="">Choose Employee ID</option>
              {generateEmployeeIdOptions()}
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
          <h1>Tracked Records</h1>
          <table>
            <thead>
             <tr>
                <th>SNO</th>
                <th>Customer Name</th>
                <th>Employee Name</th>
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

export default Record;
