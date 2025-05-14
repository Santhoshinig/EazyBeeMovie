
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { User, Mail, Phone, Calendar, Users, MapPin, Building, Briefcase } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProfileData {
  phoneNumber: string;
  age: string;
  gender: string;
  address: string;
  occupation: string;
  company: string;
  bio: string;
}

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [profileData, setProfileData] = useState<ProfileData>({
    phoneNumber: user?.phoneNumber || "",
    age: user?.age || "",
    gender: user?.gender || "",
    address: user?.address || "",
    occupation: user?.occupation || "",
    company: user?.company || "",
    bio: user?.bio || ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateProfile(profileData);
    if (success) {
      setIsEditing(false);
      toast.success("Profile updated successfully");
    }
  };

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload this to a server
      // For now, we'll use a local URL
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          updateProfile({ ...profileData, profileImage: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (confirmed) {
      try {
        logout();
        toast.success("Account deleted successfully");
        navigate("/");
      } catch (error) {
        toast.error("Failed to delete account");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6 mt-20">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="flex items-center gap-6 bg-eazybee-dark-accent p-6 rounded-lg">
          <div className="relative group">
            <div className="h-24 w-24 rounded-full bg-eazybee-yellow flex items-center justify-center overflow-hidden">
              {user?.profileImage ? (
                <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-black">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <label htmlFor="profile-picture" className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
              <span className="text-white text-sm">Change Photo</span>
            </label>
            <input
              type="file"
              id="profile-picture"
              className="hidden"
              accept="image/*"
              onChange={handleProfilePictureChange}
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user?.name}</h1>
            <p className="text-gray-400">{user?.email}</p>
            <p className="text-sm mt-2">{profileData.bio || "No bio added yet"}</p>
          </div>
        </div>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="personal">Personal Information</TabsTrigger>
            <TabsTrigger value="professional">Professional Details</TabsTrigger>
            <TabsTrigger value="settings">Account Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card className="bg-eazybee-dark-accent border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-eazybee-yellow" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-gray-400">Full Name</Label>
                        <p className="text-lg">{user?.name}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-gray-400">Email</Label>
                        <p className="text-lg">{user?.email}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-gray-400">Phone Number</Label>
                        <p className="text-lg">{user?.phoneNumber || "Not set"}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-gray-400">Age</Label>
                        <p className="text-lg">{user?.age || "Not set"}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-gray-400">Gender</Label>
                        <p className="text-lg">{user?.gender || "Not set"}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-gray-400">Address</Label>
                        <p className="text-lg">{profileData.address || "Not set"}</p>
                      </div>
                    </div>
                    <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Phone Number</Label>
                        <Input
                          value={profileData.phoneNumber}
                          onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Age</Label>
                        <Input
                          type="number"
                          value={profileData.age}
                          onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                          placeholder="Enter age"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Gender</Label>
                        <Select
                          value={profileData.gender}
                          onValueChange={(value) => setProfileData({ ...profileData, gender: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Address</Label>
                        <Input
                          value={profileData.address}
                          onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                          placeholder="Enter address"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">Save Changes</Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="professional">
            <Card className="bg-eazybee-dark-accent border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-eazybee-yellow" />
                  Professional Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-gray-400">Occupation</Label>
                        <p className="text-lg">{profileData.occupation || "Not set"}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-gray-400">Company</Label>
                        <p className="text-lg">{profileData.company || "Not set"}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-gray-400">Bio</Label>
                        <p className="text-lg">{profileData.bio || "Not set"}</p>
                      </div>
                    </div>
                    <Button onClick={() => setIsEditing(true)}>Edit Details</Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Occupation</Label>
                        <Input
                          value={profileData.occupation}
                          onChange={(e) => setProfileData({ ...profileData, occupation: e.target.value })}
                          placeholder="Enter occupation"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Company</Label>
                        <Input
                          value={profileData.company}
                          onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                          placeholder="Enter company name"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Bio</Label>
                      <Input
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        placeholder="Tell us about yourself"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">Save Changes</Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-eazybee-dark-accent border-0">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="destructive" onClick={handleDeleteAccount}>Delete Account</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </>
  );
}
