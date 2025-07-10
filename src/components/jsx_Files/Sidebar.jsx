import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css_files/Sidebar.css';

export default function Sidebar() {
  const navigate = useNavigate();

  const menuItems = [
    { url: '/Dashboard', icon: 'fas fa-tachometer-alt', text: 'Dashboard' },
    { url: '/Course', icon: 'fas fa-book', text: 'My Courses' },
    { url: '/Attendance', icon: 'fas fa-check-circle', text: 'Attendance' },
    { url: '/Enrollment', icon: 'fas fa-exclamation-triangle', text: 'Enrollment' },
    { url: '/Financial', icon: 'fas fa-gift', text: 'Financial' },
    { url: '/Profile', icon: 'fas fa-user', text: 'Profile' },
    { url: '/', icon: 'fas fa-sign-out-alt', text: 'Logout' }
  ];

  return (
    <ul className="sidebar-menu" style={{ overflow: 'visible' }}>
      {menuItems.map(({ url, icon, text, className = '' }, index) => (
        <li key={index} className={className}>
          {text === 'Logout' ? (
            <a className="sidebar-link" onClick={() => navigate(url)} style={{ cursor: 'pointer' }}>
              <i className={icon}></i> {text}
            </a>
          ) : (
            <Link to={url} className="sidebar-link">
              <i className={icon}></i> {text}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}
