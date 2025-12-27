import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface KeyboardShortcutsOptions {
    onCloseModal?: () => void;
    onFocusSearch?: () => void;
}

export function useKeyboardShortcuts(options: KeyboardShortcutsOptions = {}) {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Ignore if typing in input/textarea
            const target = event.target as HTMLElement;
            if (
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable
            ) {
                // Allow Esc even in inputs
                if (event.key !== 'Escape') {
                    return;
                }
            }

            const key = event.key.toLowerCase();

            switch (key) {
                case 'n':
                    // N: Navigate to Create page
                    if (!event.ctrlKey && !event.metaKey) {
                        event.preventDefault();
                        navigate('/create');
                    }
                    break;

                case 's':
                    // S: Focus search input
                    if (!event.ctrlKey && !event.metaKey) {
                        event.preventDefault();
                        if (options.onFocusSearch) {
                            options.onFocusSearch();
                        } else {
                            // Try to focus any search input on the page
                            const searchInput = document.querySelector<HTMLInputElement>(
                                'input[type="text"][placeholder*="Search" i], input[type="text"][placeholder*="Recherche" i]'
                            );
                            searchInput?.focus();
                        }
                    }
                    break;

                case 'escape':
                    // Esc: Close modals
                    if (options.onCloseModal) {
                        options.onCloseModal();
                    }
                    // Also blur any focused input
                    if (document.activeElement instanceof HTMLElement) {
                        document.activeElement.blur();
                    }
                    break;

                case '1':
                    // 1: Navigate to Explore
                    if (!event.ctrlKey && !event.metaKey) {
                        event.preventDefault();
                        navigate('/explore');
                    }
                    break;

                case '2':
                    // 2: Navigate to Create
                    if (!event.ctrlKey && !event.metaKey) {
                        event.preventDefault();
                        navigate('/create');
                    }
                    break;

                case '3':
                    // 3: Navigate to Collection
                    if (!event.ctrlKey && !event.metaKey) {
                        event.preventDefault();
                        navigate('/collection');
                    }
                    break;

                case '4':
                    // 4: Navigate to Dashboard
                    if (!event.ctrlKey && !event.metaKey) {
                        event.preventDefault();
                        navigate('/dashboard');
                    }
                    break;

                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [navigate, location.pathname, options]);
}
