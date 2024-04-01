import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FurkanPage() {
    const [furkanData, setFurkanData] = useState([]);
    const [furkanOpsData, setFurkanOpsData] = useState([]);

    useEffect(() => {
        const fetchFurkanData = async () => {
            try {
                const response = await axios.get('http://13.232.127.73:5000/furkandata');
                console.log(response.data);
                setFurkanData(response.data);
            } catch (error) {
                console.error('Error fetching Nisha data:', error);
            }
        };

        fetchFurkanData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://13.232.127.73:5000/furkanopsdata'); // Adjust the URL to your backend API
                console.log(response.data);
                setFurkanOpsData(response.data);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };
  
        fetchData();
    }, []);

    // Delete functionality
    const handleDelete = async (furkanDataId, furkanOpsDataId, dataIndex, opsDataIndex) => {
        try {
            const isConfirmed = window.confirm('Are you sure you want to submit this row?');
            if (isConfirmed) {
                await axios.delete(`http://13.232.127.73:5000/furkandata/${furkanDataId}`);
                await axios.delete(`http://13.232.127.73:5000/furkanopsdata/${furkanOpsDataId}`);
                
                const updatedFurkanData = [...furkanData];
                updatedFurkanData.splice(dataIndex, 1);
                setFurkanData(updatedFurkanData);
                
                const updatedFurkanOpsData = [...furkanOpsData];
                updatedFurkanOpsData.splice(opsDataIndex, 1);
                setFurkanOpsData(updatedFurkanOpsData);
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
            <h1>Furkan Data</h1>
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
                    {furkanData.map((item, index) => (
                        
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
                            <td>{furkanOpsData[index] && furkanOpsData[index].pocName}</td>
                            <td>{furkanOpsData[index] && furkanOpsData[index].docCheckStatus}</td>
                            <td>{furkanOpsData[index] && furkanOpsData[index].docCheckBy}</td>
                            <td>{furkanOpsData[index] && furkanOpsData[index].tvrStatus}</td>
                            <td>{furkanOpsData[index] && furkanOpsData[index].tvrDoneBy}</td>
                            <td>{furkanOpsData[index] && furkanOpsData[index].eligibilityCheckStatus}</td>
                            <td>{furkanOpsData[index] && furkanOpsData[index].eligibilityCheckBy}</td>
                            <td>{furkanOpsData[index] && furkanOpsData[index].loginStatus}</td>
                            <td>{furkanOpsData[index] && furkanOpsData[index].loginDoneBy}</td>
                            <td>{furkanOpsData[index] && furkanOpsData[index].loginDate}</td>
                            <td>{furkanOpsData[index] && furkanOpsData[index].leadId}</td>
                            <td>{furkanOpsData[index] && furkanOpsData[index].caseStatus}</td>
                            <td>{furkanOpsData[index] && furkanOpsData[index].appovalDate}</td>
                            <td>{furkanOpsData[index] && furkanOpsData[index].disbursalDate}</td>
                            <td>{furkanOpsData[index] && furkanOpsData[index].opsRemarks}</td>
                            <td>{furkanOpsData[index] && furkanOpsData[index].casePendingFrom}</td>
                            <td>{furkanOpsData[index] && furkanOpsData[index].bankerName}</td>
                            <td>{furkanOpsData[index] && furkanOpsData[index].bankerNo}</td>
                            <td>{furkanOpsData[index] && furkanOpsData[index].bankerMail}</td>
                            <td>{furkanOpsData[index] && furkanOpsData[index].cashBackAmount}</td>
                            <td>{furkanOpsData[index] && furkanOpsData[index].highDegree}</td>
                            <td>{furkanOpsData[index] && furkanOpsData[index].regYear}</td>
                            <td>{furkanOpsData[index] && furkanOpsData[index].totalActiveLoanCountAmount}</td>
                            <td>{furkanOpsData[index] && furkanOpsData[index].creditCardStatus}</td>
                            <td>
                            <button className='delete-btn' onClick={() => handleDelete(item._id, furkanOpsData[index]._id, index, index)}>Submit</button>
                            </td>

                            {/* Display more fields as needed */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default FurkanPage;