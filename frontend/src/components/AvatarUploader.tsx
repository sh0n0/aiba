import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Import shadcn Avatar components
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import type React from "react";
import { useCallback, useRef, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";

interface AvatarUploaderProps {
  avatarUrl: string | null;
  onUpload?: (image: string) => void;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({ avatarUrl, onUpload }) => {
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onCropComplete = useCallback((_unusedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setImage(reader.result);
          setIsModalOpen(true);
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset the value so selecting the same file triggers the onChange event
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getCroppedImage = () => {
    if (!image || !croppedAreaPixels) return;
    const img = new Image();
    img.src = image;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      ctx.beginPath();
      ctx.arc(croppedAreaPixels.width / 2, croppedAreaPixels.height / 2, croppedAreaPixels.width / 2, 0, 2 * Math.PI);
      ctx.clip();
      ctx.drawImage(
        img,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
      );
      const croppedDataUrl = canvas.toDataURL();
      setCroppedImage(croppedDataUrl);
      setIsModalOpen(false);

      if (onUpload) {
        onUpload(croppedDataUrl);
      }
    };
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <Avatar className="h-40 w-40">
        {croppedImage || avatarUrl ? (
          <AvatarImage src={croppedImage || avatarUrl || undefined} alt="Avatar" />
        ) : (
          <AvatarFallback>Avatar</AvatarFallback>
        )}
      </Avatar>

      {/* Hidden file input */}
      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
      {/* Button to trigger file selection */}
      <Button onClick={() => fileInputRef.current?.click()}>Upload Image</Button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="flex flex-col items-center gap-4">
          <div className="relative h-80 w-80 bg-gray-200">
            {image && (
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                cropShape="round"
                showGrid={false}
              />
            )}
          </div>
          <Slider
            min={1}
            max={3}
            step={0.1}
            value={[zoom]}
            onValueChange={(value: number[]) => setZoom(value[0])}
            className="mt-2 w-full"
          />
          <Button onClick={getCroppedImage}>Done</Button>
        </DialogContent>
      </Dialog>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default AvatarUploader;
