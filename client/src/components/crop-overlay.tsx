import { useState, useEffect, useCallback, useRef } from "react";
import { Move } from "lucide-react";
import type { PassportSize } from "@shared/schema";

interface CropOverlayProps {
  imageWidth: number;
  imageHeight: number;
  passportSize: PassportSize;
  cropPosition: { x: number; y: number };
  onCropPositionChange: (position: { x: number; y: number }) => void;
  zoom: number;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export function CropOverlay({
  imageWidth,
  imageHeight,
  passportSize,
  cropPosition,
  onCropPositionChange,
  zoom,
  canvasRef,
}: CropOverlayProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });
  const overlayRef = useRef<HTMLDivElement>(null);

  // Calculate displayed canvas size
  useEffect(() => {
    if (!canvasRef.current) return;

    const updateDisplaySize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      setDisplaySize({
        width: rect.width,
        height: rect.height,
      });
    };

    updateDisplaySize();
    
    // Update on resize
    const resizeObserver = new ResizeObserver(updateDisplaySize);
    resizeObserver.observe(canvasRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [canvasRef, imageWidth, imageHeight]);

  // Calculate scale factor between actual and displayed size
  const scale = displaySize.width > 0 ? displaySize.width / imageWidth : 1;

  // Calculate crop box dimensions maintaining passport aspect ratio
  const aspectRatio = passportSize.widthPx / passportSize.heightPx;
  
  let cropWidth: number;
  let cropHeight: number;
  
  // Fit the crop box within the image while maintaining aspect ratio
  if (imageWidth / imageHeight > aspectRatio) {
    cropHeight = Math.min(imageHeight * 0.7, imageHeight);
    cropWidth = cropHeight * aspectRatio;
  } else {
    cropWidth = Math.min(imageWidth * 0.7, imageWidth);
    cropHeight = cropWidth / aspectRatio;
  }

  // Ensure crop box fits within image
  if (cropWidth > imageWidth) {
    cropWidth = imageWidth;
    cropHeight = cropWidth / aspectRatio;
  }
  if (cropHeight > imageHeight) {
    cropHeight = imageHeight;
    cropWidth = cropHeight * aspectRatio;
  }

  // Scale to display size
  const displayCropWidth = cropWidth * scale;
  const displayCropHeight = cropHeight * scale;

  // Maximum position values to keep crop box within bounds
  const maxX = Math.max(0, imageWidth - cropWidth);
  const maxY = Math.max(0, imageHeight - cropHeight);

  // Initialize crop position centered
  useEffect(() => {
    const centerX = (imageWidth - cropWidth) / 2;
    const centerY = (imageHeight - cropHeight) / 2;
    
    if (cropPosition.x === 0 && cropPosition.y === 0) {
      onCropPositionChange({ 
        x: Math.max(0, Math.min(maxX, centerX)),
        y: Math.max(0, Math.min(maxY, centerY))
      });
    }
  }, [imageWidth, imageHeight, cropWidth, cropHeight, maxX, maxY]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - cropPosition.x * scale,
      y: e.clientY - cropPosition.y * scale,
    });
  }, [cropPosition, scale]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.touches[0].clientX - cropPosition.x * scale,
      y: e.touches[0].clientY - cropPosition.y * scale,
    });
  }, [cropPosition, scale]);

  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!isDragging) return;

      const newX = (clientX - dragStart.x) / scale;
      const newY = (clientY - dragStart.y) / scale;

      // Clamp position within bounds
      const clampedX = Math.max(0, Math.min(maxX, newX));
      const clampedY = Math.max(0, Math.min(maxY, newY));

      onCropPositionChange({ x: clampedX, y: clampedY });
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
  }, [isDragging, dragStart, maxX, maxY, scale, onCropPositionChange]);

  if (displaySize.width === 0 || displaySize.height === 0) {
    return null;
  }

  const displayX = cropPosition.x * scale;
  const displayY = cropPosition.y * scale;

  return (
    <div
      ref={overlayRef}
      className="absolute inset-0 pointer-events-none"
      style={{
        width: `${displaySize.width}px`,
        height: `${displaySize.height}px`,
      }}
    >
      {/* Dark overlay outside crop area */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: 'none' }}
      >
        <defs>
          <mask id="crop-mask">
            <rect width="100%" height="100%" fill="white" />
            <rect
              x={displayX}
              y={displayY}
              width={displayCropWidth}
              height={displayCropHeight}
              fill="black"
            />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.6)"
          mask="url(#crop-mask)"
        />
      </svg>

      {/* Crop box border and handles */}
      <div
        className="absolute border-2 border-primary pointer-events-auto cursor-move touch-none"
        style={{
          left: `${displayX}px`,
          top: `${displayY}px`,
          width: `${displayCropWidth}px`,
          height: `${displayCropHeight}px`,
          boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.5)",
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        data-testid="crop-box"
      >
        {/* Grid lines */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="border border-primary/30" />
          ))}
        </div>

        {/* Center move icon */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-primary text-primary-foreground rounded-full p-1.5 sm:p-2">
            <Move className="w-3 h-3 sm:w-4 sm:h-4" />
          </div>
        </div>

        {/* Corner handles */}
        <div className="absolute -left-1.5 -top-1.5 w-3 h-3 bg-primary rounded-full pointer-events-none" />
        <div className="absolute -right-1.5 -top-1.5 w-3 h-3 bg-primary rounded-full pointer-events-none" />
        <div className="absolute -left-1.5 -bottom-1.5 w-3 h-3 bg-primary rounded-full pointer-events-none" />
        <div className="absolute -right-1.5 -bottom-1.5 w-3 h-3 bg-primary rounded-full pointer-events-none" />
      </div>

      {/* Passport size label */}
      {displayY > 35 && (
        <div
          className="absolute bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-medium pointer-events-none"
          style={{
            left: `${displayX}px`,
            top: `${displayY - 30}px`,
          }}
        >
          {passportSize.label}
        </div>
      )}
    </div>
  );
}
