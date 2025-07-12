import React, { useState } from 'react';
import '../css_files/Courses.css';

const CollapsibleSection = ({ title, className, children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => setIsCollapsed(prev => !prev);

  return (
    <div className={className}>
      <div className={`collapsible-section ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="section-headers" onClick={handleToggle}>
          {title}
          <span className="toggle-icon">{isCollapsed ? '▲' : '▼'}</span>
        </div>
        <div className="section-content">
          {!isCollapsed && children}
        </div>
      </div>
    </div>
  );
};

const CompletedCourses = () => {
  const completedCourses = [
    { sno: 1, code: 'SPIC1', name: 'Project 1', grade: 'B', status: 'PASS', date: 'April-2025' },
    { sno: 2, code: 'DSA06', name: 'Data Handling and Visualization', grade: 'A', status: 'PASS', date: 'February-2025' },
    { sno: 3, code: 'DSA04', name: 'Fundamentals of Data Science', grade: 'S', status: 'PASS', date: 'February-2025' },
    { sno: 4, code: 'CSA14', name: 'Compiler design', grade: 'B', status: 'PASS', date: 'February-2025' },
    { sno: 5, code: 'CSA47', name: 'Deep Learning', grade: 'B', status: 'PASS', date: 'November-2024' },
  ];

  return (
    <CollapsibleSection title="COMPLETED COURSES" className="completed-course">
      <div className="scrollable-wrapper">
        <table className="course-table" id="completed-courses-table">
          <thead>
            <tr>
              <th>Sno</th>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Grade</th>
              <th>Status</th>
              <th>Month & Year</th>
            </tr>
          </thead>
          <tbody>
            {completedCourses.map(course => (
              <tr key={course.sno}>
                <td><span className="course-code">{course.sno}</span></td>
                <td><span className="course-code">{course.code}</span></td>
                <td>{course.name}</td>
                <td><span className={`grade-badge grade-${course.grade.toLowerCase()}`}>{course.grade}</span></td>
                <td><span className={`status-badge status-${course.status.toLowerCase()}`}>{course.status}</span></td>
                <td>{course.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CollapsibleSection>
  );
};

const InProgressCourses = () => {
  const inProgressCourses = [
    { code: 'ML101', name: 'Machine Learning', status: 'Enrolled', enrolledOn: 'June-2025' },
    { code: 'WD102', name: 'Web Development', status: 'Ongoing', enrolledOn: 'May-2025' },
  ];

  return (
    <CollapsibleSection title="IN PROGRESS COURSES" className="inprogress-courses">
      <table className="course-table" id="inprogress-courses-table">
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Course Name</th>
            <th>Status</th>
            <th>Enroll On</th>
          </tr>
        </thead>
        <tbody>
          {inProgressCourses.map((course, index) => (
            <tr key={index}>
              <td><span className="course-code">{course.code}</span></td>
              <td>{course.name}</td>
              <td>{course.status}</td>
              <td>{course.enrolledOn}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </CollapsibleSection>
  );
};

const CourseManagement = () => {
  return (
    <div id="course-container" className="course-management">
      <CompletedCourses />
      <InProgressCourses />
    </div>
  );
};

export default CourseManagement;
