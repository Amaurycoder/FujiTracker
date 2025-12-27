import React from 'react';
import { Recipe, UserSettings } from '../types';
import { useRecipes } from '../contexts/RecipeContext';

interface SlotAssignmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    recipeToAssign: Recipe | null;
}

export const SlotAssignmentModal: React.FC<SlotAssignmentModalProps> = ({ isOpen, onClose, recipeToAssign }) => {
    const { settings, assignSlot, recipes } = useRecipes();

    if (!isOpen) return null;

    const handleAssignSlot = (slot: string) => {
        if (!recipeToAssign) return;
        assignSlot(slot, recipeToAssign.id);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700 shadow-2xl animate-scale-up">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Assign "{recipeToAssign?.name}" to Slot</h3>
                <div className="grid grid-cols-2 gap-3 mb-6">
                    {['C1', 'C2', 'C3', 'C4'].map(slot => {
                        const currentId = settings.customSlots[slot];
                        const currentName = recipes.find(r => r.id === currentId)?.name;
                        return (
                            <button
                                key={slot}
                                onClick={() => handleAssignSlot(slot)}
                                className={`p-3 rounded-lg border text-left transition-all ${currentId
                                    ? 'border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    : 'border-dashed border-gray-300 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10'
                                    }`}
                            >
                                <span className="font-bold text-indigo-600 dark:text-indigo-400 block text-xs">{slot}</span>
                                <span className="text-sm text-gray-600 dark:text-gray-300 truncate block">
                                    {currentName || 'Empty'}
                                </span>
                            </button>
                        );
                    })}
                </div>
                <button
                    onClick={onClose}
                    className="w-full py-3 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};
