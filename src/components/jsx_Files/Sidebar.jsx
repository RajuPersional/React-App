import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css_files/Sidebar.css';

async function logout(navigate) {
    try {
        const response = await fetch('http://localhost:5000/api/logout', {
            method: 'POST',
            credentials: 'include'
        });
        
        if (response.ok) {
          console.log(`Logout successful! ${response}`);
          navigate('/');

        } else {
            const errorText = await response.text();
            console.error('Logout failed:', errorText);

        }
    } catch (error) {
        console.error('Logout error:', error);
    }
}

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
            <a className="sidebar-link" onClick={() => logout(navigate)} style={{ cursor: 'pointer' }}>
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
