import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import './PlaylistGrid.css';

function PlaylistGrid({ images, isLoading }) {
    const canvasRef = useRef(null);
    const CANVAS_SIZE = 3000;

    useEffect(() => {
        if (!images || images.length === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        canvas.width = CANVAS_SIZE;
        canvas.height = CANVAS_SIZE;

        // Calculate optimal grid dimensions
        const totalImages = images.length;
        const cols = Math.ceil(Math.sqrt(totalImages));
        const totalSlots = cols * cols; // Total number of slots in the grid
        
        // Create array with filled slots and random images for empty slots
        const filledImages = [...images];
        while (filledImages.length < totalSlots) {
            // Pick a random image from the original set
            const randomImage = images[Math.floor(Math.random() * images.length)];
            filledImages.push(randomImage);
        }

        const imageSize = CANVAS_SIZE / cols;

        const loadImage = (src) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = src;
            });
        };

        const drawGrid = async () => {
            try {
                for (let i = 0; i < totalSlots; i++) {
                    const row = Math.floor(i / cols);
                    const col = i % cols;
                    const x = col * imageSize;
                    const y = row * imageSize;

                    const img = await loadImage(filledImages[i]);
                    ctx.drawImage(img, x, y, imageSize, imageSize);
                }
            } catch (error) {
                console.error('Error loading images:', error);
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
        <div>
            {isLoading ? (
                <div>Loading all tracks...</div>
            ) : (
                <div style={{ width: '100%', aspectRatio: '1' }}>
                    <canvas 
                        ref={canvasRef}
                        style={{ 
                            width: '100%', 
                            height: '100%',
                            objectFit: 'contain'
                        }}
                    />
                    <button onClick={handleDownload}>Download Grid Image</button>
                </div>
            )}
        </div>
    );
}

export default PlaylistGrid; 