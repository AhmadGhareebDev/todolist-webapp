import { Routes, Route, Navigate } from "react-router-dom";
import RegisterPage from "../features/auth/pages/RegisterPage";
import Dashboard from "../features/dashboard/Dashboard";
import LoginPage from "../features/auth/pages/LoginPage";
import ProtectedRoute from "./ProtectedRoutes";
import DashboardLayout from "../layouts/DashboardLayout";
import TaskPage from "../features/tasks/TaskPage";
import Profile from "../features/user/Profile";
import History from "../features/user/History";
import StepTasks from "../features/tasks/StepTasks";
import GroupTasks from "../features/tasks/GroupTasks";
import VerificationSuccess from "../features/auth/pages/VerificationSuccess";
import VerificationError from "../features/auth/pages/VerificationError";
import ResetPassword from '../features/auth/pages/ResetPassword'
import ForgetPassword from '../features/auth/pages/ForgetPassword'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/verification-success" element={<VerificationSuccess />} />
      <Route path="/verification-error" element={<VerificationError />} />
      <Route path="/forgot-password" element={<ForgetPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} /> 

      
      <Route element={<ProtectedRoute />}>
      <Route element={<DashboardLayout/>}>
      <Route element={<TaskPage/>} path="/tasks" />
      <Route element={<Profile/>} path="/profile"/>
      <Route element={<History/>} path="/history"/>
      <Route element={<GroupTasks/>} path="/group-tasks"/>
      <Route element={<StepTasks/>} path="/group-tasks/:groupId"/>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      </Route>
      
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRoutes;