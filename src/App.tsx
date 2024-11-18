import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUpload } from './components/ImageUpload';
import { ImagePreview } from './components/ImagePreview';
import { AnalysisResult } from './components/AnalysisResult';
import { ErrorMessage } from './components/ErrorMessage';
import axios, { AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Prediction {
  prediction: string;
  confidence: number;
}

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setPrediction(null);
      setError(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post<Prediction>(`${API_URL}/predict`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      });
      setPrediction(response.data);
    } catch (err) {
      console.error('Error:', err);
      const errorMessage = err instanceof AxiosError 
        ? err.response?.data?.error || 
          (err.code === 'ECONNREFUSED' ? 'Cannot connect to server. Please ensure the server is running.' : 'Network error occurred')
        : 'Failed to analyze the image. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <div className="container mx-auto px-4 py-8">
        <Header />
        
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <ImageUpload onFileChange={handleFileChange} />
            
            {preview && <ImagePreview previewUrl={preview} />}

            <button
              type="submit"
              disabled={!selectedFile || loading}
              className={`w-full py-3 px-6 rounded-lg text-white font-medium ${
                !selectedFile || loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              } transition-colors`}
            >
              {loading ? 'Analyzing...' : 'Analyze Image'}
            </button>
          </form>

          {error && (
  <>
    <ErrorMessage message={error} />
    <button onClick={() => setError(null)} className="retry-button">
      Retry
    </button>
  </>
)}
          {prediction && <AnalysisResult prediction={prediction} />}
        </div>
      </div>
    </div>
  );
}

export default App;