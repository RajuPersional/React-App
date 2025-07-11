import React, { useState } from 'react';
import '../css_files/Attendance.css'; // Link your styles here

const Attendance = () => {
  // Sample attendance data
  const [attendanceData, setAttendanceData] = useState([
    {
      sno: 1,
      courseCode: 'CS101',
      courseName: 'Intro to CS',
      classAttended: 12,
      attendedHours: 24,
      totalClass: 15,
      totalHours: 30,
      percentage: 80,
      details: [
        { sno: 1, date: '2025-07-01', type: 'Absent' },
        { sno: 2, date: '2025-07-04', type: 'Leave' }
      ]
    },
    {
      sno: 2,
      courseCode: 'MATH301',
      courseName: 'Discrete Math',
      classAttended: 10,
      attendedHours: 20,
      totalClass: 15,
      totalHours: 30,
      percentage: 67,
      details: [
        { sno: 1, date: '2025-07-02', type: 'Absent' }
      ]
    },
    {
      sno: 3,
      courseCode: 'PHY201',
      courseName: 'Mechanics',
      classAttended: 15,
      attendedHours: 30,
      totalClass: 15,
      totalHours: 30,
      percentage: 100,
      details: []
    }
  ]);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const openModal = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
  };

  return (
    <div className="Attendence-container">
      <table className="attendance-table">
        <thead>
          <tr>
            <th className="sortable">S No. <span className="sort-icon">▲</span></th>
            <th className="sortable">Course Code <span className="sort-icon">▲</span></th>
            <th className="sortable">Course Name <span className="sort-icon">▲</span></th>
            <th className="sortable">Class Attended <span className="sort-icon">▲</span></th>
            <th className="sortable">Attended Hours <span className="sort-icon">▲</span></th>
            <th className="sortable">Total Class <span className="sort-icon">▲</span></th>
            <th className="sortable">Total Hours <span className="sort-icon">▲</span></th>
            <th className="sortable">% <span className="sort-icon">▲</span></th>
            <th className="sortable">View <span className="sort-icon">▲</span></th>
          </tr>
        </thead>
        <tbody>
          {attendanceData.map((course, index) => (
            <tr key={index}>
              <td>{course.sno}</td>
              <td>{course.courseCode}</td>
              <td>{course.courseName}</td>
              <td>{course.classAttended}</td>
              <td>{course.attendedHours}</td>
              <td>{course.totalClass}</td>
              <td>{course.totalHours}</td>
              <td>{course.percentage}%</td>
              <td>
                <button onClick={() => openModal(course)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination-info">
        Showing 1 to {attendanceData.length} of {attendanceData.length} entries
      </div>

      {showModal && selectedCourse && (
        <div id="attendance-modal" className="modal">
          <div className="modal-content">
            <span id="close" className="close-button" onClick={closeModal}>&times;</span>
            <h3 id="wise">Attendance day wise absent details</h3>
            <table className="modal-table">
              <thead>
                <tr>
                  <th>S No.</th>
                  <th>Dated On</th>
                  <th>Attendance Type</th>
                </tr>
              </thead>
              <tbody id="modal-table-body">
                {selectedCourse.details.length === 0 ? (
                  <tr>
                    <td colSpan="3">No absence records</td>
                  </tr>
                ) : (
                  selectedCourse.details.map((detail, i) => (
                    <tr key={i}>
                      <td>{detail.sno}</td>
                      <td>{detail.date}</td>
                      <td>{detail.type}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <button className="close-button modal-close-btn" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
