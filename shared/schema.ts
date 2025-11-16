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

// Print sheet sizes for arranging multiple passport photos
export const printSheetSchema = z.object({
  id: z.string(),
  label: z.string(),
  widthMm: z.number(),
  heightMm: z.number(),
  widthPx: z.number(), // at 300 DPI
  heightPx: z.number(), // at 300 DPI
});

export type PrintSheet = z.infer<typeof printSheetSchema>;

export const PRINT_SHEET_SIZES: PrintSheet[] = [
  {
    id: "3x4",
    label: '3x4"',
    widthMm: 76,
    heightMm: 102,
    widthPx: 900,
    heightPx: 1200,
  },
  {
    id: "4x4",
    label: '4x4"',
    widthMm: 102,
    heightMm: 102,
    widthPx: 1200,
    heightPx: 1200,
  },
  {
    id: "4x6",
    label: '4x6"',
    widthMm: 102,
    heightMm: 152,
    widthPx: 1200,
    heightPx: 1800,
  },
  {
    id: "5x6",
    label: '5x6"',
    widthMm: 127,
    heightMm: 152,
    widthPx: 1500,
    heightPx: 1800,
  },
  {
    id: "5x7",
    label: '5x7"',
    widthMm: 127,
    heightMm: 178,
    widthPx: 1500,
    heightPx: 2100,
  },
  {
    id: "a4",
    label: "A4",
    widthMm: 210,
    heightMm: 297,
    widthPx: 2480,
    heightPx: 3508,
  },
];

// Standard passport photo sizes
export const PASSPORT_SIZES: PassportSize[] = [
  {
    id: "us-standard",
    label: '2x2" (USA Passport)',
    widthMm: 51,
    heightMm: 51,
    widthPx: 600,
    heightPx: 600,
  },
  {
    id: "india-standard",
    label: "2x2\" (India Passport/Visa)",
    widthMm: 51,
    heightMm: 51,
    widthPx: 600,
    heightPx: 600,
  },
  {
    id: "china-standard",
    label: "33x48mm (China Passport)",
    widthMm: 33,
    heightMm: 48,
    widthPx: 390,
    heightPx: 567,
  },
  {
    id: "eu-standard",
    label: "35x45mm (EU Passport)",
    widthMm: 35,
    heightMm: 45,
    widthPx: 413,
    heightPx: 531,
  },
  {
    id: "uk-standard",
    label: "35x45mm (UK Passport)",
    widthMm: 35,
    heightMm: 45,
    widthPx: 413,
    heightPx: 531,
  },
  {
    id: "germany-standard",
    label: "35x45mm (Germany)",
    widthMm: 35,
    heightMm: 45,
    widthPx: 413,
    heightPx: 531,
  },
  {
    id: "france-standard",
    label: "35x45mm (France)",
    widthMm: 35,
    heightMm: 45,
    widthPx: 413,
    heightPx: 531,
  },
  {
    id: "spain-standard",
    label: "26x32mm (Spain DNI)",
    widthMm: 26,
    heightMm: 32,
    widthPx: 307,
    heightPx: 378,
  },
  {
    id: "italy-standard",
    label: "35x45mm (Italy)",
    widthMm: 35,
    heightMm: 45,
    widthPx: 413,
    heightPx: 531,
  },
  {
    id: "japan-standard",
    label: "35x45mm (Japan Passport)",
    widthMm: 35,
    heightMm: 45,
    widthPx: 413,
    heightPx: 531,
  },
  {
    id: "korea-standard",
    label: "35x45mm (South Korea)",
    widthMm: 35,
    heightMm: 45,
    widthPx: 413,
    heightPx: 531,
  },
  {
    id: "brazil-standard",
    label: "5x7cm (Brazil)",
    widthMm: 50,
    heightMm: 70,
    widthPx: 591,
    heightPx: 827,
  },
  {
    id: "australia-standard",
    label: "35x45mm (Australia)",
    widthMm: 35,
    heightMm: 45,
    widthPx: 413,
    heightPx: 531,
  },
  {
    id: "canada-standard",
    label: "50x70mm (Canada)",
    widthMm: 50,
    heightMm: 70,
    widthPx: 591,
    heightPx: 827,
  },
  {
    id: "russia-standard",
    label: "35x45mm (Russia)",
    widthMm: 35,
    heightMm: 45,
    widthPx: 413,
    heightPx: 531,
  },
  {
    id: "mexico-standard",
    label: "25x35mm (Mexico)",
    widthMm: 25,
    heightMm: 35,
    widthPx: 295,
    heightPx: 413,
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
