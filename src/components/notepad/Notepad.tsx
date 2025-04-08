
import React, { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Save } from 'lucide-react';
import { getStoredContent, storeContent, NOTEPAD_STORAGE_KEY } from '@/api/services/storageUtils';

const Notepad: React.FC = () => {
  const [text, setText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Load content from localStorage on component mount
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const savedContent = await getStoredContent(NOTEPAD_STORAGE_KEY);
        setText(savedContent);
      } catch (error) {
        console.error('Error loading notepad content:', error);
      }
    };
    
    fetchContent();
  }, []);

  // Auto-save on text change with debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (text) {
        try {
          await storeContent(NOTEPAD_STORAGE_KEY, text);
        } catch (error) {
          console.error('Error auto-saving notepad content:', error);
        }
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [text]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await storeContent(NOTEPAD_STORAGE_KEY, text);
      toast({
        title: "Saved",
        description: "Your notes have been saved successfully",
      });
    } catch (error) {
      console.error('Error saving notes:', error);
      toast({
        title: "Error",
        description: "Failed to save your notes",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between">
          <span>Quick Notes</span>
          <Button 
            onClick={handleSave} 
            size="sm" 
            className="h-8" 
            disabled={isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Type your notes here... Everything will be auto-saved"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[150px] resize-none"
        />
        <div className="mt-2 text-xs text-muted-foreground text-right">
          Auto-saving enabled
        </div>
      </CardContent>
    </Card>
  );
};

export default Notepad;
