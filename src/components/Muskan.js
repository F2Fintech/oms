import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Muskan() {
    const [muskanData, setMuskanData] = useState([]);
    const [muskanOpsData, setMuskanOpsData] = useState([]);

    useEffect(() => {
        const fetchMuskanData = async () => {
            try {
                const response = await axios.get('http://13.232.127.73:5000/muskandata');
                console.log(response.data);
                setMuskanData(response.data);
            } catch (error) {
                console.error('Error fetching Muskan data:', error);
            }
        };

        fetchMuskanData();
    }, []);

    useEffect(() => {
        const fetchMuskanOpsData = async () => {
            try {
                const response = await axios.get('http://13.232.127.73:5000/muskanopsdata'); // Adjust the URL to your backend API
                console.log(response.data);
                setMuskanOpsData(response.data);
            } catch (error) {
                console.error('Error fetching muskan ops data', error);
            }
        };
  
        fetchMuskanOpsData();
    }, []);

    // Delete functionality
    const handleDelete = async (muskanDataId, muskanOpsDataId, dataIndex, opsDataIndex) => {
        try {
            const isConfirmed = window.confirm('Are you sure you want to submit this row?');
            if (isConfirmed) {
                await axios.delete(`http://13.232.127.73:5000/muskandata/${muskanDataId}`);
                await axios.delete(`http://13.232.127.73:5000/muskanopsdata/${muskanOpsDataId}`);
                
                const updatedMuskanData = [...muskanData];
                updatedMuskanData.splice(dataIndex, 1);
                setMuskanData(updatedMuskanData);
                
                const updatedMuskanOpsData = [...muskanOpsData];
                updatedMuskanOpsData.splice(opsDataIndex, 1);
                setMuskanOpsData(updatedMuskanOpsData);
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
            <h1>Muskan Data</h1>
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
                    {muskanData.map((item, index) => (
                        
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
                            <td>{muskanOpsData[index] && muskanOpsData[index].pocName}</td>
                            <td>{muskanOpsData[index] && muskanOpsData[index].docCheckStatus}</td>
                            <td>{muskanOpsData[index] && muskanOpsData[index].docCheckBy}</td>
                            <td>{muskanOpsData[index] && muskanOpsData[index].tvrStatus}</td>
                            <td>{muskanOpsData[index] && muskanOpsData[index].tvrDoneBy}</td>
                            <td>{muskanOpsData[index] && muskanOpsData[index].eligibilityCheckStatus}</td>
                            <td>{muskanOpsData[index] && muskanOpsData[index].eligibilityCheckBy}</td>
                            <td>{muskanOpsData[index] && muskanOpsData[index].loginStatus}</td>
                            <td>{muskanOpsData[index] && muskanOpsData[index].loginDoneBy}</td>
                            <td>{muskanOpsData[index] && muskanOpsData[index].loginDate}</td>
                            <td>{muskanOpsData[index] && muskanOpsData[index].leadId}</td>
                            <td>{muskanOpsData[index] && muskanOpsData[index].caseStatus}</td>
                            <td>{muskanOpsData[index] && muskanOpsData[index].appovalDate}</td>
                            <td>{muskanOpsData[index] && muskanOpsData[index].disbursalDate}</td>
                            <td>{muskanOpsData[index] && muskanOpsData[index].opsRemarks}</td>
                            <td>{muskanOpsData[index] && muskanOpsData[index].casePendingFrom}</td>
                            <td>{muskanOpsData[index] && muskanOpsData[index].bankerName}</td>
                            <td>{muskanOpsData[index] && muskanOpsData[index].bankerNo}</td>
                            <td>{muskanOpsData[index] && muskanOpsData[index].bankerMail}</td>
                            <td>{muskanOpsData[index] && muskanOpsData[index].cashBackAmount}</td>
                            <td>{muskanOpsData[index] && muskanOpsData[index].highDegree}</td>
                            <td>{muskanOpsData[index] && muskanOpsData[index].regYear}</td>
                            <td>{muskanOpsData[index] && muskanOpsData[index].totalActiveLoanCountAmount}</td>
                            <td>{muskanOpsData[index] && muskanOpsData[index].creditCardStatus}</td>
                            <td>
                            <button className='delete-btn' onClick={() => handleDelete(item._id, muskanOpsData[index]._id, index, index)}>Submit</button>
                            </td>

                            {/* Display more fields as needed */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Muskan;