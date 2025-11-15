import { useState, useCallback, useEffect } from "react";
import { Camera, HelpCircle, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { UploadZone } from "@/components/upload-zone";
import { CanvasPreview } from "@/components/canvas-preview";
import { ToolsSidebar } from "@/components/tools-sidebar";
import { BeforeAfterSlider } from "@/components/before-after-slider";
import { useToast } from "@/hooks/use-toast";
import { useImageEditor } from "@/hooks/use-image-editor";
import { removeImageBackground } from "@/lib/image-processing";
import { processAndDownloadImage } from "@/lib/api-client";
import type { PassportSize, ExportFormat } from "@shared/schema";
import { PASSPORT_SIZES } from "@shared/schema";

export default function PhotoEditor() {
  const { toast } = useToast();
  const { state, setImage, setBackgroundRemoved, updateState, reset, canvasRef } =
    useImageEditor(PASSPORT_SIZES[0]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    return () => {
      if (state.originalUrl) {
        URL.revokeObjectURL(state.originalUrl);
      }
      if (state.processedUrl) {
        URL.revokeObjectURL(state.processedUrl);
      }
    };
  }, [state.originalUrl, state.processedUrl]);

  const handleImageSelect = useCallback(
    (file: File) => {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 10MB",
          variant: "destructive",
        });
        return;
      }

      const url = URL.createObjectURL(file);
      setImage(file, url);

      toast({
        title: "Image uploaded",
        description: "Your photo is ready for editing",
      });
    },
    [toast, setImage]
  );

  const handleRemoveBackground = useCallback(async () => {
    if (!state.originalUrl) return;

    setIsProcessing(true);
    try {
      const resultUrl = await removeImageBackground(state.originalUrl);
      setBackgroundRemoved(resultUrl);
      setShowComparison(true);
      toast({
        title: "Background removed",
        description: "You can now choose a custom background color",
      });
    } catch (error) {
      console.error("Background removal error:", error);
      toast({
        title: "Error",
        description: "Failed to remove background. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [state.originalUrl, setBackgroundRemoved, toast]);

  const handleResetBackground = useCallback(() => {
    if (state.processedUrl) {
      URL.revokeObjectURL(state.processedUrl);
    }
    updateState({
      processedUrl: null,
      backgroundRemoved: false,
      backgroundColor: "#FFFFFF",
    });
    setShowComparison(false);
    toast({
      title: "Background reset",
      description: "Original background restored",
    });
  }, [state.processedUrl, updateState, toast]);

  const handleRemoveImage = useCallback(() => {
    setShowComparison(false);
    reset();
  }, [reset]);

  const handleRotateLeft = useCallback(() => {
    updateState({ rotation: (state.rotation - 90) % 360 });
    toast({
      title: "Rotated left",
      description: "Image rotated 90° counterclockwise",
    });
  }, [state.rotation, updateState, toast]);

  const handleRotateRight = useCallback(() => {
    updateState({ rotation: (state.rotation + 90) % 360 });
    toast({
      title: "Rotated right",
      description: "Image rotated 90° clockwise",
    });
  }, [state.rotation, updateState, toast]);

  const handleFlipHorizontal = useCallback(() => {
    updateState({
      flipped: {
        ...state.flipped,
        horizontal: !state.flipped.horizontal,
      },
    });
    toast({
      title: "Flipped horizontally",
      description: "Image flipped on horizontal axis",
    });
  }, [state.flipped, updateState, toast]);

  const handleFlipVertical = useCallback(() => {
    updateState({
      flipped: {
        ...state.flipped,
        vertical: !state.flipped.vertical,
      },
    });
    toast({
      title: "Flipped vertically",
      description: "Image flipped on vertical axis",
    });
  }, [state.flipped, updateState, toast]);

  const handleDownload = useCallback(
    async (format: ExportFormat, quality: number) => {
      if (!state.originalFile) {
        toast({
          title: "Error",
          description: "No image to download",
          variant: "destructive",
        });
        return;
      }

      const timestamp = Date.now();
      const baseFilename = `passport-photo-${timestamp}`;

      const fileToProcess = state.backgroundRemoved && state.processedUrl
        ? await fetch(state.processedUrl).then(r => r.blob()).then(b => new File([b], `${baseFilename}.png`, { type: "image/png" }))
        : state.originalFile;

      const clampedQuality = Math.min(100, Math.max(1, quality));

      try {
        await processAndDownloadImage(
          fileToProcess,
          {
            format,
            quality: clampedQuality,
            adjustments: state.adjustments,
            backgroundColor: state.backgroundRemoved ? state.backgroundColor : undefined,
            rotation: state.rotation,
            flipHorizontal: state.flipped.horizontal,
            flipVertical: state.flipped.vertical,
            passportWidthPx: state.passportSize.widthPx > 0 ? state.passportSize.widthPx : undefined,
            passportHeightPx: state.passportSize.heightPx > 0 ? state.passportSize.heightPx : undefined,
          },
          baseFilename
        );
        toast({
          title: "Download started",
          description: `Your photo is being downloaded as ${format.toUpperCase()}`,
        });
      } catch (error) {
        console.error("Download error:", error);
        toast({
          title: "Error",
          description: "Failed to download image. Please try again.",
          variant: "destructive",
        });
      }
    },
    [state, toast]
  );

  const handleStartOver = useCallback(() => {
    handleRemoveImage();
    toast({
      title: "Starting over",
      description: "All changes have been reset",
    });
  }, [handleRemoveImage, toast]);

  const displayUrl = state.processedUrl || state.originalUrl;

  const sidebarContent = (
    <ToolsSidebar
      passportSize={state.passportSize}
      onPassportSizeChange={(size: PassportSize) =>
        updateState({ passportSize: size })
      }
      backgroundColor={state.backgroundColor}
      onBackgroundColorChange={(color: string) =>
        updateState({ backgroundColor: color })
      }
      adjustments={state.adjustments}
      onAdjustmentsChange={(adjustments) => updateState({ adjustments })}
      onRemoveBackground={handleRemoveBackground}
      onResetBackground={handleResetBackground}
      onRotateLeft={handleRotateLeft}
      onRotateRight={handleRotateRight}
      onFlipHorizontal={handleFlipHorizontal}
      onFlipVertical={handleFlipVertical}
      onDownload={handleDownload}
      onStartOver={handleStartOver}
      isProcessing={isProcessing}
      backgroundRemoved={state.backgroundRemoved}
      hasImage={!!state.originalUrl}
    />
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {!state.originalUrl && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 border-b bg-background flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
            <div className="flex items-center gap-2 lg:gap-3">
              <Camera className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
              <h1 className="text-lg lg:text-xl font-semibold">Photo Passport Editor</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" data-testid="button-help">
                <HelpCircle className="w-5 h-5" />
              </Button>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-4 lg:p-6">
            <div className="max-w-6xl mx-auto space-y-4 lg:space-y-6">
              <UploadZone onImageSelect={handleImageSelect} hasImage={false} />
            </div>
          </main>
        </div>
      )}

      {state.originalUrl && (
        <>
          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="h-16 border-b bg-background flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
              <div className="flex items-center gap-2 lg:gap-3">
                <Sheet>
                  <SheetTrigger asChild className="lg:hidden">
                    <Button variant="ghost" size="icon" data-testid="button-menu">
                      <Menu className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="p-0 w-full sm:w-80 sm:max-w-80">
                    {sidebarContent}
                  </SheetContent>
                </Sheet>
                <Camera className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
                <h1 className="text-lg lg:text-xl font-semibold">Photo Passport Editor</h1>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" data-testid="button-help">
                  <HelpCircle className="w-5 h-5" />
                </Button>
              </div>
            </header>

            <main className="flex-1 overflow-auto p-4 lg:p-6">
              <div className="max-w-6xl mx-auto space-y-4 lg:space-y-6">
                <CanvasPreview
                  imageUrl={displayUrl}
                  fileName={state.originalFile?.name}
                  dimensions={state.dimensions || undefined}
                  fileSize={state.originalFile?.size}
                  adjustments={state.adjustments}
                  backgroundColor={state.backgroundColor}
                  backgroundRemoved={state.backgroundRemoved}
                  onRemoveImage={handleRemoveImage}
                  onDownload={() => handleDownload("jpeg", 90)}
                  rotation={state.rotation}
                  flipped={state.flipped}
                  canvasRef={canvasRef}
                />
                {showComparison &&
                  state.originalUrl &&
                  state.processedUrl && (
                    <BeforeAfterSlider
                      beforeUrl={state.originalUrl}
                      afterUrl={state.processedUrl}
                    />
                  )}
              </div>
            </main>
          </div>

          <div className="w-80 flex-shrink-0 hidden lg:block">
            {sidebarContent}
          </div>
        </>
      )}
    </div>
  );
}
