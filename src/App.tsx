import React, { useState, Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useRecipes } from './contexts/RecipeContext';
import { useTheme } from './contexts/ThemeContext';
import { Recipe } from './types';
import { RecipeDetailModal } from './components/RecipeDetailModal';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { SlotAssignmentModal } from './components/SlotAssignmentModal';
import { ImportModal } from './components/ImportModal';
import { BackupManager } from './components/BackupManager';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { PageTransition } from './components/PageTransition';
import { AnimatePresence } from 'framer-motion';

// Lazy Load Pages
const Dashboard = React.lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));
const Explore = React.lazy(() => import('./pages/Explore').then(module => ({ default: module.Explore })));
const Create = React.lazy(() => import('./pages/Create').then(module => ({ default: module.Create })));
const Login = React.lazy(() => import('./pages/Login').then(module => ({ default: module.Login })));
const Collection = React.lazy(() => import('./pages/Collection').then(module => ({ default: module.Collection })));

export default function App() {
    const navigate = useNavigate();
    const { recipes, settings, updateRecipe, toggleFavorite, addRecipe, assignSlot, setDevice, setRating } = useRecipes();
    const { theme, cycleTheme } = useTheme();

    // Modal states (UI State)
    const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
    const [recipeToAssign, setRecipeToAssign] = useState<Recipe | null>(null);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

    // Global keyboard shortcuts
    useKeyboardShortcuts({
        onCloseModal: () => {
            setSelectedRecipe(null);
            setIsSlotModalOpen(false);
            setIsImportModalOpen(false);
            setIsBackupModalOpen(false);
        }
    });


    const assignedRecipeIds = Object.values(settings.customSlots).filter(Boolean) as string[];

    const handleSaveCreatedRecipe = (newRecipe: Recipe) => {
        addRecipe(newRecipe);
        navigate('/collection');
    };

    const handleUpdateRecipeImage = (id: string, imageUrl: string | undefined) => {
        updateRecipe(id, { imageUrl });
        // Update selectedRecipe local state to reflect changes immediately
        if (selectedRecipe?.id === id) {
            setSelectedRecipe(prev => prev ? { ...prev, imageUrl } : null);
        }
    };

    const openAssignModal = (recipe: Recipe) => {
        setRecipeToAssign(recipe);
        setIsSlotModalOpen(true);
    };

    const LoadingFallback = () => (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <Suspense fallback={<LoadingFallback />}>
            <AnimatePresence mode="wait">
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route element={<ProtectedRoute />}>
                        <Route element={<Layout theme={theme} cycleTheme={cycleTheme} device={settings.device} onOpenImport={() => setIsImportModalOpen(true)} onOpenBackup={() => setIsBackupModalOpen(true)} />}>
                            <Route index element={<Navigate to="/explore" replace />} />

                            <Route path="explore" element={
                                <PageTransition>
                                    <Explore
                                        recipes={recipes.filter(r => r.sensor === settings.device.sensor)}
                                        onToggleFavorite={toggleFavorite}
                                        onAssignSlot={openAssignModal}
                                        assignedIds={assignedRecipeIds}
                                        switchToCreate={() => navigate('/create')}
                                        onClick={setSelectedRecipe}
                                    />
                                </PageTransition>
                            } />

                            <Route path="create" element={
                                <PageTransition>
                                    <Create
                                        currentDeviceSensor={settings.device.sensor}
                                        onSaveRecipe={handleSaveCreatedRecipe}
                                    />
                                </PageTransition>
                            } />

                            <Route path="dashboard" element={
                                <PageTransition>
                                    <Dashboard
                                        device={settings.device}
                                        settings={settings}
                                        allRecipes={recipes}
                                        onAssignSlot={(recipe, slot) => assignSlot(slot, recipe.id)}
                                        onRemoveSlot={(slot) => assignSlot(slot, null)}
                                        onDeviceChange={setDevice}
                                    />
                                </PageTransition>
                            } />

                            <Route path="collection" element={
                                <PageTransition>
                                    <Collection
                                        onOpenAssignModal={openAssignModal}
                                        onSelectRecipe={setSelectedRecipe}
                                    />
                                </PageTransition>
                            } />
                        </Route>
                    </Route>
                </Routes>
            </AnimatePresence>

            {/* Global Recipe Detail Modal */}
            {selectedRecipe && (
                <RecipeDetailModal
                    recipe={selectedRecipe}
                    onClose={() => setSelectedRecipe(null)}
                    onToggleFavorite={toggleFavorite}
                    onAssignSlot={openAssignModal}
                    isAssigned={assignedRecipeIds.includes(selectedRecipe.id)}
                    onUpdateImage={handleUpdateRecipeImage}
                    onSetRating={setRating}
                />
            )}

            {/* Global Slot Assignment Modal */}
            <SlotAssignmentModal
                isOpen={isSlotModalOpen}
                onClose={() => setIsSlotModalOpen(false)}
                recipeToAssign={recipeToAssign}
            />

            {/* Global Import Modal */}
            <ImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                existingRecipes={recipes}
                onImport={(importedRecipes) => {
                    importedRecipes.forEach(recipe => addRecipe(recipe));
                    setIsImportModalOpen(false);
                }}
            />

            {/* Backup Manager Modal */}
            <BackupManager
                isOpen={isBackupModalOpen}
                onClose={() => setIsBackupModalOpen(false)}
            />
        </Suspense>
    );
}