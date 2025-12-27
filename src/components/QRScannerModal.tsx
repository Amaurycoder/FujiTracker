import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRecipes } from '../contexts/RecipeContext';
import { Recipe, UserSettings } from '../types';

interface QRScannerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onScanSuccess: (data: any) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ isOpen, onClose, onScanSuccess }) => {
    const { t } = useTranslation();
    const [error, setError] = useState<string | null>(null);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);
    const { addRecipe, importData } = useRecipes();

    useEffect(() => {
        if (!isOpen) return;

        // Initialize scanner after a short delay to ensure DOM is ready
        const timeoutId = setTimeout(() => {
            const scanner = new Html5QrcodeScanner(
                "reader",
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0,
                    showTorchButtonIfSupported: true
                },
                /* verbose= */ false
            );

            scannerRef.current = scanner;

            scanner.render(
                (decodedText) => {
                    handleScan(decodedText);
                },
                (errorMessage) => {
                    // console.log(errorMessage); // Ignore frame errors
                }
            );
        }, 100);

        return () => {
            clearTimeout(timeoutId);
            if (scannerRef.current) {
                scannerRef.current.clear().catch(console.error);
            }
        };
    }, [isOpen]);

    const handleScan = (data: string) => {
        try {
            if (scannerRef.current) {
                scannerRef.current.clear();
            }

            const parsed = JSON.parse(data);

            // Handle Single Recipe
            if (parsed.type === 'recipe' && parsed.data) {
                try {
                    addRecipe(parsed.data);
                    onScanSuccess({ type: 'recipe', name: parsed.data.name });
                    onClose();
                } catch (e: any) {
                    setError(e.message);
                    // Don't close modal on error, let user retry or see error
                    if (scannerRef.current) {
                        // Re-enable scanning? It usually continues scanning.
                        // We might want to clear the error after a few seconds.
                        setTimeout(() => setError(null), 3000);
                    }
                }
            }
            // Handle Full Backup
            else if (parsed.recipes && parsed.settings) {
                importData(parsed.recipes, parsed.settings);
                onScanSuccess({ type: 'backup' });
            }
            else {
                throw new Error('Invalid QR format');
            }

            onClose();
        } catch (err) {
            console.error(err);
            setError('Invalid QR Code format. Please scan a valid FujiTracker QR code.');
            // Restart scanner if needed or let user retry
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-zinc-700">
                <div className="p-4 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center bg-gray-50 dark:bg-zinc-950">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">Scan QR Code</h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800 text-gray-500 dark:text-gray-400 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div id="reader" className="overflow-hidden rounded-lg bg-black"></div>

                    <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        Scan a recipe QR code or a backup QR code from another device.
                    </div>
                </div>
            </div>
        </div>
    );
};
