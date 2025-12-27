// Mapping of recipe authors to their website URLs
export const AUTHOR_URLS: Record<string, string> = {
    'FujiWeekly': 'https://fujixweekly.com/recipes/',
    'Film.Recipes': 'https://film.recipes/',
    '@osanbilgi': 'https://www.instagram.com/osanbilgi/',
    'Kevin Mullins': 'https://www.kevinmullinsphotography.co.uk/blog/',
    // Add more authors as needed
};

/**
 * Get source URL for a recipe author
 */
export function getAuthorUrl(author: string): string | null {
    return AUTHOR_URLS[author] || null;
}
