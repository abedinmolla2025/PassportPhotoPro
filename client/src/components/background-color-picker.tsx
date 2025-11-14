import { useState } from "react";
import { BACKGROUND_COLORS } from "@shared/schema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Palette, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackgroundColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  disabled?: boolean;
}

export function BackgroundColorPicker({
  selectedColor,
  onColorChange,
  disabled = false,
}: BackgroundColorPickerProps) {
  const [customColor, setCustomColor] = useState(selectedColor);

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setCustomColor(color);
    onColorChange(color);
  };

  return (
    <div className="space-y-3">
      <Label className="flex items-center gap-2 text-sm font-medium">
        <Palette className="w-4 h-4" />
        Background Color
      </Label>
      <div className="grid grid-cols-4 gap-2">
        {BACKGROUND_COLORS.map((color) => (
          <button
            key={color.id}
            onClick={() => onColorChange(color.value)}
            disabled={disabled}
            className={cn(
              "w-full h-12 rounded-lg border-2 transition-all hover-elevate active-elevate-2",
              selectedColor === color.value
                ? "ring-2 ring-ring ring-offset-2 ring-offset-background"
                : "border-border"
            )}
            style={{ backgroundColor: color.value }}
            title={color.label}
            data-testid={`button-color-${color.id}`}
          />
        ))}
      </div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="color"
            value={customColor}
            onChange={handleCustomColorChange}
            disabled={disabled}
            className="h-10 cursor-pointer"
            data-testid="input-custom-color"
          />
        </div>
        <Input
          type="text"
          value={customColor}
          onChange={(e) => {
            setCustomColor(e.target.value);
            if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
              onColorChange(e.target.value);
            }
          }}
          disabled={disabled}
          placeholder="#FFFFFF"
          className="flex-1 font-mono"
          data-testid="input-hex-color"
        />
      </div>
    </div>
  );
}
