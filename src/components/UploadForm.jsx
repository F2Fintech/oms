import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import axios from 'axios';
import './UploadForm.css';

function UploadForm() {
  const [selectedLenders, setSelectedLenders] = useState([]);
  const [selectedLenders1, setSelectedLenders1] = useState([]);
  const [selectedLenders2, setSelectedLenders2] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const [formData, setFormData] = useState({
    dateOfLogin: '',
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
    const { name, value } = e.target;
    let updatedValue = value;
    
   // Convert alphabetic characters to uppercase for all fields except email
    if (name !== 'mailId' && typeof value === 'string') {
        updatedValue = value.toUpperCase();
    }

    // Convert email to lowercase
    if (name === 'mailId') {
        updatedValue = value.toLowerCase();
    }

    setFormData({ ...formData, [name]: updatedValue });


    // Fetch employee name based on selected employee ID
    const employeeNames = {
      'F2-369-001': 'HARPREET SINGH',
'F2-369-002': 'ABHINAV AWAL',
'F2-369-101': 'NEHA SINGH',
'F2-369-173': 'ANSHIKA KHOLI',
'F2-369-175': 'ROSHAN YADAV',
'F2-369-186': 'ANURAG',
'F2-369-188': 'JOLLY KUMARI',
'F2-369-189': 'MUSKAN JAISWAL',
'F2-369-190': 'ADITI SINGHAL',
'F2-369-191': 'RANI KUMARI',
'F2-369-192': 'AMBAR RAJ JAISWAL',
'F2-369-193': 'ADARSH THAKUR',
'F2-369-199': 'ANKUSH SHARMA',
'F2-369-210': 'MANISHA CHAUHAN',
'F2-369-224': 'MAMTA KANOJIA',
'F2-369-225': 'SURAJ KUMAR',
'F2-369-226': 'SAGAR CHAUHAN',
'F2-369-003': 'SHASHANK SHARMA',
'F2-369-004': 'JIYA SINGH RAJPUT',
'F2-369-005': 'RAJKUMARI',
'F2-369-006': 'SHIVANI KASHYAP',
'F2-369-008': 'MANOJ KUMAR',
'F2-369-009': 'MANISHA SAXENA',
'F2-369-010': 'AKANSHA BHARTI',
'F2-369-018': 'BARKHA SINGH',
'F2-369-019': 'FURKAN JUNG',
'F2-369-020': 'PRAGATI SAXENA',
'F2-369-021': 'UJALA RISHIWAL',
'F2-369-023': 'JAI SINGH',
'F2-369-024': 'SHARDA KUSHWAH',
'F2-369-025': 'KRISHNA THAKUR',
'F2-369-026': 'NEHA LAKRA',
'F2-369-045': 'HIMANSHI SINGH',
'F2-369-046': 'DEEPANSHU',
'F2-369-056': 'TARUN DHEEMAN',
'F2-369-077': 'SHUBHAM PAHTAK',
'F2-369-079': 'ANURANDHAN KUMAR',
'F2-369-083': 'PRASHANT KUMAR',
'F2-369-085': 'ADITYA RAWAL',
'F2-369-106': 'RIYA CHADDHA',
'F2-369-107': 'VINEET TIWARI',
'F2-369-118': 'PRADEEP KUMAR',
'F2-369-120': 'MANSI PORWAL',
'F2-369-122': 'NEHA DANISH',
'F2-369-130': 'ROZI PRAVEEN',
'F2-369-132': 'LAKHVINDER SINGH',
'F2-369-133': 'KAJAL KASHYAP',
'F2-369-135': 'RASHI GANGWAR',
'F2-369-136': 'KRISHNA PANDEY',
'F2-369-138': 'ANIT SINHA',
'F2-369-145': 'PRERNA THAKUR',
'F2-369-148': 'ADITYACHAUHAN',
'F2-369-149': 'NISHA CHAUHAN',
'F2-369-150': 'SANIA IRSHAD',
'F2-369-152': 'ABHISHEK TRIVEDI',
'F2-369-155': 'RENU MATHUR',
'F2-369-157': 'TANNU YADAV',
'F2-369-159': 'SHWETA RAJPUT',
'F2-369-166': 'HIMANSHI SINGH',
'F2-369-167': 'RITU ANURAGI',
'F2-369-168': 'AMIR ALAM',
'F2-369-172': 'PALAK MITTAL',
'F2-369-183': 'ANURAG SHARMA',
'F2-369-196': 'SHIVANGI KASHYAP',
'F2-369-197': 'HARSH TYAGI',
'F2-369-200': 'NOOR UL HUDA',
'F2-369-201': 'TUBA KHAN',
'F2-369-202': 'AADI SONI',
'F2-369-205': 'ANKIT PAL',
'F2-369-208': 'PRIYANSHU PAL',
'F2-369-209': 'SHIVAM KUMAR',
'F2-369-215': 'CHANCHAL PRAJAPATI',
'F2-369-218': 'VISHAL',
'F2-369-219': 'RITIKA SINGHAL',
'F2-369-220': 'ROHIT CHAUHAN',
'F2-369-222': 'IRAM KHAN',
'F2-369-223': 'MANSIKASHYAP',
'F2-369-228': 'AKSHIT VIJAY WARGIYA',
'F2-369-233': 'DISHA',
'F2-369-229': 'DAKSH SINGH',
'F2-369-230': 'DIVYANSH SINGHAL',
'F2-369-231': 'HARSH BHARDWAJ',
'F2-369-232': 'SURYA PRATAP',
'F2-369-234': 'SAMIRUDDIN KHAN',
'F2-369-235': 'ANKIT KUMAR',
'F2-369-238': 'HARSH',
'F2-369-243': 'VISHAL',
'F2-369-244': 'AKASH SINGHAL',
'F2-369-245': 'GULFAM',
'F2-369-251': 'ANJALI SINGH',
// sourcer id
'F3-369-003': 'SOURAV',
'F3-369-004': 'MANAS',
'F3-369-005': 'SHRISHTI TOMAR',
'F3-369-006': 'MUSKAN',
'F3-369-007': 'PRADEEP',
'F3-369-008': 'JYOTI',
'F3-369-009': 'SONU',
'F3-369-010': 'NEHA',
'F3-369-011': 'SHAMREEN',
'F3-369-012': 'SHAZIL',
'F3-369-013': 'PRIYA SHARMA',
'F3-369-014': 'AMAN',
'F3-369-015': 'SHIKHA',
'F3-369-016': 'SALONI',
'F3-369-017': 'ABHISHEK',
'F3-369-018': 'KAPIL',
'F3-369-019': 'PRIYA SHARMA',
'F3-369-020': 'JITENDRA KUMAR',
'F3-369-021': 'RAJIV GUPTA',

'INT-369-034': 'ANKITA KUNDU',
'INT-369-021': 'AYESHKANTA MOHAPATRA',
'INT-369-025': 'ANURAG NAYAK',
'INT-369-026': 'AWNISH',
'INT-369-039': 'ARYMAN NAHAR',
'INT-369-037': 'ABDUL AZHAR',
'INT-369-024': 'JASHANPREET',
'INT-369-029': 'KHUSHI BAJORIA',
'INT-369-036': 'MANIK RANA',
'INT-369-028': 'NAVROOP KAUR',
'INT-369-032': 'PRANAV ACHARYA',
'INT-369-023': 'RAHUL SAHA',
'INT-369-022': 'SIDDARTH L',
'INT-369-030': 'SIDDHI SINGH',
'INT-369-038': 'SNEHAL',
'INT-369-027': 'SANAD',
'INT-369-035': 'VIKRANT CHOUDHARY',
    };

     if (name === 'employeeIdOfCaseOwner') {
    // Allow manual input for 'CUSTOMER', 'CHANNEL PARTNER', and 'SOURCER'
    if (['CUSTOMER', 'CHANNEL PARTNER', 'SOURCER','INTERN'].includes(value)) {
      // Clear the employeeName field so that it can be manually filled
      setFormData((prevData) => ({
        ...prevData,
        employeeName: '',
      }));
    } else {
      // For other cases, populate employeeName automatically
      setFormData((prevData) => ({
        ...prevData,
        employeeName: employeeNames[value] || '',
      }));
    }
  }
};

// Get current date in "YYYY-MM-DD" format
const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDate();

  // Add leading zeros if month or day is less than 10
  month = month < 10 ? `0${month}` : month;
  day = day < 10 ? `0${day}` : day;

  return `${year}-${month}-${day}`;
};
// Prevent typing in the input field
const preventTyping = (e) => {
  e.preventDefault();
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
  const isChecked = event.target.checked;
  if (isChecked) {
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
  const isChecked = event.target.checked;
  if (isChecked) {
    setSelectedLenders1((prevSelected) => [...prevSelected, selectedLender]);
  } else {
    setSelectedLenders1((prevSelected) =>
      prevSelected.filter((lender) => lender !== selectedLender)
    );
  }
  setFormData({ ...formData, toBeLoggedInFromWhichLender: selectedLender });
};

const handleLenderChange2 = (event) => {
  const selectedLender = event.target.value;
  const isChecked = event.target.checked;
  if (isChecked) {
    setSelectedLenders2((prevSelected) => [...prevSelected, selectedLender]);
  } else {
    setSelectedLenders2((prevSelected) =>
      prevSelected.filter((lender) => lender !== selectedLender)
    );
  }
  setFormData({ ...formData, toBeLoggedInFromWhichLender: selectedLender });
};
  
  
  const lenderOptions = [
    'ADITYA BIRLA',
    'AXIS BANK',
    'BAJAJ FINANCE',
    'BAJAJ MARKET',
    'BAJAJ SALPL',
    'CHOLA MANDALAM',
    'FEDERAL BANK',
    'FINNABLE',
  ];
  
  const lenderOptions1 = [
    'FULLERTON',
     'GODREJ',
     'HDFC',
     'HERO FINCORP',
    'ICICI BANK',
     'ICICI EDUCATION LOAN',
     'INCRED',
     'INDUSIND',
     'INDIFY',
     'IDFC',
  ];
  
  const lenderOptions2 = [

    'INDIAN BANK',
    'KOTAK MAHINDRA BANK',
     'L&T',
     'LENDING KART',
      'PAYSENSE',
      'TATA CAPITAL',
      'UPWARD',
      'YES BANK',
  ];
  
  

  const handleUpload = async () => {
    const allSelectedLenders = [
      ...selectedLenders,
      ...selectedLenders1,
      ...selectedLenders2,
    ];
    setFormData({ ...formData, selectedLenders: allSelectedLenders });

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
    !formData.requiredLoanAmount ||
    allSelectedLenders.length === 0
    ) {
      setWarning('Please fill out all required fields excepts latest cibil score and select at least one lender.');
      setTimeout(() => {
        setMessage('');
      }, 5000);
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
    data.append('toBeLoggedInFromWhichLender', allSelectedLenders.join(', '));
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
    setError('Failed to upload data and files. Please try again.');
  }
  };
  // Generate employeeIdOfCaseOwner values from F2-369-001 to F2-369-400
  const employeeIds = Array.from({ length: 300 }, (_, index) => `F2-369-${String(index + 1).padStart(3, '0')}`);

  const internIds = [
    'INT-369-001', 'INT-369-002', 'INT-369-003', 'INT-369-004', 'INT-369-005',
'INT-369-006', 'INT-369-007', 'INT-369-008', 'INT-369-009', 'INT-369-010',
'INT-369-011', 'INT-369-012', 'INT-369-013', 'INT-369-014', 'INT-369-015',
'INT-369-016', 'INT-369-017', 'INT-369-018', 'INT-369-019', 'INT-369-020',
'INT-369-021', 'INT-369-022', 'INT-369-023', 'INT-369-024', 'INT-369-025',
'INT-369-026', 'INT-369-027', 'INT-369-028', 'INT-369-029', 'INT-369-030',
'INT-369-031', 'INT-369-032', 'INT-369-033', 'INT-369-034', 'INT-369-035',
'INT-369-036', 'INT-369-037', 'INT-369-038', 'INT-369-039', 'INT-369-040',
'INT-369-041', 'INT-369-042', 'INT-369-043', 'INT-369-044', 'INT-369-045',
'INT-369-046', 'INT-369-047', 'INT-369-048', 'INT-369-049', 'INT-369-050'
  ];

  // sourcer id
  const sourcerId = [
    'F3-369-003', 'F3-369-004', 'F3-369-005', 'F3-369-006', 'F3-369-007', 
'F3-369-008', 'F3-369-009', 'F3-369-010', 'F3-369-011', 'F3-369-012',
'F3-369-013', 'F3-369-014', 'F3-369-015', 'F3-369-016', 'F3-369-017',
'F3-369-018', 'F3-369-019','F3-369-020','F3-369-021'
  ]
  const allEmployeeIds = [
  { category: 'Sourcer', ids: sourcerId },
    { category: 'Regular Employee', ids: employeeIds },
    
    { category: 'Intern', ids: internIds }
  ];

  const handleFormExistsOrNot = () => {
    navigate('/formexistsornot'); // Navigate to /mngfetch URL
  };

  return (
    <>
      <div className="form-container">
      <h1 className="form-title">Case Login Form</h1>
      <button className='existformornot-button' onClick={handleFormExistsOrNot}>Do you want to check form is submitted or not??</button> {/* Button for manager login */}
      <form className="loanApplicationForm">
     
      <div className="column">
      <div className="form-group">
        <label>
          Date Of Login:
          <input
            type="date"
            name="dateOfLogin"
            value={formData.dateOfLogin}
            min={getCurrentDate()} // Set minimum date to current date
            max={getCurrentDate()} // Set maximum date to current date
            onChange={handleInputChange}
            onKeyDown={preventTyping} // Prevent typing in the input field
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
                  <option value="">Choose Employee ID</option>
                  <optgroup label="Other">
            {/* <option value="CUSTOMER">CUSTOMER</option> */}
            <option value="CHANNEL PARTNER">CHANNEL PARTNER</option>
            {/* <option value="INTERN">INTERN</option>
            <option value="SOURCER">SOURCER</option> */}
          </optgroup>
          {allEmployeeIds.map(({ category, ids }) => (
            <optgroup key={category} label={category}>
              {ids.map((id) => (
                <option key={id} value={id}>{id}</option>
              ))}
            </optgroup>
          ))}
          
        </select>
      </label>
      {/* <div>
        {formData.employeeName && (
          <p>Selected Employee Name: {formData.employeeName}</p>
        )}
      </div> */}
    </div>
          <div className="form-group">
  <label>
    Employee Name:
    <input
      type="text"
      name="employeeName"
      value={formData.employeeName}
      onChange={handleInputChange}
      required
      style={{ textTransform: 'uppercase' }}
       disabled={formData.employeeIdOfCaseOwner !== 'CUSTOMER' && formData.employeeIdOfCaseOwner !== 'CHANNEL PARTNER' && formData.employeeIdOfCaseOwner !== 'SOURCER' && formData.employeeIdOfCaseOwner !== 'INTERN'}
    />
  </label>
</div>
          <div className="form-group">
  <label>
    Employment Type:
    <select
      name="employementType"
      required
      onChange={handleInputChange}
      style={{ textTransform: 'uppercase' }}
    >
      <option value="">Select Employment Type</option>
      <option value="SALARIED">SALARIED</option>
      <option value="SOURCER">SOURCER</option>
      <option value="CHANNEL PARTNER">CHANNEL PARTNER</option>
      <option value="CUSTOMER">CUSTOMER</option>
      <option value="INTERN">INTERN</option>
    </select>
  </label>
</div>


          <div className="form-group">
          <label>
            Manager Name:
            <select name="managerName" required onChange={handleInputChange}>
           <option value="">Select Manager Name</option>
          <option value="ABHINAV AWAL">ABHINAV AWAL</option>
          <option value="DEEPANSHU">DEEPANSHU</option>
          <option value="F2-FINTECH">F2-FINTECH</option>
          <option value="GROWTH MANAGER">GROWTH MANAGER</option>
          <option value="HARPREET SINGH">HARPREET SINGH</option>
          <option value="JIYA">JIYA</option>
          <option value="NEHA LAKRA">NEHA LAKRA</option>
          <option value="PARSANT KUMAR">PRASHANT KUMAR</option>
          <option value="PRADEEP KUMAR">PRADEEP KUMAR</option>
          <option value="RAJKUMARI">RAJKUMARI</option>
          <option value="ROZI">ROZI</option>
          <option value="SHASHANK SHARMA">SHASHANK SHARMA</option>
          <option value="SHIVANI">SHIVANI</option>
          <option value="SHUBHAM">SHUBHAM</option>
          <option value="SURAJ">SURAJ</option>
          <option value="VINEET TIWARI">VINEET TIWARI</option>
          {/* <option value="TARUN DHIMAN">TARUN DHIMAN</option> */}

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
                  <option value="BAREILLY">BAREILLY</option>
                  <option value="F2-FINTECH">F2-FINTECH</option>
                  <option value="JHANDEWALAN">JHANDEWALAN</option>
                  <option value="NOIDA">NOIDA</option>
      
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
    <select
      name="customerOccupation"
      required
      onChange={handleInputChange}
      
    >
      <option value="">Select Occupation</option>
     <option value="CORPORATE">CORPORATE</option>
      <option value="PROFESSIONAL">PROFESSIONAL</option>
      <option value="SALARIED">SALARIED</option>
     
      <option value="SELF-EMPLOYED">SELF-EMPLOYED</option>
      <option value="OTHER">OTHER</option>
    </select>
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
                    style={{ textTransform: 'lowercase' }}
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
                    style={{ textTransform: 'uppercase' }}
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
                    style={{ textTransform: 'uppercase' }}
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
                    style={{ textTransform: 'uppercase' }}
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
                    style={{ textTransform: 'uppercase' }}
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
                    style={{ textTransform: 'uppercase' }}
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
                  style={{ textTransform: 'uppercase' }}
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
                  style={{ textTransform: 'uppercase' }}
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
                    <option value="AUTO LOAN">AUTO LOAN</option>
                    <option value="HOME LOAN">HOME LOAN</option>
                <option value="EDUCATIONAL LOAN">EDUCATIONAL LOAN</option>
                <option value="EQUIPMENT LOAN/MACHINERY LOAN">EQUIPMENT LOAN/MACHINERY LOAN</option>
                    <option value="PERSONAL LOAN">PERSONAL LOAN</option>
                    <option value="BUISNESS LOAN">BUISNESS LOAN</option>
                <option value="PROFESSIONAL LOAN">PROFESSIONAL LOAN (Doctor/CA/CS,CWA)</option>
              </optgroup>
              <optgroup label="Secured Loans">
                <option value="Housing Loan Salaried<">Housing Loan Salaried</option>
                <option value="Housing Loan Business Loan">Housing Loan Business Loan</option>
                <option value="Education Loan India">Education Loan India</option>
                <option value="Education Loan Foreign">Education Loan Foreign</option>
                <option value="LAP Salaried">LAP Salaried</option>
                <option value="LAP Businessmant">LAP Businessman</option>
                <option value="LAP Professional">LAP Professional</option>
               
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
              placeholder='Please fill only Numeric'
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
        value={lender.toUpperCase()}
        checked={selectedLenders.includes(lender.toUpperCase())}
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
        value={lender1.toUpperCase()}
        checked={selectedLenders1.includes(lender1.toUpperCase())}
        onChange={handleLenderChange1}
      />
      <label htmlFor={`lender1-${index}`}>{lender1}
      </label>
                </div>
              ))}
            </div>
            </div>
            <div className="form-group checkbox-group">
         <div className='checkbox-options'>
         {lenderOptions2.map((lender2, index) => (
  
        <div key={index} className={`checkbox-option ${index % 6 === 0 ? "new-row" : ""}`}>
       <input
        type="checkbox"
        id={`lender2-${index}`}
        value={lender2.toUpperCase()}
        checked={selectedLenders1.includes(lender2.toUpperCase())}
        onChange={handleLenderChange1}
      />
      <label htmlFor={`lender2-${index}`}>{lender2}
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
                  style={{ textTransform: 'uppercase' }}
              />
            </label>
          </div>
         
        </div>
        <button className="submit-btn" onClick={handleUpload}>Submit</button>
      </form>
      {message && <div className="set-message">{message}</div>}
      {error && <div className="error">{error}</div>} 
      {warning && <div className="warning">{warning}</div>} 
      </div>
    </>
  );
}

export default UploadForm;