import React, { useState, useMemo } from 'react';
import { Recipe } from '../types';
import { RecipeCard } from "../components/RecipeCard";
import { RecipeListItem } from "../components/RecipeListItem";
import { MobileFilterDrawer } from '../components/MobileFilterDrawer';
import { Search, Filter, Rocket, ArrowUpDown, X, Grid3x3, List, Shuffle, SlidersHorizontal } from 'lucide-react';
import { useViewMode } from '../hooks/useViewMode';

interface ExploreProps {
    recipes: Recipe[];
    onToggleFavorite: (id: string) => void;
    onAssignSlot: (recipe: Recipe) => void;
    onClick: (recipe: Recipe) => void;
    assignedIds: string[];
    switchToCreate: () => void;
}

type SortOption = 'name' | 'author' | 'recent';
type FilterType = 'all' | 'color' | 'bw';

export const Explore: React.FC<ExploreProps> = ({ recipes, onToggleFavorite, onAssignSlot, onClick, assignedIds, switchToCreate }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<FilterType>('all');
    const [sortBy, setSortBy] = useState<SortOption>('name');
    const [selectedSimulation, setSelectedSimulation] = useState<string>('');
    const [selectedAuthor, setSelectedAuthor] = useState<string>('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [viewMode, setViewMode] = useViewMode('exploreViewMode');

    // Extract unique values for filters
    const uniqueSimulations = useMemo(() =>
        [...new Set(recipes.map(r => r.simulation))].sort(),
        [recipes]);

    const uniqueAuthors = useMemo(() =>
        [...new Set(recipes.map(r => r.author).filter(Boolean))].sort(),
        [recipes]);

    const uniqueTags = useMemo(() =>
        [...new Set(recipes.flatMap(r => r.tags || []))].sort(),
        [recipes]);

    // Filter and sort recipes
    const filteredRecipes = useMemo(() => {
        let result = recipes.filter(recipe => {
            // Search filter
            const matchesSearch =
                recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                recipe.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                recipe.tags?.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
                recipe.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                recipe.dynamicRange.toLowerCase().includes(searchTerm.toLowerCase()) ||
                recipe.whiteBalance.toLowerCase().includes(searchTerm.toLowerCase());

            // B&W filter
            const isBW = recipe.simulation.includes('Acros') || recipe.simulation.includes('Monochrome');
            if (filter === 'bw' && !isBW) return false;
            if (filter === 'color' && isBW) return false;

            // Simulation filter
            if (selectedSimulation && recipe.simulation !== selectedSimulation) return false;

            // Author filter
            if (selectedAuthor && recipe.author !== selectedAuthor) return false;

            // Tags filter
            if (selectedTags.length > 0) {
                const hasAllTags = selectedTags.every(tag =>
                    recipe.tags?.some(t => t.toLowerCase() === tag.toLowerCase())
                );
                if (!hasAllTags) return false;
            }

            return matchesSearch;
        });

        // Sort
        result.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'author':
                    return (a.author || '').localeCompare(b.author || '');
                case 'recent':
                    // Favorites first, then by name
                    if (a.isFavorite !== b.isFavorite) {
                        return a.isFavorite ? -1 : 1;
                    }
                    return a.name.localeCompare(b.name);
                default:
                    return 0;
            }
        });

        return result;
    }, [recipes, searchTerm, filter, selectedSimulation, selectedAuthor, selectedTags, sortBy]);

    const clearFilters = () => {
        setSearchTerm('');
        setFilter('all');
        setSelectedSimulation('');
        setSelectedAuthor('');
        setSelectedTags([]);
        setSortBy('name');
    };

    const activeFiltersCount =
        (selectedSimulation ? 1 : 0) +
        (selectedAuthor ? 1 : 0) +
        selectedTags.length +
        (searchTerm ? 1 : 0);

    const handleRandomRecipe = () => {
        if (filteredRecipes.length > 0) {
            const randomIndex = Math.floor(Math.random() * filteredRecipes.length);
            onClick(filteredRecipes[randomIndex]);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Search & Filter Bar */}
            <div className="flex flex-col gap-3 bg-white dark:bg-gray-800 p-3 md:p-4 rounded-xl border border-gray-200 dark:border-gray-700 sticky top-0 z-20 shadow-lg shadow-gray-200/50 dark:shadow-black/20">
                {/* Search Bar - Full width on mobile */}
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search recipes, tags, parameters..."
                        className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500 text-sm md:text-base"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Controls Row - Wraps on mobile */}
                <div className="flex flex-wrap items-center gap-2">
                    {/* Random Recipe Button */}
                    <button
                        onClick={handleRandomRecipe}
                        disabled={filteredRecipes.length === 0}
                        className="px-3 md:px-4 py-2 rounded-lg font-bold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 active:scale-95 text-sm md:text-base"
                        title="Discover a random recipe"
                    >
                        <Shuffle size={16} />
                        <span className="hidden sm:inline">Surprise-moi !</span>
                        <span className="sm:hidden">!</span>
                    </button>

                    {/* Mobile: Filter Trigger Button */}
                    <button
                        onClick={() => setShowMobileFilters(true)}
                        className="md:hidden flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg font-bold text-gray-700 dark:text-gray-300 flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700 active:scale-95 transition-all h-[42px]"
                    >
                        <SlidersHorizontal size={18} />
                        Filters
                        {activeFiltersCount > 0 && (
                            <span className="bg-indigo-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                                {activeFiltersCount}
                            </span>
                        )}
                    </button>

                    {/* Desktop: Color Filter */}
                    <div className="hidden md:flex items-center gap-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
                        <FilterButton active={filter === 'all'} onClick={() => setFilter('all')} label="All" />
                        <FilterButton active={filter === 'color'} onClick={() => setFilter('color')} label="Color" />
                        <FilterButton active={filter === 'bw'} onClick={() => setFilter('bw')} label="B&W" />
                    </div>

                    {/* Desktop: Advanced Filters Button */}
                    <button
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        className={`hidden md:flex px-3 py-2 rounded-lg border transition-colors items-center gap-2 ${showAdvancedFilters || activeFiltersCount > 0
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                            }`}
                    >
                        <Filter size={16} />
                        {activeFiltersCount > 0 && (
                            <span className="bg-white/20 px-1.5 py-0.5 rounded text-xs font-bold">
                                {activeFiltersCount}
                            </span>
                        )}
                    </button>

                    {/* Desktop: Sort Dropdown */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="hidden md:block px-2 md:px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-xs md:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="name">Sort: Name</option>
                        <option value="author">Sort: Author</option>
                        <option value="recent">Sort: Favorites</option>
                    </select>

                    {/* View Mode Toggle - Hidden on small screens */}
                    <div className="hidden sm:flex items-center gap-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-lg border border-gray-200 dark:border-gray-700 ml-auto">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'grid'
                                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                }`}
                            title="Grid View"
                        >
                            <Grid3x3 size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'list'
                                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                }`}
                            title="List View"
                        >
                            <List size={18} />
                        </button>
                    </div>
                </div>

                {/* Row 2: Advanced Filters */}
                {showAdvancedFilters && (
                    <div className="flex flex-wrap gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                        <select
                            value={selectedSimulation}
                            onChange={(e) => setSelectedSimulation(e.target.value)}
                            className="px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All Simulations</option>
                            {uniqueSimulations.map(sim => (
                                <option key={sim} value={sim}>{sim}</option>
                            ))}
                        </select>

                        <select
                            value={selectedAuthor}
                            onChange={(e) => setSelectedAuthor(e.target.value)}
                            className="px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All Authors</option>
                            {uniqueAuthors.map(author => (
                                <option key={author} value={author}>{author}</option>
                            ))}
                        </select>

                        <div className="flex-1 flex flex-wrap gap-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400 self-center">Tags:</span>
                            {uniqueTags.slice(0, 10).map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => {
                                        if (selectedTags.includes(tag)) {
                                            setSelectedTags(selectedTags.filter(t => t !== tag));
                                        } else {
                                            setSelectedTags([...selectedTags, tag]);
                                        }
                                    }}
                                    className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${selectedTags.includes(tag)
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={clearFilters}
                            className="px-3 py-2 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors flex items-center gap-1"
                        >
                            <X size={14} />
                            Clear All
                        </button>
                    </div>
                )}

                {/* Active Filters Display */}
                {activeFiltersCount > 0 && !showAdvancedFilters && (
                    <div className="flex flex-wrap gap-2 text-sm">
                        {searchTerm && (
                            <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded">
                                Search: "{searchTerm}"
                            </span>
                        )}
                        {selectedSimulation && (
                            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                                {selectedSimulation}
                            </span>
                        )}
                        {selectedAuthor && (
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
                                by {selectedAuthor}
                            </span>
                        )}
                        {selectedTags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Featured Banner (only show if no search/filters) */}
            {!searchTerm && filter === 'all' && !selectedSimulation && !selectedAuthor && selectedTags.length === 0 && recipes.length > 0 && (
                <div className="bg-gradient-to-r from-amber-600 to-orange-800 rounded-xl p-8 relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
                    <div className="relative z-10 max-w-lg">
                        <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded uppercase mb-2 inline-block backdrop-blur-sm">Editor's Choice</span>
                        <h2 className="text-3xl font-bold text-white mb-2">Golden Hour Classic</h2>
                        <p className="text-amber-100 mb-4">Capture the warmth of the sunset with this modified Classic Chrome recipe.</p>
                        <button onClick={() => setSearchTerm('Kodachrome')} className="bg-white text-amber-900 px-4 py-2 rounded-lg font-bold text-sm hover:bg-amber-50 transition-colors shadow-lg">
                            View Similar
                        </button>
                    </div>
                </div>
            )}

            {/* Results count */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
                {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} found
            </div>

            {/* Grid or List View */}
            {filteredRecipes.length > 0 ? (
                viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {filteredRecipes.map(recipe => (
                            <RecipeCard
                                key={recipe.id}
                                recipe={recipe}
                                onToggleFavorite={onToggleFavorite}
                                onAssignSlot={onAssignSlot}
                                onClick={onClick}
                                isAssigned={assignedIds.includes(recipe.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredRecipes.map(recipe => (
                            <RecipeListItem
                                key={recipe.id}
                                recipe={recipe}
                                onToggleFavorite={onToggleFavorite}
                                onAssignSlot={onAssignSlot}
                                onClick={onClick}
                                isAssigned={assignedIds.includes(recipe.id)}
                            />
                        ))}
                    </div>
                )
            ) : (
                <div className="text-center py-20 bg-gray-100 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                    <Filter className="mx-auto text-gray-400 dark:text-gray-600 mb-4" size={48} />
                    <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">No recipes found</h3>
                    <p className="text-gray-500 mb-6">Try adjusting your filters or search term.</p>
                    <button
                        onClick={clearFilters}
                        className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 transition-colors mr-2"
                    >
                        Clear Filters
                    </button>
                    {searchTerm && (
                        <button
                            onClick={switchToCreate}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 transition-colors"
                        >
                            <Rocket size={18} />
                            Create with AI using "{searchTerm}"
                        </button>
                    )}
                </div>
            )}
            {/* Mobile Filter Drawer */}
            <MobileFilterDrawer
                isOpen={showMobileFilters}
                onClose={() => setShowMobileFilters(false)}
                filter={filter}
                setFilter={setFilter}
                sortBy={sortBy}
                setSortBy={setSortBy}
                selectedSimulation={selectedSimulation}
                setSelectedSimulation={setSelectedSimulation}
                uniqueSimulations={uniqueSimulations}
                selectedAuthor={selectedAuthor}
                setSelectedAuthor={setSelectedAuthor}
                uniqueAuthors={uniqueAuthors}
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
                uniqueTags={uniqueTags}
                clearFilters={clearFilters}
                activeFiltersCount={activeFiltersCount}
            />
        </div>
    );
};

const FilterButton = ({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) => (
    <button
        onClick={onClick}
        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${active
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
    >
        {label}
    </button>
);