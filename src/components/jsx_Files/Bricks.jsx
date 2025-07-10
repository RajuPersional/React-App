import React, { useState, useEffect } from 'react';
import '../css_files/Bricks.css';
import { useNavigate } from 'react-router-dom';



const Bricks = () => {
    const navigate = useNavigate();// the navigate is the Funtion name
    const [registerNumber, setRegisterNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [welcomeVisible, setWelcomeVisible] = useState(false);
    const [subheadingVisible, setSubheadingVisible] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        if (!registerNumber || !password) {
            setError('Please enter both registration number and password');
            return;
        }   
        setLoading(true);
        try {
            const res = await fetch('http://127.0.0.1:5000/api/login', {
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ 
                    registrationNumber: registerNumber,
                    password: password
                })
            });
            
            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error || 'Login failed');
            }
            navigate('./HomePage')
            

           
            // Handle successful login
            // alert('Login successful!');
            // <Attendance />
            // You can redirect or update app state here
            
        } catch (err) {// The err in catch (err) gets its value from the error that was thrown inside the try block`.
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    // Add animation effects
    useEffect(() => {
        // Force show the text immediately for testing
        // setWelcomeVisible(true);
        // setSubheadingVisible(true);
        
        // Original animation timing
        setTimeout(() => setWelcomeVisible(true), 500);//1*
        setTimeout(() => setSubheadingVisible(true), 1000);//1*
    }, []);

    return (
        <div className="bricks-root">
            <div className="bricks-container">
                <div className="bricks-first-container">
                    {/* Left Section */}
                    <div className="bricks-left-section">
                        <img 
                            className="bricks-image" 
                            src={`${import.meta.env.BASE_URL}Landing Page (1).jpeg`} // the output of the import.meta.env.BASE_URL base url "/"
                            alt="Landing Page"
                        />
                        <div className={`bricks-welcome ${welcomeVisible ? 'bricks-visible' : ''}`}>
                            GET READY FOR THE <span className="bricks-highlight">FEATURE</span>
                        </div>
                        <div className={`bricks-subheading ${subheadingVisible ? 'bricks-visible' : ''}`}>
                            Empowering minds, Enriching lives, Elevating communities
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="bricks-right-section">
                        <div className="bricks-login-container">
                            <img 
                                className="bricks-logo" 
                                src={`${import.meta.env.BASE_URL}Logo.jpeg`} 
                                alt="Logo"
                            />
                            <h1>Login to your account</h1>
                            
                            {error && <div className="bricks-error-message">{error}</div>}
                            
                            <form onSubmit={handleLogin}>
                                <div className="bricks-register-container">
                                    <label htmlFor="registerNumber">Register Number</label>
                                    <input
                                        type="text"
                                        id="registerNumber"
                                        value={registerNumber}
                                        onChange={(e) => setRegisterNumber(e.target.value)}
                                        required
                                        className="bricks-register-input"
                                        placeholder="Enter Register Number"
                                    />
                                </div>
                                
                                <div className="bricks-password-container">
                                    <label htmlFor="password">Enter Your Password</label>
                                    <div className="bricks-password-input-container">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="bricks-password-input"
                                            placeholder="Enter your password"
                                        />
                                        <button
                                            type="button"
                                            className="bricks-toggle-password"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? '👁️' : '👁️‍🗨️'}
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="bricks-remember-me">
                                    <input 
                                        type="checkbox" 
                                        id="remember" 
                                        className="bricks-checkbox" 
                                    />
                                    <label 
                                        htmlFor="remember" 
                                        className="bricks-remember-me-text"
                                    >
                                        Remember Me
                                    </label>
                                </div>
                                
                                <button 
                                    type="submit" 
                                    className="bricks-login-button" 
                                    disabled={loading}
                                >
                                    {loading ? 'Logging in...' : 'Login'}
                                </button>
                                
                                <div className="bricks-links">
                                    <a href="/verfy">Forgot Password</a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Bricks;