
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Users, Film, Eye, Clock } from "lucide-react";

export default function AdminDashboard() {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    if (!isAdmin) {
      navigate("/");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Mock analytics data
  const analyticsData = {
    totalUsers: 5847,
    totalVideos: 1245,
    totalViews: 487923,
    avgWatchTime: 47,
    dailyActiveUsers: 1247,
    popularGenres: [
      { name: "Action", percentage: 35 },
      { name: "Drama", percentage: 25 },
      { name: "Comedy", percentage: 20 },
      { name: "Sci-Fi", percentage: 15 },
      { name: "Horror", percentage: 5 }
    ],
    viewsPerDay: [
      { day: "Mon", views: 12500 },
      { day: "Tue", views: 13200 },
      { day: "Wed", views: 14800 },
      { day: "Thu", views: 15300 },
      { day: "Fri", views: 18900 },
      { day: "Sat", views: 22500 },
      { day: "Sun", views: 24100 }
    ],
    topContent: [
      { title: "The Quantum Effect", views: 48721, type: "Series" },
      { title: "Dark Matter", views: 32145, type: "Movie" },
      { title: "The Last Kingdom", views: 29876, type: "Series" },
      { title: "Cosmic Travel", views: 27543, type: "Movie" },
      { title: "Nebula Dreams", views: 24321, type: "Series" }
    ]
  };

  return (
    <div className="pt-20 pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome back. Here's a summary of your platform.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-eazybee-dark-accent border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="mr-2 text-eazybee-yellow" size={18} />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{analyticsData.totalUsers.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">+124 this week</p>
          </CardContent>
        </Card>

        <Card className="bg-eazybee-dark-accent border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Film className="mr-2 text-eazybee-yellow" size={18} />
              Total Videos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{analyticsData.totalVideos.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">+48 this week</p>
          </CardContent>
        </Card>
        
        <Card className="bg-eazybee-dark-accent border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Eye className="mr-2 text-eazybee-yellow" size={18} />
              Total Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{analyticsData.totalViews.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">+12.5% this month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-eazybee-dark-accent border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="mr-2 text-eazybee-yellow" size={18} />
              Avg. Watch Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{analyticsData.avgWatchTime} min</p>
            <p className="text-xs text-muted-foreground">+3 min this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart - left column */}
        <div className="lg:col-span-2">
          <Card className="bg-eazybee-dark-accent border-0 h-full">
            <CardHeader>
              <CardTitle>Weekly Views</CardTitle>
              <CardDescription>Total views per day for the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-end justify-between gap-2">
                {analyticsData.viewsPerDay.map((day) => {
                  // Normalize height to maximum 100%
                  const maxViews = Math.max(...analyticsData.viewsPerDay.map(d => d.views));
                  const heightPercentage = (day.views / maxViews) * 100;
                  
                  return (
                    <div key={day.day} className="flex flex-col items-center flex-1">
                      <div className="w-full flex-grow flex flex-col items-center justify-end">
                        <div 
                          className="w-full bg-gradient-to-t from-eazybee-yellow to-yellow-400 rounded-t-md relative group"
                          style={{ height: `${heightPercentage}%` }}
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {day.views.toLocaleString()} views
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-xs">{day.day}</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Top Content */}
        <div>
          <Card className="bg-eazybee-dark-accent border-0">
            <CardHeader>
              <CardTitle>Top Content</CardTitle>
              <CardDescription>Most viewed videos this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topContent.map((content, index) => (
                  <div 
                    key={index} 
                    className="flex items-center p-2 rounded hover:bg-muted transition-colors"
                  >
                    <div className="w-8 h-8 bg-muted flex items-center justify-center rounded mr-3 text-eazybee-yellow font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-grow">
                      <div className="font-medium">{content.title}</div>
                      <div className="text-xs text-muted-foreground flex justify-between items-center">
                        <span>{content.type}</span>
                        <span className="text-eazybee-yellow font-medium">
                          {content.views.toLocaleString()} views
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-eazybee-dark-accent border-0 mt-6">
            <CardHeader>
              <CardTitle>Popular Genres</CardTitle>
              <CardDescription>Distribution of views by genre</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.popularGenres.map((genre) => (
                  <div key={genre.name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{genre.name}</span>
                      <span>{genre.percentage}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-eazybee-yellow h-2 rounded-full"
                        style={{ width: `${genre.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
