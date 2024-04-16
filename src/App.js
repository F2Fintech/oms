import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import UploadForm from './components/UploadForm';
import DataViewer from './components/DataViewer';
import Navbar from './components/Navbar';
import OpsTeamRegister from './components/OpsTeamRegister';
import Login from './components/Login';
import OpsForm from './components/OpsForm';



import NishaPage from './components/NishaPage';

import FurkanPage from './components/FurkanPage';
import AnitPage from './components/AnitPage';
import AnurandhanPage from './components/Anurandhan';
import ManojPage from './components/ManojPage';
import Muskan from './components/Muskan';
import Aaditi from './components/Aaditi';
import RecordingUpload from './components/RecordingUpload';
import ViewRecording from './components/ViewRecording';
import ViewOpsRec from './components/ViewOpsRec';
import SalesRecView from './components/SalesRecView';
import AdminPage from './components/AdminPage';
import Record from './components/Record';

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  const setToken = (token) => {
    setAuthToken(token);
    localStorage.setItem('token', token);
    navigate('/salesview'); // Navigate to DataViewer after setting the token
  };

  // logout functionality
  const logout = () => {
    setAuthToken(null); // Clear the authentication token
    localStorage.removeItem('token'); // Clear token from localStorage
    navigate('/login'); // Redirect to the login page
  };

  // Define a protected route component
  const ProtectedRoute = ({ children }) => {
    if (!authToken) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  useEffect(() => {
    // Check for token in localStorage and update state accordingly
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  return (
  
    <>
      <Navbar />
      <Routes>
      <Route path="/record" element={<Record />} />
      <Route path="/rec" element={<RecordingUpload />} />
         <Route path="/tvrrec" element={<ViewRecording />} />
        <Route path="/opsrec" element={<ViewOpsRec />} />
        <Route path="/salesrec" element={<SalesRecView />} />
       <Route path="/admin" element={<AdminPage/>} />
      <Route path="/nisha" element={<NishaPage/>} />
      <Route path="/furkan" element={<FurkanPage/>} />
      <Route path="/anit" element={<AnitPage/>}/>
      <Route path="/anurandhan" element={<AnurandhanPage/>}/>
      <Route path="/manoj" element={<ManojPage/>}/>
      <Route path="/muskan" element={<Muskan/>}/>
      <Route path="/aaditi" element={<Aaditi/>}/>
        <Route path='/' element={<UploadForm />} />
        <Route path='/opsForm' element={<OpsForm />} />
        <Route path='/login' element={<Login setToken={setToken} />} />
        <Route path='/salesview' element={
          <ProtectedRoute>
          <DataViewer onLogout={logout} />
        </ProtectedRoute>
      } />
        <Route path='/reg' element={<OpsTeamRegister />} />
        {/* Redirect to caselogin page if no other routes match */}
        <Route path='*' element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
