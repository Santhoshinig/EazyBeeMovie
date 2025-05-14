import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Plus, Upload } from "lucide-react";

// Local storage key for content
const CONTENT_STORAGE_KEY = "eazybee-content";
const USERS_STORAGE_KEY = "eazybee-users";
const ANNOUNCEMENTS_STORAGE_KEY = "eazybee-announcements";

export default function AdminAdd() {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("content");
  const editData = location.state?.editData;
  const editType = location.state?.type;

  useEffect(() => {
    if (editData && editType) {
      setActiveTab(editType);
      switch (editType) {
        case 'announcements':
          setAnnouncementForm(editData);
          break;
        case 'content':
          setContentForm(editData);
          break;
        case 'users':
          setUserForm(editData);
          break;
      }
    }
  }, [editData, editType]);

  // Form states
  const [contentForm, setContentForm] = useState({
    title: "",
    type: "movie",
    description: "",
    genre: "",
    releaseYear: new Date().getFullYear(),
    duration: 120,
    cast: "",
    poster: null,
    video: null
  });

  const [userForm, setUserForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "user",
    profilePicture: null
  });

  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    message: "",
    type: "info",
    expiryDate: "",
    bannerImage: null
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!isAdmin) {
      navigate("/");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Form handlers
  const handleContentChange = (e) => {
    const { id, value } = e.target;
    setContentForm(prev => ({ ...prev, [id]: value }));
  };

  const handleContentSelectChange = (id, value) => {
    setContentForm(prev => ({ ...prev, [id]: value }));
  };

  const handleContentFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const { id } = e.target;
      const file = e.target.files[0];

      // For poster and video, create a URL that can be stored
      if (id === "poster" || id === "video") {
        const fileUrl = URL.createObjectURL(file);
        setContentForm(prev => ({ 
          ...prev, 
          [id]: {
            file: file,
            name: file.name,
            url: fileUrl
          }
        }));
      }
    }
  };

  const handleUserChange = (e) => {
    const { id, value } = e.target;
    setUserForm(prev => ({ ...prev, [id]: value }));
  };

  const handleUserSelectChange = (id, value) => {
    setUserForm(prev => ({ ...prev, [id]: value }));
  };

  const handleUserFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileUrl = URL.createObjectURL(file);

      setUserForm(prev => ({ 
        ...prev, 
        profilePicture: {
          file: file,
          name: file.name,
          url: fileUrl
        }
      }));
    }
  };

  const handleAnnouncementChange = (e) => {
    const { id, value } = e.target;
    setAnnouncementForm(prev => ({ ...prev, [id]: value }));
  };

  const handleAnnouncementSelectChange = (id, value) => {
    setAnnouncementForm(prev => ({ ...prev, [id]: value }));
  };

  const handleAnnouncementFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileUrl = URL.createObjectURL(file);

      setAnnouncementForm(prev => ({ 
        ...prev, 
        bannerImage: {
          file: file,
          name: file.name,
          url: fileUrl
        }
      }));
    }
  };

  const handleContentSubmit = (e) => {
    e.preventDefault();

    // Create a new content item with a unique ID
    const newContent = {
      ...contentForm,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };

    // Get existing content from localStorage or initialize empty array
    const existingContent = JSON.parse(localStorage.getItem(CONTENT_STORAGE_KEY) || "[]");

    // Add the new content and save back to localStorage
    const updatedContent = [...existingContent, newContent];
    localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(updatedContent));

    console.log("Content saved:", newContent);
    toast.success(`Content "${contentForm.title}" added successfully`);

    // Reset form
    setContentForm({
      title: "",
      type: "movie",
      description: "",
      genre: "",
      releaseYear: new Date().getFullYear(),
      duration: 120,
      cast: "",
      poster: null,
      video: null
    });
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();

    // Create a new user with a unique ID
    const newUser = {
      ...userForm,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };

    // Get existing users from localStorage or initialize empty array
    const existingUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || "[]");

    // Add the new user and save back to localStorage
    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));

    console.log("User saved:", newUser);
    toast.success(`User "${userForm.fullName}" added successfully`);

    // Reset form
    setUserForm({
      fullName: "",
      email: "",
      password: "",
      role: "user",
      profilePicture: null
    });
  };

  const handleAnnouncementSubmit = (e) => {
    e.preventDefault();

    // Create a new announcement with a unique ID
    const newAnnouncement = {
      ...announcementForm,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };

    // Get existing announcements from localStorage or initialize empty array
    const existingAnnouncements = JSON.parse(localStorage.getItem(ANNOUNCEMENTS_STORAGE_KEY) || "[]");

    // Add the new announcement and save back to localStorage
    const updatedAnnouncements = [...existingAnnouncements, newAnnouncement];
    localStorage.setItem(ANNOUNCEMENTS_STORAGE_KEY, JSON.stringify(updatedAnnouncements));

    console.log("Announcement saved:", newAnnouncement);
    toast.success(`Announcement "${announcementForm.title}" added successfully`);

    // Reset form
    setAnnouncementForm({
      title: "",
      message: "",
      type: "info",
      expiryDate: "",
      bannerImage: null
    });
  };

  return (
    <div className="pt-16 md:pt-20 pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add New</h1>
        <p className="text-muted-foreground">Create new content, users, or announcements</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 md:mb-8 overflow-x-auto flex-nowrap w-full">
          <TabsTrigger value="content" className="data-[state=active]:bg-eazybee-yellow data-[state=active]:text-black">
            Content
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-eazybee-yellow data-[state=active]:text-black">
            Users
          </TabsTrigger>
          <TabsTrigger value="announcements" className="data-[state=active]:bg-eazybee-yellow data-[state=active]:text-black">
            Announcements
          </TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content">
          <Card className="bg-eazybee-dark-accent border-0">
            <CardHeader>
              <CardTitle>Add New Content</CardTitle>
              <CardDescription>Upload movies or TV series to the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContentSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title" 
                      placeholder="Enter content title" 
                      value={contentForm.title}
                      onChange={handleContentChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content-type">Content Type</Label>
                    <Select 
                      value={contentForm.type}
                      onValueChange={(value) => handleContentSelectChange("type", value)}
                    >
                      <SelectTrigger id="content-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="movie">Movie</SelectItem>
                        <SelectItem value="tv">TV Series</SelectItem>
                        <SelectItem value="kdrama">K-Drama</SelectItem>
                        <SelectItem value="cdrama">C-Drama</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Enter content description" 
                    rows={4}
                    value={contentForm.description}
                    onChange={handleContentChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="genre">Genre</Label>
                    <Select 
                      value={contentForm.genre}
                      onValueChange={(value) => handleContentSelectChange("genre", value)}
                    >
                      <SelectTrigger id="genre">
                        <SelectValue placeholder="Select genre" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="action">Action</SelectItem>
                        <SelectItem value="comedy">Comedy</SelectItem>
                        <SelectItem value="drama">Drama</SelectItem>
                        <SelectItem value="horror">Horror</SelectItem>
                        <SelectItem value="romance">Romance</SelectItem>
                        <SelectItem value="scifi">Science Fiction</SelectItem>
                        <SelectItem value="thriller">Thriller</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="releaseYear">Release Year</Label>
                    <Input 
                      id="releaseYear" 
                      type="number" 
                      placeholder="2023" 
                      min="1900" 
                      max="2099" 
                      step="1"
                      value={contentForm.releaseYear}
                      onChange={handleContentChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input 
                      id="duration" 
                      type="number" 
                      placeholder="120" 
                      min="1"
                      value={contentForm.duration}
                      onChange={handleContentChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cast">Cast (comma separated)</Label>
                  <Input 
                    id="cast" 
                    placeholder="Actor 1, Actor 2, Actor 3"
                    value={contentForm.cast}
                    onChange={handleContentChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Poster Image</Label>
                    <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 md:p-8 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Upload className="h-8 w-8 text-gray-500" />
                        <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        <Input 
                          id="poster" 
                          type="file" 
                          className="hidden" 
                          onChange={handleContentFileChange}
                          accept="image/*"
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => document.getElementById('poster')?.click()}
                        >
                          {contentForm.poster ? 'Change File' : 'Choose File'}
                        </Button>
                        {contentForm.poster && (
                          <p className="text-xs text-green-500 mt-1">
                            File selected: {contentForm.poster.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Video File</Label>
                    <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 md:p-8 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Upload className="h-8 w-8 text-gray-500" />
                        <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500">MP4, WebM up to 2GB</p>
                        <Input 
                          id="video" 
                          type="file" 
                          className="hidden" 
                          onChange={handleContentFileChange}
                          accept="video/*"
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => document.getElementById('video')?.click()}
                        >
                          {contentForm.video ? 'Change File' : 'Choose File'}
                        </Button>
                        {contentForm.video && (
                          <p className="text-xs text-green-500 mt-1">
                            File selected: {contentForm.video.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" className="bg-eazybee-yellow text-black hover:bg-eazybee-yellow/80">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Content
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card className="bg-eazybee-dark-accent border-0">
            <CardHeader>
              <CardTitle>Add New User</CardTitle>
              <CardDescription>Create user accounts for the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUserSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input 
                      id="fullName" 
                      placeholder="Enter full name"
                      value={userForm.fullName}
                      onChange={handleUserChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="user@example.com"
                      value={userForm.email}
                      onChange={handleUserChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••"
                      value={userForm.password}
                      onChange={handleUserChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">User Role</Label>
                    <Select 
                      defaultValue={userForm.role}
                      onValueChange={(value) => handleUserSelectChange("role", value)}
                    >
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">Regular User</SelectItem>
                        <SelectItem value="admin">Administrator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Profile Picture</Label>
                  <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 md:p-8 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Upload className="h-8 w-8 text-gray-500" />
                      <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                      <Input 
                        id="profilePicture" 
                        type="file" 
                        className="hidden"
                        onChange={handleUserFileChange}
                        accept="image/*"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => document.getElementById('profilePicture')?.click()}
                      >
                        {userForm.profilePicture ? 'Change File' : 'Choose File'}
                      </Button>
                      {userForm.profilePicture && (
                        <p className="text-xs text-green-500 mt-1">
                          File selected: {userForm.profilePicture.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" className="bg-eazybee-yellow text-black hover:bg-eazybee-yellow/80">
                    <Plus className="mr-2 h-4 w-4" />
                    Add User
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Announcements Tab */}
        <TabsContent value="announcements">
          <Card className="bg-eazybee-dark-accent border-0">
            <CardHeader>
              <CardTitle>Add New Announcement</CardTitle>
              <CardDescription>Create announcements for the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAnnouncementSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Announcement Title</Label>
                  <Input 
                    id="title" 
                    placeholder="Enter announcement title"
                    value={announcementForm.title}
                    onChange={handleAnnouncementChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Announcement Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Enter announcement message" 
                    rows={4}
                    value={announcementForm.message}
                    onChange={handleAnnouncementChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="type">Announcement Type</Label>
                    <Select 
                      defaultValue={announcementForm.type}
                      onValueChange={(value) => handleAnnouncementSelectChange("type", value)}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Information</SelectItem>
                        <SelectItem value="new">New Release</SelectItem>
                        <SelectItem value="update">Update</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input 
                      id="expiryDate" 
                      type="date"
                      value={announcementForm.expiryDate}
                      onChange={handleAnnouncementChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Banner Image (Optional)</Label>
                  <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 md:p-8 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Upload className="h-8 w-8 text-gray-500" />
                      <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                      <Input 
                        id="bannerImage" 
                        type="file" 
                        className="hidden"
                        onChange={handleAnnouncementFileChange}
                        accept="image/*"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => document.getElementById('bannerImage')?.click()}
                      >
                        {announcementForm.bannerImage ? 'Change File' : 'Choose File'}
                      </Button>
                      {announcementForm.bannerImage && (
                        <p className="text-xs text-green-500 mt-1">
                          File selected: {announcementForm.bannerImage.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" className="bg-eazybee-yellow text-black hover:bg-eazybee-yellow/80">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Announcement
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}