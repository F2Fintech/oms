import React, { useState } from 'react';
import axios from 'axios';

import '@fortawesome/fontawesome-free/css/all.css';
import './OpsForm.css'


function OpsForm() {
  
  const [formData, setFormData] = useState({
    pocName: '',
    customerPan: '',
    docCheckStatus: '',
    docCheckBy: '',
    tvrStatus: '',
    tvrDoneBy: '',
    eligibilityCheckStatus: '',
    eligibilityCheckBy: '',
    elgibilityType: '',
    loginStatus: '',
    loginDoneBy: '',
    loginDate: '',
    leadId: '',
    caseStatus: '',
    kfs: '',
    lastUpdateDate: '',
    appovalDate: '',
    disbursalDate: '',
    opsRemarks: '',
    casePendingFrom: '',
    bankerName: '',
    bankerNo: '',
    bankerMail: '',
    cashBackAmount: '',
    finalApproval: '',
    finalDisbAmnt: '',
    highDegree: '',
    regYear: '',
    totalActiveLoanCountAmount: '',
    creditCardStatus: '',
    bounIn6Month: '',
    enquariesIn6Month: '',
    totalSal: '',
    totalExtraIncome: '',
    totalCalculatedSal: '',
    creditSuggLender: '',
    creditRemarks: '',
    messageToBanker: ''
  });

   const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpsData = async () => {
    const opsData = {
      pocName: formData.pocName || '',
      customerPan: formData.customerPan || '',
    docCheckStatus: formData.docCheckStatus || '',
    docCheckBy: formData.docCheckBy || '',
    tvrStatus: formData.tvrStatus || '',
    tvrDoneBy: formData.tvrDoneBy || '',
    eligibilityCheckStatus: formData.eligibilityCheckStatus || '',
    eligibilityCheckBy: formData.eligibilityCheckBy || '',
    loginStatus: formData.loginStatus || '',
    loginDoneBy: formData.loginDoneBy || '',
    loginDate: formData.loginDate || '',
    leadId: formData.leadId || '',
    caseStatus: formData.caseStatus || '',
    kfs: formData.kfs || '',
    lastUpdateDate: formData.lastUpdateDate || '',
    appovalDate: formData.appovalDate || '',
    disbursalDate: formData.disbursalDate || '',
    opsRemarks: formData.opsRemarks || '',
    casePendingFrom: formData.casePendingFrom || '',
    bankerName: formData.bankerName || '',
    bankerNo: formData.bankerNo || '',
    bankerMail: formData.bankerMail || '',
      cashBackAmount: formData.cashBackAmount || '',
      finalApproval: formData.finalApproval || '',
    finalDisbAmnt: formData.finalDisbAmnt || '',
    highDegree: formData.highDegree || '',
    regYear: formData.regYear || '',
    totalActiveLoanCountAmount: formData.totalActiveLoanCountAmount || '',
    creditCardStatus: formData.creditCardStatus || '',
    bounIn6Month: formData.bounIn6Month || '',
    enquariesIn6Month: formData.enquariesIn6Month || '',
    totalSal: formData.totalSal || '',
      totalExtraIncome: formData.totalExtraIncome || '',
      totalCalculatedSal: formData.totalCalculatedSal || '',
      elgibilityType: formData.elgibilityType || '',
      creditSuggLender: formData.creditSuggLender || '',
       creditRemarks: formData.creditRemarks || '',
    messageToBanker: formData.messageToBanker || ''
    };

    try {
      await axios.post('http://13.232.127.73:5000/upload-ops', opsData, {
        headers: {
          'Content-Type': 'application/json', // Set the content type correctly
        },
        body: JSON.stringify(formData)
      });

      setMessage('Data uploaded successfully.');
     
      // Hide the message after 5 seconds
      // setTimeout(() => {
      //   setMessage('');
      // }, 20000);
      // Reload the page after successful upload
      // window.location.reload();
    } catch (error) {
      console.error('Error uploading data:', error);
      
    setMessage('Error uploading data. Please try again.'); // Set an error message
    }
  };
  console.log('Message:', message); // Add this line to log the message

  const calculateTotalCalculatedSal = () => {
    const { totalSal, totalExtraIncome } = formData;
    if (totalSal && totalExtraIncome) {
      return parseFloat(totalSal) + parseFloat(totalExtraIncome);
    }
    return '';
  };

  return (
    <>
    <div className='heading'>
      <h2 className='opsteam'>Only For Ops Teams</h2>
      </div>
      <form className='opsDataForm'>
        <div className='column'>
          <div className='form-group'>
            <label>
              POC Name:
              <input type='text' name='pocName' onChange={handleInputChange} />
            </label>
          </div>

          <div className='form-group'>
            <label>
              Customer Pan:
              <input type='text' name='customerPan' onChange={handleInputChange} />
            </label>
          </div>
            <div className='form-group'>
          <label>
            Document Check Status:
            <select
              name='docCheckStatus'
              onChange={handleInputChange}
            >
              <option value=''>Choose</option>
              <option>Done</option>
              <option>PENDING</option>
            </select>
          </label>
        </div>

         <div className='form-group'>
          <label>
            Document Check By:
            <select name='docCheckBy' onChange={handleInputChange}>
              <option value=''>Choose</option>
              <option value='ANURUDHAN KUMAR'>ANURUDHAN KUMAR</option>
              <option value='MANOJ'>MANOJ</option>
              <option value='ANIT'>ANIT</option>
              <option value='FURKAN'>FURKAN</option>
              <option value='NISHA'>NISHA</option>
            </select>
          </label>
        </div>
          <div className='form-group'>
          <label>
            TVR Status:
            <select name='tvrStatus' onChange={handleInputChange}>
              <option value=''>Choose</option>
              <option value='Done'>Done</option>
              <option value='PENDING'>PENDING</option>
              <option value='REJECTED'>REJECTED</option>
            </select>
          </label>
        </div>

        <div className='form-group'>
            <label>
              TVR Done By:
              <select name='tvrDoneBy' onChange={handleInputChange}>
              <option value=''>Choose</option>
              <option value='ANURUDHAN KUMAR'>ANURUDHAN KUMAR</option>
              <option value='MANOJ'>MANOJ</option>
              <option value='ANIT'>ANIT</option>
              <option value='FURKAN'>FURKAN</option>
              <option value='NISHA'>NISHA</option>
            </select>
            </label>
          </div>

          <div className='form-group'>
            <label>
              Eligibility Check Status:
              <select
              name='eligibilityCheckStatus'
              onChange={handleInputChange}
            >
              <option value=''>Choose</option>
              <option value='Done'>Done</option>
              <option value='PENDING'>PENDING</option>
              <option value='REJECTED'>REJECTED</option>
            </select>
            </label>
          </div>
          <div className='form-group'>
            <label>
              Eligibility Type:
              <input
                type='text'
                name='elgibilityType'
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className='form-group'>
            <label>
              Eligibility Check By:
              <input
                type='text'
                name='eligibilityCheckBy'
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className='form-group'>
            <label>
              Login Status:
              <select
              name='loginStatus'
              onChange={handleInputChange}
              >
                <option value=''>Choose</option>
                <option value='Done'>Done</option>
                <option value='PENDING'>PENDING</option>
                
            </select>
            </label>
          </div>
          <div className='form-group'>
            <label>
              Login Done By:
              <input
                type='text'
                name='loginDoneBy'
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className='form-group'>
            <label>
              Login Date:
              <input type='date' name='loginDate' onChange={handleInputChange} />
            </label>
          </div>
          <div className='form-group'>
            <label>
              Lead ID:
              <input type='text' name='leadId' onChange={handleInputChange} />
            </label>
          </div>
          <div className='form-group'>
            <label>
              Case Status:
              <select name='caseStatus'onChange={handleInputChange}>
              <option value=''>Choose</option>
              <option value='LOGIN'>LOGIN</option>
              <option value='APPROVED'>APPROVED</option>
              <option value='DISBURSED'>DISBURSED</option>
              <option value='REJECTED'>REJECTED</option>
              <option value='HOLD'>HOLD</option>
              <option value='DROP'>DROP</option>
              <option value='>CARRY FORWARD'>CARRY FORWARD</option>
              <option value='PENDING'>PENDING</option>
            </select>
            </label>
          </div>

<div className='form-group'>
            <label>
              KFS:
              <input
                type='text'
                name='kfs'
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className='form-group'>
            <label>
              Last Update Date:
              <input
                type='date'
                name='lastUpdateDate'
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className='form-group'>
            <label>
              Approval Date:
              <input
                type='date'
                name='appovalDate'
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className='form-group'>
            <label>
              Disbursal Date:
              <input
                type='date'
                name='disbursalDate'
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className='form-group'>
            <label>
              OPS Remarks:
              <input
                type='text'
                name='opsRemarks'
                onChange={handleInputChange}
              />
            </label>
          </div>
 
          <div className='form-group'>
            <label>
              Case Pending From:
              <select name='casePendingFrom'onChange={handleInputChange}>
              <option value=''>Choose</option>
              <option value='Banker'>Banker</option>
              <option value='Customer'>Customer</option>
              <option value='Sales Teams'>Sales Teams</option>
              
            </select>
            </label>
          </div>
          <div className='form-group'>
            <label>
              Banker Name:
              <select name='bankerName'onChange={handleInputChange}>
              <option value=''>Choose</option>
              <option value='Bajaj'>Bajaj</option>
              <option value='Chola'>Chola</option>
              <option value='TATA'>TATA</option>
              <option value='L&T'>L&T</option>
              <option value='IDFC'>IDFC</option>
            </select>
            </label>
          </div>
          <div className='form-group'>
            <label>
              Banker No:
              <input type='text' name='bankerNo' onChange={handleInputChange} />
            </label>
          </div>
          <div className='form-group'>
            <label>
              Banker Mail:
              <input
                type='text'
                name='bankerMail'
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className='form-group'>
            <label>
              Cash Back Amount:
              <input
                type='text'
                name='cashBackAmount'
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className='form-group'>
            <label>
              Final Approval Amount:
              <input
                type='text'
                name='finalApproval'
                onChange={handleInputChange}
              />
            </label>
          </div>

          <div className='form-group'>
            <label>
              Final Disbursal Amount:
              <input
                type='text'
                name='finalDisbAmnt'
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className='form-group'>
            <label>
              High Degree:
              <input
                type='text'
                name='highDegree'
              
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className='form-group'>
            <label>
              Registration Year:
              <input
                type='text'
                name='regYear'
              
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className='form-group'>
            <label>
              Total Active Loan Count Amount:
              <input
                type='text'
                name='totalActiveLoanCountAmount'
                
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className='form-group'>
            <label>
              Credit Card Status:
              <input
                type='text'
                name='creditCardStatus'
                
                onChange={handleInputChange}
              />
            </label>
          </div>


          <div className='form-group'>
            <label>
              Bouncing in 6 Months:
              <input
                type='text'
                name='bounIn6Month'
              
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className='form-group'>
            <label>
              Inquiries in 6 Months:
              <input
                type='text'
                name='enquariesIn6Month'
                
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className='form-group'>
            <label>
              Salary:
              <input
                type='text'
                name='totalSal'
            
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className='form-group'>
            <label>
              Total Extra Income:
              <input
                type='text'
                name='totalExtraIncome'
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className="form-group">
        <label>
          Total Calculated Salary:
          <input
            type="text"
            name="totalCalculatedSal"
            value={calculateTotalCalculatedSal()}
            readOnly
          />
        </label>
          </div>

          
           <div className='form-group'>
            <label>
              Credit Suggested Lender:
              <input
                type='text'
                name='creditSuggLender'
                onChange={handleInputChange}
              />
            </label>
          </div>
          
          <div className='form-group'>
            <label>
              Credit Remarks:
              <input
                type='text'
                name='creditRemarks'
                onChange={handleInputChange}
              />
            </label>
          </div>
                  </div>

                  {/* OPS Team submit button */}
                  <button className='submit-btn' onClick={handleOpsData}>
                    Submit
                  </button>
                </form>
                {message && <div className="message">{message}</div>} 
              </>
            );
          }

export default OpsForm;
