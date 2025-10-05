import React, { useEffect, useState } from "react";
import TaskItem from "./components/TaskItem";
import api from "../../api/api";
import TaskForm from "./components/TaskForm";
import Toast from "../../components/Toast";
import CircularProgress from "@mui/material/CircularProgress";

function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [timeSorting, setTimeSorting] = useState("None");
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const showToast = (message, type = "error") => {
    setToast({ message, type });
  };
  const closeToast = () => {
    setToast(null);
  };

  const filteredTasks = tasks
    .filter(
      (task) => priorityFilter === "All" || task.priority === priorityFilter
    )
    .sort((a, b) => {
      if (!a.deadLine && !b.deadLine) return 0;
      if (!a.deadLine) return -1;
      if (!b.deadLine) return -1;
      const now = new Date();
      const aTimeLeft = new Date(a.deadLine) - now;
      const bTimeLeft = new Date(b.deadLine) - now;
      if (timeSorting === "Nearest") return aTimeLeft - bTimeLeft;
      if (timeSorting === "Farest") return bTimeLeft - aTimeLeft;
      return 0;
    });

  useEffect(() => {
    const getTasks = async () => {
      setLoading(true);
      try {
        const response = await api.taskApis.getTasks();
        if (response.success) {
          setTasks(response.data);
        } else {
          console.log("Error:", response.message);
          console.log("Error Code:", response.errorCode);
        }
      } catch (error) {
        showToast(error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    getTasks();
  }, []);

  const onEdit = (taskId) => {
    setEditingTaskId(taskId);
  };

  const onCloseEdit = () => {
    setEditingTaskId(null);
  };

  const onSaveTask = (updatedTask) => {
    showToast("Task edited succcefully.", "success");
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === updatedTask._id ? updatedTask : task
      )
    );
    setEditingTaskId(null);
  };

  const onClose = () => {
    setShowTaskForm(false);
  };

  const onTaskAdded = (newTask) => {
    setTasks((prev) => [...prev, newTask]);
    onClose();
  };

  const onDelete = (id) => {
    showToast("Task deleted succcefully.", "info");
    const newTasks = tasks.filter((task) => task._id !== id);
    setTasks(newTasks);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
          duration={3000}
        />
      )}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-2">
                Sticky Notes
              </h1>
              <p className="text-slate-600">Organize your day</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-0">
              <div className="relative">
                <select
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  value={priorityFilter}
                  className="pl-4 pr-10 py-2.5 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none cursor-pointer shadow-sm hover:shadow-md text-slate-700 font-medium"
                >
                  <option value="All">All Priorities</option>
                  <option value="High">🔴 High</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="Low">🟢 Low</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              <div className="relative">
                <select
                  onChange={(e) => setTimeSorting(e.target.value)}
                  value={timeSorting}
                  className="pl-4 pr-10 py-2.5 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none cursor-pointer shadow-sm hover:shadow-md text-slate-700 font-medium"
                >
                  <option value="None">Sort by Time</option>
                  <option value="Nearest">⏰ Nearest</option>
                  <option value="Farest">📅 Farthest</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          {(priorityFilter !== "All" || timeSorting !== "None") && (
            <div className="flex flex-wrap gap-2 mb-4">
              {priorityFilter !== "All" && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
                  Priority: {priorityFilter}
                  <button
                    onClick={() => setPriorityFilter("All")}
                    className="ml-2 text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    ×
                  </button>
                </span>
              )}
              {timeSorting !== "None" && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200">
                  Sort: {timeSorting}
                  <button
                    onClick={() => setTimeSorting("None")}
                    className="ml-2 text-purple-600 hover:text-purple-800 transition-colors"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
        {loading && (
          <div className="h-screen w-full flex justify-center mt-20">
            <CircularProgress size={40} color="primary" />
          </div>
        )}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div
            onClick={() => setShowTaskForm(true)}
            className="group h-[280px] w-full max-w-[400px] mx-auto bg-white hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 shadow-lg hover:shadow-xl p-6 rounded-3xl flex flex-col justify-center items-center border-2 border-dashed border-indigo-200 hover:border-indigo-300 cursor-pointer transition-all duration-300 ease-in-out transform hover:-translate-y-1"
          >
            <div className="flex justify-center items-center w-16 h-16 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 group-hover:from-indigo-200 group-hover:to-purple-200 transition-all duration-300 mb-4">
              <span className="text-4xl text-indigo-600 group-hover:text-indigo-700 transition-colors duration-300">
                +
              </span>
            </div>
            <h2 className="text-xl font-semibold text-slate-700 group-hover:text-slate-800 transition-colors duration-300">
              Add New Task
            </h2>
            <p className="text-slate-500 text-sm mt-2 group-hover:text-slate-600 transition-colors duration-300">
              Click to create a task
            </p>
          </div>
          {filteredTasks.map((task, index) => (
            <TaskItem
              onDelete={onDelete}
              key={task._id || index}
              task={task}
              isEditing={editingTaskId === task._id}
              onEdit={onEdit}
              onCloseEdit={onCloseEdit}
              onSaveTask={onSaveTask}
              showEditingButton={true}
              showTimeLeft={true}
              allowToggle={true}
              showToast={showToast}
            />
          ))}
        </div>
      </div>
      {showTaskForm ? (
        <TaskForm
          onClose={onClose}
          onTaskAdded={onTaskAdded}
          showToast={showToast}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default TaskPage;
