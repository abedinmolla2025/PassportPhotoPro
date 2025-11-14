import { z } from "zod";

// Passport size presets
export const passportSizeSchema = z.object({
  id: z.string(),
  label: z.string(),
  widthMm: z.number(),
  heightMm: z.number(),
  widthPx: z.number(), // at 300 DPI
  heightPx: z.number(), // at 300 DPI
});

export type PassportSize = z.infer<typeof passportSizeSchema>;

// Standard passport photo sizes
export const PASSPORT_SIZES: PassportSize[] = [
  {
    id: "eu-standard",
    label: "35x45mm (EU Standard)",
    widthMm: 35,
    heightMm: 45,
    widthPx: 413,
    heightPx: 531,
  },
  {
    id: "us-standard",
    label: '2x2 inches (US Standard)',
    widthMm: 51,
    heightMm: 51,
    widthPx: 600,
    heightPx: 600,
  },
  {
    id: "india-standard",
    label: "51x51mm (India)",
    widthMm: 51,
    heightMm: 51,
    widthPx: 600,
    heightPx: 600,
  },
  {
    id: "uk-standard",
    label: "35x45mm (UK)",
    widthMm: 35,
    heightMm: 45,
    widthPx: 413,
    heightPx: 531,
  },
  {
    id: "custom",
    label: "Custom Size",
    widthMm: 0,
    heightMm: 0,
    widthPx: 0,
    heightPx: 0,
  },
];

// Background preset colors for passport photos
export const BACKGROUND_COLORS = [
  { id: "white", label: "White", value: "#FFFFFF" },
  { id: "light-gray", label: "Light Gray", value: "#F5F5F5" },
  { id: "light-blue", label: "Light Blue", value: "#E3F2FD" },
  { id: "blue", label: "Blue", value: "#2196F3" },
  { id: "red", label: "Red", value: "#F44336" },
  { id: "gray", label: "Gray", value: "#9E9E9E" },
  { id: "beige", label: "Beige", value: "#F5F5DC" },
  { id: "light-red", label: "Light Red", value: "#FFEBEE" },
];

// Image adjustments
export const imageAdjustmentsSchema = z.object({
  brightness: z.number().min(-100).max(100).default(0),
  contrast: z.number().min(-100).max(100).default(0),
  saturation: z.number().min(-100).max(100).default(0),
});

export type ImageAdjustments = z.infer<typeof imageAdjustmentsSchema>;

// Export format options
export const exportFormatSchema = z.enum(["jpeg", "png"]);
export type ExportFormat = z.infer<typeof exportFormatSchema>;

// Image processing request
export const imageProcessRequestSchema = z.object({
  format: exportFormatSchema,
  quality: z.number().min(1).max(100).default(90),
});

export type ImageProcessRequest = z.infer<typeof imageProcessRequestSchema>;
