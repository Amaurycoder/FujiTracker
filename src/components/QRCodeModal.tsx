import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Recipe } from '../types';
import { X, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface QRCodeModalProps {
    recipe: Recipe;
    onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ recipe, onClose }) => {
    const { t } = useTranslation();
    // Strip imageUrl to keep payload size within QR limits
    const { imageUrl, ...recipeWithoutImage } = recipe;
    const recipeData = JSON.stringify({
        type: 'recipe',
        data: recipeWithoutImage
    });

    const downloadQRCode = () => {
        const svg = document.getElementById('recipe-qr-code');
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL('image/png');

            const downloadLink = document.createElement('a');
            downloadLink.download = `${recipe.name.replace(/[^a-z0-9]/gi, '_')}_QR.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-zinc-700 animate-scale-up"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center bg-gray-50 dark:bg-zinc-950">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">{t('recipe.qrTitle', 'QR Code')}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800 text-gray-500 dark:text-gray-400 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* QR Code Display */}
                <div className="p-8 flex flex-col items-center">
                    <div className="bg-white p-4 rounded-xl shadow-lg">
                        <QRCodeSVG
                            id="recipe-qr-code"
                            value={recipeData}
                            size={256}
                            level="H"
                            includeMargin={true}
                        />
                    </div>

                    <div className="mt-6 text-center">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-1">{recipe.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{recipe.simulation}</p>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="bg-gray-50 dark:bg-zinc-950 p-4 border-t border-gray-200 dark:border-zinc-800 flex gap-2">
                    <button
                        onClick={downloadQRCode}
                        className="flex-1 py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors flex items-center justify-center gap-2"
                    >
                        <Download size={18} />
                        {t('common.download')}
                    </button>
                </div>

                <div className="px-6 pb-6">
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        {t('recipe.scanQR', 'Scan this QR code with your phone to share this recipe')}
                    </p>
                </div>
            </div>
        </div>
    );
};
