import React, { useState } from 'react';
import axios from 'axios';
import './UploadFile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

function UploadForm() {
  const [selectedLenders, setSelectedLenders] = useState([]);
    const [formData, setFormData] = useState({
        dateOfLogin:'',
    employeeIdOfCaseOwner: '',
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
    customerPermanentAddress: '',
    officeAddressWithPin: '',
    state: '',
    city: '',
    customerOccupation: '',
    requiredLoanType: '',
    requiredLoanAmount: '',
    uploadFiles: '',
    latestCIBILScore: '',
    bankingPassAndOtherDocPass: '',
    toBeLoggedInFromWhichLender: '',
    remarks: ''
    });


    
    

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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
  const lenderOptions = [
    "Bajaj Finance",
    "Tata Capital",
    "HDFC",
    "Axis Bank",
    "ICICI Bank",
    "Kotak Mahindra Bank",
  ];
  
  
  //   const handleFileChangeAdhar = (e) => {
  //     // Check if any file is selected
  //     if (e.target.files && e.target.files[0]) {
  //         setFormData({ ...formData, adharCard: e.target.files[0] });
  //     }
  // };
  
    const handleUpload = async () => {
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
    data.append('customerPermanentAddress', formData.customerPermanentAddress);
    data.append('officeAddressWithPin', formData.officeAddressWithPin);
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
  
  // Append other files
  if (formData.files && formData.files.length) {
      for (let i = 0; i < formData.files.length; i++) {
          data.append('files', formData.files[i]);
      }
  }


        try {
            await axios.post('http://localhost:5000/upload', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Data and files uploaded successfully');
        } catch (error) {
            console.error('Error uploading data and files:', error);
        }
    };

    
    

    return (

        <>
      <h1>Case Login Form</h1>
      {/* <form className='loanApplicationForm'/> */}
      <form className='loanApplicationForm'>
        <div className='column'>

        
        
        <div className="form-group">
            <label>
              Date Of Login:<FontAwesomeIcon icon={faStar} style={{ color: 'red',fontSize:'6px',marginLeft:'1px'}} />
              <input
                type="date"
                name="dateOfLogin"
               
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              Employee Id Of Case Owner:<FontAwesomeIcon icon={faStar} style={{ color: 'red',fontSize:'6px',marginLeft:'1px'}} />
              <input
                type="text"
                name="employeeIdOfCaseOwner"
                required
                onChange={handleInputChange}
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Employee Name:<FontAwesomeIcon icon={faStar} style={{ color: 'red',fontSize:'6px',marginLeft:'1px'}} />
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
              Manager Name:<FontAwesomeIcon icon={faStar} style={{ color: 'red',fontSize:'6px',marginLeft:'1px'}} />
              <input
                type="text"
                name="managerName"
                required
                onChange={handleInputChange}
              />
            </label>
          </div>

          <div className='form-group'>
     <label>Employment Type:<FontAwesomeIcon icon={faStar} style={{ color: 'red',fontSize:'6px',marginLeft:'1px'}} /></label>
    <select name='employementType' required onChange={handleInputChange}>
    <option value='Salaried'>Salaried</option>
    <option value='partTime'>Self Employed</option>
    <option value='businessman'>Businessman</option>
    <option value='professional'>Professional</option>
  </select>
</div>
</div>
        <div className='column'>
         
        <div className="form-group">
          <label>
            Upload Documents:<FontAwesomeIcon icon={faStar} style={{ color: 'red',fontSize:'6px',marginLeft:'1px'}} />
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
        {/* <div className="form-group">
          <label>
            Upload Adhar:
            <input
              type="file"
              name="adharCard"
              multiple
              onChange={handleFileChange}
            />
          </label>
        </div> */}

        {/* Add other form fields here */}

        <div className="form-group">
        <label>
        Branch Name:<FontAwesomeIcon icon={faStar} style={{ color: 'red',fontSize:'6px',marginLeft:'1px'}} />
      <select
        name="branchName"
        required
       onChange={handleInputChange}
  >
      <option >Noida</option>
      <option >Jhandewalan</option>
      <option >Bareily</option>
      <option >Centralised Ops</option>
 
  </select>
</label>
        </div>
        
        <div className='form-group'>
        <label>
        OfficeAddressWithPin:<FontAwesomeIcon icon={faStar} style={{ color: 'red',fontSize:'6px',marginLeft:'1px'}} />
          <input
            type="text"
            name="officeAddressWithPin"
           required
            onChange={handleInputChange}
          />
        </label>
        </div>
        
        </div>
        <div className='column'>
        <div className="form-group">
            <label>
        Customer Name(As per PAN Card):<FontAwesomeIcon icon={faStar} style={{ color: 'red',fontSize:'6px',marginLeft:'1px'}} />
        <br/>
        <h6>TYPE IN CAPITAL LETTER</h6>
          <input
            type="text"
            name="customerName"
            required
            onChange={handleInputChange}
          />
        </label>
        </div>
            <div className='form-group'>
            <label>
        Customer Mail:<FontAwesomeIcon icon={faStar} style={{ color: 'red',fontSize:'6px',marginLeft:'1px'}} />
          <input
            type="text"
            name="mailId"
           required
            onChange={handleInputChange}
          />
        </label>
            </div>
            <div className='form-group'>
            <label>
            Customer PAN Card Number:<FontAwesomeIcon icon={faStar} style={{ color: 'red',fontSize:'6px',marginLeft:'1px'}} /><br/>
            <h6>TYPE PAN NUMBER IN CAPITAL LETTER</h6>
          <input
            type="text"
            name="customerPan"
            required
            onChange={handleInputChange}
          />
        </label>

        </div>
        <div className='form-group'>
        <label>
        Customer PermanentAddress:<FontAwesomeIcon icon={faStar} style={{ color: 'red',fontSize:'6px',marginLeft:'1px'}} />
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
        Customer Contact:<FontAwesomeIcon icon={faStar} style={{ color: 'red',fontSize:'6px',marginLeft:'1px'}} />
          <input
            type="text"
            name="customerContact"
            required
            onChange={handleInputChange}
          />
        </label>
        </div>
        
        </div>
        
        <div className='column'>
            <div className='form-group'>
            <label>
           State:<FontAwesomeIcon icon={faStar} style={{ color: 'red',fontSize:'6px',marginLeft:'1px'}} />
          <input
            type="text"
            name="state"
            required
            onChange={handleInputChange}
          />
        </label>
            </div>
            <div className='form-group'>
            <label>
        City:<FontAwesomeIcon icon={faStar} style={{ color: 'red',fontSize:'6px',marginLeft:'1px'}} />
          <input
            type="text"
            name="city"
            required
            onChange={handleInputChange}
          />
        </label>
            </div>
         <div className='form-group'>
         <label>
        Customer Occupation:<FontAwesomeIcon icon={faStar} style={{ color: 'red',fontSize:'6px',marginLeft:'1px'}} />
          <input
            type="text"
            name="customerOccupation"
            required
            onChange={handleInputChange}
          />
        </label>
        </div>
        <div className='form-group'>
         <label>
         Customer DateOf Birth:<FontAwesomeIcon icon={faStar} style={{ color: 'red',fontSize:'6px',marginLeft:'1px'}} />
         <br />
         <h6>AS PER PAN CARD</h6>
          <input
            type="date"
            name="dateOfBirth"
            required
            onChange={handleInputChange}
          />
        </label>
        </div>
        <label>
    Required LoanType:<FontAwesomeIcon icon={faStar} style={{ color: 'red',fontSize:'6px',marginLeft:'1px'}} />
    <select
        name="requiredLoanType"
        required
        onChange={handleInputChange}
    >
        <optgroup label="Unsecured Loans">
            <option value="personal">Professional Loan (Doctor/CA/CS,CWA)</option>
            <option value="personal">Personal Loan</option>
            <option value="business">Home Loan</option>
            <option value="education">Educational Loan</option>
            <option value="education">Equipment Loan/Machinary Loan</option>
            <option value="auto">Auto Loan</option>
           
        </optgroup>
        <optgroup label="Secured Loans">
            <option value="home">Housing Loan Salaried</option>
            <option value="property">Housing Loan Business Loan</option>
            <option value="equipment">LAP Salaried</option>
            <option value="equipment">LAP Businessman</option>
            <option value="equipment">LAP Professional</option>
            <option value="equipment">Education Loan India</option>
            <option value="equipment">Education Loan Foreign</option>
        </optgroup>
        {/* Add more options as needed */}
    </select>
</label>
</div>

        <div className='column'>
            <div className='form-group'>
            <label>
        Required LoanAmount:<FontAwesomeIcon icon={faStar} style={{ color: 'red',fontSize:'6px',marginLeft:'1px'}} />
          <input
            type="text"
            name="requiredLoanAmount"
            required
            onChange={handleInputChange}
          />
        </label>
     </div>
     <div className='form-group'>
     <label>
        Latest CIBIL Score:
        <br />
        <h6>(If you know your past CIBIL or if you have recently checked the CIBIL then mention the last checked score.)</h6>
          <input
            type="text"
            name="latestCIBILScore"
            
            onChange={handleInputChange}
          />
        </label>
        </div>
        <div className='form-group'>
        <label>
        Banking Password & Other Document's Password:
        <br />
        <h6>(If any of the customer documents has a password then please mention here)</h6>
          <input
            type="text"
            name="bankingPassAndOtherDocPass"
            
            onChange={handleInputChange}
          />
        </label>
        </div>
        <div>
        <div className="form-group">
        <label className='label'><b>Which lender you want to choose:</b></label>
        
        {lenderOptions.map((lender, index) => (
          <div key={index} className="checkbox-option">
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
        
    
        <button className='submit-btn' onClick={handleUpload}>Submit</button>
      </form>

      
      </>
   
  );
};


export default UploadForm;