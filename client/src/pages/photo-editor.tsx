import { useState, useCallback, useEffect } from "react";
import { Camera, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadZone } from "@/components/upload-zone";
import { CanvasPreview } from "@/components/canvas-preview";
import { PassportSizeSelector } from "@/components/passport-size-selector";
import { BackgroundColorPicker } from "@/components/background-color-picker";
import { AdjustmentSliders } from "@/components/adjustment-sliders";
import { CropRotateTools } from "@/components/crop-rotate-tools";
import { DownloadControls } from "@/components/download-controls";
import { BeforeAfterSlider } from "@/components/before-after-slider";
import { useToast } from "@/hooks/use-toast";
import { useImageEditor } from "@/hooks/use-image-editor";
import { removeImageBackground } from "@/lib/image-processing";
import { processAndDownloadImage } from "@/lib/api-client";
import { Separator } from "@/components/ui/separator";
import { Eraser, Loader2, RotateCcw, Sparkles } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { PassportSize, ExportFormat } from "@shared/schema";
import { PASSPORT_SIZES } from "@shared/schema";

export default function PhotoEditor() {
  const { toast } = useToast();
  const indiaSize = PASSPORT_SIZES.find(s => s.id === "india-standard") || PASSPORT_SIZES[0];
  const { state, setImage, setBackgroundRemoved, updateState, reset, canvasRef } =
    useImageEditor(indiaSize);

  const [isProcessing, setIsProcessing] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);

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

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
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

      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
          {!state.originalUrl ? (
            <UploadZone onImageSelect={handleImageSelect} hasImage={false} />
          ) : (
            <>
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
                passportSize={state.passportSize}
                cropPosition={state.cropPosition}
                onCropPositionChange={(position) => updateState({ cropPosition: position })}
              />

              {showComparison &&
                state.originalUrl &&
                state.processedUrl && (
                  <BeforeAfterSlider
                    beforeUrl={state.originalUrl}
                    afterUrl={state.processedUrl}
                  />
                )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold">Passport Size</h2>
                  </div>
                  <PassportSizeSelector
                    selectedSize={state.passportSize}
                    onSizeChange={(size: PassportSize) =>
                      updateState({ passportSize: size })
                    }
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-lg font-semibold">Background</h2>
                    {state.backgroundRemoved && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleResetBackground}
                        className="h-8 gap-1"
                        data-testid="button-reset-background"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Reset
                      </Button>
                    )}
                  </div>
                  <Button
                    onClick={handleRemoveBackground}
                    disabled={!state.originalUrl || isProcessing}
                    className="w-full gap-2"
                    variant={state.backgroundRemoved ? "secondary" : "default"}
                    data-testid="button-remove-background"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Eraser className="w-4 h-4" />
                        {state.backgroundRemoved ? "Background Removed" : "Remove Background"}
                      </>
                    )}
                  </Button>
                  {state.backgroundRemoved && (
                    <BackgroundColorPicker
                      selectedColor={state.backgroundColor}
                      onColorChange={(color: string) =>
                        updateState({ backgroundColor: color })
                      }
                    />
                  )}
                </div>

                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Rotate & Flip</h2>
                  <CropRotateTools
                    onRotateLeft={handleRotateLeft}
                    onRotateRight={handleRotateRight}
                    onFlipHorizontal={handleFlipHorizontal}
                    onFlipVertical={handleFlipVertical}
                    disabled={!state.originalUrl}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between h-auto font-medium text-lg"
                      data-testid="button-toggle-advanced"
                    >
                      Advanced Adjustments
                      <span className="text-sm text-muted-foreground">
                        {advancedOpen ? "Hide" : "Show"}
                      </span>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-4">
                    <AdjustmentSliders
                      adjustments={state.adjustments}
                      onAdjustmentsChange={(adjustments) => updateState({ adjustments })}
                    />
                  </CollapsibleContent>
                </Collapsible>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Download Photo</h2>
                  <DownloadControls onDownload={handleDownload} disabled={!state.originalUrl} />
                </div>

                <div className="space-y-4 flex flex-col justify-end">
                  <Button
                    variant="outline"
                    onClick={handleStartOver}
                    disabled={!state.originalUrl}
                    className="w-full"
                    size="lg"
                    data-testid="button-start-over"
                  >
                    Start Over
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
