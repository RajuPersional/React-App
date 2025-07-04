import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <Link to="/attendance">Attendance</Link>
      <Link to="/course">Course</Link>
      <Link to="/profile">Profile</Link>
    </div>
  );
}

export default Sidebar;
