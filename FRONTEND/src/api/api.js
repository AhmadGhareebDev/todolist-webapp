import axiosInstance from "./axios";
import { handleApiError } from "../utils/ApiErrorHelper";
const authApis = {
  register: async (email, username, password) => {
    try {
      const response = await axiosInstance.post("/register", {
        username,
        email,
        password,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed.",
        errorCode: error.response?.data?.errorCode || "UNKNOWN_ERROR",
      };
    }
  },

  login: async (email, password) => {
    try {
      const response = await axiosInstance.post("/login", {
        email,
        password,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
        errorCode: error.response?.data?.errorCode || "UNKNOWN_ERROR",
      };
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('/logout');
    } catch (error) {
      return handleApiError(error);
    }
  },

  refreshToken: async () => {
    try {
      const response = await axiosInstance.get("/refresh");

      return {
        success: true,
        accessToken: response.data.data.accessToken,
        user: response.data.data.user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to refresh token.",
        errorCode: error.response?.data?.errorCode || "UNKNOWN_ERROR",
      };
    }
  },

  resendVerificationEmail: async (email) => {
    try {
      const response = await axiosInstance.post("/re-verify-email", {
        email,
      });

      return {
        success: true,
        message: response.data.message,
        code: response.data.code || "",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Failed to resend verification email due to server error.",
        errorCode: error.response?.data?.errorCode || "UNKNOWN_ERROR",
      };
    }
  },

  requestPasswordReset: async (email) => {
    try {
      const response = await axiosInstance.post('/reset/forgot-password', { 
        email 
      });

      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to send reset email.",
        errorCode: error.response?.data?.errorCode || "UNKNOWN_ERROR",
      };
    }
  },

  verifyResetToken: async (token) => {
    try {
      const response = await axiosInstance.get(`/reset/verify-reset-token/${token}`);

      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Invalid or expired token.",
        errorCode: error.response?.data?.errorCode || "UNKNOWN_ERROR",
      };
    }
  },

  // Reset password
  resetPassword: async (token, password) => {
    try {
      const response = await axiosInstance.post(`/reset/reset-password/${token}`, { 
        password 
      });

      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to reset password.",
        errorCode: error.response?.data?.errorCode || "UNKNOWN_ERROR",
      };
    }
  },
};

const taskApis = {
  getTasks: async () => {
    try {
      const response = await axiosInstance.get("/user/get-tasks");
      return {
        success: true,
        message: response.data.message || "Tasks retrieved successfully",
        errorCode: null,
        data: response.data.data || []
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  toggleTask: async (taskId) => {
    try {
      const response = await axiosInstance.patch(`/user/toggleTask/${taskId}`);
      return {
        success: true,
        message: response.data.message || "Task toggled successfully",
        errorCode: null,
        data: response.data.data || {}
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  addTask: async (title, desc, priority, deadline = null) => {
    try {
      const response = await axiosInstance.post("/user", {
        title,
        desc,
        priority,
        deadLine: deadline,
      });
      return {
        success: response.data.success,
        message: response.data.message || "Task added successfully",
        errorCode: response.data.errorCode || null,
        data: response.data.data || {}
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  deleteTask: async (id) => {
    try {
      const response = await axiosInstance.delete(`/user/${id}`);
      return {
        success: true,
        message: response.data.message || "Task deleted successfully",
        errorCode: null,
        data: response.data.data || {}
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  editTask: async (taskId, title, desc, priority, deadline = null) => {
    try {
      const response = await axiosInstance.patch(`/user/editTask/${taskId}`, {
        title,
        desc,
        priority,
        deadLine: deadline,
      });
      return {
        success: response.data.success,
        message: response.data.message || "Task edited successfully",
        errorCode: response.data.errorCode || null,
        data: response.data.data || {}
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  getHistoryTasks: async () => {
    try {
      const response = await axiosInstance.get("/user/get-history-tasks");
      return {
        success: true,
        message: response.data.message || "History tasks retrieved successfully",
        errorCode: null,
        data: response.data.data || []
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  getGroups: async () => {
    try {
      const response = await axiosInstance.get("/user/groups");
      return {
        success: response.data.success,
        message: response.data.message || "Groups retrieved successfully",
        errorCode: response.data.errorCode || null,
        data: response.data.data || []
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  addGroup: async (title) => {
    try {
      const response = await axiosInstance.post("/user/groups", { title });
      return {
        success: response.data.success,
        message: response.data.message || "Group added successfully",
        errorCode: response.data.errorCode || null,
        data: response.data.data || []
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  deleteGroup: async (groupId) => {
    try {
      const response = await axiosInstance.delete(`/user/groups/${groupId}`);
      return {
        success: response.data.success,
        message: response.data.message || "Group deleted successfully",
        errorCode: response.data.errorCode || null,
        data: response.data.data || []
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  addGroupTask: async (title, groupId) => {
    try {
      const response = await axiosInstance.post(`/user/groups/${groupId}/tasks`, { title });
      return {
        success: response.data.success,
        message: response.data.message || "Step task added successfully",
        errorCode: response.data.errorCode || null,
        data: response.data.data || []
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  deleteGroupTask: async (groupId, taskId) => {
    try {
      const response = await axiosInstance.delete(`/user/groups/${groupId}/tasks/${taskId}`);
      return {
        success: response.data.success,
        message: response.data.message || "Step task deleted successfully",
        errorCode: response.data.errorCode || null,
        data: response.data.data || []
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  getGroupTasks: async (groupId) => {
    try {
      const response = await axiosInstance.get(`/user/groups/${groupId}`);
      return {
        success: response.data.success,
        message: response.data.message || "Group tasks retrieved successfully",
        errorCode: response.data.errorCode || null,
        data: response.data.data || []
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  toggleStepTask: async (groupId, taskId) => {
    try {
      const response = await axiosInstance.patch(`/user/groups/${groupId}/tasks/${taskId}/toggle`);
      return {
        success: response.data.success,
        message: response.data.message || "Step task toggled successfully",
        errorCode: response.data.errorCode || null,
        data: response.data.data || {}
      };
    } catch (error) {
      if (error.response?.status === 400) {
        return {
          success: false,
          message: error.response.data?.message || "Complete previous tasks first",
          errorCode: error.response.data?.errorCode || "PREVIOUS_TASKS_INCOMPLETE",
          data: {}
        };
      }
      return handleApiError(error);
    }
  }
};

const profileApis = {
  getProfileInfo: async () => {
    try {
      const response = await axiosInstance.get("/user");
      return {
        success: response.data.success,
        message: response.data.message || "Profile info retrieved successfully",
        errorCode: null,
        data: {
          username: response.data.data.username,
          email: response.data.data.email,
          profileImage: response.data.data.profileImage
        }
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  deleteAccount: async () => {
    try {
      const response = await axiosInstance.delete("/user");
      return {
        success: response.data.success,
        message: response.data.message || "Account deleted successfully",
        errorCode: null,
        data: response.data.data || {}
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  addProfileImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append("profileImage", file);
      const response = await axiosInstance.post("/user/profile-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      return {
        success: response.data.success,
        message: response.data.message || "Profile image uploaded successfully",
        errorCode: null,
        data: { imageUrl: response.data.data.profileImage }
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  editProfileInfo: async (username, currentPassword, newPassword) => {
    try {
      const response = await axiosInstance.patch("/user/editProfile", {
        username,
        currentPassword,
        newPassword
      });
      return {
        success: response.data.success,
        message: response.data.message || "Profile updated successfully",
        errorCode: response.data.errorCode || null,
        data: response.data.data || {}
      };
    } catch (error) {
      return handleApiError(error);
    }
  },
};

const statisticsApis = {
  getTasksNumber: async () => {
    try {
      const response = await axiosInstance.get("/user/get-tasks-number");
      return {
        success: response.data.success,
        message: response.data.message || "Task statistics retrieved successfully",
        errorCode: response.data.errorCode || null,
        data: response.data.data || {}
      };
    } catch (error) {
      return handleApiError(error);
    }
  }
};
const notificationApis = {
  getNotifications: async () => {
    try {
      const response = await axiosInstance.get('/user/notifications');

      if (response.data.success) {
         return {
        success: true,
        message: response.data.message || "Notifications retrieved successfully",
        errorCode: null,
        data: response.data.data || []
      };

      }

    } catch (error){
      handleApiError(error)
    }
  },
  markNotificationRead: async (id) => {
    try {
      const response = await axiosInstance.patch(`/user/mark-notification-read/${id}`);

      return {
        success: true,
        message: response.data.message || "Notification Read successfully",
        errorCode: null,
        data: response.data.data
      }

    } catch(error) {
      handleApiError(error)
    }
  }
}
const api = {
  authApis,
  taskApis,
  profileApis,
  statisticsApis,
  notificationApis
};

export default api;