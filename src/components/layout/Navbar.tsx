import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, User, LogOut, Menu, X } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import SearchBar from "@/components/SearchBar";

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Handle scroll event to add background to navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 px-4 md:px-8 py-4
        ${isScrolled || mobileMenuOpen ? "bg-eazybee-dark/95 backdrop-blur-md shadow-md" : "bg-transparent"}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center mr-8">
            <span className="text-2xl font-bold">
              <span className="text-eazybee-yellow">Eazy</span>
              <span className="text-white">Bee</span>
            </span>
          </Link>

          {isAuthenticated && (
            <>
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-6">
                <NavLink to="/" className="nav-link" end>
                  Home
                </NavLink>
                <NavLink to="/browse" className="nav-link">
                  Browse
                </NavLink>
                <NavLink to="/movies" className="nav-link">
                  Movies
                </NavLink>
                <NavLink to="/series" className="nav-link">
                  Series
                </NavLink>
                {isAdmin && (
                  <NavLink to="/admin" className="nav-link">
                    Admin
                  </NavLink>
                )}
              </nav>

              {/* Mobile Menu Button */}
              <button 
                className="md:hidden ml-2 p-1.5 rounded-lg hover:bg-eazybee-dark-accent"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X size={24} />
                ) : (
                  <Menu size={24} />
                )}
              </button>
            </>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated && (
            <>
              {/* Search Bar - Desktop */}
              <div className="hidden md:block">
                <SearchBar />
              </div>

              <button className="p-2 rounded-full hover:bg-eazybee-dark-accent transition-colors">
                <Bell size={18} />
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center">
                    <div className="w-8 h-8 bg-eazybee-yellow rounded-full overflow-hidden">
                      {user?.profileImage ? (
                        <img 
                          src={user.profileImage} 
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 m-auto mt-1.5" />
                      )}
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2">
                  <div className="px-4 py-2">
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/watchlist" className="cursor-pointer">My Watchlist</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/watch-history" className="cursor-pointer">Watch History</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-red-500 cursor-pointer flex items-center"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          {!isAuthenticated && (
            <div className="flex items-center space-x-2">
              <Link to="/login" className="py-1 px-3 text-sm rounded-md hover:bg-eazybee-dark-accent transition-colors">
                Log in
              </Link>
              <Link to="/register" className="py-1 px-3 text-sm bg-eazybee-yellow text-black rounded-md hover:bg-yellow-400 transition-colors">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isAuthenticated && (
        <div className={`md:hidden ${mobileMenuOpen ? "block" : "hidden"} mt-4 py-4 border-t border-gray-700`}>
          {/* Search Bar - Mobile */}
          <div className="mb-4">
            <SearchBar className="w-full" />
          </div>

          <nav className="flex flex-col space-y-3">
            <NavLink 
              to="/" 
              className="nav-link py-2" 
              end
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink 
              to="/browse" 
              className="nav-link py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse
            </NavLink>
            <NavLink 
              to="/movies" 
              className="nav-link py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Movies
            </NavLink>
            <NavLink 
              to="/series" 
              className="nav-link py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Series
            </NavLink>
            {isAdmin && (
              <NavLink 
                to="/admin" 
                className="nav-link py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </NavLink>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}