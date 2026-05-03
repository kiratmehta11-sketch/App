import React, { useEffect, useState } from 'react';
import { dashboardService } from '../services/api';
import { DashboardData } from '../types';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await dashboardService.getDashboard();
      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!data) return <div className="error">No data available</div>;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return '#ff6b6b';
      case 'Medium':
        return '#ffc107';
      case 'Low':
        return '#28a745';
      default:
        return '#6c757d';
    }
  };

  return (
    <div className="dashboard">
      <h1>📊 Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{data.totalProjects}</div>
          <div className="stat-label">Projects</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{data.totalTasks}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{data.inProgressTasks}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{data.completedTasks}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-value">{data.overdueTasks}</div>
          <div className="stat-label">Overdue</div>
        </div>
      </div>

      <div className="recent-tasks">
        <h2>📝 Recent Tasks</h2>
        {data.recentTasks.length === 0 ? (
          <p className="no-tasks">No tasks yet</p>
        ) : (
          <div className="tasks-list">
            {data.recentTasks.slice(0, 5).map((task) => (
              <div key={task.id} className="task-item">
                <div className="task-header">
                  <h3>{task.title}</h3>
                  <span
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(task.priority) }}
                  >
                    {task.priority}
                  </span>
                </div>
                <div className="task-details">
                  <span className="project">{task.project_name}</span>
                  <span className={`status status-${task.status.replace(' ', '-').toLowerCase()}`}>
                    {task.status}
                  </span>
                  {task.due_date && <span className="due-date">📅 {task.due_date}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
