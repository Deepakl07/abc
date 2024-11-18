import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <div className="mt-6 p-4 bg-red-50 rounded-lg flex items-center">
    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
    <p className="text-red-600">{message}</p>
  </div>
);