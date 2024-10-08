import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, CheckCircle, User, Bookmark, Award, Calendar } from 'lucide-react';
import Api from '../../Api/Api';
import logo from '../../Assest/logo.png'

const Home = () => {
  const [activeSection, setActiveSection] = useState('enrolled');
  const [userData, setUserData] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const localstorage = localStorage.getItem('user');
    if (!localstorage) {
      navigate('/login');
    } else {
      const fetchedUserData = JSON.parse(localstorage);
      setUserData(fetchedUserData);
      
      const StudentId = fetchedUserData?.studentId;
      if (StudentId) {
        fetchCourses(StudentId);
      }
    }
  }, []);

  const fetchCourses = async (StudentId) => {
    try {
      const enrolledResponse = await Api.get(`/course/enrolled/${StudentId}`);
      const enrolledCoursesData = enrolledResponse.data?.enrolledCourses || enrolledResponse.data || [];
      setEnrolledCourses(Array.isArray(enrolledCoursesData) ? enrolledCoursesData : []);

      const completedResponse = await Api.get(`/course/completed/${StudentId}`);
      const completedCoursesData = completedResponse.data?.completedCourses || completedResponse.data || [];
      setCompletedCourses(Array.isArray(completedCoursesData) ? completedCoursesData : []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const renderContent = () => {
    if (activeSection === 'enrolled') {
      return (
        <div className="content-card">
          <h3><Bookmark className="section-icon" /> Enrolled Courses</h3>
          <div className="course-grid">
            {enrolledCourses.length > 0 ? (
              enrolledCourses.map((course, index) => (
                <div key={index} className="course-item">
                  <Book className="course-icon" />
                  <div>
                    <h4>{course.courseName}</h4>
                    <p><Calendar className="info-icon" /> Approved: {new Date(course.approvedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No enrolled courses yet.</p>
            )}
          </div>
        </div>
      );
    } else if (activeSection === 'completed') {
      return (
        <div className="content-card">
          <h3><Award className="section-icon" /> Completed Courses</h3>
          <div className="completed-list">
            {completedCourses.length > 0 ? (
              completedCourses.map((course, index) => (
                <div key={index} className="completed-item">
                  <div>
                    <h4>{course.courseName}</h4>
                    <p><Calendar className="info-icon" /> Completed: {new Date(course.completedAt).toLocaleDateString()}</p>
                  </div>
                  <CheckCircle className="check-icon" />
                </div>
              ))
            ) : (
              <p>No completed courses yet.</p>
            )}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="home-container">
      <header>
        <div className="header-content">
          <div className="header-left">
            <img src={logo} alt="Logo" className="logo" />
          </div>
          <div className="header-right">
            <div className="user-profile" onClick={() => setShowDropdown(!showDropdown)}>
              <div className="user-avatar">
                <User />
              </div>
              <span className="user-name">{userData?.name}</span>
              {showDropdown && (
                <div className="dropdown-menu">
                  <button onClick={handleLogout}>
                    <User className="dropdown-icon" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="welcome-banner">
          <h1>Welcome back, {userData ? userData.name : 'Seeker of Peace'}!</h1>
          <p>Ready to continue your journey to inner peace and self-discovery?</p>
          <button className="resume-btn">Resume Learning</button>
        </section>

        <section className="nav-buttons">
          <button
            onClick={() => setActiveSection('enrolled')}
            className={`nav-btn ${activeSection === 'enrolled' ? 'active' : ''}`}
          >
            <Book className="nav-icon" />
            Enrolled Courses
          </button>
          <button
            onClick={() => setActiveSection('completed')}
            className={`nav-btn ${activeSection === 'completed' ? 'active' : ''}`}
          >
            <CheckCircle className="nav-icon" />
            Completed Courses
          </button>
        </section>

        <section className="content-section">{renderContent()}</section>
      </main>
      
      <style jsx>{`
        .home-container {
          min-height: 100vh;
          background-color: #f0f2f5;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        header {
          background-color: #ffffff;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-left {
          display: flex;
          align-items: center;
        }

        .logo {
          height: 2.5rem;
        }

        .user-profile {
          display: flex;
          align-items: center;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 25px;
          transition: background-color 0.3s ease;
          position: relative;
        }

        .user-profile:hover {
          background-color: #f0f2f5;
        }

        .user-avatar {
          width: 2.5rem;
          height: 2.5rem;
          background-color: #4a90e2;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 0.75rem;
        }

        .user-name {
          margin-right: 0.5rem;
          font-weight: 500;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          padding: 0.5rem;
          min-width: 200px;
          z-index: 1000;
        }

        .dropdown-menu button {
          width: 100%;
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.9rem;
          color: #333;
          transition: background-color 0.3s ease;
        }

        .dropdown-menu button:hover {
          background-color: #f0f2f5;
        }

        .dropdown-icon {
          margin-right: 0.75rem;
          color: #666;
        }

        main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .welcome-banner {
          background: linear-gradient(135deg, #4a90e2, #63b3ed);
          color: white;
          padding: 3rem 2rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          box-shadow: 0 4px 15px rgba(74, 144, 226, 0.2);
        }

        .welcome-banner h1 {
          font-size: 2.2rem;
          margin-bottom: 0.5rem;
        }

        .welcome-banner p {
          font-size: 1.2rem;
          margin-bottom: 1.5rem;
          opacity: 0.9;
        }

        .resume-btn {
          background-color: white;
          color: #4a90e2;
          border: none;
          padding: 0.7rem 1.5rem;
          border-radius: 25px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .resume-btn:hover {
          background-color: #f0f2f5;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
        }

        .nav-buttons {
          display: flex;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .nav-btn {
          background-color: white;
          border: none;
          padding: 0.7rem 1.5rem;
          margin: 0 0.5rem;
          border-radius: 25px;
          display: flex;
          align-items: center;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .nav-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
        }

        .nav-btn.active {
          background-color: #4a90e2;
          color: white;
        }

        .nav-icon {
          margin-right: 0.5rem;
        }

        .content-card {
          background-color: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .content-card h3 {
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
          color: #333;
          display: flex;
          align-items: center;
        }

        .section-icon {
          margin-right: 0.75rem;
          color: #4a90e2;
        }

        .course-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .course-item {
          background-color: #f9f9f9;
          padding: 1.5rem;
          border-radius: 12px;
          transition: all 0.3s ease;
          display: flex;
          align-items: flex-start;
        }

        .course-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
        }

        .course-icon {
          color: #4a90e2;
          margin-right: 1rem;
          font-size: 2rem;
        }

        .course-item h4 {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
          color: #333;
        }

        .info-icon {
          vertical-align: middle;
          margin-right: 0.3rem;
          color: #666;
        }

        .completed-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .completed-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #f9f9f9;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .completed-item:hover {
          transform: translateX(5px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .check-icon {
          color: #4caf50;
          font-size: 1.5rem;
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            align-items: flex-start;
          }

          .header-left {
            width: 100%;
            margin-bottom: 1rem;
          }

          .nav-buttons {
            flex-direction: column;
          }

          .nav-btn {
            width: 100%;
            margin: 0.5rem 0;
          }

          .course-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;