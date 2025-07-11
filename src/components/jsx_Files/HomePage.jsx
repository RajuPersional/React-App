import Sidebar from './Sidebar'
import '../css_files/HomePage.css'
import { Outlet } from 'react-router-dom';
const HomePage =() => {
            return (
                <div className="container">
                    <div className="full-container">
                        {/* Sidebar */}
                        <aside className="sidebar">
                            <div className="toggle">
                                <i className="fas fa-bars menu-toggle"></i>
                            </div>
                            <div className="logo-container">
                                <img src="/Logo.jpeg" alt="Company Logo" className="logo" />
                            </div>
                            <Sidebar />
                        </aside>
                        {/* Right side */}
                        <div className="right-side">
                            <header className="main-header">
                                <div className="header-left">
                                    <img src="/saveetha.png" alt="Logo" className="header-logo" />
                                </div>
                                <div className="header-right">
                                    <span className="header-user">raju</span>
                                    <i className="fas fa-bell"></i> 
                                    <i className="fas fa-user-circle" onClick={() => loadPage("/Profile")}></i>
                                    <i className="fas fa-sign-out-alt sig-out" style={{ cursor: "pointer" }}></i>
                                </div>
                            </header>
                            <div id="total-container" className="total-content">
                                <Outlet />
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
export default HomePage 
