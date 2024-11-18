import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface AnalysisResultProps {
  prediction: {
    prediction: string;
    confidence: number;
  };
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ prediction }) => (
  <div className="mt-6 p-6 bg-green-50 rounded-lg">
    <div className="flex items-center mb-4">
      <CheckCircle2 className="w-6 h-6 text-green-600 mr-2" />
      <h3 className="text-xl font-semibold text-gray-800">Analysis Result</h3>
    </div>
    <div className="space-y-2">
      <p className="text-gray-700">
        <span className="font-medium">Detected Condition:</span>{' '}
        {prediction.prediction.replace(/_/g, ' ')}
      </p>
      <p className="text-gray-700">
        <span className="font-medium">Confidence:</span>{' '}
        {(prediction.confidence * 100).toFixed(2)}%
      </p>
    </div>
  </div>
);