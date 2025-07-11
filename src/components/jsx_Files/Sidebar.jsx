import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css_files/Sidebar.css';

export default function Sidebar() {
  const navigate = useNavigate();
  const menuItems = [
    { path: '/HomePage/Dashboard', icon: 'fas fa-tachometer-alt', text: 'Dashboard' },
    { path: '/HomePage/Course', icon: 'fas fa-book', text: 'My Courses' },
    { path: '/HomePage/Attendance', icon: 'fas fa-check-circle', text: 'Attendance' },
    { path: '/HomePage/Enrollment', icon: 'fas fa-exclamation-triangle', text: 'Enrollment' },
    { path: '/HomePage/Financial', icon: 'fas fa-gift', text: 'Financial' },
    { path: '/HomePage/Profile', icon: 'fas fa-user', text: 'Profile' },
    { path: '/', icon: 'fas fa-sign-out-alt', text: 'Logout' }
  ];

  return (
    <ul className="sidebar-menu" style={{ overflow: 'visible' }}>
      {menuItems.map(({ path, icon, text, className = '' }, index) => (
        <li key={index} className={className}>
          {text === 'Logout' ? (
            <a className="sidebar-link" onClick={() => navigate(path)} style={{ cursor: 'pointer' }}>
              <i className={icon}></i> {text}
            </a>
          ) : (
            <Link to={path} className="sidebar-link">
              <i className={icon}></i> {text}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}
