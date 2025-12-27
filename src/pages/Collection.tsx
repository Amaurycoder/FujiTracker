import React, { useState, useMemo } from 'react';
import { useRecipes } from '../contexts/RecipeContext';
import { RecipeCard } from '../components/RecipeCard';
import { Recipe } from '../types';
import { ArrowUpDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CollectionProps {
    onOpenAssignModal: (recipe: Recipe) => void;
    onSelectRecipe: (recipe: Recipe) => void;
}

type SortOption = 'rating' | 'name' | 'recent';

export const Collection: React.FC<CollectionProps> = ({ onOpenAssignModal, onSelectRecipe }) => {
    const { recipes, toggleFavorite, settings } = useRecipes();
    const assignedIds = Object.values(settings.customSlots).filter(Boolean) as string[];
    const [sortBy, setSortBy] = useState<SortOption>('recent');

    const displayedRecipes = useMemo(() => {
        let filtered = recipes.filter(r => r.isFavorite || r.author === 'AI Assistant');

        // Sort based on selected option
        const sorted = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'rating':
                    // Sort by rating (descending), unrated recipes go last
                    const ratingA = a.personalRating || 0;
                    const ratingB = b.personalRating || 0;
                    if (ratingA !== ratingB) return ratingB - ratingA;
                    return a.name.localeCompare(b.name);
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'recent':
                default:
                    return 0; // Keep original order
            }
        });

        return sorted;
    }, [recipes, sortBy]);

    return (
        <div className="space-y-6 animate-fade-in">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Library</h2>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">{displayedRecipes.length} Favorites</span>
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                    <ArrowUpDown size={18} className="text-gray-400" />
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="recent">Sort: Recent</option>
                        <option value="rating">Sort: Rating</option>
                        <option value="name">Sort: Name</option>
                    </select>
                </div>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayedRecipes.map(recipe => (
                    <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        onToggleFavorite={toggleFavorite}
                        onAssignSlot={onOpenAssignModal}
                        onClick={onSelectRecipe}
                        isAssigned={assignedIds.includes(recipe.id)}
                    />
                ))}
            </div>
        </div>
    );
};
