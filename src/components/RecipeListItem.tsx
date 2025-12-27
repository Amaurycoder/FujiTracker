import React from 'react';
import { Recipe } from '../types';
import { Heart, Plus, ExternalLink, ThermometerSun, Sliders } from 'lucide-react';
import { getAuthorUrl } from '../utils/authorUrls';

interface RecipeListItemProps {
    recipe: Recipe;
    onToggleFavorite: (id: string) => void;
    onAssignSlot: (recipe: Recipe) => void;
    onClick: (recipe: Recipe) => void;
    isAssigned?: boolean;
}

export const RecipeListItem: React.FC<RecipeListItemProps> = ({
    recipe,
    onToggleFavorite,
    onAssignSlot,
    onClick,
    isAssigned
}) => {
    return (
        <div
            onClick={() => onClick(recipe)}
            className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-4 p-4 cursor-pointer group"
        >
            {/* Image/Gradient Preview */}
            <div
                className={`w-24 h-24 rounded-lg flex-shrink-0 ${recipe.imageUrl
                        ? 'bg-cover bg-center'
                        : 'bg-gradient-to-br from-gray-200 to-gray-400 dark:from-gray-700 dark:to-gray-900'
                    }`}
                style={recipe.imageUrl ? { backgroundImage: `url(${recipe.imageUrl})` } : {}}
            >
                {!recipe.imageUrl && (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                            {recipe.simulation.split('/')[0]}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                {/* Title & Sensor */}
                <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {recipe.name}
                        </h3>
                        <span className="text-xs uppercase font-mono text-gray-500 dark:text-gray-400 tracking-wide">
                            {recipe.sensor}
                        </span>
                    </div>

                    {/* Favorite Button */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleFavorite(recipe.id); }}
                        className={`p-2 rounded-full transition-all hover:scale-110 ${recipe.isFavorite
                                ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                                : 'text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-zinc-800'
                            }`}
                    >
                        <Heart size={18} fill={recipe.isFavorite ? "currentColor" : "none"} />
                    </button>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                    {recipe.description}
                </p>

                {/* Author */}
                {recipe.author && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-3">
                        <span>by</span>
                        {getAuthorUrl(recipe.author) ? (
                            <a
                                href={getAuthorUrl(recipe.author)!}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {recipe.author}
                                <ExternalLink size={10} />
                            </a>
                        ) : (
                            <span className="font-semibold text-gray-700 dark:text-gray-300">{recipe.author}</span>
                        )}
                    </div>
                )}

                {/* Tags & Technical Info */}
                <div className="flex items-center gap-4 flex-wrap">
                    {/* Simulation Badge */}
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-zinc-800 text-[10px] font-mono font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                        {recipe.simulation.split('/')[0]}
                    </span>

                    {/* Favorite Badge */}
                    {recipe.isFavorite && (
                        <span className="px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-900/20 text-[10px] font-mono font-medium text-red-500 uppercase tracking-wide">
                            Favorite
                        </span>
                    )}

                    {/* Technical Info */}
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                            <ThermometerSun size={12} className="text-orange-500/80" />
                            <span className="font-mono">{recipe.whiteBalance}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Sliders size={12} className="text-blue-500/80" />
                            <span className="font-mono">{recipe.dynamicRange}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Button */}
            <button
                onClick={(e) => { e.stopPropagation(); onAssignSlot(recipe); }}
                disabled={isAssigned}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex-shrink-0 ${isAssigned
                        ? 'bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-600 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm hover:shadow-md active:scale-95'
                    }`}
            >
                {isAssigned ? (
                    <span className="flex items-center gap-1">
                        <Plus size={14} />
                        Assigned
                    </span>
                ) : (
                    <span className="flex items-center gap-1">
                        <Plus size={14} />
                        Add to Camera
                    </span>
                )}
            </button>
        </div>
    );
};
