import { useState, useRef, useEffect, useCallback } from "react";
import { Move } from "lucide-react";
import type { PassportSize } from "@shared/schema";

interface CropOverlayProps {
  imageWidth: number;
  imageHeight: number;
  passportSize: PassportSize;
  cropPosition: { x: number; y: number };
  onCropPositionChange: (position: { x: number; y: number }) => void;
  zoom: number;
}

export function CropOverlay({
  imageWidth,
  imageHeight,
  passportSize,
  cropPosition,
  onCropPositionChange,
  zoom,
}: CropOverlayProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const overlayRef = useRef<HTMLDivElement>(null);

  // Calculate crop box dimensions maintaining passport aspect ratio
  const aspectRatio = passportSize.widthPx / passportSize.heightPx;
  
  let cropWidth: number;
  let cropHeight: number;
  
  // Fit the crop box within the image while maintaining aspect ratio
  if (imageWidth / imageHeight > aspectRatio) {
    // Image is wider - fit to height
    cropHeight = Math.min(imageHeight * 0.7, imageHeight);
    cropWidth = cropHeight * aspectRatio;
  } else {
    // Image is taller - fit to width
    cropWidth = Math.min(imageWidth * 0.7, imageWidth);
    cropHeight = cropWidth / aspectRatio;
  }

  // Ensure crop box doesn't exceed image boundaries
  const maxX = imageWidth - cropWidth;
  const maxY = imageHeight - cropHeight;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - cropPosition.x * (zoom / 100),
      y: e.clientY - cropPosition.y * (zoom / 100),
    });
  }, [cropPosition, zoom]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    setIsDragging(true);
    setDragStart({
      x: e.touches[0].clientX - cropPosition.x * (zoom / 100),
      y: e.touches[0].clientY - cropPosition.y * (zoom / 100),
    });
  }, [cropPosition, zoom]);

  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!isDragging) return;

      const newX = Math.max(0, Math.min(maxX, (clientX - dragStart.x) / (zoom / 100)));
      const newY = Math.max(0, Math.min(maxY, (clientY - dragStart.y) / (zoom / 100)));

      onCropPositionChange({ x: newX, y: newY });
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      e.preventDefault();
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleEnd);
      document.addEventListener("touchmove", handleTouchMove, { passive: false });
      document.addEventListener("touchend", handleEnd);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleEnd);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleEnd);
      };
    }
  }, [isDragging, dragStart, maxX, maxY, zoom, onCropPositionChange]);

  return (
    <div
      ref={overlayRef}
      className="absolute inset-0 pointer-events-none"
      style={{
        transform: `scale(${zoom / 100})`,
        transformOrigin: "center",
      }}
    >
      {/* Dark overlay outside crop area */}
      <div className="absolute inset-0 bg-black/50">
        {/* Clear area for crop box */}
        <div
          className="absolute bg-transparent"
          style={{
            left: `${cropPosition.x}px`,
            top: `${cropPosition.y}px`,
            width: `${cropWidth}px`,
            height: `${cropHeight}px`,
            boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
          }}
        />
      </div>

      {/* Crop box border and handles */}
      <div
        className="absolute border-2 border-primary pointer-events-auto cursor-move"
        style={{
          left: `${cropPosition.x}px`,
          top: `${cropPosition.y}px`,
          width: `${cropWidth}px`,
          height: `${cropHeight}px`,
          boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.5)",
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        data-testid="crop-box"
      >
        {/* Grid lines */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="border border-primary/30" />
          ))}
        </div>

        {/* Center move icon */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-primary text-primary-foreground rounded-full p-2">
            <Move className="w-4 h-4" />
          </div>
        </div>

        {/* Corner handles */}
        <div className="absolute -left-1 -top-1 w-3 h-3 bg-primary rounded-full" />
        <div className="absolute -right-1 -top-1 w-3 h-3 bg-primary rounded-full" />
        <div className="absolute -left-1 -bottom-1 w-3 h-3 bg-primary rounded-full" />
        <div className="absolute -right-1 -bottom-1 w-3 h-3 bg-primary rounded-full" />
      </div>

      {/* Passport size label */}
      <div
        className="absolute bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-medium pointer-events-none"
        style={{
          left: `${cropPosition.x}px`,
          top: `${cropPosition.y - 30}px`,
        }}
      >
        {passportSize.label}
      </div>
    </div>
  );
}
