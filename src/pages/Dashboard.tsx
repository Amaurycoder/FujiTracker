import React, { useState, useMemo } from 'react';
import { Recipe, Device, UserSettings } from '../types';
import { Camera, X, Search, Check, GripVertical, Star } from 'lucide-react';
import { CAMERAS } from '../utils/constants';
import { DndContext, DragEndEvent, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core';
import { useTranslation } from 'react-i18next';

interface DashboardProps {
    device: Device;
    settings: UserSettings;
    allRecipes: Recipe[];
    onAssignSlot: (recipe: Recipe, slot: string) => void;
    onRemoveSlot: (slot: string) => void;
    onDeviceChange: (device: Device) => void;
}

// Draggable Recipe component for unassigned recipes
const DraggableRecipe: React.FC<{ recipe: Recipe }> = ({ recipe }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: recipe.id,
        data: { recipe },
    });

    const style = transform
        ? {
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
            opacity: isDragging ? 0.5 : 1,
        }
        : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="px-3 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center gap-2 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
        >
            <GripVertical size={14} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{recipe.name}</span>
        </div>
    );
};

// Droppable Slot component
const DroppableSlot: React.FC<{ slot: string; recipe: Recipe | null; onRemove: () => void }> = ({ slot, recipe, onRemove }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: slot,
    });

    return (
        <div
            ref={setNodeRef}
            className={`relative group p-6 rounded-xl border transition-all duration-200 min-h-[160px] flex flex-col ${recipe
                ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 shadow-sm'
                : 'bg-gray-50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 border-dashed hover:border-gray-400 dark:hover:border-gray-500'
                } ${isOver && !recipe
                    ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-gray-900 scale-105 border-indigo-500'
                    : ''
                }`}
        >
            <div className="flex justify-between items-start mb-4">
                <span className={`text-2xl font-black ${recipe ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}>
                    {slot}
                </span>
                {recipe && (
                    <button
                        onClick={onRemove}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Clear Slot"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {recipe ? (
                <>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{recipe.name}</h3>
                    <div className="mt-auto grid grid-cols-2 gap-2 text-xs">
                        <div className="text-gray-600 dark:text-gray-400">
                            <span className="font-semibold">Sim:</span> {recipe.simulation.split('/')[0]}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400">
                            <span className="font-semibold">DR:</span> {recipe.dynamicRange}
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-gray-400 dark:text-gray-600 text-sm text-center">
                        Drag a recipe here
                    </p>
                </div>
            )}
        </div>
    );
};

export const Dashboard: React.FC<DashboardProps> = ({ device, settings, allRecipes, onAssignSlot, onRemoveSlot, onDeviceChange }) => {
    const slots = ['C1', 'C2', 'C3', 'C4'];
    const { t } = useTranslation();
    const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeId, setActiveId] = useState<string | null>(null);

    const getRecipeForSlot = (slotKey: string) => {
        const recipeId = settings.customSlots[slotKey];
        if (!recipeId) return null;
        return allRecipes.find(r => r.id === recipeId) || null;
    };

    // Show only favorite recipes that are not assigned
    const favoriteUnassignedRecipes = useMemo(() => {
        const assignedIds = Object.values(settings.customSlots).filter(Boolean);
        return allRecipes
            .filter(r => r.isFavorite && !assignedIds.includes(r.id))
            .slice(0, 12); // Show up to 12 favorites
    }, [allRecipes, settings.customSlots]);

    const filteredCameras = useMemo(() => {
        if (!searchQuery) return CAMERAS;
        const lowerQuery = searchQuery.toLowerCase();
        return CAMERAS.filter(cam =>
            cam.name.toLowerCase().includes(lowerQuery) ||
            cam.sensor.toLowerCase().includes(lowerQuery)
        );
    }, [searchQuery]);

    const groupedCameras = useMemo(() => {
        const groups: Record<string, Device[]> = {};
        filteredCameras.forEach(cam => {
            if (!groups[cam.sensor]) groups[cam.sensor] = [];
            groups[cam.sensor].push(cam);
        });
        return groups;
    }, [filteredCameras]);

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && slots.includes(over.id as string)) {
            // Check if dragging from another slot
            if (active.id.toString().startsWith('slot-')) {
                const fromSlot = active.id.toString().replace('slot-', '');
                const toSlot = over.id as string;

                // Swap recipes between slots
                if (fromSlot !== toSlot) {
                    const fromRecipe = getRecipeForSlot(fromSlot);
                    const toRecipe = getRecipeForSlot(toSlot);

                    if (fromRecipe) {
                        onAssignSlot(fromRecipe, toSlot);
                        if (toRecipe) {
                            onAssignSlot(toRecipe, fromSlot);
                        } else {
                            onRemoveSlot(fromSlot);
                        }
                    }
                }
            } else {
                // Dragging from favorites list
                const recipe = allRecipes.find(r => r.id === active.id);
                if (recipe) {
                    onAssignSlot(recipe, over.id as string);
                }
            }
        }

        setActiveId(null);
    };

    const activeRecipe = activeId ? allRecipes.find(r => r.id === activeId) : null;

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="space-y-8 animate-fade-in">
                <header className="flex justify-between items-end border-b border-gray-200 dark:border-gray-700 pb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Camera className="text-indigo-600 dark:text-indigo-400" />
                            {t('dashboard.title')}
                        </h2>
                        <div className="flex items-center gap-3 mt-1">
                            <p className="text-gray-500 dark:text-gray-400 text-sm">{device.name} • {device.sensor}</p>
                            <button
                                onClick={() => setIsDeviceModalOpen(true)}
                                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                            >
                                {t('dashboard.change')}
                            </button>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-gray-800 rounded-full text-xs text-green-700 dark:text-gray-300 border border-green-200 dark:border-gray-700">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            {t('dashboard.syncActive')}
                        </div>
                    </div>
                </header>

                {/* Slots Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {slots.map((slot) => {
                        const recipe = getRecipeForSlot(slot);
                        return (
                            <DroppableSlot
                                key={slot}
                                slot={slot}
                                recipe={recipe}
                                onRemove={() => onRemoveSlot(slot)}
                            />
                        );
                    })}
                </div>

                {/* Favorite Recipes */}
                {favoriteUnassignedRecipes.length > 0 && (
                    <div className="mt-8">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Star size={20} className="text-yellow-500 fill-yellow-500" />
                            {t('dashboard.yourFavorites', { count: favoriteUnassignedRecipes.length })}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            {t('dashboard.dragToAssign')}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                            {favoriteUnassignedRecipes.map(recipe => (
                                <DraggableRecipe key={recipe.id} recipe={recipe} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Drag Overlay */}
                <DragOverlay>
                    {activeRecipe ? (
                        <div className="px-3 py-2 bg-white dark:bg-zinc-800 border-2 border-indigo-500 rounded-lg shadow-2xl">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{activeRecipe.name}</span>
                        </div>
                    ) : null}
                </DragOverlay>

                {/* Device Modal */}
                {isDeviceModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setIsDeviceModalOpen(false)}>
                        <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-zinc-700 max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                            <div className="p-6 border-b border-gray-200 dark:border-zinc-700">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('dashboard.selectCamera')}</h3>
                            </div>

                            <div className="p-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder={t('common.search')}
                                        className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {Object.keys(groupedCameras).length > 0 ? (
                                    (Object.entries(groupedCameras) as [string, Device[]][]).map(([sensor, cameras]) => (
                                        <div key={sensor}>
                                            <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">{sensor}</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {cameras.map((cam) => (
                                                    <button
                                                        key={cam.id}
                                                        onClick={() => {
                                                            onDeviceChange(cam);
                                                            setIsDeviceModalOpen(false);
                                                            setSearchQuery('');
                                                        }}
                                                        className={`p-3 rounded-lg border transition-all text-left ${device.id === cam.id
                                                            ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500 ring-2 ring-indigo-500'
                                                            : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-indigo-500'
                                                            }`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-medium text-gray-900 dark:text-white">{cam.name}</span>
                                                            {device.id === cam.id && <Check size={18} className="text-indigo-600 dark:text-indigo-400" />}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500 dark:text-gray-400">{t('dashboard.noCamerasFound')} "{searchQuery}"</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DndContext>
    );
};