import { PASSPORT_SIZES, type PassportSize } from "@shared/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Ruler } from "lucide-react";

interface PassportSizeSelectorProps {
  selectedSize: PassportSize;
  onSizeChange: (size: PassportSize) => void;
}

export function PassportSizeSelector({
  selectedSize,
  onSizeChange,
}: PassportSizeSelectorProps) {
  const handleValueChange = (value: string) => {
    const size = PASSPORT_SIZES.find((s) => s.id === value);
    if (size) {
      onSizeChange(size);
    }
  };

  return (
    <div className="space-y-3">
      <Label className="flex items-center gap-2 text-sm font-medium">
        <Ruler className="w-4 h-4" />
        Passport Photo Size
      </Label>
      <Select value={selectedSize.id} onValueChange={handleValueChange}>
        <SelectTrigger data-testid="select-passport-size">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PASSPORT_SIZES.map((size) => (
            <SelectItem key={size.id} value={size.id}>
              {size.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedSize.id !== "custom" && (
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary" className="font-mono no-default-active-elevate">
            {selectedSize.widthMm}×{selectedSize.heightMm}mm
          </Badge>
          <Badge variant="secondary" className="font-mono no-default-active-elevate">
            {selectedSize.widthPx}×{selectedSize.heightPx}px @ 300 DPI
          </Badge>
        </div>
      )}
    </div>
  );
}
