import React, { useState, useEffect, useRef } from 'react';
import '../css_files/Enrollment.css'; // Make sure to create this CSS file


const Enrollment = () => {
  const [courses, setCourses] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('slot-a');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });
  const toastTimeoutRef = useRef(null);

  const loadCourses = async (slot) => {
    try {
      const response = await fetch(`/backend/Json_Files/Enrollment.json`);
      const data = await response.json();
      setCourses(data[slot] || []);
    } catch (error) {
      console.error('Error loading courses:', error);
      showToast('Error loading courses. Please try again.');
    }
  };
  useEffect(() => { loadCourses(selectedSlot)}, [selectedSlot]);  
  


  const showToast = (message) => {
    
    if (toastTimeoutRef.current) { // if there is a timeout already scheduled, clear it
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ show: true, message });
    toastTimeoutRef.current = setTimeout(() => { // setTimeout() returns id right away — this is the ID for the scheduled task.
      setToast(prev => ({ ...prev, show: false }));
      toastTimeoutRef.current = null; // clear the ref after use
    }, 3000);
  };
      

  const handleSlotChange = (e) => {
    setSelectedSlot(e.target.value);
    setSelectedCourse(null);
  };

  const handleCourseSelect = (course, index) => {
    setSelectedCourse({ ...course, index }); //2* only one object will be created and Selected
  };

  const handleEnrollment = async () => {
    if (!selectedCourse) {
      showToast('Please select a course before enrolling.');
      return;
    }

    try {

      const parts = selectedCourse.title.split('-');
      const code = parts[0];
      const subject = parts[1];
      showToast(`Enrollment successful! ${subject}`);
      console.log(code);
      console.log(subject);
      
      // const subject = parts.slice(1, -1).join('-');
 
    //   const response = await fetch('/save-attendance', {
    //     method: 'POST',
    //     headers: { 
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ code, subject })
    //   });

    //   const data = await response.json();

    //   if (!response.ok) {
    //     throw new Error(data.message || 'Failed to save enrollment');
    //   }
    //   console.log('Enrollment saved:', data);
    } catch (error) {
      console.error('Error:', error);
      showToast(error.message || 'Error processing enrollment');
    }
  };


  const isSelected =(idx)=> selectedCourse?.index===idx // this is trhe Funtion which declare the selected course

  const toggleSection = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="enrollment-container">
      <div 
        className={`section-header ${isCollapsed ? 'collapsed' : ''}`} 
        onClick={toggleSection}
      >
        Course Enrollment
        <span className="toggle-icon">{isCollapsed ? '▼' : '▲'}</span>
      </div>

      {!isCollapsed && (
        <div className="enrollment-content">
          <div className="slot-selector">
            <label htmlFor="slotSelect">Select Time Slot:</label>
            <select 
              id="slotSelect" 
              value={selectedSlot} 
              onChange={handleSlotChange}
            >
              <option value="slot-a">Slot A</option>
              <option value="slot-b">Slot B</option>
              <option value="slot-c">Slot C</option>
              <option value="slot-d">Slot D</option>
            </select>
          </div>

          <div id="courseGrid" className="course-grid">
            {courses.map((course, idx) => (
              <div 
                key={idx} 
                className={`course-card ${isSelected(idx) ? 'selected-course' : ''}`}//1*
                onClick={() => handleCourseSelect(course, idx)}
              >
                <div className="radio-option">
                  <input 
                    type="radio" 
                    name="course" 
                    id={`course${idx}`} 
                    checked={selectedCourse?.index === idx}
                    readOnly
                  />
                  <label htmlFor={`course${idx}`}>{course.title}</label>
                </div>
                  <div className="course-badge">{course.badge}</div>
              </div>
            ))}
          </div>

          <button 
            className="btn-enrollment" 
            onClick={handleEnrollment}
            disabled={!selectedCourse}
          >
            Enroll Now
          </button>
        </div>
      )}

        {toast.show && <div className="toasts">
          {toast.message}
        </div>}
    </div>
  );
};

export default Enrollment;