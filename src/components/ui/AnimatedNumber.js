'use client';

import { useEffect, useState, useRef } from 'react';

// A beautifully simple custom hook to animate numbers up smoothly
function useCountUp(end, duration = 1200) {
    const [count, setCount] = useState(0);
    const countRef = useRef(0);
    const startTimeRef = useRef(null);

    useEffect(() => {
        let animationFrame;

        const easeOutExpo = (t) => {
            return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        };

        const updateCount = (timestamp) => {
            if (!startTimeRef.current) startTimeRef.current = timestamp;
            const progress = timestamp - startTimeRef.current;

            // Calculate progress percentage (0 to 1)
            let percent = progress / duration;
            if (percent > 1) percent = 1;

            // Apply easing
            const easedPercent = easeOutExpo(percent);

            // Set the new value
            const currentCount = end * easedPercent;
            setCount(currentCount);

            if (percent < 1) {
                animationFrame = requestAnimationFrame(updateCount);
            } else {
                setCount(end); // Ensure we hit the exact target at the end
            }
        };

        // Start animation
        startTimeRef.current = null;
        animationFrame = requestAnimationFrame(updateCount);

        return () => {
            if (animationFrame) cancelAnimationFrame(animationFrame);
        };
    }, [end, duration]);

    return count;
}

export default function AnimatedNumber({ value, prefix = '', suffix = '', isCurrency = false }) {
    // Only animate on the first render/mount, then snap to new values if they change
    const [hasAnimated, setHasAnimated] = useState(false);

    // We animate from 0 to the target value
    const animatedValue = useCountUp(value, 1500);

    useEffect(() => {
        const timer = setTimeout(() => setHasAnimated(true), 1600);
        return () => clearTimeout(timer);
    }, []);

    const displayValue = hasAnimated ? value : animatedValue;

    // Formatting based on type
    let formatted;
    if (isCurrency) {
        formatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(displayValue);
        // The formatter already includes the prefix ($)
        return <span style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.03em' }}>{formatted}{suffix}</span>;
    }

    // Standard number format
    formatted = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
        maximumFractionDigits: 1,
    }).format(displayValue);

    return <span style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.03em' }}>{prefix}{formatted}{suffix}</span>;
}
