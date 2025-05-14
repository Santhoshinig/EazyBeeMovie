
import React from "react";
import { NavLink } from "react-router-dom";
import { Film, Users, BarChart2, Bell, Settings, Plus } from "lucide-react";

export default function AdminSidebar() {
  return (
    <aside className="w-64 h-screen bg-eazybee-dark-accent fixed left-0 top-0 pt-16 hidden md:block">
      <div className="p-4 mt-4">
        <p className="text-xs uppercase tracking-wider text-gray-400 mb-4 px-4">
          Admin Dashboard
        </p>
        <nav className="space-y-1">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => 
              `flex items-center space-x-3 px-4 py-2.5 rounded-md transition-colors
              ${isActive ? "bg-eazybee-yellow text-black" : "hover:bg-gray-800"}`
            }
          >
            <BarChart2 size={18} />
            <span>Analytics</span>
          </NavLink>

          <NavLink
            to="/admin/add"
            className={({ isActive }) => 
              `flex items-center space-x-3 px-4 py-2.5 rounded-md transition-colors
              ${isActive ? "bg-eazybee-yellow text-black" : "hover:bg-gray-800"}`
            }
          >
            <Plus size={18} />
            <span>Add New</span>
          </NavLink>

          <NavLink
            to="/admin/content"
            className={({ isActive }) => 
              `flex items-center space-x-3 px-4 py-2.5 rounded-md transition-colors
              ${isActive ? "bg-eazybee-yellow text-black" : "hover:bg-gray-800"}`
            }
          >
            <Film size={18} />
            <span>Content</span>
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) => 
              `flex items-center space-x-3 px-4 py-2.5 rounded-md transition-colors
              ${isActive ? "bg-eazybee-yellow text-black" : "hover:bg-gray-800"}`
            }
          >
            <Users size={18} />
            <span>Users</span>
          </NavLink>

          <NavLink
            to="/admin/announcements"
            className={({ isActive }) => 
              `flex items-center space-x-3 px-4 py-2.5 rounded-md transition-colors
              ${isActive ? "bg-eazybee-yellow text-black" : "hover:bg-gray-800"}`
            }
          >
            <Bell size={18} />
            <span>Announcements</span>
          </NavLink>
          
          <NavLink
            to="/admin/settings"
            className={({ isActive }) => 
              `flex items-center space-x-3 px-4 py-2.5 rounded-md transition-colors
              ${isActive ? "bg-eazybee-yellow text-black" : "hover:bg-gray-800"}`
            }
          >
            <Settings size={18} />
            <span>Settings</span>
          </NavLink>
        </nav>
      </div>
    </aside>
  );
}
