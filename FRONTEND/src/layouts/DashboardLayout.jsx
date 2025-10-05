import { Outlet } from "react-router-dom"
import Dashboard from "../features/dashboard/Dashboard"
import SideBar from "../components/SideBar"

function DashboardLayout() {
  return (
    <div className="flex h-screen">
        <div className="sm:w-64 w-16 flex  transition-all duration-300">
            <SideBar/>
        </div>
         
        <div className="flex-1">
            <Outlet/>
        </div>
           
    </div>
  )
}

export default DashboardLayout;