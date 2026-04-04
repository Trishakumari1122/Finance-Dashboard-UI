'use client';

import { useRef, useState } from 'react';
import styles from './SpotlightCard.module.css';

export default function SpotlightCard({ children, className = '', highlightColor = 'rgba(255, 255, 255, 0.04)' }) {
    const divRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);

    const handleMouseMove = (e) => {
        if (!divRef.current || isFocused) return;
        const div = divRef.current;
        const rect = div.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
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
        setHasAnimated(true);
        // Calculate the translation needed to move THIS card exactly to the center of the viewport
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
        }
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    return (
        <div className={`${styles.cardHoverTrap} ${hasAnimated ? styles.animateOnce : ''}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
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
