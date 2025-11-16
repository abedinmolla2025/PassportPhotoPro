import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import sharp from "sharp";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG and PNG are allowed."));
    }
  },
});

function parseNumber(value: string | undefined, defaultValue: number): number {
  if (!value) return defaultValue;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

function parseBoolean(value: string | undefined): boolean {
  return value === "true";
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Image upload endpoint
  app.post("/api/upload", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      const imageBuffer = req.file.buffer;
      const metadata = await sharp(imageBuffer).metadata();

      res.json({
        success: true,
        data: {
          filename: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          dimensions: {
            width: metadata.width,
            height: metadata.height,
          },
        },
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to process image" });
    }
  });

  // Image processing endpoint
  app.post("/api/process", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      const format = (req.body.format || "jpeg") as "jpeg" | "png";
      const quality = Math.min(100, Math.max(1, parseNumber(req.body.quality, 90)));
      const brightness = parseNumber(req.body.brightness, 0);
      const contrast = parseNumber(req.body.contrast, 0);
      const saturation = parseNumber(req.body.saturation, 0);
      const rotation = parseNumber(req.body.rotation, 0);
      const flipHorizontal = parseBoolean(req.body.flipHorizontal);
      const flipVertical = parseBoolean(req.body.flipVertical);
      const backgroundColor = req.body.backgroundColor;
      const width = req.body.width ? parseInt(req.body.width) : undefined;
      const height = req.body.height ? parseInt(req.body.height) : undefined;

      let pipeline = sharp(req.file.buffer);

      // Apply rotation
      if (rotation !== 0) {
        pipeline = pipeline.rotate(rotation);
      }

      // Apply flip - CORRECTED: horizontal flip uses flop, vertical flip uses flip
      if (flipHorizontal || flipVertical) {
        if (flipVertical) {
          pipeline = pipeline.flip();
        }
        if (flipHorizontal) {
          pipeline = pipeline.flop();
        }
      }

      // Resize if dimensions provided
      if (width && height) {
        pipeline = pipeline.resize(width, height, {
          fit: "contain",
          background: backgroundColor || "transparent",
        });
      }

      // Apply color adjustments
      if (brightness !== 0 || saturation !== 0) {
        const brightnessMultiplier = 1 + brightness / 100;
        pipeline = pipeline.modulate({
          brightness: brightnessMultiplier,
          saturation: 1 + saturation / 100,
        });
      }

      if (contrast !== 0) {
        const contrastMultiplier = 1 + contrast / 100;
        pipeline = pipeline.linear(
          contrastMultiplier,
          -(128 * contrastMultiplier) + 128
        );
      }

      // Apply background color ONLY if provided - preserve transparency otherwise
      if (backgroundColor) {
        pipeline = pipeline.flatten({ background: backgroundColor });
      }

      // Set output format and quality
      if (format === "png") {
        pipeline = pipeline.png({ quality: Math.round(quality) });
      } else {
        pipeline = pipeline.jpeg({ quality: Math.round(quality) });
      }

      const processedBuffer = await pipeline.toBuffer();

      res.set({
        "Content-Type": format === "png" ? "image/png" : "image/jpeg",
        "Content-Length": processedBuffer.length,
        "Content-Disposition": `attachment; filename="processed-image.${format}"`,
      });

      res.send(processedBuffer);
    } catch (error) {
      console.error("Processing error:", error);
      res.status(500).json({ error: "Failed to process image" });
    }
  });

  // Resize to passport size endpoint
  app.post("/api/resize-passport", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      const { widthPx, heightPx, backgroundColor = "#FFFFFF" } = req.body;

      if (!widthPx || !heightPx) {
        return res.status(400).json({ error: "Width and height are required" });
      }

      const processedBuffer = await sharp(req.file.buffer)
        .resize(parseInt(widthPx), parseInt(heightPx), {
          fit: "cover",
          position: "center",
        })
        .flatten({ background: backgroundColor })
        .toBuffer();

      res.set({
        "Content-Type": "image/jpeg",
        "Content-Length": processedBuffer.length,
      });

      res.send(processedBuffer);
    } catch (error) {
      console.error("Resize error:", error);
      res.status(500).json({ error: "Failed to resize image" });
    }
  });

  // Print sheet layout endpoint - arrange multiple passport photos on a sheet
  app.post("/api/print-sheet", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      const {
        passportWidthPx,
        passportHeightPx,
        sheetWidthPx,
        sheetHeightPx,
        backgroundColor,
        format = "jpeg",
        quality = 90,
        brightness,
        contrast,
        saturation,
        rotation,
        flipHorizontal,
        flipVertical,
      } = req.body;

      if (!passportWidthPx || !passportHeightPx || !sheetWidthPx || !sheetHeightPx) {
        return res.status(400).json({ error: "Passport and sheet dimensions are required" });
      }

      const pWidth = parseInt(passportWidthPx);
      const pHeight = parseInt(passportHeightPx);
      const sWidth = parseInt(sheetWidthPx);
      const sHeight = parseInt(sheetHeightPx);
      const margin = 20;
      const spacing = 15;

      const cols = Math.floor((sWidth - margin * 2 + spacing) / (pWidth + spacing));
      const rows = Math.floor((sHeight - margin * 2 + spacing) / (pHeight + spacing));

      if (cols < 1 || rows < 1) {
        return res.status(400).json({ 
          error: "Passport photo is too large for the selected sheet size. Please choose a larger sheet or smaller passport size." 
        });
      }

      const brightnessVal = parseNumber(brightness, 0);
      const contrastVal = parseNumber(contrast, 0);
      const saturationVal = parseNumber(saturation, 0);
      const rotationVal = parseNumber(rotation, 0);
      const flipH = parseBoolean(flipHorizontal);
      const flipV = parseBoolean(flipVertical);

      let passportPipeline = sharp(req.file.buffer);

      if (rotationVal !== 0) {
        passportPipeline = passportPipeline.rotate(rotationVal);
      }

      if (flipV || flipH) {
        if (flipV) {
          passportPipeline = passportPipeline.flip();
        }
        if (flipH) {
          passportPipeline = passportPipeline.flop();
        }
      }

      passportPipeline = passportPipeline.resize(pWidth, pHeight, {
        fit: "contain",
        background: backgroundColor || "transparent",
      });

      if (brightnessVal !== 0 || saturationVal !== 0) {
        const brightnessMultiplier = 1 + brightnessVal / 100;
        passportPipeline = passportPipeline.modulate({
          brightness: brightnessMultiplier,
          saturation: 1 + saturationVal / 100,
        });
      }

      if (contrastVal !== 0) {
        const contrastMultiplier = 1 + contrastVal / 100;
        passportPipeline = passportPipeline.linear(
          contrastMultiplier,
          -(128 * contrastMultiplier) + 128
        );
      }

      if (backgroundColor) {
        passportPipeline = passportPipeline.flatten({ background: backgroundColor });
      }

      const passportImage = await passportPipeline.toBuffer();

      const availableWidth = cols * pWidth + (cols - 1) * spacing;
      const availableHeight = rows * pHeight + (rows - 1) * spacing;
      const startX = Math.floor((sWidth - availableWidth) / 2);
      const startY = Math.floor((sHeight - availableHeight) / 2);

      const composites = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = startX + col * (pWidth + spacing);
          const y = startY + row * (pHeight + spacing);
          composites.push({
            input: passportImage,
            top: y,
            left: x,
          });
        }
      }

      let pipeline = sharp({
        create: {
          width: sWidth,
          height: sHeight,
          channels: 4,
          background: backgroundColor || { r: 0, g: 0, b: 0, alpha: 0 },
        },
      }).composite(composites);

      if (backgroundColor) {
        pipeline = pipeline.flatten({ background: backgroundColor });
      }

      if (format === "png") {
        pipeline = pipeline.png({ quality: Math.round(parseInt(quality)) });
      } else {
        pipeline = pipeline.jpeg({ quality: Math.round(parseInt(quality)) });
      }

      const sheetBuffer = await pipeline.toBuffer();

      res.set({
        "Content-Type": format === "png" ? "image/png" : "image/jpeg",
        "Content-Length": sheetBuffer.length,
        "Content-Disposition": `attachment; filename="passport-sheet.${format}"`,
      });

      res.send(sheetBuffer);
    } catch (error) {
      console.error("Print sheet error:", error);
      res.status(500).json({ error: "Failed to create print sheet" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
