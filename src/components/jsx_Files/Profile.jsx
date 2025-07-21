// Note :
// * formData	Temporary state while editing	✅ When isEditing === true  user	Permanent profile data	✅ When isEditing === false


import React, { useState, useEffect } from 'react';
import '../css_files/Profile.css';
import ProfContainer from './Prof_container';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({});
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
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 30000);
  };

  // Validate input field
  const validateField = (name, value) => {
    let error = ''; // we are intializing the error to empty string
    
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
      
      default:// we Write this beacue 
        break;
    }
    
    setErrors(prev => ({    // this is the inital State of the errors 
      ...prev,            
      [name]: error
    }));
    
    return !error; //3*  So if there is any error we set error variable its has a value not is true we convert that into the flase and return 
  };

  // Handle input change with validation
  const handleInputChange = (e) => {
    const { id, value } = e.target; // profile-email-input this is the example output of the id  and value is the value of the input field
    const fieldName = id.replace('-input', '').replace('profile-', ''); // this will remove the profile- and -input from the id so we will get the email as the output 
    
    setFormData(prev => ({
      ...prev,
      [fieldName]: value     // so we are using teh fieldname to set the value of the input Field like an email
    }));
    
    // Validate field on change
    if (isEditing) {
      validateField(fieldName, value);
    }
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


  // Toggle edit mode
  const handleEditToggle = async () => {
      if (isEditing) { // this is only Work when the data is Editing 
        // Validate all fields before saving
        const fieldsToValidate = ['name', 'email', 'phone_number', 'date_of_birth'];
        const isValid = fieldsToValidate.every(field => {     // the use of the every is It returns true only if all validations return true
          return validateField(field, formData[field]); // field is the name of the field and formData[field] is the value of the field
        }); 
        
        if (isValid) { // this is the reasone we are Writing the isValid
          setUser(formData);
 
          try {
            await saveProfileData(); // we write the await beacuse we want to wait for the saveProfileData to finish before we continue
          } catch (error) {
            // If backend save fails, we can still show the updated UI
            // but inform the user about the error
            showToast('Profile saved locally but failed to sync with server', 'warning');
          }        
        
        } else {
          showToast('Please fix the validation errors', 'error');
          return;
        }
      }
    setIsEditing(!isEditing);
  };

  

  return (
    <div className="profile-container">
      <div classname="Profile-Section">
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
           
            <div className="detail-group">
              <span className="detail-label">Reg No.</span>
              <span className="detail-value" id="profile-reg-display">{user.register_number}</span>
            </div>

            {["email","phone_number","date_of_birth","name"].map((field)=>{
                return(
                    <ProfContainer 
                    user={user}
                    formData={formData[field]}
                    errors={errors[field]}
                    isEditing={isEditing}
                    handleInputChange={handleInputChange}
                    fieldName={field}
                    label={field.charAt(0).toUpperCase() + field.slice(1)} // made the Field name as the key to send the value to the Component
                  />
                )
            })}
            

          </div>
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
          ))}{/* We need to use this because we need to use the {} to make the jsx understand the js */}
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
      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast ${toast.type}`}>
          <div className="toast-message">
            {toast.message}
          </div>
        </div>
      )}

    </div>
   
  );
};

export default Profile;