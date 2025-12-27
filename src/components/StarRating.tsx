import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
    rating: number; // 0-5
    onRatingChange?: (rating: number) => void;
    size?: 'sm' | 'md' | 'lg';
    interactive?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
    rating,
    onRatingChange,
    size = 'md',
    interactive = false
}) => {
    const [hoverRating, setHoverRating] = useState(0);

    const sizeClasses = {
        sm: 14,
        md: 20,
        lg: 24
    };

    const starSize = sizeClasses[size];
    const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;

    const handleClick = (value: number) => {
        if (interactive && onRatingChange) {
            // If clicking the same rating, clear it
            onRatingChange(rating === value ? 0 : value);
        }
    };

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => handleClick(star)}
                    onMouseEnter={() => interactive && setHoverRating(star)}
                    onMouseLeave={() => interactive && setHoverRating(0)}
                    disabled={!interactive}
                    className={`transition-all ${interactive
                            ? 'cursor-pointer hover:scale-110'
                            : 'cursor-default'
                        }`}
                >
                    <Star
                        size={starSize}
                        className={`transition-colors ${star <= displayRating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-none text-gray-300 dark:text-gray-600'
                            }`}
                    />
                </button>
            ))}
        </div>
    );
};
