import React from 'react';
import './Navbar.css'; // You can create a CSS file for styling

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
         <a href="https://f2fintech.com/" target="_blank" rel="noopener noreferrer">
                            <img src="https://i0.wp.com/f2fintech.com/wp-content/uploads/2022/09/cropped-F2-Fintech-logo-1-removebg-preview.png?w=500&ssl=1" />
                        </a>
      </div>
      <div className="navbar-right">
        <ul className="nav-links">
          <li><a href="/">CASE LOGIN</a></li>
          <li><a href="/record">TRACK EMP RECORD</a></li>
          <li><a href="/rec">UPLOAD TVR RECORDING</a></li>
          <li><a href="/login">OPS TEAMS LOGIN</a></li>
          <li><a href="/opsForm">OPS TEAMS FORM</a></li>
          {/* <li><a href="/reg">SIGNUP</a></li> */}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
