import '../css_files/Dashboard.css'

const Dashboard = () => {
    return (
      <div id="dashboard-section" className="Dashboard-section">
        <h1 className="Dashboard">Dashboard Overview</h1>
  
        <div className="main-content" style={{ flexDirection: "row" }}>
          <div className="right-column">
            {/* Notification Card */}
            <div className="card notification">
              <div className="card-header">
                <h2>
                  <i className="fas fa-bell"></i> Notification
                </h2>
                <div className="card-actions">
                  <i className="fas fa-ellipsis-h"></i>
                </div>
              </div>
              <div className="notification-list">
                {[...Array(4)].map((_, i) => (
                  <div className="notification-item" key={i}>
                    <div className="notification-avatar">
                      <img
                        src="/Landing Page (1).jpeg"
                        alt="Avatar"
                      />
                    </div>
                    <div className="notification-content">
                      <div className="notification-header">
                        {["System Update", "Meeting Reminder", "Document Shared", "New Task Assigned"][i]}{" "}
                        <span>
                          {["10m ago", "1h ago", "3h ago", "Yesterday"][i]}
                        </span>
                      </div>
                      <div className="notification-message">
                        {[
                          "A new system update is available. Please review the changes.",
                          "Project Alpha meeting scheduled for 2 PM today.",
                          <>
                            Jane Doe shared 'Q3 Report.pdf' with you.{" "}
                            <a href="#" className="notification-download">
                              <i className="fas fa-download"></i> Download
                            </a>
                          </>,
                          "You have been assigned a new task: 'Prepare presentation slides'.",
                        ][i]}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
  
          {/* Page Content */}
          <main className="page-content">
            <div className="content-row">
              <div className="card holiday-events">
                <div className="card-header">
                  <h2>
                    <i className="fas fa-calendar-alt"></i> Holiday & Events Calendar
                  </h2>
                  <div className="card-actions">
                    <i className="fas fa-ellipsis-h"></i>
                  </div>
                </div>
                <div className="calendar-controls">
                  <div className="calendar-nav">
                    <button>&lt;</button>
                    <button className="today">Today</button>
                    <button>&gt;</button>
                  </div>
                  <div className="calendar-title">July 2024</div>
                  <div className="calendar-view">
                    <button>Month</button>
                  </div>
                </div>
                <table className="calendar-grid">
                  <thead>
                    <tr>
                      <th>Sun</th>
                      <th>Mon</th>
                      <th>Tue</th>
                      <th>Wed</th>
                      <th>Thu</th>
                      <th>Fri</th>
                      <th>Sat</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td>
                    </tr>
                    <tr>
                      <td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td>
                    </tr>
                    <tr>
                      <td>14</td><td>15</td><td>16</td><td>17</td><td>18</td><td>19</td><td>20</td>
                    </tr>
                    <tr>
                      <td>21</td><td>22</td><td>23</td><td>24</td><td>25</td><td>26</td><td>27</td>
                    </tr>
                    <tr>
                      <td>28</td><td>29</td><td>30</td><td>31</td>
                    </tr>
                  </tbody>
                </table>
              </div>
  
              {/* Attendance Confirmation Card */}
              <div className="card attendance-confirmation">
                <div className="card-header">
                  <h2>
                    <i className="fas fa-user-check"></i> Attendance Confirmation
                  </h2>
                  <div className="card-actions">
                    <i className="fas fa-ellipsis-h"></i>
                  </div>
                </div>
                <div className="attendance-content">
                  <div className="icon">
                    <i className="fas fa-times-circle"></i>
                  </div>
                  <p>Attendance not confirmed for today.</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  };
  
export default Dashboard;