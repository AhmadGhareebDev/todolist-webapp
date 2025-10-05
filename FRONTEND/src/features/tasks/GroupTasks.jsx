import React from "react";
import api from "../../api/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../../components/Toast";
import CircularProgress from '@mui/material/CircularProgress';
import DeleteIcon from '@mui/icons-material/Delete';

function GroupTasks() {
  useEffect(() => {
    getGroups();
  }, []);
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
  };
  const closeToast = () => {
    setToast(null);
  };

  const getGroups = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.taskApis.getGroups();
      if (response.success) {
        setGroups(response.data);
      } else {
        setError(response.errorCode);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGroup = async () => {
    if (!title) {
      showToast('Group title is required.', 'error');
      setShowForm(true);
      return;
    }
    if (title.length > 35) {
      showToast('Group title cannot be longer than 35 characters.', 'error');
      setShowForm(false);
      return;
    }
    setShowForm(true);
    setLoading(true);
    if (groups.length === 3) {
      setShowForm(false);
      showToast('You cannot add more than 3 Groups');
      setLoading(false);
      return;
    }
    try {
      const response = await api.taskApis.addGroup(title);
      if (response.success) {
        setGroups(response.data);
        showToast('Group added successfully!', 'success');
      } else {
        showToast(response.message || 'Failed to add group', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Failed to add group', 'error');
    } finally {
      setShowForm(false);
      setLoading(false);
      setTitle('');
    }
  };

  return (
    <div className="p-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
          duration={3000}
        />
      )}
      <p>{error}</p>
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 transform transition-all duration-300 scale-100">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-indigo-600">📁</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Create New Group
              </h2>
              <p className="text-slate-600 text-sm">
                Enter a name for your new task group
              </p>
            </div>
            <div className="space-y-6">
              <div>
                <div className="block text-sm font-medium text-slate-700 mb-2">
                  Group Name
                </div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter group name..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-slate-800 placeholder-slate-400"
                  autoFocus
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowForm(false)}
                  type="button"
                  className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddGroup}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Group'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <h1 className="text-4xl font-bold text-slate-800 mb-3">Step Tasks</h1>
      <p className="text-slate-600 mb-8 leading-relaxed">
        Add a gooup of tasks
      </p>
      {loading && (
        <div className="h-screen w-full flex justify-center mt-20">
          <CircularProgress size={40} color="primary" />
        </div>
      )}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div
          className="group h-[320px] w-full mx-auto bg-white hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 shadow-lg hover:shadow-xl p-6 rounded-lg flex flex-col justify-center items-center border-2 border-dashed border-indigo-200 hover:border-indigo-300 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-102"
          onClick={() => setShowForm(true)}
        >
          <div className="flex justify-center items-center w-16 h-16 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 group-hover:from-indigo-200 group-hover:to-purple-200 transition-all duration-300 mb-4">
            <span className="text-4xl text-indigo-600 group-hover:text-indigo-700 transition-colors duration-300">
              +
            </span>
          </div>
          <h2 className="text-xl font-semibold text-slate-700 group-hover:text-slate-800 transition-colors duration-300">
            Add New Group
          </h2>
          <p className="text-slate-500 text-sm mt-2 group-hover:text-slate-600 transition-colors duration-300">
            Click to create a Group
          </p>
        </div>
        {groups.map((group, index) => (
          <div
            onClick={() => navigate(`/group-tasks/${group._id}`)}
            key={index}
          >
            <Group title={group.title} groupId={group._id} completed={group.completed} setGroups={setGroups} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default GroupTasks;

function Group({ title, completed, groupId, setGroups }) {
  const handleDeleteGroup = async (groupId) => {
    try {
      const response = await api.taskApis.deleteGroup(groupId);
      if (response.success) {
        setGroups(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className={`relative group w-full h-80 flex items-center justify-center p-3 rounded-lg drop-shadow-lg shadow-lg hover:scale-102 transition-all duration-300 ${
        completed
          ? 'bg-gradient-to-br from-green-300 to-green-100'
          : 'bg-gradient-to-br from-slate-300 to-slate-500'
      }`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteGroup(groupId);
        }}
        className="absolute top-4 right-4 text-white hover:text-red-500 transition-colors duration-200"
      >
        <DeleteIcon />
      </button>
      <span className="group-hover:text-[32px] group-hover:text-white transition-all duration-500 text-center text-black text-4xl font-bold">
        {title}
      </span>
    </div>
  );
}