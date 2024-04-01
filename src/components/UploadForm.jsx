import React, { useState } from 'react';
import axios from 'axios';
import './UploadForm.css';

function UploadForm() {
  const [selectedLenders, setSelectedLenders] = useState([]);
  const [selectedLenders1, setSelectedLenders1] = useState([]);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    dateOfLogin: '',
    employeeIdOfCaseOwner: 'F2-369-001',
    employeeName: '',
    dateOfBirth: '',
    managerName: '',
    employementType: '',
    branchName: '',
    customerName: '',
    customerContact: '',
    mailId: '',
    customerPan: '',
    customerDateOfBirth: '',
    motherName: '',
    customerPermanentAddress: '',
    officeAddressWithPin: '',
    pinCode: '',
    state: '',
    city: '',
    customerOccupation: '',
    requiredLoanType: '',
    requiredLoanAmount: '',
    customLoanAmunt: '',
    uploadFiles: '',
    latestCIBILScore: '',
    bankingPassAndOtherDocPass: '',
    toBeLoggedInFromWhichLender: '',
    remarks: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [files, setFiles] = useState({
    aadhar: null,
    pan: null,
    other: null,
  });

  const handleFileChange = (e) => {
    const { name, files } = e.target; // 'name' will be either 'adharCard' or 'files'

    if (name === 'adharCard') {
        // For Aadhaar card, assuming only one file
        setFormData({ ...formData, adharCard: files[0] });
    } else if (name === 'files') {
        // For other files, assuming multiple files
        setFormData({ ...formData, files: [...files] });
    }
};
  

// Remove selected file after clicking on cut
const handleRemoveFile = (index) => {
  const updatedFiles = [...formData.files];
  updatedFiles.splice(index, 1);
  setFormData({ ...formData, files: updatedFiles });
};
  
  
  const handleLenderChange = (event) => {
    const selectedLender = event.target.value;
    if (event.target.checked) {
      setSelectedLenders((prevSelected) => [...prevSelected, selectedLender]);
    } else {
      setSelectedLenders((prevSelected) =>
        prevSelected.filter((lender) => lender !== selectedLender)
      );
    }
    setFormData({ ...formData, toBeLoggedInFromWhichLender: selectedLender });
  };
  const handleLenderChange1 = (event) => {
    const selectedLender = event.target.value;
    if (event.target.checked) {
      setSelectedLenders1(prevSelected => [...prevSelected, selectedLender]);
    } else {
      setSelectedLenders1(prevSelected => prevSelected.filter(lender => lender !== selectedLender));
    }
    setFormData({ ...formData, toBeLoggedInFromWhichLender: selectedLender });
  };
  
  
  const lenderOptions = [
    'Bajaj Finance',
    'Bajaj Market',
    'Bajaj MS',
    'Tata Capital',
    'HDFC',
    'Axis Bank',
    'ICICI Bank',
    'Kotak Mahindra Bank',
    'Paysense',
    'Chola Mandalam',
    'Aditya Birla',
    'Finnable',
    'Hero FinCorp',
    'Godrej',
    
  ];
  const lenderOptions1 = [
  
    'Federal Bank',
    'FULLERTON',
    'L&T',
    'Yes Bank',
    'Indusind',
    'ICICI Education Loan',
    'Upward',
    'Lending kart',
    'Incred',
    'Others'
    
  ];
  

  const handleUpload = async () => {
    if (
    !formData.dateOfLogin ||
    !formData.employeeName ||
    !formData.employementType ||
    !formData.managerName ||
    !formData.branchName ||
    !formData.customerName ||
    !formData.dateOfBirth ||
    !formData.customerOccupation ||
    !formData.customerContact ||
    !formData.mailId ||
    !formData.customerPan ||
    !formData.customerCurrentAdd ||
    !formData.customerPermanentAddress ||
    !formData.officeAddressWithPin ||
    !formData.pinCode ||
    !formData.state ||
    !formData.city ||
    !formData.requiredLoanType ||
    !formData.requiredLoanAmount
  ) {
    setMessage('Please fill out all required fields Except latest cibil score.');
    setTimeout(() => {
        setMessage('');
    }, 5000); // 5 seconds delay
    return;
  }


    const data = new FormData();
    data.append('dateOfLogin', formData.dateOfLogin);
    data.append('employeeIdOfCaseOwner', formData.employeeIdOfCaseOwner);
    data.append('employeeName', formData.employeeName);
    data.append('dateOfBirth', formData.dateOfBirth);
    data.append('managerName', formData.managerName);
    data.append('employementType', formData.employementType);
    data.append('branchName', formData.branchName);
    data.append('customerName', formData.customerName);
    data.append('customerContact', formData.customerContact);
    data.append('mailId', formData.mailId);
    data.append('customerPan', formData.customerPan);
    data.append('customerDateOfBirth', formData.customerDateOfBirth);
    data.append('motherName', formData.motherName);
     
    data.append('customerPermanentAddress', formData.customerPermanentAddress);
    data.append('customerCurrentAdd', formData.customerCurrentAdd);
    data.append('officeAddressWithPin', formData.officeAddressWithPin);
    data.append('pinCode', formData.pinCode);
    data.append('state', formData.state);
    data.append('city', formData.city);
    data.append('customerOccupation', formData.customerOccupation);
    data.append('requiredLoanType', formData.requiredLoanType);
    data.append('requiredLoanAmount', formData.requiredLoanAmount);
    data.append('latestCIBILScore', formData.latestCIBILScore);
    data.append('bankingPassAndOtherDocPass', formData.bankingPassAndOtherDocPass);
    data.append('toBeLoggedInFromWhichLender', formData.toBeLoggedInFromWhichLender);
    data.append('remarks', formData.remarks);

    if (formData.adharCard && formData.adharCard.length) {
      for (let i = 0; i < formData.adharCard.length; i++) {
        data.append('adharCard', formData.adharCard[i]);
      }
    }

    if (formData.files && formData.files.length) {
      for (let i = 0; i < formData.files.length; i++) {
        data.append('files', formData.files[i]);
      }
    }

    try {
      await axios.post('http://13.232.127.73:5000/upload', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
       // If the request is successful, update the message state
      setMessage('Data and file uploaded successfully!');
       // Clear the message after 5 seconds
    setTimeout(() => {
      setMessage('');
      window.location.reload();
    }, 5000);
  } catch (error) {
    // If there's an error during the upload, log the error
    console.error('Error uploading data and files:', error);
    // You may also set an error message here if you want
    setMessage('Failed to upload data and files. Please try again.');
  }
  };
  // Generate employeeIdOfCaseOwner values from F2-369-001 to F2-369-400
  const employeeIds = Array.from({ length: 400 }, (_, index) => `F2-369-${String(index + 1).padStart(3, '0')}`);


  return (
    <>
      <div className="form-container">
      <h1 className="form-title">Case Login Form</h1>
      <form className="loanApplicationForm">
     
        <div className="column">
          <div className="form-group">
            <label>
              Date Of Login:
              <input
                type="date"
                name="dateOfLogin"
                onChange={handleInputChange}
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Employee ID of Case Owner:
              <select
                name="employeeIdOfCaseOwner"
                value={formData.employeeIdOfCaseOwner}
                onChange={handleInputChange}
              >
                {employeeIds.map((id) => (
                  <option key={id} value={id}>{id}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="form-group">
            <label>
              Employee Name:
            
              <input
                type="text"
                name="employeeName"
                required
                onChange={handleInputChange}
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Employement Type:
            
              <input
                type="text"
                name="employementType"
                required
                onChange={handleInputChange}
              />
            </label>
          </div>

          <div className="form-group">
          <label>
            Manager Name:
            <select name="managerName" required onChange={handleInputChange}>
              <option value="">Select Manager Name</option>
              <option value="TARUN DHIMAN">TARUN DHIMAN</option>
              <option value="SHASHANK SHARMA">SHASHANK SHARMA</option>
              <option value="ABHINAV AWAL">ABHINAV AWAL</option>
              <option value="HARPREET SINGH">HARPREET SINGH</option>
              <option value="PRADEEP KUMAR">PRADEEP KUMAR</option>
              <option value="DEEPANSHU">DEEPANSHU</option>
              <option value="NEHA LAKRA">NEHA LAKRA</option>
              <option value="PARSANT KUMAR">PARSANT KUMAR</option>
              <option value="RAJKUMARI">RAJKUMARI</option>
              <option value="SHUBHAM">SHUBHAM</option>
              <option value="SHIVANI">SHIVANI</option>
              <option value="JIYA">JIYA</option>
              <option value="F2-FINTECH">F2-FINTECH</option>
              {/* Add more options as needed */}
            </select>
          </label>
        </div>

          <h2>Upload All Document Here</h2>
        
          <div className="column">
        {/* MUltiple file upload */}
        <div className="form-group">
          <label>
            Upload Documents:
            <br />
            <h6>(Upload KYC's, Income Documents, Bank Statements etc)</h6>
            <input
              type="file"
              name="files"
              multiple
              required
              onChange={handleFileChange}
            />
          </label>
        </div>
        </div>

        <div className="form-group">
          <label>
            Branch Name:
            <select
              name="branchName"
              required
              onChange={handleInputChange}
            >
              <option value="">Select Branch</option>
              <option value="NOIDA">NOIDA</option>
              <option value="JHANDEWALAN">JHANDEWALAN</option>
              <option value="BAREILLY">BAREILLY</option>
              <option value="F2-FINTECH">F2-FINTECH</option>
            </select>
          </label>
        </div>

          <h1>Customer Section</h1>
          
        <div className="column">
          <div className="form-group">
            <label>
              Customer Name (As per PAN Card):
              <br />
             
              <input
                type="text"
                name="customerName"
                required
                onChange={handleInputChange}
                placeholder="ENTER NAME IN CAPITAL LETTERS"
                style={{ textTransform: 'uppercase' }}
              />
            
            </label>
          </div>
          <div className="form-group">
            <label>
              Customer Date Of Birth:
              <br />
              
              <input
                type="date"
                name="dateOfBirth"
                required
               
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              Customer Occupation:
              <input
                type="text"
                name="customerOccupation"
                required
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              Customer Contact:
              <input
                type="text"
                name="customerContact"
                required
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              Customer Mail:
              <input
                type="text"
                name="mailId"
                required
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              Customer PAN Card Number:
              <br />
              
              <input
                type="text"
                name="customerPan"
                placeholder='TYPE PAN NUMBER IN CAPITAL LETTER'
                required
                onChange={handleInputChange}
              />
            </label>
          </div>

         <div className="form-group">
            <label>
              Customer Mother Name:
              <br />
              
              <input
                type="text"
                name="motherName"
                
                onChange={handleInputChange}
              />
            </label>
              </div>
              
              

          <div className="form-group">
            <label>
              Customer Current Address:
              <input
                type="text"
                name="customerCurrentAdd"
                required
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              Customer Permanent Address:
              <input
                type="text"
                name="customerPermanentAddress"
                required
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              Office Address:
              <input
                type="text"
                name="officeAddressWithPin"
                required
                onChange={handleInputChange}
              />
            </label>
              </div>
              
              <div className="form-group">
            <label>
              Pin Code:
              <input
                type="text"
                name="pinCode"
                required
                onChange={handleInputChange}
              />
            </label>
          </div>
        </div>
          
        </div>
        <div className="column">
          <div className="form-group">
            <label>
              State:
              <input
                type="text"
                name="state"
                required
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              City:
              <input
                type="text"
                name="city"
                required
                onChange={handleInputChange}
              />
            </label>
          </div>
          
          <div className="form-group">
          <label>
            Required Loan Type:
            <select
              name="requiredLoanType"
              required
              onChange={handleInputChange}
            >
              <optgroup label="Unsecured Loans">
              <option value="">Choose Any Of One</option>
                <option value="PROFESSIONAL LOAN">PROFESSIONAL LOAN (Doctor/CA/CS,CWA)</option>
                <option value="PERSONAL LOAN">PERSONAL LOAN</option>
                <option value="HOME LOAN">HOME LOAN</option>
                <option value="EDUCATIONAL LOAN">EDUCATIONAL LOAN</option>
                <option value="EQUIPMENT LOAN/MACHINERY LOAN">EQUIPMENT LOAN/MACHINERY LOAN</option>
                <option value="AUTO LOAN">AUTO LOAN</option>
              </optgroup>
              <optgroup label="Secured Loans">
                <option value="Housing Loan Salaried<">Housing Loan Salaried</option>
                <option value="Housing Loan Business Loan">Housing Loan Business Loan</option>
                <option value="LAP Salaried">LAP Salaried</option>
                <option value="LAP Businessmant">LAP Businessman</option>
                <option value="LAP Professional">LAP Professional</option>
                <option value="Education Loan India">Education Loan India</option>
                <option value="Education Loan Foreign">Education Loan Foreign</option>
              </optgroup>
            </select>
          </label>
        </div>
        </div>
        <div className="column">
          <div className="form-group">
            <label>
              Required Loan Amount:
              {/* <select> */}
              <input
                type="text"
                name="requiredLoanAmount"
                required
                onChange={handleInputChange}
              />
              
              
            </label>
          </div>
          <div className="form-group">
            <label>
              Latest CIBIL Score:
              <br />
              
              <input
                type="text"
                name="latestCIBILScore"
                placeholder='(If you know your past CIBIL or have recently checked the CIBIL then mention the last checked score.)'
                required
                onChange={handleInputChange}
                
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              Banking Password & Other Document's Password:
              <br />
              
              <input
                type="text"
                name="bankingPassAndOtherDocPass"
                placeholder='(If any of the customer documents has a password then please mention here)'
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div>
            <div className="form-group checkbox-group">
              <label className="label"><b>Which lender you want to choose:</b></label>
              <div className='checkbox-options'>
              {lenderOptions.map((lender, index) => (
    // Wrap each group of 6 lenders in its own div
            <div key={index} className={`checkbox-option ${index % 6 === 0 ? "new-row" : ""}`}>
          <input
           type="checkbox"
            id={`lender-${index}`}
        value={lender.toLowerCase()}
        checked={selectedLenders.includes(lender.toLowerCase())}
        onChange={handleLenderChange}
      />
      <label htmlFor={`lender-${index}`}>{lender}</label>
                </div>
              ))}
            </div>
            </div>
         
          <div className="form-group checkbox-group">
         <div className='checkbox-options'>
         {lenderOptions1.map((lender1, index) => (
  
        <div key={index} className={`checkbox-option ${index % 6 === 0 ? "new-row" : ""}`}>
       <input
        type="checkbox"
        id={`lender1-${index}`}
        value={lender1.toLowerCase()}
        checked={selectedLenders1.includes(lender1.toLowerCase())}
        onChange={handleLenderChange1}
      />
      <label htmlFor={`lender1-${index}`}>{lender1}
      </label>
                </div>
              ))}
            </div>
            </div>
            </div>
          <div className="form-group">
            <label>
              Remarks:
              <input
                type="text"
                name="remarks"
                onChange={handleInputChange}
              />
            </label>
          </div>
         
        </div>
        <button className="submit-btn" onClick={handleUpload}>Submit</button>
      </form>
      {message && <div className="message">{message}</div>} 
      </div>
    </>
  );
}

export default UploadForm;