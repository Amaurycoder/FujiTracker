import { useState, useEffect } from 'react';

export type ViewMode = 'grid' | 'list';

export function useViewMode(storageKey: string = 'viewMode'): [ViewMode, (mode: ViewMode) => void] {
    const [viewMode, setViewModeState] = useState<ViewMode>(() => {
        const saved = localStorage.getItem(storageKey);
        return (saved === 'list' || saved === 'grid') ? saved : 'grid';
    });

    const setViewMode = (mode: ViewMode) => {
        setViewModeState(mode);
        localStorage.setItem(storageKey, mode);
    };

    return [viewMode, setViewMode];
}
