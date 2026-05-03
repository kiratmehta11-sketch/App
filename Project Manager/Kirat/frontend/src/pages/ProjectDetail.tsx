import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectService, taskService } from '../services/api';
import { Project, Task, ProjectMember } from '../types';
import { useAuth } from '../context/AuthContext';
import './ProjectDetail.css';

export const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState('Medium');

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const fetchProjectData = async () => {
    if (!id) return;
    try {
      const [projectRes, tasksRes, membersRes] = await Promise.all([
        projectService.getProjectById(Number(id)),
        taskService.getProjectTasks(Number(id)),
        projectService.getProjectMembers(Number(id)),
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
      setMembers(membersRes.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch project');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      await taskService.createTask(Number(id), taskTitle, taskDescription, taskPriority, null, null);
      setTaskTitle('');
      setTaskDescription('');
      setTaskPriority('Medium');
      setShowTaskForm(false);
      fetchProjectData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create task');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(taskId);
        fetchProjectData();
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to delete task');
      }
    }
  };

  const isAdmin = members.some((m) => m.id === user?.id && m.role === 'Admin');

  if (loading) return <div className="loading">Loading project...</div>;
  if (!project) return <div className="error">Project not found</div>;

  return (
    <div className="project-detail">
      <button className="btn-back" onClick={() => navigate('/projects')}>
        ← Back to Projects
      </button>

      <div className="project-info">
        <div>
          <h1>{project.name}</h1>
          <p>{project.description}</p>
        </div>
        {isAdmin && (
          <button className="btn-edit" onClick={() => navigate(`/projects/${id}/edit`)}>
            ✏️ Edit
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="project-sections">
        {/* Members Section */}
        <div className="section">
          <div className="section-header">
            <h2>👥 Team Members</h2>
            {isAdmin && (
              <button
                className="btn-small"
                onClick={() => setShowMemberForm(!showMemberForm)}
              >
                {showMemberForm ? '✕' : '+ Add Member'}
              </button>
            )}
          </div>

          {showMemberForm && isAdmin && (
            <div className="add-member-form">
              <p>Member management coming soon...</p>
            </div>
          )}

          <div className="members-list">
            {members.map((member) => (
              <div key={member.id} className="member-item">
                <div>
                  <strong>{member.name}</strong>
                  <p>{member.email}</p>
                </div>
                <span className="role-badge">{member.role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks Section */}
        <div className="section">
          <div className="section-header">
            <h2>📋 Tasks</h2>
            <button
              className="btn-small"
              onClick={() => setShowTaskForm(!showTaskForm)}
            >
              {showTaskForm ? '✕' : '+ New Task'}
            </button>
          </div>

          {showTaskForm && (
            <form onSubmit={handleCreateTask} className="task-form">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Task title"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  placeholder="Task description"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="form-group">
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value)}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <button type="submit" className="btn-primary">
                Create Task
              </button>
            </form>
          )}

          <div className="tasks-list">
            {tasks.length === 0 ? (
              <p className="no-tasks">No tasks yet</p>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="task-card">
                  <div className="task-header">
                    <h3>{task.title}</h3>
                    <button
                      className="btn-delete-task"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      🗑️
                    </button>
                  </div>
                  <p className="task-description">{task.description}</p>
                  <div className="task-meta">
                    <span className={`status status-${task.status.replace(' ', '-').toLowerCase()}`}>
                      {task.status}
                    </span>
                    <span className="priority">{task.priority}</span>
                    {task.assigned_to_name && (
                      <span className="assigned">👤 {task.assigned_to_name}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
