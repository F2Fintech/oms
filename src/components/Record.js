import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import './Record.css';

function Record() {
  const [employeeIdOfCaseOwner, setEmployeeIdOfCaseOwner] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

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

  const handleUserLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://13.232.127.73:5000/api/login', {
        employeeIdOfCaseOwner,
        password: userPassword
      });
      setLoggedInUser(employeeIdOfCaseOwner);
    } catch (error) {
      setError('Invalid employee ID or password');
      console.error('Error:', error);
    }
  };

  const handleEmployeeIdChange = (e) => {
    setEmployeeIdOfCaseOwner(e.target.value);
  };

  const handleManagerLogin = () => {
    navigate('/mngfetch'); // Navigate to /mngfetch URL
  };

  return (
    <div className='track-rec'>
      {!loggedInUser ? (
        <div className='login-form'>
          <h1>User Login</h1>
          <form onSubmit={handleUserLogin}>
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
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
            />
            <button type="submit">Login</button>
            <button className='mng-button' onClick={handleManagerLogin}>If you are Manager ? Click Here</button> {/* Button for manager login */}
          </form>
          
          

          {error && <p className='record-err'>{error}</p>}
        </div>
      ) : (
        <div className='track-data'>
          <h1>TRACK BY: { employeeIdOfCaseOwner }</h1>
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

function generateEmployeeIdOptions() {
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
  
  // Regular Employees (F2-369)
  options.push(<option key="regular" disabled className="regular">Regular Employees</option>);
  for (let i = 1; i <= 300; i++) {
    const employeeId = `F2-369-${String(i).padStart(3, '0')}`;
    options.push(
      <option key={employeeId} value={employeeId} className="regular-option">
        {employeeId}
      </option>
    );
  }
  
  // Sourcer IDs (F3-369)
  options.push(<option key="sourcer" disabled className="sourcer">Sourcer IDs</option>);
  for (let i = 1; i <= 20; i++) {
    const employeeId = `F3-369-${String(i).padStart(3, '0')}`;
    options.push(
      <option key={employeeId} value={employeeId} className="sourcer-option">
        {employeeId}
      </option>
    );
  }
  
  // Intern IDs (INT-369)
  options.push(<option key="intern" disabled className="intern">Intern IDs</option>);
  for (let i = 1; i <= 100; i++) {
    const employeeId = `INT-369-${String(i).padStart(3, '0')}`;
    options.push(
      <option key={employeeId} value={employeeId} className="intern-option">
        {employeeId}
      </option>
    );
  }
  
  return options;
}

export default Record;
