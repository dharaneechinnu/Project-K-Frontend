import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, CheckCircle, Search, Bell, ChevronDown } from 'lucide-react';
import Api from '../../Api/Api'; // Assuming you have an Axios instance set up

const Home = () => {
  const [activeSection, setActiveSection] = useState('enrolled');
  const [userData, setUserData] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const localstorage = localStorage.getItem('user');
    if (!localstorage) {
      navigate('/login');
    } else {
      const fetchedUserData = JSON.parse(localstorage);
      setUserData(fetchedUserData);
      
      const StudentId = fetchedUserData?.studentId; // Extract the student ID from the user data
      console.log("Student : ",StudentId)
      if (StudentId) {
        // Fetch enrolled and completed courses
        fetchCourses(StudentId);
      }
    }
  }, []);

  const fetchCourses = async (StudentId) => {
    try {
      // Fetch enrolled courses
      const enrolledResponse = await Api.get(`/course/enrolled/${StudentId}`);
  
      // Safely access the enrolledCourses data (adjust based on actual API response structure)
      const enrolledCoursesData = enrolledResponse.data?.enrolledCourses || enrolledResponse.data || []; 
      console.log("enrolledCoursesData", enrolledCoursesData);

      // Ensure it's an array
      if (!Array.isArray(enrolledCoursesData)) {
        console.error("Expected an array but got something else", enrolledCoursesData);
        setEnrolledCourses([]);
      } else {
        setEnrolledCourses(enrolledCoursesData);
        console.log("enrolledCourses : ", enrolledCoursesData);
      }
  
  
      const completedResponse = await Api.get(`/course/completed/${StudentId}`);
      const completedCoursesData = completedResponse.data?.completedCourses || completedResponse.data || [];
      if (!Array.isArray(completedCoursesData)) {
        console.error("Expected an array but got something else", completedCoursesData);
        setCompletedCourses([]);
      } else {
        setCompletedCourses(completedCoursesData);
        console.log("completedCourses : ", completedCoursesData);
      }
  
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const renderContent = () => {
    if (activeSection === 'enrolled') {
      return (
        <div className="content-card">
          <h3>Enrolled Courses</h3>
          <div className="course-grid">
            {enrolledCourses.length > 0 ? (
              enrolledCourses.map((course, index) => (
                <div key={index} className="course-item">
                  <h4>{course.courseName}</h4>
                  <p>Approved on: {new Date(course.approvedAt).toLocaleDateString()}</p>
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
          <h3>Completed Courses</h3>
          <div className="completed-list">
            {completedCourses.length > 0 ? (
              completedCourses.map((course, index) => (
                <div key={index} className="completed-item">
                  <div>
                    <h4>{course.courseName}</h4>
                    <p>Completed on: {new Date(course.completedAt).toLocaleDateString()}</p>
                  </div>
                  <CheckCircle className="check-icon" size={24} />
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
            <img src="/logo.png" alt="Logo" className="logo" />
            <div className="search-container">
              <input type="text" placeholder="Search for courses" className="search-input" />
              <Search className="search-icon" size={18} />
            </div>
          </div>
          <div className="header-right">
            <Bell className="notification-icon" size={20} />
            <div className="user-profile">
              <div className="user-avatar">
                {userData?.name.charAt(0).toUpperCase()}
              </div>
              <ChevronDown size={16} />
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="welcome-banner">
          <h1>Welcome back, {userData ? userData.name : 'Seeker of Peace'}!</h1>
          <p>Ready to continue your journey to inner peace and self-discovery?</p>
        </section>

        <section className="nav-buttons">
          {['enrolled', 'completed'].map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`nav-btn ${activeSection === section ? 'active' : ''}`}
            >
              {section === 'enrolled' && <Book className="nav-icon" size={18} />}
              {section === 'completed' && <CheckCircle className="nav-icon" size={18} />}
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </section>

        <section className="content-section">{renderContent()}</section>
      </main>
      
<style jsx>{`
  .home-container {
    min-height: 100vh;
    background-color: #f0f2f5;
    font-family: Arial, sans-serif;
  }

  header {
    background-color: #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header-left, .header-right {
    display: flex;
    align-items: center;
  }

  .logo {
    height: 2rem;
    margin-right: 1rem;
  }

  .search-container {
    position: relative;
  }

  .search-input {
    padding: 0.5rem 1rem 0.5rem 2.5rem;
    border: 1px solid #ccc;
    border-radius: 20px;
    font-size: 0.9rem;
  }

  .search-icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
  }

  .notification-icon {
    margin-right: 1rem;
    color: #666;
    cursor: pointer;
  }

  .user-profile {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .user-avatar {
    width: 2rem;
    height: 2rem;
    background-color: #4a90e2;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-right: 0.5rem;
  }

  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  .welcome-banner {
    background: linear-gradient(to right, #4a90e2, #63b3ed);
    color: white;
    padding: 2rem;
    border-radius: 8px;
    margin-bottom: 2rem;
  }

  .welcome-banner h1 {
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
  }

  .welcome-banner p {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }

  .resume-btn {
    background-color: white;
    color: #4a90e2;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-weight: bold;
    cursor: pointer;
  }

  .quote-section {
    background-color: white;
    padding: 1.5rem;
    border-radius: 8px;
    text-align: center;
    font-style: italic;
    margin-bottom: 2rem;
  }

  .nav-buttons {
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
  }

  .nav-btn {
    background-color: white;
    border: none;
    padding: 0.5rem 1rem;
    margin: 0 0.5rem;
    border-radius: 20px;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.3s;
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
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .content-card h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #333;
  }

  .course-grid, .cert-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }

  .course-item, .cert-item {
    background-color: #f9f9f9;
    padding: 1rem;
    border-radius: 8px;
  }

  .course-item h4, .cert-item h4 {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }

  .progress-bar {
    background-color: #e0e0e0;
    height: 8px;
    border-radius: 4px;
    margin-bottom: 0.5rem;
  }

  .progress {
    background-color: #4caf50;
    height: 100%;
    border-radius: 4px;
  }

  .continue-btn, .view-all-btn {
    background-color: #4a90e2;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    cursor: pointer;
    margin-top: 1rem;
  }

  .cert-icon {
    color: #ffd700;
    margin-right: 1rem;
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
    padding: 1rem;
    border-radius: 8px;
  }

  .check-icon {
    color: #4caf50;
  }

  .quote {
    font-style: italic;
    color: #666;
  }

  @media (max-width: 768px) {
    .header-content, .nav-buttons {
      flex-direction: column;
    }

    .header-left, .header-right, .nav-btn {
      margin-bottom: 1rem;
    }

    .search-container {
      width: 100%;
    }

    .search-input {
      width: 100%;
    }
  }
`}</style>
    </div>
  );
};



export default Home;