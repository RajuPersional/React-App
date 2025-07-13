import React, { useState, useEffect } from 'react';
import '../css_files/Attendance.css';

const Attendance = () => {
  const [courses, setCourses] = useState({});
  const [attendanceData, setAttendanceData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        console.time("FetchAttendance"); // Start timer
        const response = await fetch('http://localhost:5000/api/merged-attendance', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
  
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
        const result = await response.json();
        console.timeEnd("FetchAttendance"); // End timer
  
        if (result.status === 'error') throw new Error(result.error);
  
        const data = result.data;
        if (!data || (!data.courses && !data.attendance)) throw new Error('Invalid data format');
  
        console.time("StateUpdate");
        setCourses(data.courses);
        setAttendanceData(data.attendance);
        setIsLoading(false);
        console.timeEnd("StateUpdate");
  
      } catch (err) {
        console.error('Error loading attendance data:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };
  
    fetchAttendanceData();
  }, []);
  

  const openModal = (courseCode) => {
    setSelectedCourse(courseCode);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  return (
    <>
      {isLoading && <div className="loading">Loading attendance data...</div>}
      {!isLoading && error && <div className="error">{error}</div>}{/* this means we if the data is recieved and the error occured then display this message*/}
      {!isLoading && !error && (
        <div className={`Attendance-container ${isModalOpen ? 'modal-open' : ''}`}>
          <h2>Attendance Summary</h2>
          <div className="table-responsive">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Course Code</th>
                  <th>Course Name</th>
                  <th>Classes Attended</th>
                  <th>Hours Attended</th>
                  <th>Total Classes</th>
                  <th>Total Hours</th>
                  <th>Percentage</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(courses).map(([courseCode, course], index) => (
                  <tr key={courseCode}>
                    <td>{index + 1}</td>
                    <td>{courseCode}</td>
                    <td>{course.CourseName || 'Unknown Course'}</td>
                    <td>{course.ClassAttended || 0}</td>
                    <td>{course.AttendedHours || 0}</td>
                    <td>{course.TotalClass || 0}</td>
                    <td>{course.TotalHours || 0}</td>
                    <td>{course.Percentage || '0%'}</td>
                    <td>
                      <button
                        className="details-btn"
                        onClick={() => openModal(courseCode)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
  
      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Attendance Details - {selectedCourse}</h3>
              <button className="close-button" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              <table className="modal-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData[selectedCourse]?.length > 0 ? (
                    attendanceData[selectedCourse].map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.datedOn}</td>
                        <td>{item.attendanceType}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="no-data">No attendance records found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <button className="details-btn" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </>
  );
  
};

export default Attendance;
