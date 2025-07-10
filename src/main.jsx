import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import HomePage from './components/jsx_Files/HomePage'
import Dashboard from './components/jsx_Files/Dashboard'
import Attendance from './components/jsx_Files/Attendance'
import Course from './components/jsx_Files/Course'
import Profile from './components/jsx_Files/Profile'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/HomePage" element={<HomePage />} />
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/Attendance" element={<Attendance />} />
      <Route path="/Course" element={<Course />} />
      <Route path="/Profile" element={<Profile />} />
      <Route path="/logout" element={<HomePage />} />
    </Routes>
  </BrowserRouter>
)
