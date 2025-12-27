import React, { useState, useEffect } from 'react';
import { X, Download, Trash2, Clock, CheckCircle, AlertCircle, Scan } from 'lucide-react';
import { auth } from '../services/firebase';
import {
    createBackup,
    listBackups,
    restoreFromBackup,
    deleteBackup
} from '../services/firestoreService';
import { useRecipes } from '../contexts/RecipeContext';
import { QRScannerModal } from './QRScannerModal';


interface BackupManagerProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Backup {
    id: string;
    createdAt: Date;
}

export const BackupManager: React.FC<BackupManagerProps> = ({ isOpen, onClose }) => {
    const { recipes, settings } = useRecipes();
    const [backups, setBackups] = useState<Backup[]>([]);
    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);
    const [qrRecipeData, setQrRecipeData] = useState<any>(null); // Temp holder for recipe/backup-like structure


    useEffect(() => {
        if (isOpen) {
            loadBackups();
        }
    }, [isOpen]);

    const loadBackups = async () => {
        const user = auth.currentUser;
        if (!user) return;

        setLoading(true);
        try {
            const backupList = await listBackups(user.uid);
            setBackups(backupList);
        } catch (error) {
            console.error('Error loading backups:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateBackup = async () => {
        const user = auth.currentUser;
        if (!user) return;

        setCreating(true);
        try {
            await createBackup(user.uid, recipes, settings);
            setMessage({ type: 'success', text: 'Backup created successfully!' });
            loadBackups();
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to create backup' });
            setTimeout(() => setMessage(null), 3000);
        } finally {
            setCreating(false);
        }
    };

    const handleShowBackupQR = () => {
        // Construct a "fake" recipe object that actually holds the full backup
        // or just use valid backup structure if QRCodeModal supports it.
        // For simplicity now, we can reuse QRCodeModal if we adapt it or create a new one.
        // But the plan "Ensure QR code system works bi-bidirectionally" implies full backup QR too.
        // However, standard QR limit is small. Full backup might be too big for one QR.
        // Let's stick to "Recipe Sharing" as primary, but maybe simpler backup sharing?

        // Actually, let's implement the Scanner primarily as requested.
        // The user asked "QR code marche à la fois pour la version web et la version mobile"
        // which mainly implies ability to scan.

        // Let's just implement Scanning for now as priority.
    };

    const handleScanSuccess = (result: { type: 'recipe' | 'backup'; name?: string }) => {
        if (result.type === 'recipe') {
            setMessage({ type: 'success', text: `Recipe "${result.name}" imported!` });
        } else {
            setMessage({ type: 'success', text: 'Backup restored successfully!' });
            setTimeout(() => window.location.reload(), 2000);
        }
        setTimeout(() => setMessage(null), 3000);
    };

    const handleRestore = async (backupId: string) => {
        if (!confirm('Are you sure you want to restore this backup? This will replace all current data.')) {
            return;
        }

        const user = auth.currentUser;
        if (!user) return;

        setLoading(true);
        try {
            const data = await restoreFromBackup(user.uid, backupId);
            if (data) {
                // Data will be automatically synced via RecipeContext listeners
                setMessage({ type: 'success', text: 'Backup restored successfully!' });
                setTimeout(() => {
                    setMessage(null);
                    onClose();
                    window.location.reload(); // Reload to apply changes
                }, 2000);
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to restore backup' });
            setTimeout(() => setMessage(null), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (backupId: string) => {
        if (!confirm('Delete this backup?')) return;

        const user = auth.currentUser;
        if (!user) return;

        try {
            await deleteBackup(user.uid, backupId);
            setMessage({ type: 'success', text: 'Backup deleted' });
            loadBackups();
            setTimeout(() => setMessage(null), 2000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete backup' });
            setTimeout(() => setMessage(null), 3000);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-zinc-700 animate-scale-up max-h-[80vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center bg-gray-50 dark:bg-zinc-950">
                    <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Backup Manager</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Create and restore backups of your recipes
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800 text-gray-500 dark:text-gray-400 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Message */}
                {message && (
                    <div className={`p-4 border-b ${message.type === 'success'
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/50'
                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/50'
                        }`}>
                        <div className="flex items-center gap-2">
                            {message.type === 'success' ? (
                                <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
                            ) : (
                                <AlertCircle className="text-red-600 dark:text-red-400" size={20} />
                            )}
                            <p className={`text-sm font-medium ${message.type === 'success'
                                ? 'text-green-900 dark:text-green-200'
                                : 'text-red-900 dark:text-red-200'
                                }`}>
                                {message.text}
                            </p>
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="p-6 flex-1 overflow-y-auto">
                    {/* Backup Actions Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <button
                            onClick={handleCreateBackup}
                            disabled={creating}
                            className="py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Download size={18} />
                            {creating ? 'Creating...' : 'New Backup'}
                        </button>

                        <button
                            onClick={() => setIsScannerOpen(true)}
                            className="py-3 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-900 dark:text-white font-bold transition-colors flex items-center justify-center gap-2"
                        >
                            <Scan size={18} />
                            Scan QR
                        </button>
                    </div>

                    {/* Backups List */}
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-4">Available Backups ({backups.length})</h4>

                        {loading && (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            </div>
                        )}

                        {!loading && backups.length === 0 && (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                <p>No backups yet. Create one to get started!</p>
                            </div>
                        )}

                        {!loading && backups.length > 0 && (
                            <div className="space-y-2">
                                {backups.map(backup => (
                                    <div
                                        key={backup.id}
                                        className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Clock className="text-gray-400 dark:text-gray-500" size={20} />
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {backup.createdAt.toLocaleDateString()} at {backup.createdAt.toLocaleTimeString()}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    ID: {backup.id}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleRestore(backup.id)}
                                                className="p-2 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                                                title="Restore backup"
                                            >
                                                <Download size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(backup.id)}
                                                className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                title="Delete backup"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 dark:bg-zinc-950 p-4 border-t border-gray-200 dark:border-zinc-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        💡 Backups are stored securely in the cloud and can be restored anytime
                    </p>
                </div>
            </div>

            <QRScannerModal
                isOpen={isScannerOpen}
                onClose={() => setIsScannerOpen(false)}
                onScanSuccess={handleScanSuccess}
            />
        </div >
    );
};
