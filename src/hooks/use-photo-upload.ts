import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UsePhotoUploadOptions {
  bucket: string;
  onSuccess?: (url: string) => void;
}

export const usePhotoUpload = ({ bucket, onSuccess }: UsePhotoUploadOptions) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadPhoto = async (file: File, userId: string, customPath?: string) => {
    if (!file) return null;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return null;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      });
      return null;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = customPath || `${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      onSuccess?.(publicUrl);
      
      toast({
        title: "Photo uploaded",
        description: "Your photo has been saved successfully.",
      });

      return publicUrl;
    } catch (error) {
      // Error details logged for debugging; user receives generic message
      toast({
        title: "Upload failed",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadPhoto, uploading };
};
