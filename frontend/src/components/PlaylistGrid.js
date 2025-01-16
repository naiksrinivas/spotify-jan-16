import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './PlaylistGrid.css';
import '../styles/loading.css';

function PlaylistGrid({ images, isLoading }) {
    const canvasRef = useRef(null);
    const CANVAS_SIZE = 3000;
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        if (!images || images.length === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        canvas.width = CANVAS_SIZE;
        canvas.height = CANVAS_SIZE;

        const cols = Math.ceil(Math.sqrt(images.length));
        const totalSlots = cols * cols;
        const imageSize = CANVAS_SIZE / cols;

        // Create array with filled slots and random images
        const filledImages = [...images];
        while (filledImages.length < totalSlots) {
            const randomImage = images[Math.floor(Math.random() * images.length)];
            filledImages.push(randomImage);
        }

        const loadImage = (src) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = src;
            });
        };

        const drawImageToCanvas = (img, index) => {
            const row = Math.floor(index / cols);
            const col = index % cols;
            const x = col * imageSize;
            const y = row * imageSize;
            ctx.drawImage(img, x, y, imageSize, imageSize);
        };

        const drawGrid = async () => {
            setIsDrawing(true);
            try {
                // Load all images in parallel
                const imagePromises = filledImages.map(url => loadImage(url));
                
                // Use Promise.allSettled to handle both successful and failed image loads
                const loadedImages = await Promise.allSettled(imagePromises);
                
                // Draw successful images to canvas
                loadedImages.forEach((result, index) => {
                    if (result.status === 'fulfilled') {
                        drawImageToCanvas(result.value, index);
                    } else {
                        console.error(`Failed to load image at index ${index}:`, result.reason);
                    }
                });
            } catch (error) {
                console.error('Error in grid drawing:', error);
            } finally {
                setIsDrawing(false);
            }
        };

        drawGrid();
    }, [images]);

    const handleDownload = () => {
        const canvas = canvasRef.current;
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        
        const link = document.createElement('a');
        link.download = 'playlist-grid.jpg';
        link.href = dataUrl;
        link.click();
    };

    return (
        <div className="container">
            {(isLoading || isDrawing) && (
                <div className="loading-overlay">
                    <div className="loading-content">
                        <img 
                            src="/loader.gif" 
                            alt="Loading..." 
                            className="loading-spinner"
                        />
                        <div className="loading-text">
                            {isLoading ? 'Loading tracks...' : 'Creating your grid image...'}
                        </div>
                    </div>
                </div>
            )}
            <div style={{ width: '100%', aspectRatio: '1' }}>
                <canvas 
                    ref={canvasRef}
                    style={{ 
                        width: '100%', 
                        height: '100%',
                        objectFit: 'contain',
                        marginBottom: '20px'
                    }}
                />
                <button 
                    className="button" 
                    onClick={handleDownload}
                    disabled={isDrawing}
                >
                    Download Grid Image
                </button>
            </div>
        </div>
    );
}

export default PlaylistGrid; 