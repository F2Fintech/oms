import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './OpsTeamRegister.css'; // Import the external CSS file

const OpsTeamRegister = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (!formData.username || !formData.email || !formData.password) {
      alert('All fields are required');
      return;
    }

    // Check if the email is from f2fintech
    if (!formData.email.endsWith('@f2fintech.com')) {
      alert('Registration is only allowed with an f2fintech email');
      return;
    }

    // Password validation: at least one uppercase letter, one special character, and minimum 8 characters
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$&*]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      alert('Password must contain at least one uppercase letter, one special character, and be at least 8 characters long');
      return;
    }

    // Add further validation as needed (e.g., email format, password strength)

    try {
      // Sending Data to Server
      const response = await fetch('http://13.232.127.73:5000/reg', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log(result);
      setMessage('Registration successful!');
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      // Handle errors (e.g., show an error message)
    }
  };

  return (
    <div className="container"> 
      <form onSubmit={handleSubmit} className="form"> 
        <h2>Ops Team Registration</h2>
        <div className="formGroup"> 
          <label className="label">Username:</label> 
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="input" 
          />
        </div>
        <div className="formGroup"> 
          <label className="label">Email:</label> 
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input" 
          />
        </div>

        {/* <div className="formGroup">
        <label>
        Role:
        <select value={formData.role} onChange={handleChange} name="role">
              <option value="">Select Role</option>
              <option value="furkan">Furkan</option>
              <option value="nisha">Nisha</option>
              <option value="anit">Anit</option>
              <option value="manoj">Manoj</option>
              <option value="anurandhan">Anurandhan</option>
              <option value="dataviewer">Dataviewer</option>
        </select>
    </label>
    </div> */}
        <div className="formGroup"> 
          <label className="label">Password:</label> 
          <input
           type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="input"
          />
          <button type="button" onClick={togglePasswordVisibility}>
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>
        <div className="formGroup"> 
          <button type="submit" className="button">Register</button> 
        </div>
      </form>
      {message && <div className="message">{message}</div>} 
    </div>
  );
};

export default OpsTeamRegister;
