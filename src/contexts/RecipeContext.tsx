import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Recipe, UserSettings, Device } from '../types';
import { MOCK_RECIPES, DEFAULT_SETTINGS } from '../utils/constants';
import { auth } from '../services/firebase';
import {
    syncRecipesToCloud,
    syncSettingsToCloud,
    fetchRecipesFromCloud,
    fetchSettingsFromCloud,
    subscribeToRecipes,
    subscribeToSettings,
    hasCloudData
} from '../services/firestoreService';

interface RecipeContextType {
    recipes: Recipe[];
    settings: UserSettings;
    isSyncing: boolean;
    lastSyncedAt: Date | null;
    addRecipe: (recipe: Recipe) => void;
    updateRecipe: (id: string, updates: Partial<Recipe>) => void;
    toggleFavorite: (id: string) => void;
    assignSlot: (slot: string, recipeId: string | null) => void;
    setDevice: (device: Device) => void;
    setRating: (id: string, rating: number, notes?: string) => void;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export function RecipeProvider({ children }: { children: React.ReactNode }) {
    // Lazy load state
    const [recipes, setRecipes] = useState<Recipe[]>(() => {
        const saved = localStorage.getItem('fuji_recipes');
        return saved ? JSON.parse(saved) : MOCK_RECIPES;
    });

    const [settings, setSettings] = useState<UserSettings>(() => {
        const saved = localStorage.getItem('fuji_settings');
        return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    });

    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // Refs for debouncing and tracking sync origin
    const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isCloudUpdateRef = useRef(false); // Track if update came from cloud

    // Persistence to localStorage
    useEffect(() => {
        localStorage.setItem('fuji_recipes', JSON.stringify(recipes));
    }, [recipes]);

    useEffect(() => {
        localStorage.setItem('fuji_settings', JSON.stringify(settings));
    }, [settings]);

    // Cloud sync initialization and real-time listeners
    useEffect(() => {
        let recipesUnsubscribe: (() => void) | null = null;
        let settingsUnsubscribe: (() => void) | null = null;

        const initializeCloudSync = async () => {
            const user = auth.currentUser;
            if (!user) {
                setIsInitialized(true);
                return;
            }

            try {
                // Check if user has cloud data
                const cloudDataExists = await hasCloudData(user.uid);

                if (!cloudDataExists) {
                    // First time sync - migrate localStorage to cloud
                    console.log('📤 Migrating local data to cloud...');
                    await syncRecipesToCloud(user.uid, recipes);
                    await syncSettingsToCloud(user.uid, settings);
                    setLastSyncedAt(new Date());
                } else {
                    // Fetch from cloud and merge with local
                    console.log('📥 Fetching data from cloud...');
                    const cloudRecipes = await fetchRecipesFromCloud(user.uid);
                    const cloudSettings = await fetchSettingsFromCloud(user.uid);

                    if (cloudRecipes) {
                        isCloudUpdateRef.current = true;
                        setRecipes(cloudRecipes);
                    }
                    if (cloudSettings) {
                        isCloudUpdateRef.current = true;
                        setSettings(cloudSettings);
                    }
                    setLastSyncedAt(new Date());
                }

                // Set up real-time listeners
                recipesUnsubscribe = subscribeToRecipes(user.uid, (cloudRecipes) => {
                    isCloudUpdateRef.current = true;
                    setRecipes(cloudRecipes);
                    setLastSyncedAt(new Date());
                });

                settingsUnsubscribe = subscribeToSettings(user.uid, (cloudSettings) => {
                    isCloudUpdateRef.current = true;
                    setSettings(cloudSettings);
                    setLastSyncedAt(new Date());
                });

                setIsInitialized(true);
            } catch (error) {
                console.error('❌ Error initializing cloud sync:', error);
                setIsInitialized(true);
            }
        };

        // Wait for auth state to be ready
        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            if (user) {
                initializeCloudSync();
            } else {
                setIsInitialized(true);
            }
        });

        return () => {
            unsubscribeAuth();
            if (recipesUnsubscribe) recipesUnsubscribe();
            if (settingsUnsubscribe) settingsUnsubscribe();
        };
    }, []); // Only run once on mount

    // Debounced cloud sync when recipes change
    useEffect(() => {
        if (!isInitialized || isCloudUpdateRef.current) {
            isCloudUpdateRef.current = false;
            return;
        }

        const user = auth.currentUser;
        if (!user) return;

        // Clear previous timeout
        if (syncTimeoutRef.current) {
            clearTimeout(syncTimeoutRef.current);
        }

        // Debounce sync (500ms)
        syncTimeoutRef.current = setTimeout(async () => {
            setIsSyncing(true);
            try {
                await syncRecipesToCloud(user.uid, recipes);
                setLastSyncedAt(new Date());
            } catch (error) {
                console.error('❌ Failed to sync recipes:', error);
            } finally {
                setIsSyncing(false);
            }
        }, 500);

        return () => {
            if (syncTimeoutRef.current) {
                clearTimeout(syncTimeoutRef.current);
            }
        };
    }, [recipes, isInitialized]);

    // Debounced cloud sync when settings change
    useEffect(() => {
        if (!isInitialized || isCloudUpdateRef.current) {
            isCloudUpdateRef.current = false;
            return;
        }

        const user = auth.currentUser;
        if (!user) return;

        if (syncTimeoutRef.current) {
            clearTimeout(syncTimeoutRef.current);
        }

        syncTimeoutRef.current = setTimeout(async () => {
            setIsSyncing(true);
            try {
                await syncSettingsToCloud(user.uid, settings);
                setLastSyncedAt(new Date());
            } catch (error) {
                console.error('❌ Failed to sync settings:', error);
            } finally {
                setIsSyncing(false);
            }
        }, 500);

        return () => {
            if (syncTimeoutRef.current) {
                clearTimeout(syncTimeoutRef.current);
            }
        };
    }, [settings, isInitialized]);

    // Actions
    const addRecipe = (recipe: Recipe) => {
        if (recipes.some(r => r.name.toLowerCase() === recipe.name.toLowerCase())) {
            throw new Error(`A recipe named "${recipe.name}" already exists.`);
        }
        setRecipes(prev => [recipe, ...prev]);
    };

    const updateRecipe = (id: string, updates: Partial<Recipe>) => {
        setRecipes(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    };

    const toggleFavorite = (id: string) => {
        setRecipes(prev => prev.map(r => r.id === id ? { ...r, isFavorite: !r.isFavorite } : r));
    };

    const assignSlot = (slot: string, recipeId: string | null) => {
        setSettings(prev => ({
            ...prev,
            customSlots: { ...prev.customSlots, [slot]: recipeId }
        }));
    };

    const setDevice = (device: Device) => {
        setSettings(prev => ({ ...prev, device }));
    };

    const setRating = (id: string, rating: number, notes?: string) => {
        setRecipes(prev => prev.map(r =>
            r.id === id
                ? { ...r, personalRating: rating || undefined, personalNotes: notes || undefined }
                : r
        ));
    };

    return (
        <RecipeContext.Provider value={{
            recipes,
            settings,
            isSyncing,
            lastSyncedAt,
            addRecipe,
            updateRecipe,
            toggleFavorite,
            assignSlot,
            setDevice,
            setRating
        }}>
            {children}
        </RecipeContext.Provider>
    );
}

export function useRecipes() {
    const context = useContext(RecipeContext);
    if (context === undefined) {
        throw new Error('useRecipes must be used within a RecipeProvider');
    }
    return context;
}
