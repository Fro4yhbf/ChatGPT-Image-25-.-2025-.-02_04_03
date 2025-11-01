
import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import ImageIcon from './icons/ImageIcon';
import SparklesIcon from './icons/SparklesIcon';

const ImageGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please enter a prompt.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setImageUrl(null);

        try {
            const url = await generateImage(prompt);
            setImageUrl(url);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="flex-1 flex flex-col p-6 items-center justify-center">
            <div className="w-full max-w-2xl">
                <h1 className="text-3xl font-bold text-center text-white mb-2">Image Studio</h1>
                <p className="text-center text-gray-400 mb-6">Describe the image you want to create with AI.</p>
                
                <div className="flex items-center gap-2 mb-4">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., A cat in a spacesuit floating in space, digital art"
                        className="w-full bg-gray-800 text-gray-200 placeholder-gray-500 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !prompt.trim()}
                        className="flex items-center gap-2 px-4 py-3 bg-indigo-600 rounded-lg text-white font-semibold disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-indigo-500 transition-colors duration-200"
                    >
                        <SparklesIcon className="w-5 h-5" />
                        <span>Generate</span>
                    </button>
                </div>

                {error && <p className="text-red-400 text-center mb-4">{error}</p>}
                
                <div className="w-full aspect-square bg-gray-800/50 rounded-lg flex items-center justify-center mt-6">
                    {isLoading ? (
                        <div className="flex flex-col items-center">
                           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400"></div>
                           <p className="mt-4 text-gray-400">Generating your masterpiece...</p>
                        </div>
                    ) : imageUrl ? (
                        <img src={imageUrl} alt={prompt} className="w-full h-full object-contain rounded-lg" />
                    ) : (
                        <div className="text-center text-gray-500">
                           <ImageIcon className="w-16 h-16 mx-auto mb-2" />
                           <p>Your generated image will appear here</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageGenerator;
