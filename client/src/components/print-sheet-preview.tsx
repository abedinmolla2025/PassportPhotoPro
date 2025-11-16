import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface PrintSheetPreviewProps {
  previewUrl: string | null;
  isLoading?: boolean;
}

export function PrintSheetPreview({ previewUrl, isLoading }: PrintSheetPreviewProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center gap-3 min-h-[300px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Generating print sheet preview...</p>
        </div>
      </Card>
    );
  }

  if (!previewUrl) {
    return null;
  }

  return (
    <Card className="p-4 overflow-hidden">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">Print Sheet Preview</h3>
        </div>
        <div className="relative bg-muted rounded-md overflow-hidden">
          <img
            src={previewUrl}
            alt="Print sheet preview"
            className="w-full h-auto"
            data-testid="img-print-sheet-preview"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          This is how your print sheet will look when downloaded
        </p>
      </div>
    </Card>
  );
}
