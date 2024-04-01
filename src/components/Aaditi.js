import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Aaditi() {
    const [aaditiData, setAaditiData] = useState([]);
    const [aaditiOpsData, setAaditiOpsData] = useState([]);

    useEffect(() => {
        const fetchAaditiData = async () => {
            try {
                const response = await axios.get('http://13.232.127.73:5000/aaditidata');
                console.log(response.data);
                setAaditiData(response.data);
            } catch (error) {
                console.error('Error fetching Muskan data:', error);
            }
        };

        fetchAaditiData();
    }, []);

    useEffect(() => {
        const fetchAaditiOpsData = async () => {
            try {
                const response = await axios.get('http://13.232.127.73:5000/aaditiopsdata'); // Adjust the URL to your backend API
                console.log(response.data);
                setAaditiOpsData(response.data);
            } catch (error) {
                console.error('Error fetching muskan ops data', error);
            }
        };
  
        fetchAaditiOpsData();
    }, []);

    // Delete functionality
    const handleDelete = async (aaditiDataId, aaditiOpsDataId, dataIndex, opsDataIndex) => {
        try {
            const isConfirmed = window.confirm('Are you sure you want to submit this row?');
            if (isConfirmed) {
                await axios.delete(`http://13.232.127.73:5000/aaditidata/${aaditiDataId}`);
                await axios.delete(`http://13.232.127.73:5000/aaditiOpsData/${aaditiOpsDataId}`);
                
                const updatedAaditiData = [...aaditiData];
                updatedAaditiData.splice(dataIndex, 1);
                setAaditiData(updatedAaditiData);
                
                const updatedAaditiOpsData = [...aaditiOpsData];
                updatedAaditiOpsData.splice(opsDataIndex, 1);
                setAaditiOpsData(updatedAaditiOpsData);
            }
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    };

    // Zip file download logic
    const handleDownload = async (files) => {
        try {
            const fileNames = files.join(',');
            window.open(`http://13.232.127.73:5000/download-zip?files=${encodeURIComponent(fileNames)}`);
        } catch (error) {
            console.error('Error downloading files', error);
        }
    };

    return (
        <div>
            <h1>Aaditi Data</h1>
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
                        <th>Remove</th>

                        {/* <th>Download Files</th> */}
                        {/* Add more table headers as needed */}
                    </tr>
                </thead>
                <tbody className='t-body'>
                    {aaditiData.map((item, index) => (
                        
                        <tr key={index}>
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
                            <td>{aaditiOpsData[index] && aaditiOpsData[index].pocName}</td>
                            <td>{aaditiOpsData[index] && aaditiOpsData[index].docCheckStatus}</td>
                            <td>{aaditiOpsData[index] && aaditiOpsData[index].docCheckBy}</td>
                            <td>{aaditiOpsData[index] && aaditiOpsData[index].tvrStatus}</td>
                            <td>{aaditiOpsData[index] && aaditiOpsData[index].tvrDoneBy}</td>
                            <td>{aaditiOpsData[index] && aaditiOpsData[index].eligibilityCheckStatus}</td>
                            <td>{aaditiOpsData[index] && aaditiOpsData[index].eligibilityCheckBy}</td>
                            <td>{aaditiOpsData[index] && aaditiOpsData[index].loginStatus}</td>
                            <td>{aaditiOpsData[index] && aaditiOpsData[index].loginDoneBy}</td>
                            <td>{aaditiOpsData[index] && aaditiOpsData[index].loginDate}</td>
                            <td>{aaditiOpsData[index] && aaditiOpsData[index].leadId}</td>
                            <td>{aaditiOpsData[index] && aaditiOpsData[index].caseStatus}</td>
                            <td>{aaditiOpsData[index] && aaditiOpsData[index].appovalDate}</td>
                            <td>{aaditiOpsData[index] && aaditiOpsData[index].disbursalDate}</td>
                            <td>{aaditiOpsData[index] && aaditiOpsData[index].opsRemarks}</td>
                            <td>{aaditiOpsData[index] && aaditiOpsData[index].casePendingFrom}</td>
                            <td>{aaditiOpsData[index] && aaditiOpsData[index].bankerName}</td>
                            <td>{aaditiOpsData[index] && aaditiOpsData[index].bankerNo}</td>
                            <td>{aaditiOpsData[index] && aaditiOpsData[index].bankerMail}</td>
                            <td>{aaditiOpsData[index] && aaditiOpsData[index].cashBackAmount}</td>
                            <td>{aaditiOpsData[index] && aaditiOpsData[index].highDegree}</td>
                            <td>{aaditiOpsData[index] && aaditiOpsData[index].regYear}</td>
                            <td>{aaditiOpsData[index] && aaditiOpsData[index].totalActiveLoanCountAmount}</td>
                            <td>{aaditiOpsData[index] && aaditiOpsData[index].creditCardStatus}</td>
                            <td>
                            <button className='delete-btn' onClick={() => handleDelete(item._id, aaditiOpsData[index]._id, index, index)}>Delete</button>
                            </td>

                            {/* Display more fields as needed */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Aaditi;