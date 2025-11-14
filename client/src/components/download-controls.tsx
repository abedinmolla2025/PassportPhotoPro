import { useState } from "react";
import { Download, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import type { ExportFormat } from "@shared/schema";

interface DownloadControlsProps {
  onDownload: (format: ExportFormat, quality: number) => void;
  disabled?: boolean;
}

export function DownloadControls({
  onDownload,
  disabled = false,
}: DownloadControlsProps) {
  const [format, setFormat] = useState<ExportFormat>("jpeg");
  const [quality, setQuality] = useState(90);

  const handleDownload = () => {
    onDownload(format, quality);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-sm font-medium">Export Format</Label>
        <RadioGroup
          value={format}
          onValueChange={(value) => setFormat(value as ExportFormat)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="jpeg" id="format-jpeg" data-testid="radio-jpeg" />
            <Label htmlFor="format-jpeg" className="font-normal cursor-pointer">
              JPEG (Smaller file size)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="png" id="format-png" data-testid="radio-png" />
            <Label htmlFor="format-png" className="font-normal cursor-pointer">
              PNG (Supports transparency)
            </Label>
          </div>
        </RadioGroup>
      </div>

      {format === "jpeg" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Quality</Label>
            <span className="text-sm font-mono text-muted-foreground" data-testid="text-quality">
              {quality}%
            </span>
          </div>
          <Slider
            value={[quality]}
            onValueChange={(value) => setQuality(value[0])}
            min={60}
            max={100}
            step={5}
            data-testid="slider-quality"
          />
        </div>
      )}

      <Button
        onClick={handleDownload}
        disabled={disabled}
        className="w-full gap-2"
        size="lg"
        data-testid="button-download"
      >
        <Download className="w-4 h-4" />
        Download Photo
      </Button>
    </div>
  );
}
