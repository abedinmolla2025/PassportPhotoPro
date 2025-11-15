import { useEffect, useState } from "react";
import { ZoomIn, ZoomOut, Trash2, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CropOverlay } from "@/components/crop-overlay";
import type { ImageAdjustments, PassportSize } from "@shared/schema";

interface CanvasPreviewProps {
  imageUrl: string | null;
  fileName?: string;
  dimensions?: { width: number; height: number };
  fileSize?: number;
  adjustments: ImageAdjustments;
  backgroundColor?: string;
  backgroundRemoved: boolean;
  onRemoveImage: () => void;
  onDownload: () => void;
  rotation?: number;
  flipped?: { horizontal: boolean; vertical: boolean };
  canvasRef: React.RefObject<HTMLCanvasElement>;
  showBeforeAfter?: boolean;
  passportSize: PassportSize;
  cropPosition: { x: number; y: number };
  onCropPositionChange: (position: { x: number; y: number }) => void;
}

export function CanvasPreview({
  imageUrl,
  fileName,
  dimensions,
  fileSize,
  adjustments,
  backgroundColor = "#FFFFFF",
  backgroundRemoved,
  onRemoveImage,
  onDownload,
  rotation = 0,
  flipped = { horizontal: false, vertical: false },
  canvasRef,
  showBeforeAfter = false,
  passportSize,
  cropPosition,
  onCropPositionChange,
}: CanvasPreviewProps) {
  const [zoom, setZoom] = useState(100);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!imageUrl || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const isRotated90Degrees = Math.abs(rotation % 180) === 90;
      canvas.width = isRotated90Degrees ? img.height : img.width;
      canvas.height = isRotated90Degrees ? img.width : img.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);

      if (flipped.horizontal) ctx.scale(-1, 1);
      if (flipped.vertical) ctx.scale(1, -1);

      if (backgroundRemoved && backgroundColor) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(-img.width / 2, -img.height / 2, img.width, img.height);
      }

      const brightnessValue = 100 + adjustments.brightness;
      const contrastValue = 100 + adjustments.contrast;
      const saturationValue = 100 + adjustments.saturation;

      ctx.filter = `brightness(${brightnessValue}%) contrast(${contrastValue}%) saturate(${saturationValue}%)`;

      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      ctx.restore();

      setImageLoaded(true);
    };

    img.onerror = () => {
      console.error("Failed to load image");
      setImageLoaded(false);
    };

    img.src = imageUrl;
  }, [imageUrl, adjustments, backgroundColor, backgroundRemoved, rotation, flipped, canvasRef]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  if (!imageUrl) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 sm:gap-3 lg:gap-4">
      <Card className="p-2 sm:p-3 lg:p-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <FileImage className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <div className="min-w-0">
              <p className="font-medium truncate" data-testid="text-filename">
                {fileName || "image.jpg"}
              </p>
              <p className="text-sm text-muted-foreground font-mono">
                {dimensions && (
                  <span data-testid="text-dimensions">
                    {dimensions.width} × {dimensions.height} px
                  </span>
                )}
                {fileSize && dimensions && " • "}
                {fileSize && (
                  <span data-testid="text-filesize">{formatFileSize(fileSize)}</span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setZoom((z) => Math.max(50, z - 10))}
              data-testid="button-zoom-out"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Badge variant="secondary" className="no-default-active-elevate font-mono">
              {zoom}%
            </Badge>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setZoom((z) => Math.min(200, z + 10))}
              data-testid="button-zoom-in"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={onRemoveImage}
              data-testid="button-remove-image"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      <div
        className="overflow-auto rounded-xl border bg-card relative"
        style={{
          backgroundImage:
            "repeating-conic-gradient(hsl(var(--muted)) 0% 25%, hsl(var(--background)) 0% 50%) 50% / 20px 20px",
        }}
      >
        <div className="flex items-center justify-center min-h-[250px] sm:min-h-[350px] lg:min-h-[400px] max-h-[400px] sm:max-h-[500px] lg:max-h-[600px] p-2 sm:p-4 lg:p-8 relative">
          <div
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: "center",
              maxWidth: "100%",
              maxHeight: "100%",
            }}
            className="transition-transform relative"
          >
            {!imageLoaded && (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}
            <canvas
              ref={canvasRef}
              className="shadow-lg rounded-md"
              data-testid="canvas-preview"
              style={{ 
                display: imageLoaded ? "block" : "none",
                maxWidth: "100%",
                maxHeight: "350px",
                width: "auto",
                height: "auto",
              }}
            />
            {imageLoaded && dimensions && passportSize.widthPx > 0 && (
              <CropOverlay
                imageWidth={dimensions.width}
                imageHeight={dimensions.height}
                passportSize={passportSize}
                cropPosition={cropPosition}
                onCropPositionChange={onCropPositionChange}
                zoom={zoom}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
