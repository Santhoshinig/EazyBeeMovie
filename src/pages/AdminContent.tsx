
import React, { useState, useEffect } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminContent() {
  const [selectedContent, setSelectedContent] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [contentList, setContentList] = useState([]);

  useEffect(() => {
    const storedContent = JSON.parse(localStorage.getItem('eazybee-content') || '[]');
    setContentList(storedContent);
  }, []);

  const handleView = (content) => {
    setSelectedContent(content);
    setIsViewDialogOpen(true);
  };

  const handleDelete = (contentId) => {
    const updatedContent = contentList.filter(item => item.id !== contentId);
    localStorage.setItem('eazybee-content', JSON.stringify(updatedContent));
    setContentList(updatedContent);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Content</h1>
      </div>

      <div className="grid gap-4">
        {contentList.map((content) => (
          <Card key={content.id} className="bg-eazybee-dark-accent border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={content.poster?.url || "/no-image.png"}
                    alt={content.title}
                    className="w-16 h-24 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-medium">{content.title}</h3>
                    <p className="text-sm text-gray-400">{content.type}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleView(content)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-500"
                    onClick={() => handleDelete(content.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedContent?.title}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            {selectedContent?.video && (
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  key={selectedContent.video.url || selectedContent.video}
                  src={selectedContent.video.url || selectedContent.video}
                  controls
                  controlsList="nodownload"
                  className="w-full h-full"
                  playsInline
                  preload="metadata"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              {selectedContent?.poster?.url && (
                <img
                  src={selectedContent.poster.url}
                  alt={selectedContent?.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              )}
              <div>
                <h3 className="font-medium mb-2">Details</h3>
                <p className="text-sm text-gray-400 mb-2">
                  Type: {selectedContent?.type}
                </p>
                <p className="text-sm text-gray-400 mb-2">
                  Release Year: {selectedContent?.releaseYear}
                </p>
                <p className="text-sm text-gray-400 mb-2">
                  Genre: {selectedContent?.genre}
                </p>
                <p className="text-sm text-gray-400 mb-2">
                  Duration: {selectedContent?.duration} minutes
                </p>
                <p className="text-sm text-gray-400">
                  {selectedContent?.description}
                </p>
                {selectedContent?.cast && (
                  <p className="text-sm text-gray-400 mt-2">
                    Cast: {selectedContent.cast}
                  </p>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
