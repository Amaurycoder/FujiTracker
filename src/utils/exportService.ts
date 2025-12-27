import { Recipe } from '../types';

/**
 * Export a single recipe as a JSON file
 */
export function exportRecipeAsJSON(recipe: Recipe): void {
    const dataStr = JSON.stringify(recipe, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${recipe.name.replace(/[^a-z0-9]/gi, '_')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Export multiple recipes as a JSON file
 */
export function exportRecipesAsJSON(recipes: Recipe[], filename: string = 'recipes'): void {
    const dataStr = JSON.stringify(recipes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Export recipe as formatted text
 */
export function exportRecipeAsText(recipe: Recipe): string {
    return `${recipe.name}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📷 Camera: ${recipe.sensor}
🎨 Film Simulation: ${recipe.simulation}

BASIC SETTINGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Dynamic Range: ${recipe.dynamicRange}
White Balance: ${recipe.whiteBalance}${recipe.kelvin ? ` (${recipe.kelvin}K)` : ''}
WB Shift: R${recipe.wbShiftR > 0 ? '+' : ''}${recipe.wbShiftR} / B${recipe.wbShiftB > 0 ? '+' : ''}${recipe.wbShiftB}

TONE & COLOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Highlight: ${recipe.highlight > 0 ? '+' : ''}${recipe.highlight}
Shadow: ${recipe.shadow > 0 ? '+' : ''}${recipe.shadow}
Color: ${recipe.color > 0 ? '+' : ''}${recipe.color}
Sharpness: ${recipe.sharpness > 0 ? '+' : ''}${recipe.sharpness}
Clarity: ${recipe.clarity > 0 ? '+' : ''}${recipe.clarity}

EFFECTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Grain: ${recipe.grain}
Color Chrome Effect: ${recipe.colorChromeEffect}
Color Chrome FX Blue: ${recipe.colorChromeFXBlue}
Noise Reduction: ${recipe.noiseReduction > 0 ? '+' : ''}${recipe.noiseReduction}

EXPOSURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ISO: ${recipe.iso}
Exposure Comp: ${recipe.exposureCompensation}

${recipe.description ? `\n📝 NOTES\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${recipe.description}\n` : ''}${recipe.tags && recipe.tags.length > 0 ? `\n🏷️ TAGS\n${recipe.tags.join(', ')}\n` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Created by: ${recipe.author}
${recipe.isFavorite ? '⭐ Favorite' : ''}
`;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy:', err);
        return false;
    }
}

/**
 * Validate recipe structure
 */
export function validateRecipe(recipe: any): recipe is Recipe {
    const required = ['id', 'name', 'sensor', 'simulation', 'dynamicRange', 'whiteBalance'];
    return required.every(field => recipe.hasOwnProperty(field));
}

/**
 * Import recipes from JSON file
 */
export async function importRecipesFromFile(file: File): Promise<Recipe[]> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const data = JSON.parse(content);

                // Handle both single recipe and array of recipes
                const recipes = Array.isArray(data) ? data : [data];

                // Validate all recipes
                const validRecipes = recipes.filter(validateRecipe);

                if (validRecipes.length === 0) {
                    reject(new Error('No valid recipes found in file'));
                    return;
                }

                // Ensure recipes have unique IDs and are marked as imported
                const importedRecipes = validRecipes.map(recipe => ({
                    ...recipe,
                    id: `imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    author: recipe.author || 'Imported',
                    isFavorite: false, // Reset favorite status on import
                }));

                resolve(importedRecipes);
            } catch (error) {
                reject(new Error('Invalid JSON format'));
            }
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };

        reader.readAsText(file);
    });
}

/**
 * Generate shareable URL for recipe (base64 encoded)
 */
export function generateShareableURL(recipe: Recipe): string {
    const recipeData = JSON.stringify(recipe);
    const encoded = btoa(recipeData);
    return `${window.location.origin}${window.location.pathname}#/import/${encoded}`;
}

/**
 * Decode recipe from shareable URL
 */
export function decodeShareableURL(encoded: string): Recipe | null {
    try {
        const decoded = atob(encoded);
        const recipe = JSON.parse(decoded);
        return validateRecipe(recipe) ? recipe : null;
    } catch {
        return null;
    }
}
