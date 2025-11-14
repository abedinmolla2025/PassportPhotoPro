import { useState } from "react";
import { Eraser, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { PassportSizeSelector } from "./passport-size-selector";
import { BackgroundColorPicker } from "./background-color-picker";
import { AdjustmentSliders } from "./adjustment-sliders";
import { CropRotateTools } from "./crop-rotate-tools";
import { DownloadControls } from "./download-controls";
import type { PassportSize, ImageAdjustments, ExportFormat } from "@shared/schema";

interface ToolsSidebarProps {
  passportSize: PassportSize;
  onPassportSizeChange: (size: PassportSize) => void;
  backgroundColor: string;
  onBackgroundColorChange: (color: string) => void;
  adjustments: ImageAdjustments;
  onAdjustmentsChange: (adjustments: ImageAdjustments) => void;
  onRemoveBackground: () => void;
  onResetBackground: () => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onFlipHorizontal: () => void;
  onFlipVertical: () => void;
  onDownload: (format: ExportFormat, quality: number) => void;
  onStartOver: () => void;
  isProcessing: boolean;
  backgroundRemoved: boolean;
  hasImage: boolean;
}

export function ToolsSidebar({
  passportSize,
  onPassportSizeChange,
  backgroundColor,
  onBackgroundColorChange,
  adjustments,
  onAdjustmentsChange,
  onRemoveBackground,
  onResetBackground,
  onRotateLeft,
  onRotateRight,
  onFlipHorizontal,
  onFlipVertical,
  onDownload,
  onStartOver,
  isProcessing,
  backgroundRemoved,
  hasImage,
}: ToolsSidebarProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false);

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      <div className="p-4 lg:p-6 border-b border-sidebar-border flex-shrink-0">
        <h2 className="text-base lg:text-lg font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 text-primary flex-shrink-0" />
          Photo Tools
        </h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
          <PassportSizeSelector
            selectedSize={passportSize}
            onSizeChange={onPassportSizeChange}
          />

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-medium">Background</h3>
              {backgroundRemoved && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onResetBackground}
                  className="h-8 gap-1"
                  data-testid="button-reset-background"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </Button>
              )}
            </div>
            <Button
              onClick={onRemoveBackground}
              disabled={!hasImage || isProcessing}
              className="w-full gap-2"
              variant={backgroundRemoved ? "secondary" : "default"}
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
                  {backgroundRemoved ? "Background Removed" : "Remove Background"}
                </>
              )}
            </Button>
            {backgroundRemoved && (
              <BackgroundColorPicker
                selectedColor={backgroundColor}
                onColorChange={onBackgroundColorChange}
              />
            )}
          </div>

          <Separator />

          <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between p-0 h-auto font-medium text-sm"
                data-testid="button-toggle-advanced"
              >
                Advanced Adjustments
                <span className="text-xs text-muted-foreground">
                  {advancedOpen ? "Hide" : "Show"}
                </span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4">
              <AdjustmentSliders
                adjustments={adjustments}
                onAdjustmentsChange={onAdjustmentsChange}
              />
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          <CropRotateTools
            onRotateLeft={onRotateLeft}
            onRotateRight={onRotateRight}
            onFlipHorizontal={onFlipHorizontal}
            onFlipVertical={onFlipVertical}
            disabled={!hasImage}
          />
        </div>
      </ScrollArea>

      <div className="p-4 lg:p-6 border-t border-sidebar-border space-y-3 flex-shrink-0">
        <DownloadControls onDownload={onDownload} disabled={!hasImage} />
        <Button
          variant="outline"
          onClick={onStartOver}
          disabled={!hasImage}
          className="w-full"
          data-testid="button-start-over"
        >
          Start Over
        </Button>
      </div>
    </div>
  );
}
