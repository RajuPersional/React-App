import React, { useState, useEffect } from 'react';
import '../css_files/Enrollment.css'; // Make sure to create this CSS file

const Enrollment = () => {
  const [courses, setCourses] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('slot-a');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/backend/Json_Files/Enrollment.json");
        const courseData = await response.json();
        setCourses(courseData[selectedSlot] || []);
      } catch (error) {
        console.error('Error loading courses:', error);
        showToast('Error loading courses. Please try again.');
      }
    };

    fetchCourses();
  }, [selectedSlot]);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleSlotChange = (e) => {
    setSelectedSlot(e.target.value);
    setSelectedCourse(null);
  };

  const handleCourseSelect = (course, index) => {
    setSelectedCourse({ ...course, index });
  };

  const handleEnrollment = async () => {
    if (!selectedCourse) {
      showToast('Please select a course before enrolling.');
      return;
    }

    try {
      const parts = selectedCourse.title.split('-');
      // const code = parts[0];
      const subject = parts[1];
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

      showToast(`Enrollment successful! ${subject}`);
    //   console.log('Enrollment saved:', data);
    } catch (error) {
      console.error('Error:', error);
      showToast(error.message || 'Error processing enrollment');
    }
  };

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
                className={`course-card ${selectedCourse?.index === idx ? 'selected-course' : ''}`}
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
                {course.badge && (
                  <div className="course-badge">{course.badge}</div>
                )}
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

      {toast.show && (
        <div className="toast">
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default Enrollment;