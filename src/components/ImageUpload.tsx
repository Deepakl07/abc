import React from 'react';
import { Upload } from 'lucide-react';

interface ImageUploadProps {
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onFileChange }) => (
  <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
    <input
      type="file"
      accept="image/*"
      onChange={onFileChange}
      className="hidden"
      id="file-upload"
    />
    <label htmlFor="file-upload" className="cursor-pointer text-center">
      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <span className="text-gray-600">Click to upload or drag and drop</span>
      <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
    </label>
  </div>
);