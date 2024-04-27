import React, { useState } from 'react';
import axios from 'axios';
import './CheckCibil.css';

const CheckCibil = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    document_id: ''
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://13.232.127.73:5000/check-doctor-cibil', formData);
      setResult(response.data);
      setError(null);
    } catch (error) {
      console.error('Error:', error);
      setResult(null);
      setError('Error checking CIBIL. Please try again later.');
    }
  };

//   const downloadPDF = async () => {
//     if (!result) return;

//     const pdfDoc = await PDFDocument.create();
//     const page = pdfDoc.addPage();

//     page.drawText(JSON.stringify(result, null, 2), {
//       x: 150,
//       y: page.getHeight() - 50,
//       size: 12,
//       color: rgb(0, 0, 0),
//     });

//     const pdfBytes = await pdfDoc.save();

//     const blob = new Blob([pdfBytes], { type: 'CheckCibillication/pdf' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', 'result.pdf');
//     document.body.CheckCibilendChild(link);
//     link.click();
//   };

  return (
    <div className="check-cibil">
      <h1>Doctor CIBIL Check</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </div>
        <div>
          <label>Mobile:</label>
          <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} />
        </div>
        <div>
          <label>PAN Card No:</label>
          <input type="text" name="document_id" value={formData.document_id} onChange={handleChange} />
        </div>
        
        <button type="submit">Check CIBIL</button>
        {/* <button type="button" onClick={downloadPDF}>Download PDF</button> */}
      </form>
      {result && (
        <div>
          <h2>Result</h2>
          <pre style={{ backgroundColor: '#f4f4f4', padding: '10px', borderRadius: '5px', overflowX: 'auto' }}>
            <code style={{ color: 'green' }}>
              {JSON.stringify(result, null, 2)}
            </code>
          </pre>
        </div>
      )}
      {error && <p>{error}</p>}
    </div>
  );
};

export default CheckCibil;
