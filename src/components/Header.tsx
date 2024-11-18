import React from 'react';
import { Leaf } from 'lucide-react';

export const Header = () => (
  <header className="text-center mb-12">
    <div className="flex items-center justify-center mb-4">
      <Leaf className="w-12 h-12 text-green-600 mr-2" />
      <h1 className="text-4xl font-bold text-gray-800">Tomato Disease Detection</h1>
    </div>
    <p className="text-gray-600 max-w-2xl mx-auto">
      Upload a photo of your tomato plant and our AI model will analyze it for diseases.
      Get instant results to help protect your crops.
    </p>
  </header>
);