import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Layouts
import MainLayout from "@/components/layout/MainLayout";

// Auth Pages
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import Browse from "@/pages/Browse";
import Watchlist from "@/pages/Watchlist";
import WatchHistory from "@/pages/WatchHistory";

// User Pages
import Home from "@/pages/Home";
import Movies from "@/pages/Movies";
import Series from "@/pages/Series";
import MediaDetail from "@/pages/MediaDetail";
import NotFound from "@/pages/NotFound";

// Admin Pages
import AdminDashboard from "@/pages/AdminDashboard";
import AdminAdd from "@/pages/AdminAdd";
import AdminContent from "@/pages/AdminContent";
import AdminUsers from "@/pages/AdminUsers";
import AdminAnnouncements from "@/pages/AdminAnnouncements"; // Added AdminAnnouncements import
import AdminSettings from "@/pages/AdminSettings"; // Added AdminSettings import

// Create a new App component as a function component
const App = () => {
  // Create a client inside the function component
  const queryClient = new QueryClient();

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Authentication Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />

              {/* Main App with Layout */}
              <Route element={<MainLayout />}>
                {/* User Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/series" element={<Series />} />
                <Route path="/movie/:id" element={<MediaDetail />} />
                <Route path="/tv/:id" element={<MediaDetail />} />
                <Route path="/search" element={<Browse />} />
                <Route path="/watchlist" element={<Watchlist />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/watch-history" element={<WatchHistory />} />
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/add" element={<AdminAdd />} />
                <Route path="/admin/content" element={<AdminContent />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/announcements" element={<AdminAnnouncements />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
              </Route>

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default App;