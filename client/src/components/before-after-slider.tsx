import { useState, useRef, useCallback } from "react";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BeforeAfterSliderProps {
  beforeUrl: string;
  afterUrl: string;
  className?: string;
}

export function BeforeAfterSlider({
  beforeUrl,
  afterUrl,
  className = "",
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSliderChange = useCallback((value: number[]) => {
    setSliderPosition(value[0]);
  }, []);

  return (
    <Card className={`p-4 ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="no-default-active-elevate">
            Before
          </Badge>
          <Badge variant="secondary" className="no-default-active-elevate">
            After
          </Badge>
        </div>
        
        <div
          ref={containerRef}
          className="relative overflow-hidden rounded-lg border"
          style={{
            backgroundImage:
              "repeating-conic-gradient(hsl(var(--muted)) 0% 25%, hsl(var(--background)) 0% 50%) 50% / 20px 20px",
          }}
        >
          <div className="relative aspect-[4/3]">
            <img
              src={afterUrl}
              alt="After"
              className="absolute inset-0 w-full h-full object-contain"
            />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
              }}
            >
              <img
                src={beforeUrl}
                alt="Before"
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-primary shadow-lg"
              style={{
                left: `${sliderPosition}%`,
              }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-full shadow-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-background rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <Slider
          value={[sliderPosition]}
          onValueChange={handleSliderChange}
          min={0}
          max={100}
          step={1}
          data-testid="slider-before-after"
        />
      </div>
    </Card>
  );
}
