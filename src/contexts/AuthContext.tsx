
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";

type User = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  profileImage?: string;
  phoneNumber?: string;
  age?: string;
  gender?: string;
  address?: string;
  occupation?: string;
  company?: string;
  bio?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profileData: { phoneNumber: string; age: string; gender: string }) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we have a token in localStorage
    const storedToken = localStorage.getItem("eazybee-token");
    const storedUser = localStorage.getItem("eazybee-user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // In a real app, you would call your API here
      // This is a mock implementation
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if admin credentials
      if (email === "admin@eazybee.com" && password === "admin123") {
        const adminUser = {
          id: "admin-1",
          name: "Admin User",
          email: "admin@eazybee.com",
          role: "ADMIN" as const,
          profileImage: "https://ui-avatars.com/api/?name=Admin+User&background=FFD100&color=000"
        };
        
        // Mock token (in a real app, this would come from your backend)
        const mockToken = "admin-jwt-token-12345";
        
        setUser(adminUser);
        setToken(mockToken);
        
        // Store in localStorage
        localStorage.setItem("eazybee-token", mockToken);
        localStorage.setItem("eazybee-user", JSON.stringify(adminUser));
        
        toast.success("Welcome back, Admin!");
        return true;
      }
      
      // Regular user login
      if (email && password.length >= 6) {
        const regularUser = {
          id: "user-1",
          name: email.split("@")[0],
          email,
          role: "USER" as const,
          profileImage: `https://ui-avatars.com/api/?name=${email.split("@")[0]}&background=FFD100&color=000`
        };
        
        // Mock token
        const mockToken = "user-jwt-token-12345";
        
        setUser(regularUser);
        setToken(mockToken);
        
        // Store in localStorage
        localStorage.setItem("eazybee-token", mockToken);
        localStorage.setItem("eazybee-user", JSON.stringify(regularUser));
        
        toast.success("Successfully logged in!");
        return true;
      }
      
      toast.error("Invalid credentials");
      return false;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to login. Please try again.");
      return false;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (name && email && password.length >= 6) {
        const newUser = {
          id: `user-${Date.now()}`,
          name,
          email,
          role: "USER" as const,
          profileImage: `https://ui-avatars.com/api/?name=${name}&background=FFD100&color=000`
        };
        
        // Mock token
        const mockToken = "user-jwt-token-" + Date.now();
        
        setUser(newUser);
        setToken(mockToken);
        
        // Store in localStorage
        localStorage.setItem("eazybee-token", mockToken);
        localStorage.setItem("eazybee-user", JSON.stringify(newUser));
        
        toast.success("Account created successfully!");
        return true;
      }
      
      toast.error("Invalid registration data");
      return false;
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Failed to register. Please try again.");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("eazybee-token");
    localStorage.removeItem("eazybee-user");
    toast.success("Logged out successfully");
  };

  const updateProfile = async (profileData: { phoneNumber: string; age: string; gender: string }) => {
    if (!user) return false;
    
    const updatedUser = {
      ...user,
      ...profileData
    };
    
    setUser(updatedUser);
    localStorage.setItem("eazybee-user", JSON.stringify(updatedUser));
    return true;
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isAdmin: user?.role === "ADMIN",
    login,
    register,
    logout,
    updateProfile
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center">
      <div className="animate-pulse text-eazybee-yellow">Loading...</div>
    </div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
