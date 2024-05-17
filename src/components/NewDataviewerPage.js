import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './OpsDataViewer.css';


function NewDataviewerPage({ onLogout }) {

    const [data, setData] = useState([]);
    const [opsData, setOpsData] = useState([]);
    const [combinedData, setCombinedData] = useState([]);

    const [editedOpsData, setEditedOpsData] = useState({});
    const [editedCombinedDataIndex, setEditedCombinedDataIndex] = useState(null);

    const [fildata, setFilData] = useState([]);

    const [editedData, setEditedData] = useState({});

    const [editIndexOpsData, setEditIndexOpsData] = useState(null);
    const [editIndexData, setEditIndexData] = useState(null);
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({});

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

    // For caselogin form
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://13.232.127.73:5000/combined-data'); // Adjust the URL to your backend API
                console.log(response.data);
                setCombinedData(response.data);
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

    // Zip file download logic
    const handleDownload = async (files) => {
        try {
            const fileNames = files.join(',');
            window.open(`http://13.232.127.73:5000/download-zip?files=${encodeURIComponent(fileNames)}`);
        } catch (error) {
            console.error('Error downloading files', error);
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

    const handleDelete = async (uniqueno, dataIndex) => {
        try {
            const isConfirmed = window.confirm('Are you sure you want to delete this row?');
            if (isConfirmed) {
                // Delete data based on the uniqueno
                await axios.delete(`http://13.232.127.73:5000/combinedData/${uniqueno}`);

                // Update state to remove the deleted row
                const updatedCombinedData = combinedData.filter(item => item.data.uniqueno !== uniqueno);
                setCombinedData(updatedCombinedData);
            }
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    };
    useEffect(() => {
        setFilData(data);
    }, [data]);

    const calculateTotalCalculatedSal = (totalSal, totalExtraIncome) => {
        // Perform your calculation here based on salary and totalExtraIncome
        // For example:
        const totalCalculatedSal = parseFloat(totalSal) + parseFloat(totalExtraIncome);
        return totalCalculatedSal;
    };

    const handleEditOpsDataChange = (field, value) => {
        setEditedOpsData({
            ...editedOpsData,
            [field]: value,
        });
    };

    const handleEditDataChange = (field, value) => {
        
        setEditedData({
            ...editedData,
            [field]: value,
        });
    };

    // const handleEditOpsData = (index) => {
    //     setEditIndexOpsData(index);
    //     handleEditCombinedData(index);
    // };

    const handleEditData = (index) => {
        setEditIndexData(index);
        handleEditCombinedData(index);
    };

    // const handleSaveEditOpsData = async (index) => {
    //     try {
    //         const updatedCombinedData = [...combinedData];
    //         updatedCombinedData[index] = {
    //             opsData: editedOpsData,
    //             data: combinedData[index].data // Keep original data unchanged
    //         };

    //         // Update the combinedData state with the updated opsData
    //         setCombinedData(updatedCombinedData);

    //         // Send the edited opsData to the server
    //         await axios.post('http://13.232.127.73:5000/updatedataandopsdata', {
    //             data: combinedData[index].data,
    //             opsData: editedOpsData
    //         });

    //         // Clear the edited opsData and index after successful save
    //         setEditedCombinedDataIndex(null);
    //         setEditedOpsData({});

    //         // Exit editing mode for opsData by resetting editIndexOpsData
    //         setEditIndexOpsData(null);
    //     } catch (error) {
    //         console.error('Error saving edit', error);
    //     }
    // };


    const handleEditOpsData = (index) => {
        // Find the index of the item in the original combined data array based on uniqueno
        const dataIndex = combinedData.findIndex(item => item.data.uniqueno === combinedDataa[index].data.uniqueno);
        if (dataIndex === -1) {
          console.error('Data item not found');
          return;
        }
      
        // Set the edited ops data for the selected row
        setEditedOpsData(combinedData[dataIndex].opsData);
        setEditIndexOpsData(index);
      };
      
      const handleSaveEditOpsData = async (index) => {
        try {
          // Find the index of the item in the original combined data array based on uniqueno
          const dataIndex = combinedData.findIndex(item => item.data.uniqueno === combinedDataa[index].data.uniqueno);
          if (dataIndex === -1) {
            console.error('Data item not found');
            return;
          }
      
          // Update the opsData in the found item
          const updatedCombinedData = [...combinedData];
          updatedCombinedData[dataIndex] = {
            ...updatedCombinedData[dataIndex], // Preserve other fields
            opsData: editedOpsData // Update opsData
          };
      
          // Update the combinedData state with the updated data
          setCombinedData(updatedCombinedData);
      
          // Send the edited opsData to the server
          await axios.post('http://13.232.127.73:5000/updatedataandopsdata', {
            data: updatedCombinedData[dataIndex].data,
            opsData: editedOpsData
          });
      
          // Clear the edited opsData and index after successful save
          setEditedCombinedDataIndex(null);
          setEditedOpsData({});
      
          // Exit editing mode for opsData by resetting editIndexOpsData
          setEditIndexOpsData(null);
        } catch (error) {
          console.error('Error saving edit', error);
        }
      };

    const handleSaveEditData = async (index) => {
        try {
            const updatedCombinedData = [...combinedData];
            updatedCombinedData[index] = {
                opsData: combinedData[index].opsData, // Keep original opsData unchanged
                data: editedData
            };

            // Update the combinedData state with the updated data
            setCombinedData(updatedCombinedData);

            // Send the edited data to the server
            await axios.post('http://13.232.127.73:5000/updatedataandopsdata', {
                data: editedData,
                opsData: combinedData[index].opsData
            });

            // Clear the edited data and index after successful save
            setEditedCombinedDataIndex(null);
            setEditedData({});

            // Exit editing mode for data by resetting editIndexData
            setEditIndexData(null);
        } catch (error) {
            console.error('Error saving edit', error);
        }
    };

    const handleEditCombinedData = (index) => {
        setEditedCombinedDataIndex(index);
        const combinedDataItem = combinedData[index];
        setEditedOpsData({ ...combinedDataItem.opsData });
        setEditedData({ ...combinedDataItem.data });
    };

    const toggleFilterPanel = () => {
        setShowFilterPanel(!showFilterPanel);
    };

    const handleFilterChange = (field, value) => {
        setSelectedFilters({
            ...selectedFilters,
            [field]: value
        });
    };

    const clearFilters = () => {
        setSelectedFilters({});
    };

    const combinedDataa = combinedData.filter(item => {
        // Implement filtering logic based on selected filters
        // For example, if 'managerName' is selected, check if the item matches the filter
        return (
            (!selectedFilters.managerName || item.data.managerName === selectedFilters.managerName) &&
            (!selectedFilters.pocName || item.opsData.pocName === selectedFilters.pocName) &&
            (!selectedFilters.employeeName || item.data.employeeName === selectedFilters.employeeName) &&
            (!selectedFilters.loginDate || item.opsData.loginDate === selectedFilters.loginDate) &&
            (!selectedFilters.caseStatus || item.opsData.caseStatus === selectedFilters.caseStatus) &&
            (!selectedFilters.docCheckBy || item.opsData.docCheckBy === selectedFilters.docCheckBy) &&
            (!selectedFilters.branchName || item.data.branchName === selectedFilters.branchName)
            // Add similar conditions for other fields
        );
    });

    // Get unique manager names for dropdown options
    const managerNames = [...new Set(combinedData.map(item => item.data.managerName))];
    // Get unique employeeName names for dropdown options
    const employeeNames = [...new Set(combinedData.map(item => item.data.employeeName))];
    // Get unique branch name for dropdown options
   const branchNames = [...new Set(combinedData.map(item => item.data.branchName))];
    // Get unique POC names for dropdown options
    const pocNames = [...new Set(combinedData.map(item => item.opsData.pocName))];
    // Get unique login date for dropdown options
    const loginDate = [...new Set(combinedData.map(item => item.opsData.loginDate))];
    // Get unique case status for dropdown options
    const caseStatus = [...new Set(combinedData.map(item => item.opsData.caseStatus))];
    // Get unique doc check by for dropdown options
    const docCheckBy = [...new Set(combinedData.map(item => item.opsData.docCheckBy))];

   

    // frontend page for ops teams form
    return (
        <div >
            <div className="header-container">

                <button className="logout-btn" onClick={onLogout}>Logout</button>

            </div>

            <button onClick={toggleFilterPanel}>
  <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="24px" fill="#191919">
    <path d="m592-481-57-57 143-182H353l-80-80h487q25 0 36 22t-4 42L592-481ZM791-56 560-287v87q0 17-11.5 28.5T520-160h-80q-17 0-28.5-11.5T400-200v-247L56-791l56-57 736 736-57 56ZM535-538Z"/>
  </svg>
</button>

            {showFilterPanel && (
                <div className='for-filter'>
                    <h3>Choose Filter Options</h3>
                    <label>
                        Manager Name:
                        <select
                            value={selectedFilters.managerName || ''}
                            onChange={(e) => handleFilterChange('managerName', e.target.value)}
                        >
                            <option value="">All</option>
                            {managerNames.map((managerName, index) => (
                                <option key={index} value={managerName}>{managerName}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Employee Name:
                        <select
                            value={selectedFilters.employeeName || ''}
                            onChange={(e) => handleFilterChange('employeeName', e.target.value)}
                        >
                            <option value="">All</option>
                            {employeeNames.map((employeeName, index) => (
                                <option key={index} value={employeeName}>{employeeName}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Branch Name:
                        <select
                        value={selectedFilters.branchName || ''}
                        onChange={(e) => handleFilterChange('branchName', e.target.value)}
                        >
                        <option value="">All</option>
                        {branchNames.map((branchName, index) => (
                            <option key={index} value={branchName}>{branchName}</option>
                        ))}
                        </select>
                    </label>
                    <label>
                        POC Name:
                        <select
                            value={selectedFilters.pocName || ''}
                            onChange={(e) => handleFilterChange('pocName', e.target.value)}
                        >
                            <option value="">All</option>
                            {pocNames.map((pocName, index) => (
                                <option key={index} value={pocName}>{pocName}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Login Date:
                        <select
                            value={selectedFilters.loginDate || ''}
                            onChange={(e) => handleFilterChange('loginDate', e.target.value)}
                        >
                            <option value="">All</option>
                            {loginDate.map((loginDate, index) => (
                                <option key={index} value={loginDate}>{loginDate}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Case Status:
                        <select
                            value={selectedFilters.caseStatus || ''}
                            onChange={(e) => handleFilterChange('caseStatus', e.target.value)}
                        >
                            <option value="">All</option>
                            {caseStatus.map((caseStatus, index) => (
                                <option key={index} value={caseStatus}>{caseStatus}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Doc CheckBy:
                        <select
                            value={selectedFilters.docCheckBy || ''}
                            onChange={(e) => handleFilterChange('docCheckBy', e.target.value)}
                        >
                            <option value="">All</option>
                            {docCheckBy.map((docCheckBy, index) => (
                                <option key={index} value={docCheckBy}>{docCheckBy}</option>
                            ))}
                        </select>
                    </label>
                    {/* Add similar dropdowns for other fields */}
                    <button onClick={clearFilters}>Clear Filters</button>
                </div>
            )}
            <h2
                className="emp-data">Employee Data

            </h2>


            <div class="outer-wrapper">
                <div class="table-wrapper">

                    <table>

                        <thead>

                            <th>SNO</th>
                            <th>
                                Date of Login

                            </th>
                            <th>
                                EmployeeId

                            </th>
                            <th>
                                Employee Name

                            </th>
                            <th>DOB</th>
                            <th>Employement Type</th>
                            <th>
                                Manager Name

                            </th>
                            <th>
                                Customer Name

                            </th>
                            {/* <th>Customer DOB</th> */}
                            <th>Branch Name</th>
                            <th>Customer Contact</th>
                            <th>Mail ID</th>
                            <th>
                                Customer Pan

                            </th>
                            <th>Customer Mother Name</th>
                            {/* <th>Nominee</th> */}
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
                            <th>
                                To Be Logged In From Which Lender

                            </th>
                            <th>Remarks</th>
                            <th>UniqueNo</th>
                            <th>Documents</th>

                            <th>Edit Sales Data</th>
                            <th>
                                POC Name

                            </th>
                            <th>Ops Unique</th>

                            <th>
                                Login Status

                            </th>

                            <th>
                                Login Done By


                            </th>
                            <th>
                                Login Date

                            </th>
                            <th>Lead Id</th>
                            <th>
                                Case Status

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
                            <th>Doc Check Status</th>
                            <th>Doc Check By</th>
                            <th>TVR Status</th>
                            <th>
                                TVR Done By

                            </th>
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
                            {/* <th>Delete</th> */}
                        </thead>
                        <tbody className='t-body'>
                            {combinedDataa.map((combinedItem, index) => {
                                let rowColor = "";
                                let textColor = "black"; // Default text color
                                switch (combinedItem.opsData.caseStatus) {
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
                                        case "LOGIN PENDENCY":
                                            rowColor = "blue-row";
                                            textColor = "white"; // Change text color for red background
                                            break;
                                    default:
                                        rowColor = "";
                                }
                                return (
                                    <tr key={index} className={rowColor} style={{ color: textColor }}>
                                        <td>{index + 1}</td>
                                        {/* Render data fields */}
                                        <td>{combinedItem.data.dateOfLogin}</td>

                                        <td>{combinedItem.data.employeeIdOfCaseOwner}</td>
                                        <td>
                                            {editIndexData === index ? (
                                                <input
                                                    type="text"
                                                    value={editedData.employeeName}
                                                    onChange={(e) => handleEditDataChange('employeeName', e.target.value.toUpperCase())}
                                                />
                                            ) : (
                                                combinedItem.data.employeeName
                                            )}
                                        </td>
                                        <td>
                                            {editIndexData === index ? (
                                                <input
                                                    type="date"
                                                    value={editedData.dateOfBirth}
                                                    onChange={(e) => handleEditDataChange('dateOfBirth', e.target.value)}
                                                />
                                            ) : (
                                                combinedItem.data.dateOfBirth
                                            )}
                                        </td>
                                        <td>{combinedItem.data.employementType}</td>
                                        <td>{combinedItem.data.managerName}</td>
                                        <td>{combinedItem.data.customerName}</td>
                                        <td>{combinedItem.data.branchName}</td>

                                        <td>{combinedItem.data.customerContact}</td>
                                        <td>{combinedItem.data.mailId}</td>
                                        <td>{combinedItem.data.customerPan}</td>
                                        <td>{combinedItem.data.motherName}</td>
                                        <td>{combinedItem.data.customerPermanentAddress}</td>
                                        <td>{combinedItem.data.customerCurrentAdd}</td>
                                        <td>{combinedItem.data.officeAddressWithPin}</td>
                                        <td>{combinedItem.data.pinCode}</td>
                                        <td>{combinedItem.data.state}</td>
                                        <td>{combinedItem.data.city}</td>
                                        <td>{combinedItem.data.customerOccupation}</td>
                                        <td>{combinedItem.data.requiredLoanType}</td>
                                        <td>{combinedItem.data.requiredLoanAmount}</td>
                                        <td>{combinedItem.data.latestCIBILScore}</td>
                                        <td>{combinedItem.data.bankingPassAndOtherDocPass}</td>
                                        <td>{combinedItem.data.toBeLoggedInFromWhichLender}</td>
                                        <td>{combinedItem.data.remarks}</td>
                                        <td>{combinedItem.data.uniqueno}</td>
                                        <td>
                                            {combinedItem.data && combinedItem.data.files && combinedItem.data.files.length > 0 ? (
                                                <button className='downloadfileops' onClick={() => handleDownload(combinedItem.data.files)}>
                                                    Download Files
                                                </button>
                                            ) : (
                                                <span>No File Available</span>
                                            )}
                                        </td>



                                        <td>
                                            {editIndexData === index ? (
                                                <>
                                                    <button className='save-btn' onClick={() => handleSaveEditData(index)}>Save</button>
                                                    <button className='edit-btn' onClick={() => setEditIndexData(null)}>Cancel</button>
                                                </>
                                            ) : (
                                                <button className='edit-btn' onClick={() => handleEditData(index)}>Edit</button>
                                            )}
                                        </td>

                                        {/* Render other data fields */}

                                        {/* Render opsData fields */}
                                        <td>
                                        {editIndexOpsData === index ? (
                                            <div>
                                                <input
                                                    type="text"
                                                    value={editedOpsData.pocName}
                                                    onChange={(e) => handleEditOpsDataChange('pocName', e.target.value.toUpperCase())}
                                                />
                                                <select value={editedOpsData.pocName} onChange={(e) => handleEditOpsDataChange('pocName', e.target.value.toUpperCase())}>
                                                    <option value="">CHOOSE POC NAME</option>
                                                    <option value="NISHA">NISHA</option>
                                                    <option value="FURKAN">FURKAN</option>
                                                    <option value="MANOJ">MANOJ</option>
                                                    <option value="ANIT">ANIT</option>
                                                    <option value="ANURUNDHAN">ANURUNDHAN</option>
                                                </select>
                                            </div>
                                        ) : (
                                            combinedItem.opsData.pocName
                                        )}
                                    </td>

                                    <td>{combinedItem.opsData.uniqueno}</td>


                                        <td>
                                            {editIndexOpsData === index ? (
                                                <input
                                                    type="text"
                                                    value={editedOpsData.loginStatus}
                                                    onChange={(e) => handleEditOpsDataChange('loginStatus', e.target.value.toUpperCase())}
                                                />
                                            ) : (
                                                combinedItem.opsData.loginStatus
                                            )}
                                        </td>
                                                <td>
                                            {editIndexOpsData === index ? (
                                                <div>
                                                    <input
                                                        type="text"
                                                        value={editedOpsData.loginDoneBy}
                                                        onChange={(e) => handleEditOpsDataChange('loginDoneBy', e.target.value.toUpperCase())}
                                                    />
                                                    <select value={editedOpsData.loginDoneBy} onChange={(e) => handleEditOpsDataChange('loginDoneBy', e.target.value.toUpperCase())}>
                                                        <option value="">Choose login done by</option>
                                                        <option value="NISHA">NISHA</option>
                                                        <option value="FURKAN">FURKAN</option>
                                                        <option value="ROHIT">ROHIT</option>
                                                    </select>
                                                </div>
                                            ) : (
                                                combinedItem.opsData.loginDoneBy
                                            )}
                                        </td>

                                  <td>
                                            {editIndexOpsData === index ? (
                                                <input
                                                type="date"
                                                value={(editedOpsData.loginDate)} // Format date for input
                                                onChange={(e) => handleEditOpsDataChange('loginDate', e.target.value)}
                                                />
                                            ) : (
                                                combinedItem.opsData.loginDate
                                            )}
                                            </td>
                                        <td>
                                            {editIndexOpsData === index ? (
                                                <input
                                                    type="text"
                                                    value={editedOpsData.leadId}
                                                    onChange={(e) => handleEditOpsDataChange('leadId', e.target.value.toUpperCase())}
                                                />
                                            ) : (
                                                combinedItem.opsData.leadId
                                            )}
                                        </td>
                                        <td>
                                        {editIndexOpsData === index ? (
                                            <select
                                            value={editedOpsData.caseStatus}
                                            onChange={(e) => handleEditOpsDataChange('caseStatus', e.target.value.toUpperCase())}
                                            >
                                            <option value="">CHOOSE CASE STATUS</option>
                                            <option value="LOGIN">LOGIN</option>
                                            <option value="DISBURSED">DISBURSED</option>
                                            <option value="REJECTED">REJECTED</option>
                                            <option value="DROP">DROP</option>
                                            <option value="APPROVED">APPROVED</option>
                                            <option value="HOLD">HOLD</option>
                                            <option value="LOGIN PENDENCY">LOGIN PENDENCY</option>
                                            </select>
                                        ) : (
                                            combinedItem.opsData.caseStatus
                                        )}
                                        </td>

                                        <td>
                                            {editIndexOpsData === index ? (
                                                <input
                                                    type="text"
                                                    value={editedOpsData.kfs}
                                                    onChange={(e) => handleEditOpsDataChange('kfs', e.target.value.toUpperCase())}
                                                />
                                            ) : (
                                                combinedItem.opsData.kfs
                                            )}
                                        </td>
                                        <td>
                                            {editIndexOpsData === index ? (
                                                <input
                                                    type="date"
                                                    value={(editedOpsData.lastUpdateDate)}
                                                    onChange={(e) => handleEditOpsDataChange('lastUpdateDate', e.target.value)}
                                                />
                                            ) : (
                                                combinedItem.opsData.lastUpdateDate
                                            )}
                                        </td>
                                        <td>
                                            {editIndexOpsData === index ? (
                                                <input
                                                    type="date"
                                                    value={(editedOpsData.appovalDate)}
                                                    onChange={(e) => handleEditOpsDataChange('appovalDate', e.target.value)}
                                                />
                                            ) : (
                                                combinedItem.opsData.appovalDate
                                            )}
                                        </td>
                                        <td>
                                            {editIndexOpsData === index ? (
                                                <input
                                                    type="date"
                                                    value={(editedOpsData.disbursalDate)}
                                                    onChange={(e) => handleEditOpsDataChange('disbursalDate', e.target.value)}
                                                />
                                            ) : (
                                                combinedItem.opsData.disbursalDate
                                            )}
                                        </td>
                                        <td>
                                            {editIndexOpsData === index ? (
                                                <input
                                                    type="text"
                                                    value={editedOpsData.opsRemarks}
                                                    onChange={(e) => handleEditOpsDataChange('opsRemarks', e.target.value.toUpperCase())}
                                                />
                                            ) : (
                                                combinedItem.opsData.opsRemarks
                                            )}
                                        </td>
                                        <td>
                                        {editIndexOpsData === index ? (
                                            <select
                                            value={editedOpsData.casePendingFrom}
                                            onChange={(e) => handleEditOpsDataChange('casePendingFrom', e.target.value.toUpperCase())}
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
                                            combinedItem.opsData.casePendingFrom
                                        )}
                                        </td>

                                        <td>
                                            {editIndexOpsData === index ? (
                                                <input
                                                    type="text"
                                                    value={editedOpsData.bankerName}
                                                    onChange={(e) => handleEditOpsDataChange('bankerName', e.target.value.toUpperCase())}
                                                />
                                            ) : (
                                                combinedItem.opsData.bankerName
                                            )}
                                        </td>
                                        <td>
                                            {editIndexOpsData === index ? (
                                                <input
                                                    type="text"
                                                    value={editedOpsData.bankerNo}
                                                    onChange={(e) => handleEditOpsDataChange('bankerNo', e.target.value)}
                                                />
                                            ) : (
                                                combinedItem.opsData.bankerNo
                                            )}
                                        </td>
                                        <td>
                                            {editIndexOpsData === index ? (
                                                <input
                                                    type="text"
                                                    value={editedOpsData.bankerMail}
                                                    onChange={(e) => handleEditOpsDataChange('bankerMail', e.target.value.toLowerCase())}
                                                />
                                            ) : (
                                                combinedItem.opsData.bankerMail
                                            )}
                                        </td>
                                        <td>
                                            {editIndexOpsData === index ? (
                                                <input
                                                    type="text"
                                                    value={editedOpsData.cashBackAmount}
                                                    onChange={(e) => handleEditOpsDataChange('cashBackAmount', e.target.value)}
                                                />
                                            ) : (
                                                combinedItem.opsData.cashBackAmount
                                            )}
                                        </td>
                                        <td>
                                            {editIndexOpsData === index ? (
                                                <input
                                                    type="text"
                                                    value={editedOpsData.finalApproval}
                                                    onChange={(e) => handleEditOpsDataChange('finalApproval', e.target.value)}
                                                />
                                            ) : (
                                                combinedItem.opsData.finalApproval
                                            )}
                                        </td>
                                        <td>
                                            {editIndexOpsData === index ? (
                                                <input
                                                    type="text"
                                                    value={editedOpsData.finalDisbAmnt}
                                                    onChange={(e) => handleEditOpsDataChange('finalDisbAmnt', e.target.value)}
                                                />
                                            ) : (
                                                combinedItem.opsData.finalDisbAmnt
                                            )}
                                        </td>
                                        <td>
                                            {editIndexOpsData === index ? (
                                                <select
                                                    value={editedOpsData.docCheckStatus}
                                                    onChange={(e) => handleEditOpsDataChange('docCheckStatus', e.target.value.toUpperCase())}
                                                >
                                                    <option value="">CHOOSE DOC CHECK STATUS</option>
                                                    <option value="DONE">DONE</option>
                                                    <option value="NOT DONE">NOT DONE</option>
                                                    <option value="PENDING">PENDING</option>
                                                </select>
                                            ) : (
                                                combinedItem.opsData.docCheckStatus
                                            )}
                                        </td>

                                        <td>
                                            {editIndexOpsData === index ? (
                                                <select
                                                    value={editedOpsData.docCheckBy}
                                                    onChange={(e) => handleEditOpsDataChange('docCheckBy', e.target.value.toUpperCase())}
                                                >
                                                    <option value="">CHOOSE DOC CHECK BY</option>
                                                    <option value="MUSKAN">MUSKAN</option>
                                                    <option value="ADITI">ADITI</option>
                                                </select>
                                            ) : (
                                                combinedItem.opsData.docCheckBy
                                            )}
                                        </td>

                                        <td>
                                            {editIndexOpsData === index ? (
                                                <input
                                                    type="text"
                                                    value={editedOpsData.tvrStatus}
                                                    onChange={(e) => handleEditOpsDataChange('tvrStatus', e.target.value.toUpperCase())}
                                                />
                                            ) : (
                                                combinedItem.opsData.tvrStatus
                                            )}
                                        </td>
                                        <td>
                                            {editIndexOpsData === index ? (
                                                <select
                                                    value={editedOpsData.tvrDoneBy}
                                                    onChange={(e) => handleEditOpsDataChange('tvrDoneBy', e.target.value.toUpperCase())}
                                                >
                                                    <option value="">Choose TVR done by</option>
                                                    <option value="ADITI">ADITI</option>
                                                    <option value="MUSKAN">MUSKAN</option>
                                                </select>
                                            ) : (
                                                combinedItem.opsData.tvrDoneBy
                                            )}
                                        </td>

                                        <td>
                                            {editIndexOpsData === index ? (
                                                <input
                                                    type="text"
                                                    value={editedOpsData.eligibilityCheckStatus}
                                                    onChange={(e) => handleEditOpsDataChange('eligibilityCheckStatus', e.target.value.toUpperCase())}
                                                />
                                            ) : (
                                                combinedItem.opsData.eligibilityCheckStatus
                                            )}
                                        </td>
                                        <td>
                                            {editIndexOpsData === index ? (
                                                <select
                                                    value={editedOpsData.elgibilityType}
                                                    onChange={(e) => handleEditOpsDataChange('elgibilityType', e.target.value.toUpperCase())}
                                                >
                                                    <option value="">CHOOSE</option>
                                                    <option value="DEGREE">DEGREE</option>
                                                    <option value="ABB">ABB</option>
                                                    <option value="TURNOVER">TURNOVER</option>
                                                    <option value="GROSS PROFIT">GROSS PROFIT</option>
                                                    <option value="NET PROFIT">NET PROFIT</option>
                                                    <option value="SALARY">SALARY</option>
                                                </select>
                                            ) : (
                                                combinedItem.opsData.elgibilityType
                                            )}
                                        </td>

                                        <td>
                                            {editIndexOpsData === index ? (
                                                <select
                                                    value={editedOpsData.eligibilityCheckBy}
                                                    onChange={(e) => handleEditOpsDataChange('eligibilityCheckBy', e.target.value.toUpperCase())}
                                                >
                                                    <option value="">Choose Eligibility Check By</option>
                                                    <option value="MUSKAN">MUSKAN</option>
                                                    <option value="ADITI">ADITI</option>
                                                </select>
                                            ) : (
                                                combinedItem.opsData.eligibilityCheckBy
                                            )}
                                        </td>

                                        <td>
                                            {editIndexOpsData === index ? (
                                                <select
                                                    value={editedOpsData.highDegree}
                                                    onChange={(e) => handleEditOpsDataChange('highDegree', e.target.value.toUpperCase())}
                                                >
                                                    <option value="">Choose High Degree</option>
                                                    <option value="MA">MA</option>
                                                    <option value="MBBS">MBBS</option>
                                                    <option value="MD">MD</option>
                                                    <option value="MS">MS</option>
                                                    <option value="DNB">DNB</option>
                                                    <option value="CA/CS/ICWA">CA/CS/ICWA</option>
                                                    <option value="B.COM">B.COM</option>
                                                    <option value="M.COM">M.COM</option>
                                                    <option value="BA">BA</option>

                                                </select>
                                            ) : (
                                                combinedItem.opsData.highDegree
                                            )}
                                        </td>

                                        <td>
                                            {editIndexOpsData === index ? (
                                                <input
                                                    type="text"
                                                    value={editedOpsData.regYear}
                                                    onChange={(e) => handleEditOpsDataChange('regYear', e.target.value.toUpperCase())}
                                                />
                                            ) : (
                                                combinedItem.opsData.regYear
                                            )}
                                        </td>
                                        <td>
                                            {editIndexOpsData === index ? (
                                                <input
                                                    type="text"
                                                    value={editedOpsData.totalActiveLoanCountAmount}
                                                    onChange={(e) => handleEditOpsDataChange('totalActiveLoanCountAmount', e.target.value.toUpperCase())}
                                                />
                                            ) : (
                                                combinedItem.opsData.totalActiveLoanCountAmount
                                            )}
                                        </td>
                                        <td>
                                            {editIndexOpsData === index ? (
                                                <input
                                                    type="text"
                                                    value={editedOpsData.bounIn6Month}
                                                    onChange={(e) => handleEditOpsDataChange('bounIn6Month', e.target.value.toUpperCase())}
                                                />
                                            ) : (
                                                combinedItem.opsData.bounIn6Month
                                            )}
                                        </td>
                                        <td>
                                            {editIndexOpsData === index ? (
                                                <input
                                                    type="text"
                                                    value={editedOpsData.enquariesIn6Month}
                                                    onChange={(e) => handleEditOpsDataChange('enquariesIn6Month', e.target.value.toUpperCase())}
                                                />
                                            ) : (
                                                combinedItem.opsData.enquariesIn6Month
                                            )}
                                        </td>
                                        <td>
                                            {editIndexOpsData === index ? (
                                                <input
                                                    type="text"
                                                    value={editedOpsData.totalSal}
                                                    onChange={(e) => handleEditOpsDataChange('totalSal', e.target.value.toUpperCase())}
                                                />
                                            ) : (
                                                combinedItem.opsData.totalSal
                                            )}
                                        </td>
                                        <td>
                                            {editIndexOpsData === index ? (
                                                <input
                                                    type="text"
                                                    value={editedOpsData.totalExtraIncome}
                                                    onChange={(e) => handleEditOpsDataChange('totalExtraIncome', e.target.value.toUpperCase())}
                                                />
                                            ) : (
                                                combinedItem.opsData.totalExtraIncome
                                            )}
                                        </td>
                                        <td>
                                            {editIndexOpsData === index ? (
                                                <input
                                                    type="text"
                                                    value={calculateTotalCalculatedSal(editedOpsData.totalSal, editedOpsData.totalExtraIncome)}
                                                    onChange={(e) => handleEditOpsDataChange('totalCalculatedSal', e.target.value.toUpperCase())}
                                                />
                                            ) : (
                                                calculateTotalCalculatedSal(combinedItem.opsData.totalSal, combinedItem.opsData.totalExtraIncome)
                                            )}
                                        </td>

                                        <td>
                                            {editIndexOpsData === index ? (
                                                <input
                                                    type="text"
                                                    value={editedOpsData.creditSuggLender}
                                                    onChange={(e) => handleEditOpsDataChange('creditSuggLender', e.target.value.toUpperCase())}
                                                />
                                            ) : (
                                                combinedItem.opsData.creditSuggLender
                                            )}
                                        </td>
                                        <td>
                                            {editIndexOpsData === index ? (
                                                <input
                                                    type="text"
                                                    value={editedOpsData.creditRemarks}
                                                    onChange={(e) => handleEditOpsDataChange('creditRemarks', e.target.value.toUpperCase())}
                                                />
                                            ) : (
                                                combinedItem.opsData.creditRemarks
                                            )}
                                        </td>
                                        <td>
                                            {editIndexOpsData === index ? (
                                                <>
                                                    <button className='save-btn' onClick={() => handleSaveEditOpsData(index)}>Save</button>
                                                    <button className='edit-btn' onClick={() => setEditIndexOpsData(null)}>Cancel</button>
                                                </>
                                            ) : (
                                                <button className='edit-btn' onClick={() => handleEditOpsData(index)}>Edit</button>
                                            )}
                                        </td>
                                        {/* <td><button className='delete-btn' onClick={() => handleDelete(combinedItem.data.uniqueno, index)}>Delete</button></td> */}

                                        {/* Render other opsData fields */}
                                    </tr>
                                );
                            })}
                        </tbody>


                    </table>
                </div>
            </div>
            <button className="download-all-btn" onClick={handleDownloadAllData}>Download All Data</button>
        </div>

    );
}

export default NewDataviewerPage;