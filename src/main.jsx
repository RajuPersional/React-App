import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import HomePage from './components/jsx_Files/HomePage'
import Dashboard from './components/jsx_Files/Dashboard'
import Attendance from './components/jsx_Files/Attendance'
import Course from './components/jsx_Files/Courses'
import Enrollment from './components/jsx_Files/Enrollment'
import Profile from './components/jsx_Files/Profile'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Bricks from './components/jsx_Files/Bricks'
import Finance from './components/jsx_Files/Finance'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Bricks />} />
      <Route path="/HomePage" element={<HomePage />}>
        <Route index element={<Dashboard />} />{/* Default route */}
        <Route path="Dashboard" element={<Dashboard />} />
        <Route path="Attendance" element={<Attendance />} />
        <Route path="Course" element={<Course />} />
        <Route path="Profile" element={<Profile />} />
        <Route path="Enrollment" element={<Enrollment />} />
        <Route path="Financial" element={<Finance />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
