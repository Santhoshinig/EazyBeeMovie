
import React, { useState } from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AdminSidebar from "./AdminSidebar";

export default function MainLayout() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex flex-grow">
        {isAuthenticated && isAdmin && <AdminSidebar />}
        
        <main className={`flex-grow ${isAdmin ? "ml-0 md:ml-64" : ""}`}>
          <div className="container px-4 py-8 mx-auto max-w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
