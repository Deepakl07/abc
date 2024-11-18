import React from 'react';

interface ImagePreviewProps {
  previewUrl: string;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ previewUrl }) => (
  <div className="mt-6">
    <h3 className="text-lg font-semibold mb-2">Preview:</h3>
    <div className="relative rounded-lg overflow-hidden max-w-md mx-auto">
      <img src={previewUrl} alt="Preview" className="w-full h-auto" />
    </div>
  </div>
);