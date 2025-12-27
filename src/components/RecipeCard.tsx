import React from 'react';
import { Recipe, FilmSimulation } from '../types';
import { Heart, Plus, ThermometerSun, Sliders, ExternalLink, Star } from 'lucide-react';
import { getAuthorUrl } from '../utils/authorUrls';
import { StarRating } from './StarRating';
import { useTranslation } from 'react-i18next';

interface RecipeCardProps {
  recipe: Recipe;
  onToggleFavorite: (id: string) => void;
  onAssignSlot: (recipe: Recipe) => void;
  onClick: (recipe: Recipe) => void;
  isAssigned?: boolean;
}

const SimulationColors: Record<string, string> = {
  [FilmSimulation.ClassicChrome]: 'from-amber-100 to-cyan-800',
  [FilmSimulation.Acros]: 'from-gray-200 to-gray-900',
  [FilmSimulation.Velvia]: 'from-purple-500 to-red-500',
  [FilmSimulation.Provia]: 'from-blue-400 to-green-400',
  [FilmSimulation.ClassicNeg]: 'from-orange-700 to-teal-900',
  [FilmSimulation.NostalgicNeg]: 'from-yellow-600 to-amber-900',
  [FilmSimulation.Eterna]: 'from-stone-400 to-stone-600',
};

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onToggleFavorite, onAssignSlot, onClick, isAssigned }) => {
  const { t } = useTranslation();
  const gradient = SimulationColors[recipe.simulation] || 'from-gray-500 to-gray-700';
  const hasImage = !!recipe.imageUrl;

  return (
    <div
      onClick={() => onClick(recipe)}
      className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-zinc-800 shadow-sm md:hover:shadow-2xl md:hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group cursor-pointer active:scale-[0.98]"
    >
      <div
        className={`h-40 relative overflow-hidden ${!hasImage ? `bg-gradient-to-br ${gradient}` : ''}`}
      >
        {hasImage ? (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 md:group-hover:scale-110"
            style={{ backgroundImage: `url(${recipe.imageUrl})` }}
          />
        ) : null}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 md:group-hover:opacity-80 transition-opacity" />

        <div className="absolute top-3 right-3 z-20">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(recipe.id); }}
            className={`p-3 rounded-full backdrop-blur-md shadow-lg transition-all active:scale-90 md:hover:scale-110 ${recipe.isFavorite ? 'bg-white/10 text-red-500' : 'bg-black/20 text-white/70 md:hover:text-white'}`}
            title={recipe.isFavorite ? t('recipe.favorited') : t('recipe.favorite')}
          >
            <Heart size={18} fill={recipe.isFavorite ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="absolute bottom-4 left-4 right-4 text-white z-20">
          <span className="text-[10px] uppercase font-mono tracking-widest opacity-80 mb-1 block">{recipe.sensor}</span>
          <h3 className="text-xl font-bold leading-tight line-clamp-2 text-shadow-lg md:group-hover:text-white/90 transition-colors">{recipe.name}</h3>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-zinc-800 text-[10px] font-mono font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide">
            {recipe.simulation.split('/')[0]}
          </span>
          {recipe.isFavorite && (
            <span className="px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-900/20 text-[10px] font-mono font-medium text-red-500 uppercase tracking-wide">
              {t('recipe.favorite')}
            </span>
          )}
          {recipe.personalRating && recipe.personalRating > 0 && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-50 dark:bg-yellow-900/20">
              <Star size={10} className="fill-yellow-400 text-yellow-400" />
              <span className="text-[10px] font-mono font-medium text-yellow-600 dark:text-yellow-400">
                {recipe.personalRating}
              </span>
            </div>
          )}
        </div>

        <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 line-clamp-2 leading-relaxed">{recipe.description}</p>

        {/* Author Credit */}
        {recipe.author && (
          <div className="mb-6 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
            <span>{t('recipe.by')}</span>
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

        <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 dark:text-gray-400 mb-6 mt-auto">
          <div className="flex items-center gap-2">
            <ThermometerSun size={14} className="text-orange-500/80" />
            <span className="font-mono">{recipe.whiteBalance}</span>
          </div>
          <div className="flex items-center gap-2">
            <Sliders size={14} className="text-blue-500/80" />
            <span className="font-mono">{recipe.dynamicRange}</span>
          </div>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onAssignSlot(recipe); }}
          disabled={isAssigned}
          className={`w-full py-3 rounded-lg text-sm font-semibold transition-all active:scale-95 ${isAssigned
            ? 'bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-600 cursor-not-allowed'
            : 'bg-indigo-600 md:hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
            }`}
        >
          {isAssigned ? t('recipe.assigned') : t('recipe.addToSlot')}
        </button>
      </div>
    </div>
  );
};