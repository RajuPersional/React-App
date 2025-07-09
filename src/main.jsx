import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import HomePage from './components/jsx_Files/HomePage'
import { BrowserRouter,Routes,Route} from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
        <Route path="/" element={<App />} />
        <Route path="/Attendance" element={<HomePage />} />
    </Routes>
  </BrowserRouter>
)
