import React from 'react';
import { Cloud, CloudOff, Check, Loader2 } from 'lucide-react';

interface CloudSyncStatusProps {
    isSyncing: boolean;
    lastSyncedAt: Date | null;
    isOnline?: boolean;
}

export const CloudSyncStatus: React.FC<CloudSyncStatusProps> = ({
    isSyncing,
    lastSyncedAt,
    isOnline = navigator.onLine
}) => {
    const getStatus = () => {
        if (!isOnline) {
            return {
                icon: <CloudOff size={14} />,
                text: 'Offline',
                className: 'text-gray-400 dark:text-gray-500'
            };
        }

        if (isSyncing) {
            return {
                icon: <Loader2 size={14} className="animate-spin" />,
                text: 'Syncing...',
                className: 'text-indigo-600 dark:text-indigo-400'
            };
        }

        if (lastSyncedAt) {
            const timeSince = Date.now() - lastSyncedAt.getTime();
            const minutesAgo = Math.floor(timeSince / 60000);

            return {
                icon: <Check size={14} />,
                text: minutesAgo < 1 ? 'Synced' : `Synced ${minutesAgo}m ago`,
                className: 'text-green-600 dark:text-green-400'
            };
        }

        return {
            icon: <Cloud size={14} />,
            text: 'Cloud Ready',
            className: 'text-gray-400 dark:text-gray-500'
        };
    };

    const status = getStatus();

    return (
        <div
            className={`flex items-center gap-1.5 text-xs font-medium ${status.className}`}
            title={lastSyncedAt ? `Last synced: ${lastSyncedAt.toLocaleTimeString()}` : 'Cloud sync'}
        >
            {status.icon}
            <span className="hidden sm:inline">{status.text}</span>
        </div>
    );
};
