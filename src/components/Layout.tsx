import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Camera, Compass, PlusCircle, Book, User, Moon, Sun, Monitor, LogOut, Upload, Database } from 'lucide-react';
import { Device } from '../types';
import { auth } from "../services/firebase";
import { signOut } from 'firebase/auth';
import { CloudSyncStatus } from './CloudSyncStatus';
import { useRecipes } from '../contexts/RecipeContext';
import { LanguageSelector } from './LanguageSelector';
import { useTranslation } from 'react-i18next';
import { useSwipe } from '../hooks/useSwipe';

type ThemeMode = 'light' | 'dark' | 'system';

interface LayoutProps {
    theme: ThemeMode;
    cycleTheme: () => void;
    device: Device;
    onOpenImport: () => void;
    onOpenBackup: () => void;
}

export function Layout({ theme, cycleTheme, device, onOpenImport, onOpenBackup }: LayoutProps) {
    const navigate = useNavigate();
    const { isSyncing, lastSyncedAt } = useRecipes();
    const { t } = useTranslation();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const getThemeIcon = (size = 18) => {
        if (theme === 'light') return <Sun size={size} />;
        if (theme === 'dark') return <Moon size={size} />;
        return <Monitor size={size} />;
    };

    // Swipe Navigation Logic
    const tabs = ['/explore', '/create', '/collection', '/dashboard'];

    const handleSwipeLeft = () => {
        const currentPath = window.location.hash.replace('#', '');
        // Find closest matching tab (handling sub-routes if any)
        const currentIndex = tabs.findIndex(tab => currentPath.startsWith(tab));

        if (currentIndex !== -1 && currentIndex < tabs.length - 1) {
            navigate(tabs[currentIndex + 1]);
        }
    };

    const handleSwipeRight = () => {
        const currentPath = window.location.hash.replace('#', '');
        const currentIndex = tabs.findIndex(tab => currentPath.startsWith(tab));

        if (currentIndex > 0) {
            navigate(tabs[currentIndex - 1]);
        }
    };

    const swipeHandlers = useSwipe({
        onSwipeLeft: handleSwipeLeft,
        onSwipeRight: handleSwipeRight,
        threshold: 75 // Slightly higher threshold to prevent accidental swipes
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 flex font-sans transition-colors duration-300">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-gray-100 dark:border-zinc-800 flex flex-col hidden md:flex sticky top-0 h-screen transition-colors duration-300">
                <div className="p-6">
                    <div className="text-gray-800 dark:text-white transition-colors duration-300">
                        <svg viewBox="0 0 320 80" className="w-40 h-auto" role="img" aria-label="Logo FujiTracker">
                            <g transform="translate(10, 15)" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <rect x="2" y="2" width="56" height="46" rx="4" ry="4" />
                                <circle cx="30" cy="25" r="16" strokeWidth="2" />
                                <line x1="30" y1="12" x2="30" y2="38" strokeWidth="1.5" />
                                <line x1="17" y1="25" x2="43" y2="25" strokeWidth="1.5" />
                                <circle cx="48" cy="12" r="3" fill="#E11D48" stroke="none" />
                            </g>
                            <g transform="translate(85, 52)">
                                <text fontFamily="Helvetica Neue, Roboto, Arial, sans-serif" fontWeight="800" fontSize="36" fill="currentColor" letterSpacing="-0.5">
                                    FUJI<tspan fontWeight="400" fontStyle="italic">TRACKER</tspan>
                                </text>
                            </g>
                        </svg>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <NavButton to="/explore" icon={<Compass size={20} />} label={t('nav.explore')} />
                    <NavButton to="/create" icon={<PlusCircle size={20} />} label={t('nav.create')} />
                    <NavButton to="/collection" icon={<Book size={20} />} label={t('nav.collection')} />
                    <div className="pt-4 mt-4 border-t border-gray-100 dark:border-zinc-800">
                        <NavButton to="/dashboard" icon={<Camera size={20} />} label={t('nav.dashboard')} />
                    </div>
                </nav>

                <div className="px-4 mb-4 space-y-2">
                    <button
                        onClick={onOpenImport}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 text-sm bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-indigo-500/20"
                    >
                        <Upload size={18} />
                        <span>{t('dashboard.importRecipes', 'Import Recipes')}</span>
                    </button>
                    <button
                        onClick={onOpenBackup}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 text-sm bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors"
                    >
                        <Database size={18} />
                        <span>{t('dashboard.backups', 'Backups')}</span>
                    </button>
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-zinc-800 space-y-3">
                    {/* Cloud Sync Status */}
                    <div className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800">
                        <CloudSyncStatus isSyncing={isSyncing} lastSyncedAt={lastSyncedAt} />
                    </div>

                    {/* Language Selector */}
                    <div className="flex justify-center">
                        <LanguageSelector />
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors group"
                    >
                        <LogOut size={16} className="group-hover:rotate-12 transition-transform" />
                        <span>{t('auth.signOut')}</span>
                    </button>

                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center text-gray-600 dark:text-zinc-300">
                            <User size={16} />
                        </div>
                        <div className="text-sm flex-1 min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white truncate">Pro Member</p>
                            <p className="text-gray-500 text-xs truncate">{device.name}</p>
                        </div>
                        <button
                            onClick={cycleTheme}
                            className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-white transition-colors"
                            title={`Theme: ${theme}`}
                        >
                            {getThemeIcon(16)}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Nav - Simplified 4 tabs */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-t border-gray-200 dark:border-zinc-800 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] transition-colors duration-300">
                <div className="pb-safe">
                    <div className="grid grid-cols-4 items-center">
                        <MobileNavButton to="/explore" icon={<Compass size={24} />} label={t('nav.explore')} />
                        <MobileNavButton to="/create" icon={<PlusCircle size={24} />} label={t('nav.create')} />
                        <MobileNavButton to="/collection" icon={<Book size={24} />} label={t('nav.collection')} />
                        <MobileNavButton to="/dashboard" icon={<Camera size={24} />} label={t('nav.dashboard')} />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main
                className="flex-1 overflow-auto bg-gray-50 dark:bg-zinc-950 transition-colors duration-300"
                {...swipeHandlers}
            >
                <div className="max-w-7xl mx-auto p-4 md:p-8 pb-24 md:pb-8 min-h-full animate-fade-in">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

const NavButton = ({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) => (
    <NavLink
        to={to}
        className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive
            ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20'
            : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
    >
        {icon}
        {label}
    </NavLink>
);

const MobileNavButton = ({ to, icon, label }: { to: string, icon: React.ReactNode, label?: string }) => (
    <NavLink
        to={to}
        className={({ isActive }) => `flex flex-col items-center justify-center gap-1 py-3 px-2 transition-all active:scale-95 ${isActive
            ? 'text-indigo-600 dark:text-indigo-400'
            : 'text-gray-400 dark:text-gray-500'
            }`}
    >
        {icon}
        {label && <span className="text-[11px] font-medium">{label}</span>}
    </NavLink>
);
