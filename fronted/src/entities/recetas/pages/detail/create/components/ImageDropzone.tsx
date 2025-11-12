import React, { useRef, useState } from 'react';

interface ImageDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
}

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  onFilesSelected,
  maxFiles = 3,
  maxSize = 10,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      if (!file.type.startsWith('image/')) return false;
      if (file.size > maxSize * 1024 * 1024) return false;
      return true;
    }).slice(0, maxFiles);

    onFilesSelected(validFiles);

    // Create previews
    const previews = validFiles.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  return (
    <div className="space-y-3">
      <div
        className={`relative h-[180px] border-2 border-dashed rounded-xl transition-all cursor-pointer ${
          isDragOver
            ? 'border-[#f7a940] bg-[#f7a940]/5'
            : 'border-white/8 bg-[#120d0d]'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center text-[#b9acac]">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-2">
            <path d="M12 16V7m0 0l-3 3m3-3l3 3" stroke="#e8dede" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="3" y="14" width="18" height="6" rx="2" stroke="#e8dede" strokeWidth="1.4"/>
          </svg>
          <div className="font-semibold">Sube un archivo</div>
          <div className="text-sm">o arrastra y suelta</div>
          <small className="text-xs opacity-80">PNG, JPG, GIF hasta {maxSize}MB</small>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileInputChange}
        className="hidden"
      />

      {previewImages.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {previewImages.map((preview, index) => (
            <img
              key={index}
              src={preview}
              alt={`Preview ${index + 1}`}
              className="w-[120px] h-[80px] object-cover rounded-lg border border-white/8"
            />
          ))}
        </div>
      )}
    </div>
  );
};
