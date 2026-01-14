import React, { useRef, useState, useEffect } from 'react';

const SeamlessLoopVideo = ({ src, className }) => {
    const containerRef = useRef(null);
    const video1Ref = useRef(null);
    const video2Ref = useRef(null);
    const [activeRef, setActiveRef] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Configuration
    const TRANSITION_DURATION = 1.5; // Seconds of overlap

    useEffect(() => {
        const v1 = video1Ref.current;
        const v2 = video2Ref.current;

        // Initial setup
        if (v1 && v2) {
            v1.src = src;
            v2.src = src;
            v1.load();
            v2.load();
            v1.play().catch(() => { });
            v2.pause();
            v2.currentTime = 0;
            v2.style.opacity = 0;
            v1.style.opacity = 1;
            v1.style.zIndex = 2;
            v2.style.zIndex = 1;
        }
    }, [src]);

    const handleTimeUpdate = () => {
        if (isTransitioning) return;

        const currentVideo = activeRef === 1 ? video1Ref.current : video2Ref.current;
        const nextVideo = activeRef === 1 ? video2Ref.current : video1Ref.current;

        if (!currentVideo || !nextVideo) return;

        const timeLeft = currentVideo.duration - currentVideo.currentTime;

        if (timeLeft <= TRANSITION_DURATION && timeLeft > 0) {
            setIsTransitioning(true);

            // Prepare next video
            nextVideo.currentTime = 0;
            nextVideo.style.zIndex = 1; // Put behind
            currentVideo.style.zIndex = 2; // Keep in front

            nextVideo.play().catch(e => console.error("Loop play error", e));
            nextVideo.style.opacity = 1; // It's behind, so this is safe

            // Fade out current video to reveal next video
            currentVideo.style.transition = `opacity ${TRANSITION_DURATION}s linear`;
            currentVideo.style.opacity = 0;

            // Schedule swap
            setTimeout(() => {
                // Reset old video
                currentVideo.pause();
                currentVideo.currentTime = 0;
                currentVideo.style.transition = 'none'; // Disable transition for reset
                // activeRef is now the other one
                setActiveRef(prev => prev === 1 ? 2 : 1);
                setIsTransitioning(false);
            }, (timeLeft * 1000) - 100); // Trigger slightly before end
        }
    };

    return (
        <div className={className} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
            <video
                ref={video1Ref}
                muted
                playsInline
                onTimeUpdate={activeRef === 1 ? handleTimeUpdate : undefined}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    willChange: 'opacity'
                }}
            />
            <video
                ref={video2Ref}
                muted
                playsInline
                onTimeUpdate={activeRef === 2 ? handleTimeUpdate : undefined}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    willChange: 'opacity'
                }}
            />
        </div>
    );
};

export default SeamlessLoopVideo;
