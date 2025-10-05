import React, { useEffect, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useParams } from "react-router-dom";
import Toast from "../../components/Toast";
import api from "../../api/api";
import CircularProgress from "@mui/material/CircularProgress";

function StepTasks() {
  const [tasks, setTasks] = useState([]);
  const { groupId } = useParams();
  const [loading, setLoading] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const getTasks = async () => {
      setLoading(true);
      try {
        const response = await api.taskApis.getGroupTasks(groupId);
        if (response.success) {
          setTasks(response.data);
        } else {
          showToast(response.message || "Failed to load tasks", "error");
        }
      } catch (error) {
        console.log(error);
        showToast("Failed to load tasks", "error");
      } finally {
        setLoading(false);
      }
    };
    getTasks();
  }, [groupId]);

  const showToast = (message, type = "error") => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask) {
      showToast("Task title is required.", "error");
      return;
    }
    if (newTask.length > 128) {
      showToast("Task title cannot be longer than 128 characters.", "error");
      return;
    }
    if (tasks.length === 50) {
      setLoading(false);
      showToast('You Reached the limit "50 Tasks".', "warning");
      setNewTask("");
      return;
    }
    try {
      setLoading(true);
      const response = await api.taskApis.addGroupTask(newTask, groupId);
      if (response.success) {
        setTasks(response.data);
        showToast("Task added successfully!", "success");
      } else {
        showToast(response.message || "Failed to add task", "error");
      }
    } catch (error) {
      console.log(error);
      showToast("Failed to add task", "error");
    } finally {
      setNewTask("");
      setLoading(false);
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      const response = await api.taskApis.toggleStepTask(groupId, taskId);
      if (response.success) {
        setTasks(response.data.stepTasks);
        showToast("Task updated successfully!", "success");
      } else {
        showToast(
          response.message || "Complete previous tasks first",
          "warning"
        );
      }
    } catch (error) {
      console.error(error);
      showToast("Failed to update task", "error");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await api.taskApis.deleteGroupTask(groupId, taskId);
      if (response.success) {
        setTasks(response.data);
        showToast("Task deleted successfully!", "success");
      } else {
        showToast(response.message || "Failed to delete task", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Failed to delete task", "error");
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
      <h1 className="text-4xl font-bold text-slate-800 mb-3">Step Tasks</h1>
      <p className="text-slate-600 mb-8 leading-relaxed">
        Connected Tasks - you won't be able to finish a task until you finish
        the previous one
      </p>
      <div className="flex justify-center">
        <form
          onSubmit={handleAddTask}
          className="flex flex-col gap-5 items-center w-full"
        >
          <label
            htmlFor="new-task"
            className="text-2xl font-bold text-slate-800 text-center w-full"
          >
            Enter a Task
          </label>
          <div className="w-full flex justify-center mb-10">
            <div className="flex items-center w-full max-w-md">
              <textarea
                onChange={(e) => setNewTask(e.target.value)}
                id="new-task"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAddTask(e); 
                  }
                }}
                value={newTask}
                placeholder="Type your task here..."
                className="cursor-pointer outline-none border-0 bg-gray-200 py-2 px-4 rounded-xl resize-none w-full min-h-[40px] max-h-32 overflow-y-auto"
                rows={1}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
              />
              <button
                disabled={!newTask}
                type="submit"
                className="p-1 disabled:bg-sky-100 bg-sky-400 rounded-md ml-2 transition-all duration-300 hover:bg-sky-500"
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <KeyboardArrowDownIcon />
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
      {loading && (
        <div className="h-screen w-full flex justify-center mt-20">
          <CircularProgress size={40} color="primary" />
        </div>
      )}
      <div className="flex flex-col space-y-6">
        {tasks.map((task, index) => (
          <div key={task._id} className="relative">
            <div className="inline-flex w-fit items-center gap-3 py-3 px-5 bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="relative flex-shrink-0">
                <div
                  onClick={() => handleToggleTask(task._id)}
                  className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${
                    task.completed
                      ? "bg-blue-500 border-blue-500"
                      : "bg-white border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {task.completed && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                {index < tasks.length - 1 && (
                  <div
                    className={`absolute w-0.5 h-8 left-1/2 top-8 transform -translate-x-1/2 transition-colors duration-200 ${
                      task.completed ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
              <span
                className={`font-medium transition-colors duration-200 ${
                  task.completed ? "text-slate-700" : "text-slate-600"
                }`}
              >
                {task.title}
              </span>
              <button
                onClick={() => handleDeleteTask(task._id)}
                className="ml-4 text-slate-400 hover:text-red-500 font-bold text-lg transition-colors duration-200"
                title="Delete task"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StepTasks;
