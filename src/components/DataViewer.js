import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

import './OpsDataViewer.css';
import NishaPage from './NishaPage';


function OpsDataViewer({ onLogout }) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
    

   
    const [data, setData] = useState([]);
    const [opsData, setOpsData] = useState([]);
    
    const [editIndex, setEditIndex] = useState(null);
    const [editedOpsData, setEditedOpsData] = useState({});
    const [showAssigneeOptions, setShowAssigneeOptions] = useState(false); // State to manage assignee options visibility
    const [selectedAssignee, setSelectedAssignee] = useState(''); // State to store selected assignee
  const [timers, setTimers] = useState({}); // Track timers for each row
  const [fildata, setFilData] = useState([]);
  const [editedDataIndex, setEditedDataIndex] = useState(null);
  const [editedData, setEditedData] = useState({});

   



  // For caselogin form
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://13.232.127.73:5000/data'); // Adjust the URL to your backend API
                console.log(response.data);
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        fetchData();
    }, []);

    // For ops teams form
    useEffect(() => {
      const fetchData = async () => {
          try {
              const response = await axios.get('http://13.232.127.73:5000/opsdata'); // Adjust the URL to your backend API
              console.log(response.data);
              setOpsData(response.data);
          } catch (error) {
              console.error('Error fetching data', error);
          }
      };

      fetchData();
  }, []);


  const handleAssignTo = async (assignee, item, opsData,index) => {
    
    toggleAssigneeOptions();
    let route = '';
  
    try {
      let route = '';
      if (assignee === 'Nisha') {
        route = '/opsassign/nisha';
        startTimer(index);
      } else if (assignee === 'Furkan') {
        route = '/opsassign/furkan';
      } else if (assignee === 'Anit') {
        route = '/opsassign/anit';
      } else if (assignee === 'Anurandhan') {
        route = '/opsassign/anurandhan';
      } else if (assignee === 'Manoj') {
        route = '/opsassign/manoj'
      }
      else if (assignee === 'Muskan') {
        route = '/opsassign/muskan'
      }
      else if (assignee === 'Aaditi') {
        route = '/opsassign/aaditi'
      }
  
      const response = await axios.post(`http://13.232.127.73:5000${route}`, { item, opsData });
      console.log(response.data);

      const updatedOpsData = [...opsData];
        // Update the assigned name for the specific row
        updatedOpsData[index].assignedName = assignee;
        // Update the state
        setOpsData(updatedOpsData);
      
      setSelectedAssignee(assignee);
      localStorage.setItem('selectedAssignee', assignee);
      setShowAssigneeOptions(false);
    } catch (error) {
      console.error(`Error assigning data to ${assignee}`, error);
    }
  
    navigate(route);
  };

  useEffect(() => {
    const storedAssignee = localStorage.getItem('selectedAssignee');
    if (storedAssignee) {
      setSelectedAssignee(storedAssignee);
    }
  }, []);
  

  const toggleAssigneeOptions = () => {
    setShowAssigneeOptions(!showAssigneeOptions);
};

const startTimer = (index) => {
  const timerId = setInterval(() => {
      setTimers(prevTimers => ({
          ...prevTimers,
          [index]: (prevTimers[index] || 0) + 1
      }));
  }, 1000);

   // Clear the timer for the current row if it exists
   if (timers[index]) {
    clearInterval(timers[index]);
}

  setTimers(prevTimers => ({
      ...prevTimers,
      [index]: timerId
  }));
};

// const stopTimer = (index) => {
//   clearInterval(timers[index]);
//   setTimers(prevTimers => ({
//       ...prevTimers,
//       [index]: null
//   }));
// };

  

  
// Filter data for the last 2 days
const currentDate = new Date();
const twoDaysAgo = new Date();
twoDaysAgo.setDate(twoDaysAgo.getDate() - 30);

const filteredData = data.filter(item => {
    const dateOfLogin = new Date(item.dateOfLogin);
    return dateOfLogin >= twoDaysAgo && dateOfLogin <= currentDate;
});



// Zip file download logic
    const handleDownload = async (files) => {
        try {
            const fileNames = files.join(',');
            window.open(`http://13.232.127.73:5000/download-zip?files=${encodeURIComponent(fileNames)}`);
        } catch (error) {
            console.error('Error downloading files', error);
        }
    };

    const handleEdit = (index) => {
      setEditIndex(index);
      setEditedOpsData(opsData[index]);
    };
  
    const handleEditChange = (field, value) => {
      setEditedOpsData({
        ...editedOpsData,
        [field]: value,
      });
    };
  
    // Edit and save button 
    const handleSaveEdit = async (index) => {
      try {
        // Update OpsData in the state
        const updatedOpsData = [...opsData];
        updatedOpsData[index] = editedOpsData;
        setOpsData(updatedOpsData);
  
        // Save the updated OpsData to the backend
        await axios.post('http://13.232.127.73:5000/update-opsdata', editedOpsData); // Adjust the URL to your backend API
  
        // Reset edit index and editedOpsData
        setEditIndex(null);
        setEditedOpsData({});
      } catch (error) {
        console.error('Error saving edit', error);
      }
    };

     // Handle edit and save sales data
     const handleEditData = (index) => {
    setEditedDataIndex(index);
    setEditedData({ ...data[index] });
  };

  const handleEditDataChange = (field, value) => {
    setEditedData({
      ...editedData,
      [field]: value,
    });
  };

  const handleSaveEditedData = async (index) => {
    try {
      const updatedData = [...data];
      updatedData[index] = editedData;
      setFilData(updatedData);

      await axios.post('http://13.232.127.73:5000/update-data', editedData);

      setEditedDataIndex(null);
      setEditedData({});
    } catch (error) {
      console.error('Error saving edit', error);
    }
  };


    // Download all data 
const handleDownloadAllData = async () => {
    try {
        // Combine data and opsData into a single array
        const combinedData = data.map((item, index) => ({
            ...item,
            ...(opsData[index] || {}) // Merge data with opsData if it exists
        }));
        
        // Extract column headers from the first row
        const columnHeaders = Object.keys(combinedData[0]);

        // Convert data to CSV format
        let csvData = '';
        
        // Add column headers
        csvData += columnHeaders.map(header => `"${header}"`).join(',') + '\n';

        // Add rows
        combinedData.forEach(row => {
            csvData += columnHeaders.map(header => `"${row[header] || ''}"`).join(',') + '\n';
        });

        // Create a Blob containing the CSV data
        const blob = new Blob([csvData], { type: 'text/csv' });

        // Create a URL to the Blob
        const url = window.URL.createObjectURL(blob);

        // Create a link element to trigger the download
        const link = document.createElement('a');
        link.href = url;
        link.download = 'all_data.csv';
        document.body.appendChild(link);
        
        // Click the link to start the download
        link.click();

        // Clean up
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading all data', error);
    }
};


  
   // Delete functionality for dataviewer each row

    const handleDelete = async (nishaDataId, nishaOpsDataId, dataIndex, opsDataIndex) => {
        try {
            const isConfirmed = window.confirm('Are you sure you want to submit this row?');
            if (isConfirmed) {
                await axios.delete(`http://13.232.127.73:5000/data/${nishaDataId}`);
                await axios.delete(`http://13.232.127.73:5000/opsdata/${nishaOpsDataId}`);
                
                const updatedNishaData = [...data];
                updatedNishaData.splice(dataIndex, 1);
                setData(updatedNishaData);
                
                const updatedNishaOpsData = [...opsData];
                updatedNishaOpsData.splice(opsDataIndex, 1);
                setOpsData(updatedNishaOpsData);
            }
        } catch (error) {
            console.error('Error deleting data:', error);
        }
  };
  
   
  useEffect(() => {
    setFilData(data);
  }, [data]);

   // Function to handle changes in the search input field
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  // Function to handle changes in the search input field
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filteredResults = data.filter((item) =>
      item.customerPan.toLowerCase().includes(query.toLowerCase())
    );
    setFilData(filteredResults);
  };

  const calculateTotalCalculatedSal = (totalSal, totalExtraIncome) => {
    // Perform your calculation here based on salary and totalExtraIncome
    // For example:
    const totalCalculatedSal = parseFloat(totalSal) + parseFloat(totalExtraIncome);
    return totalCalculatedSal;
  };

  // Filter based on Employee name
  const handleFilterByEmployeeName = () => {
  const employeeName = prompt("Enter Employee Name to filter:");
  if (employeeName !== null && employeeName !== '') {
    // Find all customer PAN numbers associated with the given managerName
    const customerPANs = data.filter(item => item.employeeName === employeeName)
                              .map(item => item.customerPan);

    // Filter main data based on the identified customer PAN numbers
    const filteredData = data.filter(item => customerPANs.includes(item.customerPan));

    // Filter ops data based on matching customer PAN numbers
    const filteredOpsData = opsData.filter(item => customerPANs.includes(item.customerPan));

    // Set filtered data to your UI
    setData(filteredData);
    setOpsData(filteredOpsData); // Assuming you have a method to set opsData in your UI state
  } else {
    // If no manager name is provided, reset the filter
    setData(data);
    setOpsData(opsData); // Reset opsData to its original state
  }
};

const handleFilterByManagerName = () => {
  const managerName = prompt("Enter manager's name to filter:");
  if (managerName !== null && managerName !== '') {
    // Find all customer PAN numbers associated with the given managerName
    const customerPANs = data.filter(item => item.managerName === managerName)
                              .map(item => item.customerPan);

    // Filter main data based on the identified customer PAN numbers
    const filteredData = data.filter(item => customerPANs.includes(item.customerPan));

    // Filter ops data based on matching customer PAN numbers
    const filteredOpsData = opsData.filter(item => customerPANs.includes(item.customerPan));

    // Set filtered data to your UI
    setData(filteredData);
    setOpsData(filteredOpsData); // Assuming you have a method to set opsData in your UI state
  } else {
    // If no manager name is provided, reset the filter
    setData(data);
    setOpsData(opsData); // Reset opsData to its original state
  }
};

// Filter by Customer pan
const handleFilterByCustomerPan = () => {
  const customerPan = prompt("Enter customer pan to filter:");
  if (customerPan !== null && customerPan !== '') {
    // Find all customer PAN numbers associated with the given managerName
    const customerPANs = data.filter(item => item.customerPan === customerPan)
                              .map(item => item.customerPan);

    // Filter main data based on the identified customer PAN numbers
    const filteredData = data.filter(item => customerPANs.includes(item.customerPan));

    // Filter ops data based on matching customer PAN numbers
    const filteredOpsData = opsData.filter(item => customerPANs.includes(item.customerPan));

    // Set filtered data to your UI
    setData(filteredData);
    setOpsData(filteredOpsData); // Assuming you have a method to set opsData in your UI state
  } else {
    // If no manager name is provided, reset the filter
    setData(data);
    setOpsData(opsData); // Reset opsData to its original state
  }
};

// Filter by POC NAME
  const handleFilterByPocName = () => {
  const pocName = prompt("Enter POC name to filter:");
  if (pocName !== null && pocName !== '') {
    // Find all customer PAN numbers associated with the given caseStatus
    const customerPANs = opsData.filter(item => item.pocName === pocName)
                                  .map(item => item.customerPan);

    // Filter main data based on the identified customer PAN numbers
    const filteredData = data.filter(item => customerPANs.includes(item.customerPan));

    // Set filtered data to your UI
    setData(filteredData);

    // Set ops data to your UI
    setOpsData(opsData.filter(item => customerPANs.includes(item.customerPan))); 
    // Assuming you have a method to set opsData in your UI state
  } else {
    // If no case status is provided, reset the filter
    setData(data);
    setOpsData(opsData); // Reset opsData to its original state
  }
  };

// Filter by case status
  const handleFilterByCaseStatus = () => {
  const caseStatus = prompt("Enter Case Status to filter:");
  if (caseStatus !== null && caseStatus !== '') {
    // Find all customer PAN numbers associated with the given caseStatus
    const customerPANs = opsData.filter(item => item.caseStatus === caseStatus)
                                  .map(item => item.customerPan);

    // Filter main data based on the identified customer PAN numbers
    const filteredData = data.filter(item => customerPANs.includes(item.customerPan));

    // Set filtered data to your UI
    setData(filteredData);

    // Set ops data to your UI
    setOpsData(opsData.filter(item => customerPANs.includes(item.customerPan))); 
    // Assuming you have a method to set opsData in your UI state
  } else {
    // If no case status is provided, reset the filter
    setData(data);
    setOpsData(opsData); // Reset opsData to its original state
  }
  };
    
    

    // frontend page for ops teams form
    return (
        <div >
            <div className="header-container">
            
          <button className="logout-btn" onClick={onLogout}>Logout</button>
          
        </div>

        
        
      <div className="nav-bar">
                    <button onClick={() => navigate('/nisha')}>Nisha Page</button>
                    <button onClick={() => navigate('/furkan')}>Furkan Page</button>
                    <button onClick={() => navigate('/anit')}>Anit Page</button>
                    <button onClick={() => navigate('/aaditi')}>Aaditi Page</button>
                    <button onClick={() => navigate('/muskan')}>Muskan Page</button>
                    <button onClick={() => navigate('/manoj')}>Manoj Page</button>
                    <button onClick={() => navigate('/anurandhan')}>Anurandhan Page</button>

                    {/* Add other navigation buttons as needed */}
                </div>
      
                <h2 className="emp-data">Employee Data</h2>

        <div class="outer-wrapper">
    <div class="table-wrapper">

    <table>
          
  <thead>
    
       <th>SNO</th>
      <th>Date of Login</th>
      <th>Employee ID of Case Owner</th>
     <th>
  Employee Name
  {/* Filter icon */}
  <button onClick={() => handleFilterByEmployeeName()}>
   <FontAwesomeIcon icon={faFilter} />
  </button>
</th>
      <th>Employement Type</th>
      <th>
  Manager Name
  {/* Filter icon */}
  <button onClick={() => handleFilterByManagerName()}>
   <FontAwesomeIcon icon={faFilter} />
  </button>
</th>
      <th>Customer Name</th>
      <th>Customer DOB</th>
      <th>Branch Name</th>
      <th>Customer Contact</th>
      <th>Mail ID</th>
                <th>
  Customer Pan
  {/* Filter icon */}
  <button onClick={() => handleFilterByCustomerPan()}>
   <FontAwesomeIcon icon={faFilter} />
  </button>
</th>
                <th>Customer Mother Name</th>
                <th>Nominee</th>
      <th>Customer Permanent Address</th>
      <th>Customer Current Address</th>
      <th>Office Address</th>
      <th>Pin Code</th>
      <th>State</th>
      <th>City</th>
      <th>Customer Occupation</th>
      <th>Required Loan Type</th>
      <th>Required Loan Amount</th>
      <th>Latest CIBIL Score</th>
      <th>Banking Pass and Other Doc Pass</th>
      <th>To Be Logged In From Which Lender</th>
      <th>Remarks</th>
                <th>Documents</th>
                <th>Edit Sales Data</th>
      <th>
  POC Name
  {/* Filter icon */}
  <button onClick={() => handleFilterByPocName()}>
   <FontAwesomeIcon icon={faFilter} />
  </button>
</th>
       <th>Customer Pan</th>
      <th>Login Status</th>
      <th>Login Done By</th>
      <th>Login Date</th>
      <th>Lead Id</th>
      <th>
  Case Status
  {/* Filter icon */}
  <button onClick={() => handleFilterByCaseStatus()}>
   <FontAwesomeIcon icon={faFilter} />
  </button>
</th>
       
      <th>KFS</th>
      <th>Last Update Date</th>
      <th>Approval Date</th>
      <th>Disbursal Date</th>
      <th>Ops Remarks</th>
      <th>Case Pending From</th>
      <th>Banker Name</th>
      <th>Banker Number</th>
      <th>Banker Mail</th>
      <th>CashBack Amount</th>
      <th>Final Approval Amount</th>
     <th>Final Disbursal Amount</th>
      <th>AssignTo</th>
      {/* <th>Assignee Name</th> */}
      <th>Doc Check Status</th>
      <th>Doc Check By</th>
      <th>TVR Status</th>
      <th>TVR Done By</th>
      <th>Eligibility Amount</th>
      <th>Eligibility Type</th>
      <th>Eligibility Check By</th>
      
      <th>High Degree</th>
      <th>Registration Year</th>
      <th>Total Active Loan Count Amount</th>
     
      <th>Bouncing in 6 Months</th>
      <th>Inquiries in 6 Months</th>
      <th>Salary</th>
     <th>Extra Income</th>
     <th>Total Income</th>
     <th>Credit Suggsested Lender</th>
      <th>Credit Remarks</th>
      <th>Edit</th>
      <th>Delete</th>
  </thead>
              <tbody className='t-body'>
                
    {filteredData.map((item, index) => {
      
                let rowColor = "";
                let textColor = "black"; // Default text color
                switch (opsData[index]?.caseStatus) {
                  case "DISBURSED":
                    rowColor = "green-row";
                    textColor = "white"; // Change text color for red background
                    break;
                  case "REJECTED":
                    rowColor = "red-row";
                    textColor = "white"; // Change text color for red background
                    break;
                  case "HOLD":
                    rowColor = "pink-row";
                    break;
                  case "APPROVED":
                    rowColor = "yellow-row";
                    break;
                  case "DROP":
                    rowColor = "purple-row";
                    textColor = "white"; // Change text color for red background
                    break;
                  default:
                    rowColor = "";
                }
                return (
                   <tr key={index} className={rowColor} style={{ color: textColor }}>
        <td>{index + 1}</td>
        <td>
            {/* Editable input field for dateOfLogin */}
            {editedDataIndex === index ? (
                <input
                    type="text"
                    value={editedData.dateOfLogin}
                    onChange={(e) => handleEditDataChange('dateOfLogin', e.target.value)}
                />
            ) : (
                item.dateOfLogin
            )}
        </td>
        <td>
            {/* Editable input field for employeeIdOfCaseOwner */}
            {editedDataIndex === index ? (
                <input
                    type="text"
                    value={editedData.employeeIdOfCaseOwner}
                    onChange={(e) => handleEditDataChange('employeeIdOfCaseOwner', e.target.value)}
                />
            ) : (
                item.employeeIdOfCaseOwner
            )}
        </td>
        <td>
            {/* Editable input field for employeeName */}
            {editedDataIndex === index ? (
                <input
                    type="text"
                    value={editedData.employeeName}
                    onChange={(e) => handleEditDataChange('employeeName', e.target.value)}
                />
            ) : (
                item.employeeName
            )}
        </td>
        <td>
            {/* Editable input field for employementType */}
            {editedDataIndex === index ? (
                <input
                    type="text"
                    value={editedData.employementType}
                    onChange={(e) => handleEditDataChange('employementType', e.target.value)}
                />
            ) : (
                item.employementType
            )}
        </td>
           <td>
    {/* Editable input field for managerName */}
    {editedDataIndex === index ? (
        <input
            type="text"
            value={editedData.managerName}
            onChange={(e) => handleEditDataChange('managerName', e.target.value)}
        />
    ) : (
        item.managerName
    )}
</td>
<td>
    {/* Editable input field for customerName */}
    {editedDataIndex === index ? (
        <input
            type="text"
            value={editedData.customerName}
            onChange={(e) => handleEditDataChange('customerName', e.target.value)}
        />
    ) : (
        item.customerName
    )}
</td>
<td>
    {/* Editable input field for dateOfBirth */}
    {editedDataIndex === index ? (
        <input
            type="date"
            value={editedData.dateOfBirth}
            onChange={(e) => handleEditDataChange('dateOfBirth', e.target.value)}
        />
    ) : (
        item.dateOfBirth
    )}
</td>
        <td>
        {editedDataIndex === index ? (
        <input
            type="text"
            value={editedData.branchName}
            onChange={(e) => handleEditDataChange('branchName', e.target.value)}
        />
    ) : (
        item.branchName
    )}
</td>
        
        
        <td>
        {editedDataIndex === index ? (
        <input
            type="text"
            value={editedData.customerContact}
            onChange={(e) => handleEditDataChange('customerContact', e.target.value)}
        />
    ) : (
        item.customerContact
    )}
</td>
        
        <td>
        {editedDataIndex === index ? (
        <input
            type="text"
            value={editedData.mailId}
            onChange={(e) => handleEditDataChange('mailId', e.target.value)}
        />
    ) : (
        item.mailId
    )}
</td>
        
        
         <td>
        {editedDataIndex === index ? (
        <input
            type="text"
            value={editedData.customerPan}
            onChange={(e) => handleEditDataChange('customerPan', e.target.value)}
        />
    ) : (
        item.customerPan
    )}
</td>
        
        <td>
        {editedDataIndex === index ? (
        <input
            type="text"
            value={editedData.motherName}
            onChange={(e) => handleEditDataChange('motherName', e.target.value)}
        />
    ) : (
        item.motherName
    )}
</td>
        
        <td>
        {editedDataIndex === index ? (
        <input
            type="text"
            value={editedData.nominee}
            onChange={(e) => handleEditDataChange('nominee', e.target.value)}
        />
    ) : (
        item.nominee
    )}
</td>
        
        <td>
        {editedDataIndex === index ? (
        <input
            type="text"
            value={editedData.customerPermanentAddress}
            onChange={(e) => handleEditDataChange('customerPermanentAddress', e.target.value)}
        />
    ) : (
        item.customerPermanentAddress
    )}
</td>
        
        <td>
        {editedDataIndex === index ? (
        <input
            type="text"
            value={editedData.customerCurrentAdd}
            onChange={(e) => handleEditDataChange('customerCurrentAdd', e.target.value)}
        />
    ) : (
        item.customerCurrentAdd
    )}
</td>
        
        <td>
        {editedDataIndex === index ? (
        <input
            type="text"
            value={editedData.officeAddressWithPin}
            onChange={(e) => handleEditDataChange('officeAddressWithPin', e.target.value)}
        />
    ) : (
        item.officeAddressWithPin
    )}
</td>
        
        <td>
        {editedDataIndex === index ? (
        <input
            type="text"
            value={editedData.pinCode}
            onChange={(e) => handleEditDataChange('pinCode', e.target.value)}
        />
    ) : (
        item.pinCode
    )}
</td>
        
        <td>
        {editedDataIndex === index ? (
        <input
            type="text"
            value={editedData.state}
            onChange={(e) => handleEditDataChange('state', e.target.value)}
        />
    ) : (
        item.state
    )}
</td>
       
        <td>
        {editedDataIndex === index ? (
        <input
            type="text"
            value={editedData.city}
            onChange={(e) => handleEditDataChange('city', e.target.value)}
        />
    ) : (
        item.city
    )}
</td>
        
        <td>
        {editedDataIndex === index ? (
        <input
            type="text"
            value={editedData.customerOccupation}
            onChange={(e) => handleEditDataChange('customerOccupation', e.target.value)}
        />
    ) : (
        item.customerOccupation
    )}
</td>
        
        <td>
        {editedDataIndex === index ? (
        <input
            type="text"
            value={editedData.requiredLoanType}
            onChange={(e) => handleEditDataChange('requiredLoanType', e.target.value)}
        />
    ) : (
        item.requiredLoanType
    )}
</td>
       
        <td>
        {editedDataIndex === index ? (
        <input
            type="text"
            value={editedData.requiredLoanAmount}
            onChange={(e) => handleEditDataChange('requiredLoanAmount', e.target.value)}
        />
    ) : (
        item.requiredLoanAmount
    )}
</td>
        
        <td>
        {editedDataIndex === index ? (
        <input
            type="text"
            value={editedData.latestCIBILScore}
            onChange={(e) => handleEditDataChange('latestCIBILScore', e.target.value)}
        />
    ) : (
        item.latestCIBILScore
    )}
</td>
       
         <td>
        {editedDataIndex === index ? (
        <input
            type="text"
            value={editedData.bankingPassAndOtherDocPass}
            onChange={(e) => handleEditDataChange('bankingPassAndOtherDocPass', e.target.value)}
        />
    ) : (
        item.bankingPassAndOtherDocPass
    )}
</td>
        
        <td>
        {editedDataIndex === index ? (
        <input
            type="text"
            value={editedData.toBeLoggedInFromWhichLender}
            onChange={(e) => handleEditDataChange('toBeLoggedInFromWhichLender', e.target.value)}
        />
    ) : (
        item.toBeLoggedInFromWhichLender
    )}
</td>
       
        <td>
        {editedDataIndex === index ? (
        <input
            type="text"
            value={editedData.remarks}
            onChange={(e) => handleEditDataChange('remarks', e.target.value)}
        />
    ) : (
        item.remarks
    )}
</td>
            <td>
                {item.files && item.files.length > 0 ? (
                    <button className='downloadfileops' onClick={() => handleDownload(item.files)}>
                        Download Files
                    </button>
                ) : (
                    <span>No File Available</span>
                )}
            </td>
            <td>
                {editedDataIndex === index ? (
                    <button className='save-btn' onClick={() => handleSaveEditedData(index)}>Save</button>
                ) : (
                    <button className='edit-btn' onClick={() => handleEditData(index)}>Edit</button>
                )}
            </td>

        {opsData[index] && (
                <>
                  {/* ... existing data fields ... */}
                  <td>
  {editIndex === index ? (
    <select
      value={editedOpsData.pocName}
      onChange={(e) => handleEditChange('pocName', e.target.value)}
    >
      <option value="">CHOOSE POC NAME</option>
      <option value="NISHA">NISHA</option>
      <option value="FURKAN">FURKAN</option>
      <option value="MANOJ">MANOJ</option>
      <option value="ANIT">ANIT</option>
      <option value="ANURUNDHAN">ANURUNDHAN</option>
      {/* Add more options as needed */}
    </select>
  ) : (
    opsData[index].pocName
  )}
</td>

  <td>
                        {editIndex === index ? (
                        <input
                          type="text"
                          value={editedOpsData.customerPan}
                          onChange={(e) => handleEditChange('customerPan', e.target.value.toUpperCase())}
                        />
                        ) : (
                        opsData[index].customerPan
                        )}
            </td>
            

            <td>
                      {editIndex === index ? (
                        <input
                          type="text"
                          value={editedOpsData.loginStatus}
                          onChange={(e) => handleEditChange('loginStatus', e.target.value.toUpperCase())}
                        />
                      ) : (
                        opsData[index].loginStatus
                      )}
                    </td>
                    <td>
  {editIndex === index ? (
    <select
      value={editedOpsData.loginDoneBy}
      onChange={(e) => handleEditChange('loginDoneBy', e.target.value)}
    >
      <option value="">Choose login done by</option>
      <option value="NISHA">NISHA</option>
      <option value="FURKAN">FURKAN</option>
      <option value="ROHIT">ROHIT</option>
      {/* Add more options as needed */}
    </select>
  ) : (
    opsData[index].loginDoneBy
  )}
</td>

                    <td>
                      {editIndex === index ? (
                        <input
                          type="date"
                          value={editedOpsData.loginDate}
                          onChange={(e) => handleEditChange('loginDate', e.target.value)}
                        />
                      ) : (
                        opsData[index].loginDate
                      )}
                    </td>
                    <td>
                      {editIndex === index ? (
                        <input
                          type="text"
                          value={editedOpsData.leadId}
                          onChange={(e) => handleEditChange('leadId', e.target.value)}
                        />
                      ) : (
                        opsData[index].leadId
                      )}
                    </td>
                    <td>
  {editIndex === index ? (
    <select
      value={editedOpsData.caseStatus}
      onChange={(e) => handleEditChange('caseStatus', e.target.value)}
                            >
      <option value="">Choose case status</option>
      <option value="DISBURSED">DISBURSED</option>
      <option value="REJECTED">REJECTED</option>
      <option value="HOLD">HOLD</option>
                              <option value="APPROVED">APPROVED</option>
                              <option value="DROP">DROP</option>
                              <option value="LOGIN">LOGIN</option>
      {/* Add more options as needed */}
    </select>
  ) : (
    opsData[index].caseStatus
  )}
</td>
                <td>
                      {editIndex === index ? (
                        <input
                          type="text"
                          value={editedOpsData.kfs}
                          onChange={(e) => handleEditChange('kfs', e.target.value)}
                        />
                      ) : (
                        opsData[index].kfs
                      )}
                    </td>

                   <td>
                      {editIndex === index ? (
                        <input
                          type="date"
                          value={editedOpsData.lastUpdateDate}
                          onChange={(e) => handleEditChange('lastUpdateDate', e.target.value)}
                        />
                      ) : (
                        opsData[index].lastUpdateDate
                      )}
                    </td>
                    <td>
                      {editIndex === index ? (
                        <input
                          type="date"
                          value={editedOpsData.appovalDate}
                          onChange={(e) => handleEditChange('appovalDate', e.target.value)}
                        />
                      ) : (
                        opsData[index].appovalDate
                      )}
                    </td>
                    <td>
                      {editIndex === index ? (
                        <input
                          type="date"
                          value={editedOpsData.disbursalDate}
                          onChange={(e) => handleEditChange('disbursalDate', e.target.value)}
                        />
                      ) : (
                        opsData[index].disbursalDate
                      )}
                    </td>
                    <td>
                      {editIndex === index ? (
                        <input
                          type="text"
                          value={editedOpsData.opsRemarks}
                          onChange={(e) => handleEditChange('opsRemarks', e.target.value.toUpperCase())}
                        />
                      ) : (
                        opsData[index].opsRemarks
                      )}
                    </td>
                    <td>
  {editIndex === index ? (
    <select
      value={editedOpsData.casePendingFrom}
      onChange={(e) => handleEditChange('casePendingFrom', e.target.value)}
    >
      <option value="">Choose Case Pending From</option>
      <option value="BANKER">BANKER</option>
      <option value="CUSTOMER">CUSTOMER</option>
      <option value="CREDIT">CREDIT</option>
      <option value="SALES">SALES</option>
      <option value="OPERATION">OPERATION</option>
      <option value="NA">NA</option>
    </select>
  ) : (
    opsData[index].casePendingFrom
  )}
</td>
                    <td>
                      {editIndex === index ? (
                        <input
                          type="text"
                          value={editedOpsData.bankerName}
                          onChange={(e) => handleEditChange('bankerName', e.target.value.toUpperCase())}
                        />
                      ) : (
                        opsData[index].bankerName
                      )}
                    </td>
                    <td>
                      {editIndex === index ? (
                        <input
                          type="text"
                          value={editedOpsData.bankerNo}
                          onChange={(e) => handleEditChange('bankerNo', e.target.value)}
                        />
                      ) : (
                        opsData[index].bankerNo
                      )}
                    </td>
                    <td>
                      {editIndex === index ? (
                        <input
                          type="text"
                          value={editedOpsData.bankerMail}
                          onChange={(e) => handleEditChange('bankerMail', e.target.value.toLowerCase())}
                        />
                      ) : (
                        opsData[index].bankerMail
                      )}
                    </td>
                    <td>
                      {editIndex === index ? (
                        <input
                          type="text"
                          value={editedOpsData.cashBackAmount}
                          onChange={(e) => handleEditChange('cashBackAmount', e.target.value)}
                        />
                      ) : (
                        opsData[index].cashBackAmount
                      )}
                    </td>

                  <td>
                      {editIndex === index ? (
                        <input
                          type="text"
                          value={editedOpsData.finalApproval}
                          onChange={(e) => handleEditChange('finalApproval', e.target.value)}
                        />
                      ) : (
                        opsData[index].finalApproval
                      )}
                    </td>

            <td>
                      {editIndex === index ? (
                        <input
                          type="text"
                          value={editedOpsData.finalDisbAmnt}
                          onChange={(e) => handleEditChange('finalDisbAmnt', e.target.value)}
                        />
                      ) : (
                        opsData[index].finalDisbAmnt
                      )}
                    </td>


                 
                        
                        <td>
                                {/* AssignTo button */}
                                <button className='assign-btn' onClick={toggleAssigneeOptions}>AssignTo</button>
                                {/* Render assignee options if showAssigneeOptions is true */}
                                {showAssigneeOptions && (
                                    <div className="assignee-options">
                                        <button className='assing-btn1' onClick={() => handleAssignTo('Furkan',item,opsData[index])}>Furkan</button>
                                        <button className='assing-btn1' onClick={() => handleAssignTo('Nisha',item,opsData[index])}>Nisha</button>
                                        <button className='assing-btn1' onClick={() => handleAssignTo('Anit',item,opsData[index])}>Anit</button>
                                        <button className='assing-btn1' onClick={() => handleAssignTo('Anurandhan',item,opsData[index])}>Anurandhan</button>
                                        <button className='assing-btn1' onClick={() => handleAssignTo('Manoj',item,opsData[index])}>Manoj</button>
                                        <button className='assing-btn1' onClick={() => handleAssignTo('Muskan',item,opsData[index])}>Muskan</button>
                                        <button className='assing-btn1' onClick={() => handleAssignTo('Aaditi',item,opsData[index])}>Aaditi</button>
                                    </div>
                                )}
                            </td>

                            {/* <td>
                            
                            {selectedAssignee && (
                              <span>{selectedAssignee}</span>
                            )}
                          </td> */}

<td>
  {editIndex === index ? (
    <select
      value={editedOpsData.docCheckStatus}
      onChange={(e) => handleEditChange('docCheckStatus', e.target.value.toUpperCase())}
    >
      <option value="">Choose Doc Check Status</option>
      <option value="DONE">DONE</option>
      <option value="NOT DONE">NOT DONE</option>
      <option value="PENDING">PENDING</option>
    </select>
  ) : (
    opsData[index].docCheckStatus
  )}
</td>

                        <td>
  {editIndex === index ? (
    <select
      value={editedOpsData.docCheckBy}
      onChange={(e) => handleEditChange('docCheckBy', e.target.value)}
    >
      <option value="">Choose Doc Check By</option>
      <option value="MUSKAN">MUSKAN</option>
      <option value="ADITI">ADITI</option>
    </select>
  ) : (
    opsData[index].docCheckBy
  )}
</td>
                                              <td>
                        {editIndex === index ? (
                          <input
                            type="text"
                            value={editedOpsData.tvrStatus}
                            onChange={(e) => handleEditChange('tvrStatus', e.target.value.toUpperCase())}
                          />
                        ) : (
                          opsData[index].tvrStatus
                        )}
                      </td>
                      <td>
  {editIndex === index ? (
    <select
      value={editedOpsData.tvrDoneBy}
      onChange={(e) => handleEditChange('tvrDoneBy', e.target.value)}
    >
      <option value="">Choose TVR done by</option>
      <option value="ADITI">ADITI</option>
      <option value="MUSKAN">MUSKAN</option>
      {/* Add more options as needed */}
    </select>
  ) : (
    opsData[index].tvrDoneBy
  )}
</td>
                      <td>
                        {editIndex === index ? (
                          <input
                            type="text"
                            value={editedOpsData.eligibilityCheckStatus}
                            onChange={(e) => handleEditChange('eligibilityCheckStatus', e.target.value.toUpperCase())}
                          />
                        ) : (
                          opsData[index].eligibilityCheckStatus
                        )}
                      </td>

                      <td>
  {editIndex === index ? (
    <select
      value={editedOpsData.elgibilityType}
      onChange={(e) => handleEditChange('elgibilityType', e.target.value.toUpperCase())}
    >
      <option value="">Choose Eligibility Type</option>
      <option value="DEGREE">DEGREE</option>
      <option value="ABB">ABB</option>
      <option value="TURNOVER">TURNOVER</option>
      <option value="GROSS PROFIT">GROSS PROFIT</option>
      <option value="NET PROFIT">NET PROFIT</option>
    </select>
  ) : (
    opsData[index].elgibilityType
  )}
</td>
                      <td>
  {editIndex === index ? (
    <select
      value={editedOpsData.eligibilityCheckBy}
      onChange={(e) => handleEditChange('eligibilityCheckBy', e.target.value)}
    >
      <option value="">CHOOSE</option>
      <option value="MUSKAN">MUSKAN</option>
      <option value="ADITI">ADITI</option>
    </select>
  ) : (
    opsData[index].eligibilityCheckBy
  )}
</td>

                                          

                      <td>
  {editIndex === index ? (
    <select
      value={editedOpsData.highDegree}
      onChange={(e) => handleEditChange('highDegree', e.target.value)}
    >
       <option value="">Choose High Degree</option>
      <option value="MA">MA</option>
      <option value="MBBS">MBBS</option>
      <option value="MD">MD</option>
      <option value="MS">MS</option>
      <option value="B.COM">B.COM</option>
      <option value="M.COM">M.COM</option>
      <option value="BA">BA</option>
      <option value="DNB">DNB</option>
      <option value="PGDCC">PGDCC</option>
      <option value="CA/CS/ICWA">CA/CS/ICWA</option>
    </select>
  ) : (
    opsData[index].highDegree
  )}
</td>
                    <td>
                      {editIndex === index ? (
                        <input
                          type="text"
                          value={editedOpsData.regYear}
                          onChange={(e) => handleEditChange('regYear', e.target.value)}
                        />
                      ) : (
                        opsData[index].regYear
                      )}
                    </td>
                    <td>
                      {editIndex === index ? (
                        <input
                          type="text"
                          value={editedOpsData.totalActiveLoanCountAmount}
                          onChange={(e) => handleEditChange('totalActiveLoanCountAmount', e.target.value)}
                        />
                      ) : (
                        opsData[index].totalActiveLoanCountAmount
                      )}
                    </td>
                    
                    <td>
                      {editIndex === index ? (
                        <input
                          type="text"
                          value={editedOpsData.bounIn6Month}
                          onChange={(e) => handleEditChange('bounIn6Month', e.target.value)}
                        />
                      ) : (
                        opsData[index].bounIn6Month
                      )}
                    </td>
                    <td>
                      {editIndex === index ? (
                        <input
                          type="text"
                          value={editedOpsData.enquariesIn6Month}
                          onChange={(e) => handleEditChange('enquariesIn6Month', e.target.value)}
                        />
                      ) : (
                        opsData[index].enquariesIn6Month
                      )}
                    </td>
                    <td>
                      {editIndex === index ? (
                        <input
                          type="text"
                          value={editedOpsData.totalSal}
                          onChange={(e) => handleEditChange('totalSal', e.target.value)}
                        />
                      ) : (
                        opsData[index].totalSal
                      )}
                    </td>
                    <td>
                      {editIndex === index ? (
                        <input
                          type="text"
                          value={editedOpsData.totalExtraIncome}
                          onChange={(e) => handleEditChange('totalExtraIncome', e.target.value)}
                        />
                      ) : (
                        opsData[index].totalExtraIncome
                      )}
                    </td>

                
                 
                   <td>
  {editIndex === index ? (
    <input
      type="text"
      value={calculateTotalCalculatedSal(editedOpsData.totalSal, editedOpsData.totalExtraIncome)}
      onChange={(e) => handleEditChange('calculateTotalCalculatedSal', e.target.value)}
    />
  ) : (
    calculateTotalCalculatedSal(opsData[index].totalSal, opsData[index].totalExtraIncome)
  )}
</td>

<td>
                      {editIndex === index ? (
                        <input
                          type="text"
                          value={editedOpsData.creditSuggLender}
                          onChange={(e) => handleEditChange('creditSuggLender', e.target.value)}
                        />
                      ) : (
                        opsData[index].creditSuggLender
                      )}
                    </td>

             <td>
                      {editIndex === index ? (
                        <input
                          type="text"
                          value={editedOpsData.creditRemarks}
                          onChange={(e) => handleEditChange('creditRemarks', e.target.value.toUpperCase())}
                        />
                      ) : (
                        opsData[index].creditRemarks
                      )}
                    </td>

              
             
           
        
             

                  {/* ... other OpsData fields ... */}
                  <td>
                    {editIndex === index ? (
                      <button className='save-btn' onClick={() => handleSaveEdit(index)}>Save</button>
                    ) : (
                      <button className='edit-btn' onClick={() => handleEdit(index)}>Edit</button>
                    )}
                  </td>

                 <td>
                            <button className='delete-btn' onClick={() => handleDelete(item._id, opsData[index]._id, index, index)}>Delete</button>
                        </td>


                              <td>
                                {timers[index] && (
                                    <NishaPage timer={timers[index]} />
                                )}
                            </td>
                </>
              )}
      </tr>
   );
})}
              </tbody>
            </table>
            </div>
</div>
  {/* <button className="download-all-btn" onClick={handleDownloadAllData}>Download All Data</button> */}
        </div>
       
    );
}

export default OpsDataViewer;