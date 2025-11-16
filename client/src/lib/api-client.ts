import type { ExportFormat, ImageAdjustments } from "@shared/schema";

export interface ProcessImageOptions {
  format: ExportFormat;
  quality: number;
  adjustments: ImageAdjustments;
  backgroundColor?: string;
  rotation: number;
  flipHorizontal: boolean;
  flipVertical: boolean;
  passportWidthPx?: number;
  passportHeightPx?: number;
  printSheetWidthPx?: number;
  printSheetHeightPx?: number;
  enablePrintSheet?: boolean;
}

export async function processAndDownloadImage(
  file: File,
  options: ProcessImageOptions,
  fileName: string
): Promise<void> {
  if (options.enablePrintSheet && options.printSheetWidthPx && options.printSheetHeightPx && options.passportWidthPx && options.passportHeightPx) {
    return downloadPrintSheet(file, options, fileName);
  }

  const formData = new FormData();
  formData.append("image", file);
  formData.append("format", options.format);
  formData.append("quality", options.quality.toString());
  formData.append("brightness", options.adjustments.brightness.toString());
  formData.append("contrast", options.adjustments.contrast.toString());
  formData.append("saturation", options.adjustments.saturation.toString());
  formData.append("rotation", options.rotation.toString());
  formData.append("flipHorizontal", options.flipHorizontal.toString());
  formData.append("flipVertical", options.flipVertical.toString());
  
  if (options.backgroundColor) {
    formData.append("backgroundColor", options.backgroundColor);
  }
  
  if (options.passportWidthPx && options.passportHeightPx) {
    formData.append("width", options.passportWidthPx.toString());
    formData.append("height", options.passportHeightPx.toString());
  }

  const response = await fetch("/api/process", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to process image");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}.${options.format}`;
  a.click();
  URL.revokeObjectURL(url);
}

async function downloadPrintSheet(
  file: File,
  options: ProcessImageOptions,
  fileName: string
): Promise<void> {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("passportWidthPx", options.passportWidthPx!.toString());
  formData.append("passportHeightPx", options.passportHeightPx!.toString());
  formData.append("sheetWidthPx", options.printSheetWidthPx!.toString());
  formData.append("sheetHeightPx", options.printSheetHeightPx!.toString());
  formData.append("format", options.format);
  formData.append("quality", options.quality.toString());
  formData.append("brightness", options.adjustments.brightness.toString());
  formData.append("contrast", options.adjustments.contrast.toString());
  formData.append("saturation", options.adjustments.saturation.toString());
  formData.append("rotation", options.rotation.toString());
  formData.append("flipHorizontal", options.flipHorizontal.toString());
  formData.append("flipVertical", options.flipVertical.toString());
  
  if (options.backgroundColor) {
    formData.append("backgroundColor", options.backgroundColor);
  }

  const response = await fetch("/api/print-sheet", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "Failed to create print sheet" }));
    throw new Error(errorData.error || "Failed to create print sheet");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}-sheet.${options.format}`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function resizeToPassportSize(
  file: File,
  widthPx: number,
  heightPx: number,
  backgroundColor: string
): Promise<Blob> {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("widthPx", widthPx.toString());
  formData.append("heightPx", heightPx.toString());
  formData.append("backgroundColor", backgroundColor);

  const response = await fetch("/api/resize-passport", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to resize image");
  }

  return await response.blob();
}
