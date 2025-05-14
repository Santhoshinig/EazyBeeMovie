
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const ANNOUNCEMENTS_STORAGE_KEY = "eazybee-announcements";

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAnnouncements = JSON.parse(localStorage.getItem(ANNOUNCEMENTS_STORAGE_KEY) || "[]");
    setAnnouncements(storedAnnouncements);
  }, []);

  const handleEdit = (announcement) => {
    navigate('/admin/add', { state: { editData: announcement, type: 'announcements' } });
  };

  const handleDelete = (id) => {
    const updatedAnnouncements = announcements.filter(announcement => announcement.id !== id);
    localStorage.setItem(ANNOUNCEMENTS_STORAGE_KEY, JSON.stringify(updatedAnnouncements));
    setAnnouncements(updatedAnnouncements);
    toast.success("Announcement deleted successfully");
  };

  return (
    <div className="pt-20 pb-10 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Manage Announcements</h1>
      
      <div className="grid gap-6">
        {announcements.map((announcement) => (
          <Card key={announcement.id} className="bg-eazybee-dark-accent border-0">
            {announcement.bannerImage && (
              <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                <img 
                  src={announcement.bannerImage.url} 
                  alt={announcement.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{announcement.title}</CardTitle>
                  <p className="text-sm text-gray-400 mt-1">
                    Type: {announcement.type} | Expires: {announcement.expiryDate || 'No expiry'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleEdit(announcement)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleDelete(announcement.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-200">{announcement.message}</p>
            </CardContent>
          </Card>
        ))}

        {announcements.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>No announcements found. Create one from the Add New page.</p>
          </div>
        )}
      </div>
    </div>
  );
}
