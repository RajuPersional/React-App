import React, { useState, useEffect } from 'react';
import '../css_files/Profile.css';
import ProfContainer from './Prof_container';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({ ...user });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });


  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch('/api/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        const data = await response.json();

        if (data.status === 'success') {
          setUser(data.data);
          setFormData(data.data);
        } else {
          throw new Error(data.error || 'Failed to fetch profile data');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast(error.message || 'Error fetching profile data', 'error');
      }
    };
    fetchProfileData();
  }, []);
  
  // Show toast message
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  // Validate input field
  const validateField = (name, value) => {
    let error = '';
    
    switch(name) {
      case 'email':
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(value)) {
          error = 'Please enter a valid email address';
        } else if (value.length > 254) {
          error = 'Email is too long';
        }
        break;
      
      case 'phone_number':
        const phonePattern = /^\d{10}$/;
        if (!phonePattern.test(value)) {
          error = 'Phone number must be 10 digits';
        }
        break;
      
      case 'name':
        if (value.length < 2) {
          error = 'Name must be at least 2 characters';
        } else if (value.length > 50) {
          error = 'Name is too long';
        } else if (!/^[a-zA-Z\s.'-]+$/.test(value)) {
          error = 'Name contains invalid characters';
        }
        break;
      
      case 'date_of_birth':
        const date = new Date(value);
        const today = new Date();
        const minDate = new Date();
        minDate.setFullYear(today.getFullYear() - 100);
        
        if (isNaN(date.getTime())) {
          error = 'Invalid date';
        } else if (date >= today) {
          error = 'Date must be in the past';
        } else if (date < minDate) {
          error = 'Date is too far in the past';
        }
        break;
      
      default:
        break;
    }
    
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
    
    return !error;
  };

  // Handle input change with validation
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const fieldName = id.replace('-input', '').replace('profile-', '');
    
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    // Validate field on change
    if (isEditing) {
      validateField(fieldName, value);
    }
  };

  // Toggle edit mode
  const handleEditToggle = async () => {
    if (isEditing) {
      // Validate all fields before saving
      const fieldsToValidate = ['name', 'email', 'phone_number', 'date_of_birth'];
      const isValid = fieldsToValidate.every(field => {
        return validateField(field, formData[field]);
      });
      
      if (isValid) {
        await saveProfileData();
      } else {
        showToast('Please fix the validation errors', 'error');
        return;
      }
    }
    setIsEditing(!isEditing);
  };

  // Save profile data to API
  const saveProfileData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      const data = await response.json();

      if (data.status === 'success') {
        setUser({ ...formData });
        showToast('Profile updated successfully!');
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error:', error);
      showToast(error.message || 'An error occurred', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-container">
      {/* Header Section */}
      <div className="profile-header">
        <h1 className="profile-title">My Profile</h1>
        <button 
          type="button" 
          className="edit-btn hover-element" 
          id="edit-save-btn"
          onClick={handleEditToggle}
        >
          {isEditing ? 'Save Profile' : 'Edit Profile'}
        </button>
      </div>

      <div className="profile-content">
        <div className="profile-image-container">
          <div className="profile-image hover-element"></div>
        </div>
        <div className="profile-details">
         
          <ProfContainer 
            user={user}
            formData={formData.name}
            errors={errors.name}
            isEditing={isEditing}
            handleInputChange={handleInputChange}
            fieldName="name"
            label="Name"
          />
          <div className="detail-group">
            <span className="detail-label">Reg No.</span>
            <span className="detail-value" id="profile-reg-display">{user.register_number}</span>
          </div>
          <ProfContainer 
            user={user}
            formData={formData.email}
            errors={errors.email}
            isEditing={isEditing}
            handleInputChange={handleInputChange}
            fieldName="email"
            label="Email"
          />  
          <ProfContainer 
            user={user}
            formData={formData.date_of_birth}
            errors={errors.date_of_birth}
            isEditing={isEditing}
            handleInputChange={handleInputChange}
            fieldName="date_of_birth"
            label="Date of Birth"
          />
          <ProfContainer 
            user={user}
            formData={formData.phone_number}
            errors={errors.phone_number}
            isEditing={isEditing}
            handleInputChange={handleInputChange}
            fieldName="phone_number"
            label="Phone Number"
          />

        </div>
      </div>

      {/* Student Record Overview */}
      <section className="overview-section">
        <h2 className="overview-title">Student Record Overview</h2>
        <div className="stats-grid">
          {[
            { label: 'Awards', value: 0 },
            { label: 'Conference Attended', value: 0 },
            { label: 'Seminar(Attended)', value: 0 },
            { label: 'Research Projects', value: 0 },
            { label: 'Publication', value: 0 },
            { label: 'Sponsor Project NIRF', value: 0 }
          ].map((stat, index) => (
            <div className="stat-card hover-element" key={index}>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Student Record Details */}
      <section className="table-section">
        <h2 className="section-title">Student Record Details</h2>

        <div className="table-container">
          <table className="data-table">
            <thead className="table-header">
              <tr>
                <th>SNo.</th>
                <th>Details</th>
                <th>Type</th>
                <th>Dated On</th>
                <th>View File</th>
              </tr>
            </thead>
            <tbody>
              <tr className="table-row">
                <td colSpan="5" className="no-data">No records found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Loading Spinner */}
      <div className="loading-spinner" style={{ display: 'none' }}>
        <div className="spinner"></div>
      </div>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default Profile;