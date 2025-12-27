import { TouchEvent, useState } from 'react';

interface UseSwipeOptions {
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    onSwipeUp?: () => void;
    onSwipeDown?: () => void;
    threshold?: number;
    preventDefault?: boolean;
}

export const useSwipe = ({
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    preventDefault = false
}: UseSwipeOptions) => {
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const [touchStartY, setTouchStartY] = useState<number | null>(null);
    const [touchEndY, setTouchEndY] = useState<number | null>(null);

    // Minimum distance required for a swipe
    const minSwipeDistance = threshold;

    const onTouchStart = (e: TouchEvent) => {
        setTouchEnd(null); // Reset touch end
        setTouchStart(e.targetTouches[0].clientX);
        setTouchStartY(e.targetTouches[0].clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
        setTouchEndY(e.targetTouches[0].clientY);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd || !touchStartY || !touchEndY) return;

        const distanceX = touchStart - touchEnd;
        const distanceY = touchStartY - touchEndY;
        const isLeftSwipe = distanceX > minSwipeDistance;
        const isRightSwipe = distanceX < -minSwipeDistance;
        const isUpSwipe = distanceY > minSwipeDistance;
        const isDownSwipe = distanceY < -minSwipeDistance;

        const isHorizontal = Math.abs(distanceX) > Math.abs(distanceY);

        if (isHorizontal) {
            if (isLeftSwipe && onSwipeLeft) {
                onSwipeLeft();
            } else if (isRightSwipe && onSwipeRight) {
                onSwipeRight();
            }
        } else {
            // Vertical swipe
            if (isUpSwipe && onSwipeUp) {
                onSwipeUp();
            } else if (isDownSwipe && onSwipeDown) {
                onSwipeDown();
            }
        }
    };

    return {
        onTouchStart,
        onTouchMove,
        onTouchEnd
    };
};
