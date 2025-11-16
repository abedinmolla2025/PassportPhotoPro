import { PRINT_SHEET_SIZES, type PrintSheet } from "@shared/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FileStack } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface PrintSheetSelectorProps {
  selectedSheet: PrintSheet | null;
  onSheetChange: (sheet: PrintSheet | null) => void;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
}

export function PrintSheetSelector({
  selectedSheet,
  onSheetChange,
  enabled,
  onEnabledChange,
}: PrintSheetSelectorProps) {
  const handleValueChange = (value: string) => {
    const sheet = PRINT_SHEET_SIZES.find((s) => s.id === value);
    if (sheet) {
      onSheetChange(sheet);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <FileStack className="w-4 h-4" />
          Print Sheet Layout
        </Label>
        <Switch
          checked={enabled}
          onCheckedChange={onEnabledChange}
          data-testid="switch-print-sheet"
        />
      </div>
      {enabled && (
        <>
          <Select
            value={selectedSheet?.id || "4x6"}
            onValueChange={handleValueChange}
          >
            <SelectTrigger data-testid="select-print-sheet">
              <SelectValue placeholder="Select print sheet size" />
            </SelectTrigger>
            <SelectContent>
              {PRINT_SHEET_SIZES.map((sheet) => (
                <SelectItem key={sheet.id} value={sheet.id}>
                  {sheet.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedSheet && (
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary" className="font-mono no-default-active-elevate">
                {selectedSheet.widthMm}×{selectedSheet.heightMm}mm
              </Badge>
              <Badge variant="secondary" className="font-mono no-default-active-elevate">
                {selectedSheet.widthPx}×{selectedSheet.heightPx}px
              </Badge>
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Multiple passport photos will be arranged on this print size
          </p>
        </>
      )}
    </div>
  );
}
