import React from 'react';
import { X, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MobileFilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    filter: 'all' | 'color' | 'bw';
    setFilter: (f: 'all' | 'color' | 'bw') => void;
    sortBy: 'name' | 'author' | 'recent';
    setSortBy: (s: 'name' | 'author' | 'recent') => void;
    selectedSimulation: string;
    setSelectedSimulation: (s: string) => void;
    uniqueSimulations: string[];
    selectedAuthor: string;
    setSelectedAuthor: (s: string) => void;
    uniqueAuthors: string[];
    selectedTags: string[];
    setSelectedTags: (t: string[]) => void;
    uniqueTags: string[];
    clearFilters: () => void;
    activeFiltersCount: number;
}

export const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
    isOpen,
    onClose,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    selectedSimulation,
    setSelectedSimulation,
    uniqueSimulations,
    selectedAuthor,
    setSelectedAuthor,
    uniqueAuthors,
    selectedTags,
    setSelectedTags,
    uniqueTags,
    clearFilters,
    activeFiltersCount
}) => {
    const { t } = useTranslation();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="relative w-full bg-white dark:bg-zinc-900 rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col animate-slide-up">
                {/* Drag Handle */}
                <div className="w-full flex justify-center pt-3 pb-1" onClick={onClose}>
                    <div className="w-12 h-1.5 rounded-full bg-gray-300 dark:bg-zinc-700" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-zinc-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h2>
                    <div className="flex items-center gap-3">
                        {activeFiltersCount > 0 && (
                            <button
                                onClick={clearFilters}
                                className="text-sm font-medium text-red-500 hover:text-red-600"
                            >
                                Reset ({activeFiltersCount})
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 bg-gray-100 dark:bg-zinc-800 rounded-full text-gray-500 dark:text-zinc-400"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32">

                    {/* Sort By */}
                    <section>
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-zinc-500 uppercase tracking-wider mb-3">Sort By</h3>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { id: 'recent', label: 'Favorites' },
                                { id: 'name', label: 'Name' },
                                { id: 'author', label: 'Author' }
                            ].map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => setSortBy(option.id as any)}
                                    className={`py-2 px-3 rounded-xl text-sm font-medium border transition-all ${sortBy === option.id
                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20'
                                            : 'bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border-gray-200 dark:border-zinc-700'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Color / BW */}
                    <section>
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-zinc-500 uppercase tracking-wider mb-3">Mode</h3>
                        <div className="flex p-1 bg-gray-100 dark:bg-zinc-800 rounded-xl">
                            {[
                                { id: 'all', label: 'All' },
                                { id: 'color', label: 'Color' },
                                { id: 'bw', label: 'B&W' }
                            ].map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => setFilter(option.id as any)}
                                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${filter === option.id
                                            ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm'
                                            : 'text-gray-500 dark:text-zinc-400'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Film Simulation */}
                    <section>
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-zinc-500 uppercase tracking-wider mb-3">Film Simulation</h3>
                        <select
                            value={selectedSimulation}
                            onChange={(e) => setSelectedSimulation(e.target.value)}
                            className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All Simulations</option>
                            {uniqueSimulations.map(sim => (
                                <option key={sim} value={sim}>{sim}</option>
                            ))}
                        </select>
                    </section>

                    {/* Author */}
                    <section>
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-zinc-500 uppercase tracking-wider mb-3">Author</h3>
                        <select
                            value={selectedAuthor}
                            onChange={(e) => setSelectedAuthor(e.target.value)}
                            className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All Authors</option>
                            {uniqueAuthors.map(author => (
                                <option key={author} value={author}>{author}</option>
                            ))}
                        </select>
                    </section>

                    {/* Tags */}
                    <section>
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-zinc-500 uppercase tracking-wider mb-3">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {uniqueTags.map(tag => {
                                const isSelected = selectedTags.includes(tag);
                                return (
                                    <button
                                        key={tag}
                                        onClick={() => {
                                            if (isSelected) {
                                                setSelectedTags(selectedTags.filter(t => t !== tag));
                                            } else {
                                                setSelectedTags([...selectedTags, tag]);
                                            }
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${isSelected
                                                ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
                                                : 'bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 border-gray-200 dark:border-zinc-700'
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                );
                            })}
                        </div>
                    </section>
                </div>

                {/* Footer Actions */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border-t border-gray-100 dark:border-zinc-800 pb-safe">
                    <button
                        onClick={onClose}
                        className="w-full py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-lg shadow-lg active:scale-[0.98] transition-all"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
};
