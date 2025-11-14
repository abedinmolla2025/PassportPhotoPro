import { RotateCw, RotateCcw, FlipHorizontal, FlipVertical, Crop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface CropRotateToolsProps {
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onFlipHorizontal: () => void;
  onFlipVertical: () => void;
  disabled?: boolean;
}

export function CropRotateTools({
  onRotateLeft,
  onRotateRight,
  onFlipHorizontal,
  onFlipVertical,
  disabled = false,
}: CropRotateToolsProps) {
  return (
    <div className="space-y-3">
      <Label className="flex items-center gap-2 text-sm font-medium">
        <Crop className="w-4 h-4" />
        Transform
      </Label>
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          onClick={onRotateLeft}
          disabled={disabled}
          className="gap-2"
          data-testid="button-rotate-left"
        >
          <RotateCcw className="w-4 h-4" />
          Rotate Left
        </Button>
        <Button
          variant="outline"
          onClick={onRotateRight}
          disabled={disabled}
          className="gap-2"
          data-testid="button-rotate-right"
        >
          <RotateCw className="w-4 h-4" />
          Rotate Right
        </Button>
        <Button
          variant="outline"
          onClick={onFlipHorizontal}
          disabled={disabled}
          className="gap-2"
          data-testid="button-flip-horizontal"
        >
          <FlipHorizontal className="w-4 h-4" />
          Flip H
        </Button>
        <Button
          variant="outline"
          onClick={onFlipVertical}
          disabled={disabled}
          className="gap-2"
          data-testid="button-flip-vertical"
        >
          <FlipVertical className="w-4 h-4" />
          Flip V
        </Button>
      </div>
    </div>
  );
}
