import React from 'react';

interface DragDropProps {
  onDrop: (files: File[]) => void;
}

const DragDrop: React.FC<DragDropProps> = ({ onDrop }) => {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy'; // Indicate the allowed drop effect
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    onDrop(files);
  };

  return (
    <div
      className="drag-drop-zone border-dashed border-2 border-gray-300 p-4 text-center cursor-pointer hover:bg-gray-100"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      aria-droptarget
    >
      Drag and drop your files here
    </div>
  );
};

export default DragDrop;