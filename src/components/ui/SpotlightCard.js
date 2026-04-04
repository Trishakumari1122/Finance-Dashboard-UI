'use client';

import { useRef, useState } from 'react';
import styles from './SpotlightCard.module.css';

// Global queue for handling hover rotations sequentially
let hoverQueue = [];
let isHoverAnimating = false;

function processHoverQueue() {
    if (isHoverAnimating || hoverQueue.length === 0) return;
    const nextHoverAnim = hoverQueue.shift();
    isHoverAnimating = true;
    nextHoverAnim(() => {
        isHoverAnimating = false;
        processHoverQueue();
    });
}

export default function SpotlightCard({ children, className = '', highlightColor = 'rgba(255, 255, 255, 0.04)' }) {
    const divRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);
    const [isClicked, setIsClicked] = useState(false);
    
    // States to handle the one-by-one rotation one time
    const [hasRotated, setHasRotated] = useState(false);
    const [isHoverSpinning, setIsHoverSpinning] = useState(false);

    const handleMouseMove = (e) => {
        if (!divRef.current || isFocused) return;
        const div = divRef.current;
        const rect = div.getBoundingClientRect();
        
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        setPosition({ x, y });
        
        // Calculate tilt
        const xCenter = rect.width / 2;
        const yCenter = rect.height / 2;
        const rotateY = ((x - xCenter) / xCenter) * 3; // Max 3deg tilt
        const rotateX = -((y - yCenter) / yCenter) * 3; // Max 3deg tilt
        
        div.style.setProperty('--rotate-x', `${rotateX}deg`);
        div.style.setProperty('--rotate-y', `${rotateY}deg`);
    };

    const handleFocus = () => {
        setIsFocused(true);
        setOpacity(1);
    };

    const handleBlur = () => {
        setIsFocused(false);
        setOpacity(0);
    };

    const handleMouseEnter = () => {
        setOpacity(1);
        
        // Make sure it rotates only one time
        if (hasRotated) return;
        setHasRotated(true); // Don't allow it to queue again for the lifetime of this component

        // Add the rotation animation to the global queue so they happen one by one
        hoverQueue.push((onComplete) => {
            setIsHoverSpinning(true);
            setTimeout(() => {
                setIsHoverSpinning(false);
                onComplete();
            }, 2000); // 2s matches the expanded buttery spinOnHover CSS animation 
        });

        processHoverQueue();
    };

    const handleClick = () => {
        if (isClicked) return;
        setIsClicked(true);
        
        if (divRef.current) {
            const rect = divRef.current.getBoundingClientRect();
            const viewportCenterX = window.innerWidth / 2;
            const viewportCenterY = window.innerHeight / 2;
            const cardCenterX = rect.left + rect.width / 2;
            const cardCenterY = rect.top + rect.height / 2;

            const moveX = viewportCenterX - cardCenterX;
            const moveY = viewportCenterY - cardCenterY;

            divRef.current.style.setProperty('--move-x', `${moveX}px`);
            divRef.current.style.setProperty('--move-y', `${moveY}px`);
            
            // Remove tilt during animation
            divRef.current.style.setProperty('--rotate-x', `0deg`);
            divRef.current.style.setProperty('--rotate-y', `0deg`);
            
            setTimeout(() => {
                setIsClicked(false);
            }, 3000); // 3s matches the profound zoomToCenterScreen CSS animation
        }
    };

    const handleMouseLeave = () => {
        setOpacity(0);
        if (divRef.current) {
            divRef.current.style.setProperty('--rotate-x', `0deg`);
            divRef.current.style.setProperty('--rotate-y', `0deg`);
        }
    };

    return (
        <div 
            className={`${styles.cardHoverTrap} ${isClicked ? styles.isClicked : ''} ${isHoverSpinning && !isClicked ? styles.isHovered : ''}`} 
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
        >
            <div
                ref={divRef}
                onMouseMove={handleMouseMove}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className={`${className} ${styles.spotlightWrapper}`}
            >
                <div
                    className={styles.spotlight}
                    style={{
                        opacity,
                        background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${highlightColor}, transparent 40%)`,
                    }}
                />
                {children}
            </div>
        </div>
    );
}
