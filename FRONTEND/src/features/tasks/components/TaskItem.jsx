import React, { useState, useEffect, useCallback } from "react";
import api from "../../../api/api";
import Louder from "../../../components/Loaders/Louder";
import Delete from "../../../components/buttons/Delete";
import Louder2 from "../../../components/Loaders/Louder2";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

function TaskItem({
  task,
  onDelete,
  onEdit,
  onCloseEdit,
  onSaveTask,
  isEditing,
  showEditingButton,
  showTimeLeft,
  allowToggle, 
  showToast
}) {
  const [iscompleted, setIsCompleted] = useState(task.completed);
  const [isLoading, setIsLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDesc, setEditedDesc] = useState(task.desc);
  const [editedPriority, setEditedPriority] = useState(task.priority);
  const [editedDeadline, setEditedDeadline] = useState(
    task.deadLine ? new Date(task.deadLine).toISOString().slice(0, 16) : ""
  );

  const calculateTimeLeft = useCallback(() => {
    if (!task.deadLine) {
      return "No deadline";
    }

    const now = new Date();
    const deadline = new Date(task.deadLine);
    const diff = deadline - now;

    if (diff <= 0) {
      return "Overdue";
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} left`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} left`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} left`;
    } else {
      return "Less than a minute";
    }
  }, [task.deadLine]);

  const formatDeadline = (deadline) => {
    if (!deadline) return "No deadline";
    
    const date = new Date(deadline);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  };

  useEffect(() => {
    const updateTimeLeft = () => {
      setTimeLeft(calculateTimeLeft());
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 60000);

    return () => clearInterval(interval);
  }, [calculateTimeLeft]);

  const handleComplete = async () => {
    if (!allowToggle) return;
    try {
      setIsLoading(true);
      await api.taskApis.toggleTask(task._id);
      setIsCompleted(!iscompleted);
    } catch (error) {
      console.log(error);
      showToast("Failed to toggle task", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      const response = await api.taskApis.deleteTask(id);
      if (response.success) {
        onDelete(id);
      } else {
        showToast(response.message || "Failed to delete task", "error");
      }
    } catch (error) {
      console.log(error);
      showToast("Failed to delete task", "error");
    } finally {
      setDeleting(false);
    }
  };

  const getPriorityConfig = (priority, isCompleted, isOverdue) => {
    if (isCompleted) {
      return {
        bg: "bg-gradient-to-br from-emerald-100 to-green-100 border-emerald-200",
        text: "text-emerald-800",
        desc: "text-emerald-700",
        dot: "bg-emerald-500 ring-emerald-300",
        shadow: "shadow-emerald-100",
      };
    }

    if (isOverdue) {
      return {
        bg: "bg-gradient-to-br from-red-100 to-pink-100 border-red-300 hover:from-red-150 hover:to-pink-150",
        text: "text-red-900",
        desc: "text-red-800",
        dot: "bg-red-600 ring-red-300",
        shadow: "shadow-red-200",
      };
    }

    switch (priority) {
      case "High":
        return {
          bg: "bg-gradient-to-br from-red-50 to-rose-100 border-red-200 hover:from-red-100 hover:to-rose-150",
          text: "text-red-800",
          desc: "text-red-700",
          dot: "bg-red-500 ring-red-300",
          shadow: "shadow-red-100",
        };
      case "Medium":
        return {
          bg: "bg-gradient-to-br from-amber-50 to-orange-100 border-amber-200 hover:from-amber-100 hover:to-orange-150",
          text: "text-amber-800",
          desc: "text-amber-700",
          dot: "bg-amber-500 ring-amber-300",
          shadow: "shadow-amber-100",
        };
      default:
        return {
          bg: "bg-gradient-to-br from-sky-50 to-blue-100 border-sky-200 hover:from-sky-100 hover:to-blue-150",
          text: "text-sky-800",
          desc: "text-sky-700",
          dot: "bg-sky-500 ring-sky-300",
          shadow: "shadow-sky-100",
        };
    }
  };
  
  const handleEdit = (e) => {
    e.stopPropagation();
    setEditedTitle(task.title);
    setEditedDesc(task.desc);
    setEditedPriority(task.priority);
    
    if (task.deadLine) {
      const date = new Date(task.deadLine);
      const localDateTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setEditedDeadline(localDateTime);
    } else {
      setEditedDeadline("");
    }
    
    onEdit(task._id);
  };

  const handleSaveEdit = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    
    if (!editedTitle) {
      showToast("Task title is required.", "error");
      setIsLoading(false);
      return;
    }
    if (editedTitle.length > 22) {
      showToast("Task title cannot be longer than 22 characters.", "error");
      setIsLoading(false);
      return;
    }
    if (!editedDesc) {
      showToast("Task description is required.", "error");
      setIsLoading(false);
      return;
    }
    if (editedDesc.length > 56) {
      showToast("Task description cannot be longer than 56 characters.", "error");
      setIsLoading(false);
      return;
    }

    try {
      const deadlineValue = editedDeadline ? new Date(editedDeadline).toISOString() : null;
      
      const response = await api.taskApis.editTask(
        task._id, 
        editedTitle,
        editedDesc, 
        editedPriority,
        deadlineValue
      );
      
      if (response.success) {
        showToast("Task edited successfully!", "success");
        onSaveTask(response.data);
      } else {
        showToast(response.message || "Failed to edit task", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Failed to edit task", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = (e) => {
    e.stopPropagation();
    setEditedTitle(task.title);
    setEditedDesc(task.desc);
    setEditedPriority(task.priority);
    setEditedDeadline(
      task.deadLine ? new Date(task.deadLine).toISOString().slice(0, 16) : ""
    );
    onCloseEdit();
  };

  const isOverdue = task.deadLine && new Date(task.deadLine) < new Date() && !iscompleted;
  const config = getPriorityConfig(task.priority, iscompleted, isOverdue);

  if (isLoading) {
    return (
      <div
        onClick={handleComplete}
        className={`group h-[280px] w-full max-w-[400px] mx-auto ${config.bg} 
        rounded-[20px] p-7 shadow-lg hover:shadow-2xl ${config.shadow} 
        border-2 cursor-pointer transition-all duration-300 ease-in-out 
        transform hover:scale-[1.02] relative overflow-hidden`}
      >
        <div className="h-full flex flex-col justify-center">
          <Louder />
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={!isEditing && !iscompleted ? handleComplete : undefined}
      className={`group h-[280px] w-full max-w-[400px] mx-auto ${config.bg} 
        rounded-[20px] p-7 shadow-lg hover:shadow-2xl ${config.shadow} 
        border-2 ${!isEditing ? 'cursor-pointer' : 'cursor-default'} transition-all duration-300 ease-in-out 
        transform hover:scale-[1.02] relative overflow-hidden`}
    >
      {iscompleted && (
        <div className="absolute top-4 right-4">
          <div className="w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center shadow-md">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
        </div>
      )}

      {isOverdue && !iscompleted && (
        <div className="absolute top-4 right-4">
          <div className="w-7 h-7 bg-red-500 rounded-full flex items-center justify-center shadow-md">
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      )}

      <div
        onClick={(e) => {
          e.stopPropagation();
          handleDelete(task._id);
        }}
        className={`absolute top-[84%] ${
          deleting ? "top-[90%]" : "top-[75%]"
        } right-4 cursor-pointer`}
      >
        {deleting ? <Louder2 /> : <Delete />}
      </div>

      {!isEditing && showEditingButton && (
        <button
          onClick={handleEdit}
          className="absolute top-2 left-2 opacity-60 hover:font-bold hover:opacity-100 inline-flex items-center justify-center px-2 py-1 bg-black ease-in-out delay-75 hover:bg-white hover:text-black text-white text-sm font-medium rounded-md hover:pl-6 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <svg
            className="h-4 w-4 mr-1 self-center items-center"
            fill="none"
            stroke="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"></path>
          </svg>
          Edit
        </button>
      )}

      {isEditing && (
        <div>
          <button 
            onClick={handleSaveEdit} 
            className="absolute top-2 left-2 hover:z-30 opacity-60 hover:font-bold hover:opacity-100 inline-flex items-center justify-center px-2 py-1 bg-green-500 ease-in-out delay-75 hover:bg-green-600 text-white text-sm font-medium rounded-md active:scale-95 transition-all duration-200 cursor-pointer"
          >
            Save
          </button>
          <button 
            onClick={handleCancelEdit}
            className="absolute top-2 left-14 opacity-60 hover:font-bold hover:opacity-100 inline-flex items-center justify-center px-2 py-1 bg-gray-500 ease-in-out delay-75 hover:bg-gray-600 text-white text-sm font-medium rounded-md active:scale-95 transition-all duration-200 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="h-full flex flex-col">
        <div className="flex-grow">
          <h1
            className={`text-2xl font-semibold ${
              config.text
            } mb-2 mt-2 leading-tight ${
              iscompleted ? "line-through opacity-70" : ""
            }`}
          >
            {isEditing && !iscompleted ? (
              <textarea
                className="w-full h-16 outline-none resize-none bg-gradient-to-r from-white to-gray-50 border border-indigo-200 rounded-lg p-2 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                onClick={(e) => e.stopPropagation()}
                placeholder="Task title..."
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
            ) : (
              task.title
            )}
          </h1>

          <p
            className={`${
              config.desc
            } text-sm leading-relaxed font-semibold mt-2 mb-2 ${
              iscompleted ? "line-through opacity-60" : ""
            }`}
          >
            {isEditing && !iscompleted ? (
              <textarea
                className="w-full h-10 outline-none resize-none bg-gradient-to-r from-white to-gray-50 border border-indigo-200 rounded-lg p-2 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                onClick={(e) => e.stopPropagation()}
                placeholder="Task description..."
                value={editedDesc}
                onChange={(e) => setEditedDesc(e.target.value)}
              />
            ) : (
              task.desc
            )}
          </p>
        </div>

        <div className="flex flex-col bg-gradient-to-r from-white to-gray-50 p-3 rounded-lg mb-2 shadow-sm border-l-4 border-indigo-200">
          <div className="flex items-center space-x-2 mb-1">
            <CalendarTodayIcon className="text-gray-600 w-4 h-4" />
            <p className="font-semibold text-xs text-gray-700">Deadline</p>
            {isEditing && !iscompleted ? (
              <input
                type="datetime-local"
                className="text-sm font-medium bg-gradient-to-r from-white to-gray-50 border border-indigo-200 rounded-lg px-2 py-1 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                onClick={(e) => e.stopPropagation()}
                value={editedDeadline}
                onChange={(e) => setEditedDeadline(e.target.value)}
                min={getMinDateTime()}
              />
            ) : (
              <p className="font-medium text-sm text-gray-800">{formatDeadline(task.deadLine)}</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <AccessTimeIcon className="text-gray-600 w-4 h-4" />
            <p className="font-semibold text-xs text-gray-700">Time Left</p>
            <p className={`font-medium text-sm ${
              timeLeft === "Overdue" ? "text-red-600" : 
              timeLeft.includes("hour") || timeLeft.includes("minute") ? "text-orange-600" : "text-green-600"
            }`}>
              {showTimeLeft ? timeLeft : ''}
            </p>
          </div>
        </div>

        <div className="mt-auto">
          <div className="flex items-center space-x-2">
            <span className={`text-xs font-semibold ${config.text} opacity-75`}>
              Priority:
            </span>
            <div
              className={`w-4 h-4 rounded-full ${config.dot} ring-2 ring-offset-1 shadow-sm`}
            ></div>
            <span className={`text-sm font-semibold ${config.text}`}>
              {isEditing && !iscompleted ? (
                <select
                  className="bg-gradient-to-r from-white to-gray-50 border border-indigo-200 rounded-lg px-2 py-1 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                  onClick={(e) => e.stopPropagation()}
                  value={editedPriority}
                  onChange={(e) => setEditedPriority(e.target.value)}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              ) : (
                task.priority
              )}
            </span>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-[20px] pointer-events-none"></div>
      </div>
    </div>
  );
}

export default TaskItem;