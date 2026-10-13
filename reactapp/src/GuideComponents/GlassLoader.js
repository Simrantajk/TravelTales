import React from 'react';
import './GlassLoader.css';

// Recommended: Define the video source (replace with your actual path)
const VIDEO_SOURCE = '/videos/flight_loop.mp4'; 

const GlassLoader = ({ isLoading }) => {
    if (!isLoading) return null;

    return (
        // 1. Loader Overlay contains EVERYTHING, including the background video
        <div className="loader-overlay">
            
            {/* 1A. Background Video (Behind everything else) */}
            <video 
                className="fullscreen-background-video"
                autoPlay 
                loop 
                muted 
                playsInline 
                src={"https://www.pexels.com/download/video/2252797/"}
            >
                Your browser does not support the video tag.
            </video>

            {/* 2. Floating Loading Component (Transparent, Centered) */}
            <div className="glass-loader">
                
                {/* Content Layer with Text and Pulse Bar */}
                <div className="content-layer">
                    <p className="loading-text">Loading...</p>
                    <div className="data-transfer-bar">
                        <div className="transfer-pulse"></div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default GlassLoader;