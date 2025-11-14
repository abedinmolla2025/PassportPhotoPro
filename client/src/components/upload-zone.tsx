import { useCallback } from "react";
import { Upload, ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onImageSelect: (file: File) => void;
  hasImage: boolean;
}

export function UploadZone({ onImageSelect, hasImage }: UploadZoneProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        onImageSelect(file);
      }
    },
    [onImageSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onImageSelect(file);
      }
    },
    [onImageSelect]
  );

  if (hasImage) {
    return null;
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="flex flex-col items-center justify-center min-h-96 border-2 border-dashed rounded-xl hover-elevate active-elevate-2 transition-colors cursor-pointer"
      onClick={() => document.getElementById("file-input")?.click()}
      data-testid="upload-zone"
    >
      <div className="flex flex-col items-center gap-4 p-8 text-center">
        <div className="rounded-full bg-primary/10 p-6">
          <Upload className="w-12 h-12 text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Upload Your Photo</h3>
          <p className="text-muted-foreground">
            Drag and drop your photo here or click to browse
          </p>
        </div>
        <div className="flex gap-2 flex-wrap justify-center">
          <Badge variant="secondary" className="no-default-active-elevate">
            <ImageIcon className="w-3 h-3 mr-1" />
            JPG
          </Badge>
          <Badge variant="secondary" className="no-default-active-elevate">
            <ImageIcon className="w-3 h-3 mr-1" />
            PNG
          </Badge>
          <Badge variant="secondary" className="no-default-active-elevate">
            Max 10MB
          </Badge>
        </div>
      </div>
      <input
        id="file-input"
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        className="hidden"
        onChange={handleFileInput}
        data-testid="input-file"
      />
    </div>
  );
}
