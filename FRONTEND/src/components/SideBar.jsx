import { HiOutlineLogout } from "react-icons/hi";
import HistoryIcon from "@mui/icons-material/History";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LinearScaleIcon from "@mui/icons-material/LinearScale";
import NotificationIcon from "@mui/icons-material/NotificationImportant";
import TaskIcon from "@mui/icons-material/Task";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import CircularProgress from "@mui/material/CircularProgress";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Toast from "./Toast";
import api from "../api/api";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";

function SideBar() {
  const [toast, setToast] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [logingOut ,setLogingOut ] = useState(false)

  const showToast = (message, type = "error") => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  const navigate = useNavigate();

  const handleLogout = async () => {
    setLogingOut(true);
    try {
      await api.authApis.logout();
      navigate("/login");
    } catch (error) {
      showToast(error?.response?.data?.message, "error");
    }finally {
      setLogingOut(false)
    }
  };
 

  const handleOpenNotifications = async () => {
    setShowNotifications(true);
    setLoadingNotifications(true);
    try {
      const response = await api.notificationApis.getNotifications();
      if (response.success) {
        setNotifications(response.data.reverse());
      } else {
        showToast(response.message || "Failed to load notifications", "error");
      }
    } catch (error) {
      showToast("Failed to load notifications", "error");
    } finally {
      setLoadingNotifications(false);
    }
  };

  const handleCloseNotifications = () => {
    setShowNotifications(false);
  };

  const markAsRead = async (id) => {
    try {
      const response = await api.notificationApis.markNotificationRead(id);
      if (response.success) {
        setNotifications(prev => prev.map(n => n._id === id ? response.data : n));
      } else {
        showToast(response.message || "Failed to mark as read", "error");
      }
    } catch (error) {
      showToast("Failed to mark as read", "error");
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 h-screen sm:w-64 w-16 bg-white shadow-xl border-r border-gray-100 flex flex-col transition-all duration-300 z-40">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={closeToast}
            duration={3000}
          />
        )}
        <div className="flex items-center sm:justify-start justify-center p-6 border-b border-gray-100">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-3 rounded-xl text-xl font-bold shadow-lg">
            AA
          </div>
          <h1 className="font-bold text-2xl text-gray-800 ml-3 sm:block hidden">
            genda
          </h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-4">
          <SideBarItem
            icon={<DashboardIcon />}
            label={"Dashboard"}
            tooltip={"Dashboard"}
            to={"/dashboard"}
          />

          <SideBarItem
            icon={<TaskIcon />}
            label={"Sticky Notes"}
            tooltip={"Sticky Notes"}
            to={"/tasks"}
          />
          <SideBarItem
            icon={<AccountCircleIcon />}
            label={"Profile"}
            tooltip={"Profile"}
            to={"/profile"}
          />
          <SideBarItem
            icon={<HistoryIcon />}
            label={"History"}
            tooltip={"History"}
            to={"/history"}
          />
          <SideBarItem
            icon={<LinearScaleIcon />}
            label={"Step Tasks"}
            tooltip={"Step Tasks"}
            to={"/group-tasks"}
          />
          <SideBarItem
            icon={<NotificationIcon />}
            label={"Notifications"}
            tooltip={"Notifications"}
            onClick={handleOpenNotifications}
          />
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="relative group flex items-center justify-center sm:justify-start w-full p-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium"
          >
            <HiOutlineLogout className="text-xl sm:mr-3" />
            <span className="sm:block hidden">{logingOut ? "loging out, Please wait.." : "Logout"}</span>
            <div className="absolute left-16 bg-gray-800 text-white text-xs px-2 py-1 rounded-lg sm:hidden scale-0 group-hover:scale-100 transition-all duration-200 whitespace-nowrap z-50">
              
            </div>
          </button>
        </div>
      </div>

      {/* Notification Panel Overlay */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="flex-1 bg-black/30 backdrop-blur-sm" 
            onClick={handleCloseNotifications}
          ></div>
          
          {/* Sliding Panel */}
          <div className={`bg-white sm:w-96 w-80 h-full transform transition-transform duration-300 ease-in-out shadow-2xl border-l border-gray-200 ${
            showNotifications ? 'translate-x-0' : 'translate-x-full'
          }`}>
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
              <IconButton onClick={handleCloseNotifications} size="small">
                <CloseIcon />
              </IconButton>
            </div>
            
            <div className="p-4 overflow-y-auto h-[calc(100vh-80px)]">
              {loadingNotifications ? (
                <div className="flex justify-center items-center py-8">
                  <CircularProgress size={24} />
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <NotificationIcon className="text-5xl mb-2 opacity-30" />
                  <p>No notifications</p>
                </div>
              ) : (
                <List className="space-y-2">
                  {notifications.map((notification) => (
                    <ListItem key={notification._id} disablePadding className="mb-2">
                      <Alert
                        severity={notification.severity || "info"}
                        sx={{ 
                          width: '100%', 
                          borderRadius: 2,
                          backgroundColor: notification.read ? '#f9fafb' : undefined
                        }}
                        action={
                          !notification.read && (
                            <IconButton
                              size="small"
                              onClick={() => markAsRead(notification._id)}
                              title="Mark as read"
                            >
                              <CheckIcon fontSize="small" />
                            </IconButton>
                          )
                        }
                      >
                        <ListItemText
                          primary={notification.message}
                          secondary={`Created: ${new Date(notification.createdAt).toLocaleDateString()}`}
                        />
                      </Alert>
                    </ListItem>
                  ))}
                </List>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const SideBarItem = ({ icon, label, tooltip, to, onClick }) => {
  const content = (
    <div
      className="relative group flex items-center justify-center sm:justify-start w-full p-3 rounded-xl transition-all duration-200 font-medium cursor-pointer text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
      onClick={onClick}
    >
      <span className="text-xl sm:mr-3">{icon}</span>
      <span className="sm:block hidden">{label}</span>
      <div className="absolute left-16 bg-gray-800 text-white text-xs px-2 py-1 rounded-lg sm:hidden scale-0 group-hover:scale-100 transition-all duration-200 whitespace-nowrap z-50">
        {tooltip}
      </div>
    </div>
  );

  return to ? <NavLink to={to}>{content}</NavLink> : content;
};

export default SideBar;