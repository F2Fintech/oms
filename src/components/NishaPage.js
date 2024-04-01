import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OpsAssign.css';

function NishaPage() {
    const [nishaData, setNishaData] = useState([]);
    const [nishaOpsData, setNishaOpsData] = useState([]);
   
        useEffect(() => {
        const fetchNishaData = async () => {
            try {
                const response = await axios.get('http://13.232.127.73:5000/nishadata');
                console.log(response.data);
                setNishaData(response.data);
            } catch (error) {
                console.error('Error fetching Nisha data:', error);
            }
        };

        fetchNishaData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://13.232.127.73:5000/nishaopsdata'); // Adjust the URL to your backend API
                console.log(response.data);
                setNishaOpsData(response.data);
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

    // Delete functionality
    const handleDelete = async (nishaDataId, nishaOpsDataId, dataIndex, opsDataIndex) => {
        try {
            const isConfirmed = window.confirm('Are you sure you want to submit this row?');
            if (isConfirmed) {
                await axios.delete(`http://13.232.127.73:5000/nishaData/${nishaDataId}`);
                await axios.delete(`http://13.232.127.73:5000/nishaOpsData/${nishaOpsDataId}`);
                
                const updatedNishaData = [...nishaData];
                updatedNishaData.splice(dataIndex, 1);
                setNishaData(updatedNishaData);
                
                const updatedNishaOpsData = [...nishaOpsData];
                updatedNishaOpsData.splice(opsDataIndex, 1);
                setNishaOpsData(updatedNishaOpsData);
            }
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    };

    
    

    

    return (
        <div>
            
            <h1>Nisha's Data</h1>
            <table>
                <thead className='t-head1'>
                    <tr>
                    <th>S.No</th>
                    <th>Date Of Login</th>
                        <th>Employee Id Of CaseOwner</th>
                        <th>Employee Name</th>
                        <th>Employement Type</th>
                        <th>Date of Birth</th>
                        <th>Manager Name</th>
                        <th>Branch Name</th>
                        <th>Customer Name</th>
                        <th>Customer Contact</th>
                        <th>Mail ID</th>
                        <th>Customer PAN</th>
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
                        <th>Banking Pass And Other Doc Pass</th>
                        <th>Remarks</th>
                        <th>Files</th>
                        <th>POC Name</th>
                        <th>Doc Check Status</th>
                        <th>Doc Check By</th>
                        <th>TVR Status</th>
                        <th>TVR Done By</th>
                        <th>Eligibility Check Status</th>
                        <th>Eligibility Check By</th>
                        <th>Login Status</th>
                        <th>Login Done By</th>
                        <th>Login Date</th>
                        <th>Lead Id</th>
                        <th>Case Status</th>
                        <th>Approval Date</th>
                        <th>Disbursal Date</th>
                        <th>Ops Remarks</th>
                        <th>Case Pending From</th>
                        <th>Banker Name</th>
                        <th>Banker Number</th>
                        <th>Banker Mail</th>
                        <th>CashBack Amount</th>
                        <th>High Degree</th>
                        <th>Registration Year</th>
                        <th>Total Active Loan Count Amount</th>
                        <th>Credit Card Status</th>
                        <th>Submit</th>
                        


                        {/* <th>Download Files</th> */}
                        {/* Add more table headers as needed */}
                    </tr>
                </thead>
                <tbody className='t-body'>
                     {nishaData.map((item, index) => {
      
                let rowColor = "";
                let textColor = "black"; // Default text color
                switch (nishaOpsData[index]?.caseStatus) {
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
                             <td>{index + 1}</td> {/* Serial Number */}
                            <td>{item.dateOfLogin}</td>
                            <td>{item.employeeIdOfCaseOwner}</td>
                            <td>{item.employeeName}</td>
                            <td>{item.employementType}</td>
                            <td>{item.dateOfBirth}</td>
                            <td>{item.managerName}</td>
                            
                            <td>{item.branchName}</td>
                            <td>{item.customerName}</td>
                            <td>{item.customerContact}</td>
                            <td>{item.mailId}</td>
                            <td>{item.customerPan}</td>
                            <td>{item.customerPermanentAddress}</td>
                            <td>{item.customerCurrentAdd}</td>
                            <td>{item.officeAddressWithPin}</td>
                            <td>{item.pinCode}</td>
                            <td>{item.state}</td>
                            <td>{item.city}</td>
                            <td>{item.customerOccupation}</td>
                            <td>{item.requiredLoanType}</td>
                            <td>{item.requiredLoanAmount}</td>
                            <td>{item.latestCIBILScore}</td>
                            <td>{item.bankingPassAndOtherDocPass}</td>
                           
                            <td>{item.remarks}</td>
                            <td>
                                {item.files && item.files.length > 0 ? (
                                    <button className='downloadfile' onClick={() => handleDownload(item.files)}>
                                        Download Files
                                    </button>
                                ) : (
                                    <span>No File Available</span>
                                )}
                            </td>
                            <td>{nishaOpsData[index] && nishaOpsData[index].pocName}</td>
                            <td>{nishaOpsData[index] && nishaOpsData[index].docCheckStatus}</td>
                            <td>{nishaOpsData[index] && nishaOpsData[index].docCheckBy}</td>
                            <td>{nishaOpsData[index] && nishaOpsData[index].tvrStatus}</td>
                            <td>{nishaOpsData[index] && nishaOpsData[index].tvrDoneBy}</td>
                            <td>{nishaOpsData[index] && nishaOpsData[index].eligibilityCheckStatus}</td>
                            <td>{nishaOpsData[index] && nishaOpsData[index].eligibilityCheckBy}</td>
                            <td>{nishaOpsData[index] && nishaOpsData[index].loginStatus}</td>
                            <td>{nishaOpsData[index] && nishaOpsData[index].loginDoneBy}</td>
                            <td>{nishaOpsData[index] && nishaOpsData[index].loginDate}</td>
                            <td>{nishaOpsData[index] && nishaOpsData[index].leadId}</td>
                            <td>{nishaOpsData[index] && nishaOpsData[index].caseStatus}</td>
                            <td>{nishaOpsData[index] && nishaOpsData[index].appovalDate}</td>
                            <td>{nishaOpsData[index] && nishaOpsData[index].disbursalDate}</td>
                            <td>{nishaOpsData[index] && nishaOpsData[index].opsRemarks}</td>
                            <td>{nishaOpsData[index] && nishaOpsData[index].casePendingFrom}</td>
                            <td>{nishaOpsData[index] && nishaOpsData[index].bankerName}</td>
                            <td>{nishaOpsData[index] && nishaOpsData[index].bankerNo}</td>
                            <td>{nishaOpsData[index] && nishaOpsData[index].bankerMail}</td>
                            <td>{nishaOpsData[index] && nishaOpsData[index].cashBackAmount}</td>
                            <td>{nishaOpsData[index] && nishaOpsData[index].highDegree}</td>
                            <td>{nishaOpsData[index] && nishaOpsData[index].regYear}</td>
                            <td>{nishaOpsData[index] && nishaOpsData[index].totalActiveLoanCountAmount}</td>
                            <td>{nishaOpsData[index] && nishaOpsData[index].creditCardStatus}</td>
                            <td>
                            <button className='delete-btn' onClick={() => handleDelete(item._id, nishaOpsData[index]._id, index, index)}>Submit</button>
                        </td>

                        

                           
                        </tr>
                      );
                })}
                </tbody>
            </table>
        </div>
    );
}

export default NishaPage;