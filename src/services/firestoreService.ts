import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    onSnapshot,
    query,
    orderBy,
    Timestamp,
    deleteDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { Recipe, UserSettings } from '../types';

/**
 * Sync recipes to Firestore
 */
export async function syncRecipesToCloud(userId: string, recipes: Recipe[]): Promise<void> {
    try {
        const recipesRef = doc(db, 'users', userId, 'data', 'recipes');
        await setDoc(recipesRef, {
            recipes,
            lastUpdated: Timestamp.now()
        });
        console.log('✅ Recipes synced to cloud');
    } catch (error) {
        console.error('❌ Error syncing recipes:', error);
        throw error;
    }
}

/**
 * Sync settings to Firestore
 */
export async function syncSettingsToCloud(userId: string, settings: UserSettings): Promise<void> {
    try {
        const settingsRef = doc(db, 'users', userId, 'data', 'settings');
        await setDoc(settingsRef, {
            settings,
            lastUpdated: Timestamp.now()
        });
        console.log('✅ Settings synced to cloud');
    } catch (error) {
        console.error('❌ Error syncing settings:', error);
        throw error;
    }
}

/**
 * Fetch recipes from Firestore
 */
export async function fetchRecipesFromCloud(userId: string): Promise<Recipe[] | null> {
    try {
        const recipesRef = doc(db, 'users', userId, 'data', 'recipes');
        const snapshot = await getDoc(recipesRef);

        if (snapshot.exists()) {
            const data = snapshot.data();
            return data.recipes as Recipe[];
        }
        return null;
    } catch (error) {
        console.error('❌ Error fetching recipes:', error);
        return null;
    }
}

/**
 * Fetch settings from Firestore
 */
export async function fetchSettingsFromCloud(userId: string): Promise<UserSettings | null> {
    try {
        const settingsRef = doc(db, 'users', userId, 'data', 'settings');
        const snapshot = await getDoc(settingsRef);

        if (snapshot.exists()) {
            const data = snapshot.data();
            return data.settings as UserSettings;
        }
        return null;
    } catch (error) {
        console.error('❌ Error fetching settings:', error);
        return null;
    }
}

/**
 * Subscribe to real-time recipe updates
 */
export function subscribeToRecipes(
    userId: string,
    callback: (recipes: Recipe[]) => void
): () => void {
    const recipesRef = doc(db, 'users', userId, 'data', 'recipes');

    const unsubscribe = onSnapshot(recipesRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.data();
            callback(data.recipes as Recipe[]);
        }
    }, (error) => {
        console.error('❌ Error in recipes subscription:', error);
    });

    return unsubscribe;
}

/**
 * Subscribe to real-time settings updates
 */
export function subscribeToSettings(
    userId: string,
    callback: (settings: UserSettings) => void
): () => void {
    const settingsRef = doc(db, 'users', userId, 'data', 'settings');

    const unsubscribe = onSnapshot(settingsRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.data();
            callback(data.settings as UserSettings);
        }
    }, (error) => {
        console.error('❌ Error in settings subscription:', error);
    });

    return unsubscribe;
}

/**
 * Create a manual backup
 */
export async function createBackup(userId: string, recipes: Recipe[], settings: UserSettings): Promise<string> {
    try {
        const backupId = Date.now().toString();
        const backupRef = doc(db, 'users', userId, 'backups', backupId);

        await setDoc(backupRef, {
            recipes,
            settings,
            createdAt: Timestamp.now(),
            timestamp: backupId
        });

        console.log('✅ Backup created:', backupId);
        return backupId;
    } catch (error) {
        console.error('❌ Error creating backup:', error);
        throw error;
    }
}

/**
 * List all backups for a user
 */
export async function listBackups(userId: string): Promise<Array<{ id: string; createdAt: Date }>> {
    try {
        const backupsRef = collection(db, 'users', userId, 'backups');
        const q = query(backupsRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            createdAt: doc.data().createdAt.toDate()
        }));
    } catch (error) {
        console.error('❌ Error listing backups:', error);
        return [];
    }
}

/**
 * Restore from a specific backup
 */
export async function restoreFromBackup(
    userId: string,
    backupId: string
): Promise<{ recipes: Recipe[]; settings: UserSettings } | null> {
    try {
        const backupRef = doc(db, 'users', userId, 'backups', backupId);
        const snapshot = await getDoc(backupRef);

        if (snapshot.exists()) {
            const data = snapshot.data();
            return {
                recipes: data.recipes as Recipe[],
                settings: data.settings as UserSettings
            };
        }
        return null;
    } catch (error) {
        console.error('❌ Error restoring backup:', error);
        return null;
    }
}

/**
 * Delete a backup
 */
export async function deleteBackup(userId: string, backupId: string): Promise<void> {
    try {
        const backupRef = doc(db, 'users', userId, 'backups', backupId);
        await deleteDoc(backupRef);
        console.log('✅ Backup deleted:', backupId);
    } catch (error) {
        console.error('❌ Error deleting backup:', error);
        throw error;
    }
}

/**
 * Check if user has cloud data (for migration check)
 */
export async function hasCloudData(userId: string): Promise<boolean> {
    try {
        const recipesRef = doc(db, 'users', userId, 'data', 'recipes');
        const snapshot = await getDoc(recipesRef);
        return snapshot.exists();
    } catch (error) {
        console.error('❌ Error checking cloud data:', error);
        return false;
    }
}
