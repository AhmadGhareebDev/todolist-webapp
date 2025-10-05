import React, { useEffect, useState } from "react";
import TaskItem from "../tasks/components/TaskItem";
import api from "../../api/api";
import CircularProgress from '@mui/material/CircularProgress';

function History() {
  useEffect(() => {
    getHistoryTasks();
  }, []);

  const [historyTasks, setHistoryTasks] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [timeSorting, setTimeSorting] = useState("None");
  const [loading, setLoading] = useState(false);

  const filteredTasks = historyTasks
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

  const getHistoryTasks = async () => {
    setLoading(true);
    try {
      const response = await api.taskApis.getHistoryTasks();
      if (response.success) {
        setHistoryTasks(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = (id) => {
    const newTasks = historyTasks.filter((task) => task._id !== id);
    setHistoryTasks(newTasks);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            My Tasks History
          </h1>
          <p className="text-slate-600">Track your self here.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-4 mb-4 sm:mt-0">
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
        {loading && (
          <div className="h-screen w-full flex justify-center mt-20">
            <CircularProgress size={40} color="primary" />
          </div>
        )}
        {historyTasks.length === 0 && (
          <div className="flex justify-center w-full text-center mt-60">
            <h1 className="font-semibold text-sm text-gray-600">
              Your finished Tasks will be here.
            </h1>
          </div>
        )}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTasks.map((HistoryTask, index) => (
            <TaskItem
              key={HistoryTask._id || index}
              task={HistoryTask}
              onDelete={onDelete}
              isEditing={false}
              showEditingButton={false}
              showTimeLeft={false}
              alowToggle={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default History;