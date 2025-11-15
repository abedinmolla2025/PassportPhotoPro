import { removeBackground, Config } from "@imgly/background-removal";

export async function removeImageBackground(imageUrl: string): Promise<string> {
  try {
    console.log("Starting background removal...");
    
    // Use simple configuration for reliability
    const config: Config = {
      output: {
        format: "image/png",
        quality: 0.8,
      },
    };

    const blob = await removeBackground(imageUrl, config);
    console.log("Background removed successfully");
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Background removal error:", error);
    throw new Error("Failed to remove background. Please try with a smaller image or different photo.");
  }
}

export function applyBackgroundColor(
  canvas: HTMLCanvasElement,
  color: string
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext("2d");
  if (!tempCtx) return;

  // Fill with background color
  tempCtx.fillStyle = color;
  tempCtx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw original image on top
  tempCtx.putImageData(imageData, 0, 0);

  // Copy back to original canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(tempCanvas, 0, 0);
}

export function rotateImage(
  canvas: HTMLCanvasElement,
  degrees: number
): HTMLCanvasElement {
  const tempCanvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const tempCtx = tempCanvas.getContext("2d");
  
  if (!ctx || !tempCtx) return canvas;

  if (degrees === 90 || degrees === -90 || degrees === 270) {
    tempCanvas.width = canvas.height;
    tempCanvas.height = canvas.width;
  } else {
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
  }

  tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
  tempCtx.rotate((degrees * Math.PI) / 180);
  tempCtx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);

  canvas.width = tempCanvas.width;
  canvas.height = tempCanvas.height;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(tempCanvas, 0, 0);

  return canvas;
}

export function flipImage(
  canvas: HTMLCanvasElement,
  horizontal: boolean
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext("2d");
  if (!tempCtx) return;

  tempCtx.save();
  if (horizontal) {
    tempCtx.scale(-1, 1);
    tempCtx.drawImage(canvas, -canvas.width, 0);
  } else {
    tempCtx.scale(1, -1);
    tempCtx.drawImage(canvas, 0, -canvas.height);
  }
  tempCtx.restore();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(tempCanvas, 0, 0);
}
