import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Activity, Users, Book, UserCheck, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Api from '../../Api/Api';

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('Admin-Token'); // Get the token from localStorage

        if (!token) {
          setError('No token found. Please login again.');
          setLoading(false);
          return;
        }

        const response = await Api.get('/Admin/stats', {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in Authorization header
          },
        });

        const data = response.data;
        setStats([
          { title: 'Total Users', value: data.totalUsers, icon: Users, color: '#3b82f6' },
          { title: 'Total Courses', value: data.totalCourses, icon: Book, color: '#10b981' },
          { title: 'User Enrollments', value: data.enrolledCourse, icon: UserCheck, color: '#8b5cf6' },
        ]);
        setMonthlyStats(data.monthlyStats || [
          { name: 'Jan', users: 1000, courses: 30, enrollments: 2000 },
          { name: 'Feb', users: 1200, courses: 35, enrollments: 2400 },
          { name: 'Mar', users: 1350, courses: 40, enrollments: 2700 },
          { name: 'Apr', users: 1500, courses: 50, enrollments: 3000 },
        ]);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch stats', err);
        setError('Failed to load stats.');
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  if (loading) {
    return <LoadingMessage>Loading stats...</LoadingMessage>;
  }
  
  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <DashboardContainer>
      <StatsContainer>
        {stats.map((stat) => (
          <StatCard key={stat.title} color={stat.color}>
            <StatHeader>
              <StatTitle>{stat.title}</StatTitle>
              <stat.icon size={20} color={stat.color} />
            </StatHeader>
            <StatValue>{stat.value.toLocaleString()}</StatValue>
            <StatChange>+20% from last month</StatChange>
          </StatCard>
        ))}
      </StatsContainer>
      {/* <ChartCard>
        <ChartTitle>Monthly Growth</ChartTitle>
        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#3b82f6" name="Users" />
              <Line type="monotone" dataKey="courses" stroke="#10b981" name="Courses" />
              <Line type="monotone" dataKey="enrollments" stroke="#8b5cf6" name="Enrollments" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </ChartCard> */}
    </DashboardContainer>
  );
};

// Styled Components
const DashboardContainer = styled.div`
  margin-bottom:10px;
  padding: 10px;
  background-color: white;
  border-radius: 8px;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  // margin-bottom: 24px;
  // margin-top: 24px;
  padding:10px;
`;

const StatCard = styled.div`
  background-color: #f3f4f6;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const StatTitle = styled.h3`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #111827;
`;

const StatChange = styled.p`
  font-size: 12px;
  color: #10b981;
  margin: 8px 0 0;
`;

const ChartCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ChartTitle = styled.h3`
  font-size: 18px;
  color: #1f2937;
  margin-bottom: 16px;
`;

const ChartContainer = styled.div`
  height: 300px;
`;

const LoadingMessage = styled.p`
  font-size: 16px;
  color: #4A90E2;
  text-align: center;
`;

const ErrorMessage = styled.p`
  color: #dc2626;
  text-align: center;
`;

export default Dashboard;
