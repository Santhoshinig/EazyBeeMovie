
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-eazybee-dark">
      <div className="text-center px-4">
        <h1 className="text-6xl md:text-8xl font-bold title-gradient mb-4">404</h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8">Oops! We couldn't find what you're looking for</p>
        <Link to="/" className="btn-primary inline-flex">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
