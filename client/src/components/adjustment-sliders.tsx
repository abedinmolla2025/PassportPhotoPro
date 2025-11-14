import { Sun, Contrast, Droplet, RotateCcw } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import type { ImageAdjustments } from "@shared/schema";

interface AdjustmentSlidersProps {
  adjustments: ImageAdjustments;
  onAdjustmentsChange: (adjustments: ImageAdjustments) => void;
}

export function AdjustmentSliders({
  adjustments,
  onAdjustmentsChange,
}: AdjustmentSlidersProps) {
  const handleBrightnessChange = (value: number[]) => {
    onAdjustmentsChange({ ...adjustments, brightness: value[0] });
  };

  const handleContrastChange = (value: number[]) => {
    onAdjustmentsChange({ ...adjustments, contrast: value[0] });
  };

  const handleSaturationChange = (value: number[]) => {
    onAdjustmentsChange({ ...adjustments, saturation: value[0] });
  };

  const resetAll = () => {
    onAdjustmentsChange({ brightness: 0, contrast: 0, saturation: 0 });
  };

  const hasChanges =
    adjustments.brightness !== 0 ||
    adjustments.contrast !== 0 ||
    adjustments.saturation !== 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Adjustments</Label>
        {hasChanges && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetAll}
            className="h-8 gap-1"
            data-testid="button-reset-adjustments"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 text-sm">
              <Sun className="w-4 h-4" />
              Brightness
            </Label>
            <span className="text-sm font-mono text-muted-foreground" data-testid="text-brightness">
              {adjustments.brightness > 0 ? "+" : ""}
              {adjustments.brightness}
            </span>
          </div>
          <Slider
            value={[adjustments.brightness]}
            onValueChange={handleBrightnessChange}
            min={-100}
            max={100}
            step={1}
            data-testid="slider-brightness"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 text-sm">
              <Contrast className="w-4 h-4" />
              Contrast
            </Label>
            <span className="text-sm font-mono text-muted-foreground" data-testid="text-contrast">
              {adjustments.contrast > 0 ? "+" : ""}
              {adjustments.contrast}
            </span>
          </div>
          <Slider
            value={[adjustments.contrast]}
            onValueChange={handleContrastChange}
            min={-100}
            max={100}
            step={1}
            data-testid="slider-contrast"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 text-sm">
              <Droplet className="w-4 h-4" />
              Saturation
            </Label>
            <span className="text-sm font-mono text-muted-foreground" data-testid="text-saturation">
              {adjustments.saturation > 0 ? "+" : ""}
              {adjustments.saturation}
            </span>
          </div>
          <Slider
            value={[adjustments.saturation]}
            onValueChange={handleSaturationChange}
            min={-100}
            max={100}
            step={1}
            data-testid="slider-saturation"
          />
        </div>
      </div>
    </div>
  );
}
