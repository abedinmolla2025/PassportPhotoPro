import { useCallback } from "react";
import { Upload, ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import sample1 from "@assets/stock_images/professional_busines_8d38411e.jpg";
import sample2 from "@assets/stock_images/professional_busines_1a5ad391.jpg";
import sample3 from "@assets/stock_images/professional_busines_142548dc.jpg";

interface UploadZoneProps {
  onImageSelect: (file: File) => void;
  hasImage: boolean;
}

const SAMPLE_IMAGES = [
  { url: sample1, name: "Sample 1" },
  { url: sample2, name: "Sample 2" },
  { url: sample3, name: "Sample 3" },
];

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

  const handleSampleImage = useCallback(
    async (imageUrl: string, name: string) => {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], `${name}.jpg`, { type: "image/jpeg" });
        onImageSelect(file);
      } catch (error) {
        console.error("Failed to load sample image:", error);
      }
    },
    [onImageSelect]
  );

  if (hasImage) {
    return null;
  }

  return (
    <div className="space-y-6">
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

      <div className="space-y-3">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Or try with a sample photo</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {SAMPLE_IMAGES.map((sample, index) => (
            <button
              key={index}
              onClick={() => handleSampleImage(sample.url, sample.name)}
              className="relative aspect-[3/4] rounded-lg overflow-hidden border-2 hover-elevate active-elevate-2 transition-all group"
              data-testid={`button-sample-${index + 1}`}
            >
              <img
                src={sample.url}
                alt={sample.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm font-medium">Use This Photo</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
