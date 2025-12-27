import React, { useRef, useState } from 'react';
import { Recipe } from '../types';
import { X, Heart, Plus, Image as ImageIcon, Loader2, Trash2, Droplets, Download, FileText, QrCode, Star } from 'lucide-react';
import { compressImage } from '../services/imageService';
import { exportRecipeAsJSON, exportRecipeAsText, copyToClipboard } from '../utils/exportService';
import { QRCodeModal } from './QRCodeModal';
import { StarRating } from './StarRating';
import { getAuthorUrl } from '../utils/authorUrls';
import { ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSwipe } from '../hooks/useSwipe';

interface RecipeDetailModalProps {
  recipe: Recipe;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onAssignSlot: (recipe: Recipe) => void;
  isAssigned: boolean;
  onUpdateImage: (id: string, imageUrl: string | undefined) => void;
  onSetRating?: (id: string, rating: number, notes?: string) => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({ recipe: initialRecipe, onClose, onToggleFavorite, onAssignSlot, isAssigned, onUpdateImage, onSetRating }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const [isUploading, setIsUploading] = useState(false);
  const [isMistFilterEnabled, setIsMistFilterEnabled] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [personalRating, setPersonalRating] = useState(initialRecipe.personalRating || 0);
  const [personalNotes, setPersonalNotes] = useState(initialRecipe.personalNotes || '');

  const handleImageClick = () => fileInputRef.current?.click();

  const handleRemoveImage = () => {
    if (window.confirm(t('common.delete') + "?")) {
      onUpdateImage(initialRecipe.id, undefined);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const compressedBase64 = await compressImage(file);
      onUpdateImage(initialRecipe.id, compressedBase64);
    } catch (error) {
      alert(t('common.error'));
    } finally {
      setIsUploading(false);
    }
  };

  // Logic for Mist Filter Correction
  const getDisplayRecipe = () => {
    if (!isMistFilterEnabled) return initialRecipe;

    // Shadow logic: -2/-1 -> +1, 0 -> +2 (Strong lift)
    let newShadow = initialRecipe.shadow;
    if (newShadow <= -1) newShadow = 1;
    else if (newShadow === 0) newShadow = 2;
    else newShadow = Math.min(4, newShadow + 2);

    return {
      ...initialRecipe,
      clarity: 0,
      shadow: newShadow,
      highlight: Math.max(-2, initialRecipe.highlight - 1), // Reduce highlights (-1) to control bloom
      sharpness: -1, // Maintain definition (-1)
      // No WB Shift for neutral filters (K&F, NiSi)
      colorChromeFXBlue: initialRecipe.colorChromeFXBlue === 'Strong' ? 'Weak' : initialRecipe.colorChromeFXBlue,
      color: initialRecipe.color >= 2 ? initialRecipe.color - 1 : initialRecipe.color,
    };
  };

  const recipe = getDisplayRecipe();

  // Swipe handlers for mobile
  const swipeHandlers = useSwipe({
    onSwipeDown: onClose,
    threshold: 100 // Higher threshold for vertical swipe to avoid accidental closes while scrolling
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-zinc-900 w-full h-full md:h-auto md:max-h-[90vh] max-w-full md:max-w-2xl rounded-t-3xl md:rounded-2xl overflow-hidden shadow-2xl border-0 md:border border-gray-200 dark:border-zinc-700 animate-scale-up flex flex-col"
        onClick={e => e.stopPropagation()}
        {...swipeHandlers}
      >
        {/* Mobile Drag Handle */}
        <div className="md:hidden absolute top-0 left-0 right-0 h-8 flex items-center justify-center z-[60] bg-gradient-to-b from-black/40 to-transparent pointer-events-none">
          <div className="w-12 h-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm" />
        </div>
        <div
          className={`p-6 flex justify-between items-start relative overflow-hidden transition-all duration-500 ${recipe.imageUrl ? 'h-56 pb-6' : 'bg-gray-50 dark:bg-zinc-800'}`}
          style={recipe.imageUrl ? { backgroundImage: `url(${recipe.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' } : {}}
        >
          {recipe.imageUrl && <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />}

          <div className="relative z-10 w-full flex justify-between items-start pr-12">
            <div>
              {!recipe.imageUrl && (
                <div className="flex flex-col gap-1">
                  <h2 className="text-2xl font-black text-gray-900 leading-tight">{recipe.name}</h2>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">{recipe.sensor}</span>
                    <span>•</span>
                    <span>{recipe.simulation}</span>
                  </div>

                  {recipe.author && (
                    <div className="mt-2 inline-flex items-center gap-1.5 bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded text-xs font-medium text-gray-600 dark:text-gray-300">
                      <span>{t('recipe.by')}</span>
                      {getAuthorUrl(recipe.author) ? (
                        <a
                          href={getAuthorUrl(recipe.author)!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {recipe.author}
                          <ExternalLink size={10} />
                        </a>
                      ) : (
                        <span className="font-bold">{recipe.author}</span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => setIsMistFilterEnabled(!isMistFilterEnabled)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border shrink-0 ${isMistFilterEnabled
                ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800'
                : 'bg-white/50 text-gray-500 border-gray-200 dark:bg-black/30 dark:text-gray-400 dark:border-gray-700'
                }`}
              title="Simulate Black Mist 1/4 Filter adjustments"
            >
              <Droplets size={14} className={isMistFilterEnabled ? 'fill-current' : ''} />
              {isMistFilterEnabled ? t('recipe.mistFilterOn', 'Mist 1/4: ON') : t('recipe.mistFilter', 'Mist Filter')}
            </button>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-3 rounded-full bg-black/20 text-white hover:bg-black/40 backdrop-blur-md z-50 cursor-pointer transition-colors"
            aria-label={t('common.close')}
          >
            <X size={24} />
          </button>

          {/* Title & Author in overlay - ONLY SHOW ON IMAGE */}
          {recipe.imageUrl && (
            <div className="absolute bottom-6 left-6 right-20 z-40">
              <h2 className="text-3xl font-bold text-white drop-shadow-lg leading-tight">{recipe.name}</h2>
              <p className="text-white/90 text-sm font-medium drop-shadow mt-1">{recipe.simulation}</p>

              {/* Author Credit */}
              {recipe.author && (
                <div className="mt-2 inline-flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg">
                  <span className="text-white/80 text-xs font-medium">{t('recipe.by')}</span>
                  {getAuthorUrl(recipe.author) ? (
                    <a
                      href={getAuthorUrl(recipe.author)!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white font-bold text-sm hover:underline flex items-center gap-1 transition-all"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {recipe.author}
                      <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span className="text-white font-bold text-sm">{recipe.author}</span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar bg-white dark:bg-zinc-900 flex-1">
          {recipe.description && (
            <p className="text-gray-600 dark:text-zinc-400 mb-6 italic border-l-4 border-indigo-500 pl-4">"{recipe.description}"</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <DetailRow label={t('recipe.simulation')} value={recipe.simulation} highlight />
            <DetailRow label={t('recipe.grain')} value={recipe.grain} highlight={isMistFilterEnabled} />
            <DetailRow label={t('recipe.colorChrome')} value={recipe.colorChromeEffect} />
            <DetailRow label={t('recipe.colorChromeFXBlue')} value={recipe.colorChromeFXBlue} />
            <DetailRow label={t('recipe.whiteBalance')} value={`${recipe.whiteBalance} (${recipe.wbShiftR > 0 ? '+' : ''}${recipe.wbShiftR}, ${recipe.wbShiftB > 0 ? '+' : ''}${recipe.wbShiftB})`} highlight={isMistFilterEnabled} />
            <DetailRow label={t('recipe.dynamicRange')} value={recipe.dynamicRange} />
            <DetailRow label={t('recipe.highlight')} value={recipe.highlight} />
            <DetailRow label={t('recipe.shadow')} value={recipe.shadow} highlight={isMistFilterEnabled} />
            <DetailRow label={t('recipe.color')} value={recipe.color} />
            <DetailRow label={t('recipe.sharpness')} value={recipe.sharpness} highlight={isMistFilterEnabled} />
            <DetailRow label={t('recipe.noiseReduction')} value={recipe.noiseReduction} />
            <DetailRow label={t('recipe.clarity')} value={recipe.clarity} highlight={isMistFilterEnabled} />
            <DetailRow label={t('recipe.iso')} value={recipe.iso} />
            <DetailRow label={t('recipe.exposureComp')} value={recipe.exposureCompensation} />
            {recipe.kelvin && <DetailRow label={t('recipe.kelvin')} value={`${recipe.kelvin}K`} />}
          </div>

          {recipe.tags && recipe.tags.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{t('recipe.tags')}</h4>
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 text-xs rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Personal Rating Section */}
          {onSetRating && (
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-900/30">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Star size={16} className="text-yellow-500" />
                {t('recipe.myRating')}
              </h4>
              <div className="mb-3">
                <StarRating
                  rating={personalRating}
                  onRatingChange={(rating) => {
                    setPersonalRating(rating);
                    onSetRating(initialRecipe.id, rating, personalNotes);
                  }}
                  size="lg"
                  interactive
                />
              </div>
              <textarea
                placeholder={t('recipe.personalNotes')}
                className="w-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg p-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
                rows={3}
                value={personalNotes}
                onChange={(e) => {
                  setPersonalNotes(e.target.value);
                  onSetRating(initialRecipe.id, personalRating, e.target.value);
                }}
              />
            </div>
          )}
        </div>

        <div className="bg-gray-50 dark:bg-zinc-950 p-4 border-t border-gray-200 dark:border-zinc-800 space-y-3">
          {/* Action Buttons Row 1: Image & Export */}
          <div className="flex items-center gap-2">
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

            <button
              onClick={handleImageClick}
              className="p-3 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-800 border border-gray-200 dark:border-zinc-700"
              disabled={isUploading}
              title="Add/Change Image"
            >
              {isUploading ? <Loader2 size={20} className="animate-spin" /> : <ImageIcon size={20} />}
            </button>

            {recipe.imageUrl && (
              <button
                onClick={handleRemoveImage}
                className="p-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 border border-gray-200 dark:border-zinc-700"
                title="Remove Image"
              >
                <Trash2 size={20} />
              </button>
            )}

            <div className="flex-1" />

            {/* Export Buttons */}
            <button
              onClick={() => exportRecipeAsJSON(recipe)}
              className="p-3 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-gray-200 dark:border-zinc-700 transition-colors"
              title="Export as JSON"
            >
              <Download size={20} />
            </button>

            <button
              onClick={async () => {
                const text = exportRecipeAsText(recipe);
                const success = await copyToClipboard(text);
                if (success) {
                  setCopyFeedback(true);
                  setTimeout(() => setCopyFeedback(false), 2000);
                }
              }}
              className={`p-3 rounded-lg border transition-all ${copyFeedback
                ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 border-gray-200 dark:border-zinc-700'
                }`}
              title={copyFeedback ? t('common.success') : "Copy as Text"}
            >
              <FileText size={20} />
            </button>

            <button
              onClick={() => setShowQRModal(true)}
              className="p-3 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-200 dark:border-zinc-700 transition-colors"
              title="Share QR Code"
            >
              <QrCode size={20} />
            </button>
          </div>

          {/* Action Buttons Row 2: Favorite & Assign */}
          <div className="flex gap-2">
            <button
              onClick={() => onToggleFavorite(initialRecipe.id)}
              className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all ${recipe.isFavorite ? 'text-red-500 bg-red-50 dark:bg-red-900/10' : 'bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300'}`}
            >
              {recipe.isFavorite ? t('recipe.favorited') : t('recipe.favorite')}
            </button>
            <button
              onClick={() => { onAssignSlot(recipe); onClose(); }}
              disabled={isAssigned}
              className={`flex-[2] py-3 px-4 rounded-lg font-bold transition-all ${isAssigned ? 'bg-gray-300 text-gray-500' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'}`}
            >
              {isAssigned ? t('recipe.assigned') : t('recipe.addToSlot')}
            </button>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && <QRCodeModal recipe={recipe} onClose={() => setShowQRModal(false)} />}
    </div>
  );
};



const DetailRow = ({ label, value, highlight }: { label: string, value: string | number, highlight?: boolean }) => (
  <div className="flex justify-between items-center py-1.5 border-b border-gray-100 dark:border-zinc-800 last:border-0">
    <span className="text-gray-500 dark:text-zinc-500">{label}</span>
    <span className={`font-mono font-bold ${highlight ? 'text-amber-600 dark:text-amber-500' : 'text-gray-900 dark:text-white'} transition-colors duration-300`}>{value}</span>
  </div>
);