import React, { useState } from 'react';
import { generateRecipeFromPrompt } from '../services/geminiService';
import { SensorType, Recipe } from '../types';
import { Wand2, Loader2, Save, RefreshCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CreateProps {
    currentDeviceSensor: SensorType;
    onSaveRecipe: (recipe: Recipe) => void;
}

export const Create: React.FC<CreateProps> = ({ currentDeviceSensor, onSaveRecipe }) => {
    const { t } = useTranslation();
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
    const [credits, setCredits] = useState(5);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        if (credits <= 0) {
            setError(t('create.errorCredits'));
            return;
        }

        setIsGenerating(true);
        setError(null);
        setGeneratedRecipe(null);

        try {
            const result = await generateRecipeFromPrompt(prompt, currentDeviceSensor);
            if (result) {
                setGeneratedRecipe(result as Recipe);
                setCredits(prev => prev - 1);
            } else {
                setError(t('create.errorGeneration'));
            }
        } catch (err: any) {
            console.error("Full AI Error:", err);
            setError(`${t('common.error')}: ${err.message || "Unknown error occurred"}`);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <header className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400 flex items-center justify-center gap-3">
                    <Wand2 className="text-purple-500 dark:text-purple-400" size={32} />
                    {t('create.title')}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{t('create.subtitle')}</p>
            </header>

            {/* Input Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-xl">
                <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('create.yourPrompt')}</label>
                    <span className="text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-full">
                        {t('create.creditsRemaining', { count: credits })}
                    </span>
                </div>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={t('create.placeholder')}
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[120px] resize-none placeholder-gray-400"
                />
                {error && <p className="text-red-500 dark:text-red-400 text-sm mt-2">{error}</p>}

                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !prompt.trim()}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${isGenerating || !prompt.trim()
                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg hover:shadow-indigo-500/25'
                            }`}
                    >
                        {isGenerating ? <Loader2 className="animate-spin" /> : <Wand2 size={18} />}
                        {isGenerating ? t('create.generating') : t('create.generate')}
                    </button>
                </div>
            </div>

            {/* Result Section */}
            {generatedRecipe && (
                <div className="animate-slide-up">
                    <div className="bg-white dark:bg-gray-800 border-l-4 border-indigo-500 rounded-r-xl p-6 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-5 dark:opacity-10 text-gray-900 dark:text-white">
                            <Wand2 size={100} />
                        </div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{generatedRecipe.name}</h3>
                                    <p className="text-indigo-600 dark:text-indigo-300 font-mono text-sm mt-1">{generatedRecipe.simulation}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleGenerate}
                                        className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-white transition-colors"
                                        title={t('common.search')} // Using search/regenerate generic
                                    >
                                        <RefreshCcw size={20} />
                                    </button>
                                    <button
                                        onClick={() => onSaveRecipe(generatedRecipe)}
                                        className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-lg shadow-green-600/20"
                                    >
                                        <Save size={18} />
                                        {t('create.saveToLibrary')}
                                    </button>
                                </div>
                            </div>

                            <p className="text-gray-600 dark:text-gray-300 mb-6 italic">"{generatedRecipe.description}"</p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-100 dark:border-transparent">
                                <ParamItem label={t('recipe.dynamicRange')} value={generatedRecipe.dynamicRange} />
                                <ParamItem label={t('recipe.grain')} value={generatedRecipe.grain} />
                                <ParamItem label={t('recipe.whiteBalance')} value={generatedRecipe.whiteBalance} />
                                <ParamItem label={t('recipe.wbShift')} value={`R:${generatedRecipe.wbShiftR} B:${generatedRecipe.wbShiftB}`} />
                                <ParamItem label={t('recipe.highlight')} value={generatedRecipe.highlight} />
                                <ParamItem label={t('recipe.shadow')} value={generatedRecipe.shadow} />
                                <ParamItem label={t('recipe.color')} value={generatedRecipe.color} />
                                <ParamItem label={t('recipe.sharpness')} value={generatedRecipe.sharpness} />
                                <ParamItem label={t('recipe.noiseReduction')} value={generatedRecipe.noiseReduction} />
                                <ParamItem label={t('recipe.clarity')} value={generatedRecipe.clarity || 0} />
                                <ParamItem label={t('recipe.colorChrome')} value={generatedRecipe.colorChromeEffect} />
                                <ParamItem label={t('recipe.colorChromeFXBlue')} value={generatedRecipe.colorChromeFXBlue} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ParamItem = ({ label, value }: { label: string, value: string | number }) => (
    <div className="flex flex-col">
        <span className="text-[10px] uppercase text-gray-500 font-semibold tracking-wider">{label}</span>
        <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{value}</span>
    </div>
);