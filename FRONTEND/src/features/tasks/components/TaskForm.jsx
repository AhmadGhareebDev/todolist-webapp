import React, { useState } from "react";
import api from "../../../api/api";
import CircularProgress from '@mui/material/CircularProgress';


function TaskForm({ onClose, onTaskAdded, showToast }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("Low");
  const [deadline, setDeadline] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "from-red-500 to-rose-500 shadow-red-200";
      case "Medium":
        return "from-amber-500 to-orange-500 shadow-amber-200";
      default:
        return "from-sky-500 to-blue-500 shadow-sky-200";
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      showToast("Task title is required.", "error");
      return;
    }
    if (title.length > 22) {
      onClose()
      showToast("Task title cannot be longer than 22 characters.", "error");
      return;
    }
    if (!desc) {
      showToast("Task description is required.", "error");
      return;
    }
    if (desc.length > 56) {
      onClose()
      showToast("Task description cannot be longer than 56 characters.", "error");
      return;
    }
    setIsAdding(true);
    setLoading(true);
    try {
      const deadlineValue = deadline ? new Date(deadline).toISOString() : null;
      const response = await api.taskApis.addTask(title, desc, priority, deadlineValue);
      if (response.success) {
        onTaskAdded(response.data);
        showToast("Task added successfully!", "success");
        setTitle("");
        setDesc("");
        setPriority("Low");
        setDeadline("");
      } else {
        showToast(response.message || "Failed to add task", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Failed to add task", "error");
    } finally {
      setLoading(false);
      setIsAdding(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ease-out">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-3xl relative">
          <h2 className="text-2xl font-bold mb-1">Create New Task</h2>
          <p className="text-indigo-100 text-sm">Add a new task to your list</p>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Task Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              name="title"
              required={true}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-400"
              placeholder="Enter your task title..."
            />
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Description
            </label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              name="desc"
              rows="3"
              required={true}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-400 resize-none"
              placeholder="Describe your task..."
            />
          </div>

          {/* Deadline Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Deadline (Optional)
            </label>
            <input
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              type="datetime-local"
              name="deadline"
              min={getMinDateTime()}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-slate-800"
            />
            {deadline && (
              <div className="text-xs text-slate-500 mt-1">
                📅 Due: {new Date(deadline).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            )}
          </div>

          {/* Priority Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700">
              Priority Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {["Low", "Medium", "High"].map((inputPriority) => {
                const isSelected = priority === inputPriority;
                return (
                  <button
                    onClick={() => setPriority(inputPriority)}
                    key={inputPriority}
                    type="button"
                    className={`relative p-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium text-slate-600
                      ${isSelected 
                        ? inputPriority === 'Low' 
                          ? 'border-sky-500 bg-sky-50 shadow-md' 
                          : inputPriority === 'Medium' 
                            ? 'border-amber-500 bg-amber-50 shadow-md'
                            : 'border-red-500 bg-red-50 shadow-md'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          inputPriority === "High"
                            ? "bg-red-500"
                            : inputPriority === "Medium"
                            ? "bg-amber-500"
                            : "bg-sky-500"
                        }`}
                      ></div>
                      <span>{inputPriority}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              type="button"
              disabled={isAdding || !desc || !title}
              className={`flex-1 px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-200 transform hover:-translate-y-0.5
                ${isAdding || !desc || !title
                  ? 'bg-gray-500 text-slate-400 cursor-not-allowed'
                  : `text-white bg-gradient-to-r ${getPriorityColor(priority)} hover:shadow-xl`
                }`}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Create Task"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskForm;