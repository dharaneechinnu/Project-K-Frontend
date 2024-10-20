import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, CheckCircle, User, Bookmark, Award, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import Api from '../../Api/Api';
import logo from '../../Assest/logo.png';

const Home = () => {
  const [activeSection, setActiveSection] = useState('enrolled');
  const [userData, setUserData] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const courseGridRef = useRef(null);
  const completedCoursesRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const localstorage = localStorage.getItem('user');
    if (!localstorage) {
      navigate('/login');
    } else {
      const fetchedUserData = JSON.parse(localstorage);
      setUserData(fetchedUserData);
      
      const studentId = fetchedUserData?.studentId;
      if (studentId) {
        console.log("StudentId : ",studentId)
        fetchCourses(studentId);
      }
    }
  }, []);

  const fetchCourses = async (studentId) => {
    try {
      // Fetch enrolled courses
      const enrolledResponse = await Api.get(`/course/enrolled/${studentId}`);
      const enrolledCoursesData = enrolledResponse.data?.enrolledCourses || enrolledResponse.data || [];
      console.log('Enrolled Courses Data:', enrolledCoursesData); // Log enrolled courses data
      setEnrolledCourses(Array.isArray(enrolledCoursesData) ? enrolledCoursesData : []);
  
      // Fetch completed courses
      const completedResponse = await Api.get(`/course/completed/${studentId}`);
      const completedCoursesData = completedResponse.data?.completedCourses || completedResponse.data || [];
      console.log('Completed Courses Data:', completedCoursesData); // Log completed courses data
      setCompletedCourses(Array.isArray(completedCoursesData) ? completedCoursesData : []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleResumeLearning = () => {
    navigate('/learning-dashboard');
  };

  const scrollCourses = (direction, ref) => {
    if (ref.current) {
      const scrollAmount = 300;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const renderContent = () => {
    if (activeSection === 'enrolled') {
      return (
        <div className="content-card">
          <h3><Bookmark className="section-icon" /> Enrolled Courses</h3>
          <div className="course-container">
            <button 
              className="scroll-button scroll-left"
              onClick={() => scrollCourses('left', courseGridRef)}
            >
              <ChevronLeft size={24} />
            </button>
            <div className="course-grid" ref={courseGridRef}>
              {enrolledCourses.length > 0 ? (
                enrolledCourses.map((course, index) => (
                  <div key={index} className="course-item">
                    <Book className="course-icon" />
                    <div className="course-content">
                      <h4>{course.courseName}</h4>
                      <p>
                        <Calendar className="info-icon" /> 
                        Approved: {new Date(course.approvedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-courses">No enrolled courses yet.</p>
              )}
            </div>
            <button 
              className="scroll-button scroll-right"
              onClick={() => scrollCourses('right', courseGridRef)}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      );
    } else if (activeSection === 'completed') {
      return (
        <div className="content-card">
          <h3><Award className="section-icon" /> Completed Courses</h3>
          <div className="course-container">
            <button 
              className="scroll-button scroll-left"
              onClick={() => scrollCourses('left', completedCoursesRef)}
            >
              <ChevronLeft size={24} />
            </button>
            <div className="completed-list" ref={completedCoursesRef}>
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
                <p className="no-courses">No completed courses yet.</p>
              )}
            </div>
            <button 
              className="scroll-button scroll-right"
              onClick={() => scrollCourses('right', completedCoursesRef)}
            >
              <ChevronRight size={24} />
            </button>
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
            <h2>Soul Stretch</h2>
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
          <button onClick={handleResumeLearning} className="resume-btn">Resume Learning</button>
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

      .course-container {
  position: relative;
  width: 94%;
  padding: 0 40px;
}

.course-grid,
.completed-list {
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  gap: 1.5rem;
  padding: 1rem 0;
}

.course-grid::-webkit-scrollbar,
.completed-list::-webkit-scrollbar {
  display: none;
}

.course-item,
.completed-item {
  min-width: 280px;
  max-width: 400px;
  flex: 0 0 auto;
  background-color: #f9f9f9;
  padding: 1.5rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  display: flex;
  align-items: flex-start;
}

.course-content,
.completed-item > div {
  flex: 1;
  min-width: 0;
}

.course-content h4,
.completed-item h4 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.scroll-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background: #f0f2f5;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  z-index: 10;
}

.scroll-button:hover {
  background: #e0e3e9;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.scroll-left {
  left: -15px;
}

.scroll-right {
  right: -15px;
}

.no-courses {
  padding: 2rem;
  text-align: center;
  color: #666;
  width: 100%;
}

@media (max-width: 768px) {
  .course-container {
    padding: 0;
  }

  .scroll-button {
    display: none;
  }

  .course-grid,
  .completed-list {
    padding: 1rem;
  }

  .course-item,
  .completed-item {
    min-width: 260px;
  }
}
        .home-container {
          min-height: 100vh;
          background-color: #f0f2f5;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        h2{
          margin-left:5px;
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

 .course-container {
          position: relative;
          width: 94%;
          padding: 0 40px;
        }

        .course-grid {
          display: flex;
          overflow-x: auto;
          scroll-behavior: smooth;
          scrollbar-width: none;
          -ms-overflow-style: none;
          gap: 1.5rem;
          padding: 1rem 0;
        }

        .course-grid::-webkit-scrollbar {
          display: none;
        }

        .course-item {
          min-width: 280px;
          max-width: 400px;
          flex: 0 0 auto;
          background-color: #f9f9f9;
          padding: 1.5rem;
          border-radius: 12px;
          transition: all 0.3s ease;
          display: flex;
          align-items: flex-start;
        }

        .course-content {
          flex: 1;
          min-width: 0;
        }

        .course-content h4 {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .scroll-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          background: #f0f2f5;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          z-index: 10;
        }

        .scroll-button:hover {
          background: #f0f2f5;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .scroll-left {
          left: -15px;
        }

        .scroll-right {
          right: 20px;
        }

        .no-courses {
          padding: 2rem;
          text-align: center;
          color: #666;
          width: 100%;
        }

        @media (max-width: 768px) {
          .course-container {
            padding: 0;
          }

          .scroll-button {
            display: none;
          }

          .course-grid {
            padding: 1rem;
          }

          .course-item {
            min-width: 260px;
          }
        }

        .info-icon {
          vertical-align: middle;
          margin-right: 0.3rem;
          color: #666;
        }

        .completed-list {
          display: flex;
          flex-direction: row;
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
          min-width:400px;
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