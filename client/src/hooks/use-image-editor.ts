import { useState, useCallback, useRef } from "react";
import type { PassportSize, ImageAdjustments } from "@shared/schema";

export interface ImageEditorState {
  originalFile: File | null;
  originalUrl: string | null;
  processedUrl: string | null;
  dimensions: { width: number; height: number } | null;
  passportSize: PassportSize;
  backgroundColor: string;
  adjustments: ImageAdjustments;
  backgroundRemoved: boolean;
  rotation: number;
  flipped: { horizontal: boolean; vertical: boolean };
  cropPosition: { x: number; y: number };
}

export function useImageEditor(initialPassportSize: PassportSize) {
  const [state, setState] = useState<ImageEditorState>({
    originalFile: null,
    originalUrl: null,
    processedUrl: null,
    dimensions: null,
    passportSize: initialPassportSize,
    backgroundColor: "#FFFFFF",
    adjustments: { brightness: 0, contrast: 0, saturation: 0 },
    backgroundRemoved: false,
    rotation: 0,
    flipped: { horizontal: false, vertical: false },
    cropPosition: { x: 0, y: 0 },
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const setImage = useCallback((file: File, url: string) => {
    const img = new Image();
    img.onload = () => {
      setState((prev) => ({
        ...prev,
        originalFile: file,
        originalUrl: url,
        processedUrl: null,
        dimensions: { width: img.width, height: img.height },
        backgroundRemoved: false,
        rotation: 0,
        flipped: { horizontal: false, vertical: false },
        cropPosition: { x: 0, y: 0 },
      }));
    };
    img.src = url;
  }, []);

  const setBackgroundRemoved = useCallback((url: string) => {
    setState((prev) => ({
      ...prev,
      processedUrl: url,
      backgroundRemoved: true,
    }));
  }, []);

  const updateState = useCallback(
    (updates: Partial<ImageEditorState>) => {
      setState((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const reset = useCallback(() => {
    if (state.originalUrl) {
      URL.revokeObjectURL(state.originalUrl);
    }
    if (state.processedUrl) {
      URL.revokeObjectURL(state.processedUrl);
    }
    setState({
      originalFile: null,
      originalUrl: null,
      processedUrl: null,
      dimensions: null,
      passportSize: initialPassportSize,
      backgroundColor: "#FFFFFF",
      adjustments: { brightness: 0, contrast: 0, saturation: 0 },
      backgroundRemoved: false,
      rotation: 0,
      flipped: { horizontal: false, vertical: false },
      cropPosition: { x: 0, y: 0 },
    });
  }, [state.originalUrl, state.processedUrl, initialPassportSize]);

  return {
    state,
    setImage,
    setBackgroundRemoved,
    updateState,
    reset,
    canvasRef,
  };
}
