import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // Import the CSS file

function Login({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const token = await loginUser({ username, password });
    setToken(token);
  };

  return (
    <div className="centered-form-container">
      <form className="centered-form" onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" onChange={e => setUsername(e.target.value)} />
        </label>
        <label>
          Password:
          <input type="password" onChange={e => setPassword(e.target.value)} />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

async function loginUser(credentials) {
  return axios.post('http://13.232.127.73:5000/login', credentials)
    .then(response => response.data.accessToken)
    .catch(error => console.error(error));
}

export default Login;
