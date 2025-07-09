
import '../HomePage.css'
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
                                <img src="/static/Logo.jpeg" alt="Company Logo" className="logo" />
                            </div>
                            <ul className="sidebar-menu" style={{ overflow: "visible" }}>
                                <li data-url="/Dashboard"><i className="fas fa-tachometer-alt"></i> Dashboard</li>
                                <li data-url="/Course"><i className="fas fa-book"></i> My Courses</li>
                                <li data-url="/Attendance"><i className="fas fa-check-circle"></i> Attendence</li>
                                <li data-url="/Enrollment"><i className="fas fa-exclamation-triangle"></i> Enrollment</li>
                                <li data-url="/Financial"><i className="fas fa-gift"></i> Financial</li>
                                <li data-url="/Profile"><i className="fas fa-user"></i> Profile</li>
                                <li className="sig-out"><i className="fas fa-sign-out-alt"></i> Logout</li>
                            </ul>
                        </aside>
        
                        {/* Right side */}
                        <div className="right-side">
                            <header className="main-header">
                                <div className="header-left">
                                    <img src="/static/saveetha.png" alt="Logo" className="header-logo" />
                                </div>
                                <div className="header-right">
                                    <span className="header-user">raju</span>
                                    <i className="fas fa-bell"></i> 
                                    <i className="fas fa-user-circle" onClick={() => loadPage("/Profile")}></i>
                                    <i className="fas fa-sign-out-alt sig-out" style={{ cursor: "pointer" }}></i>
                                </div>
                            </header>
        
                            <div id="total-container" className="total-content">
                                {/* content will go here */}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
export default  HomePage 
