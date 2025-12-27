import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, FileJson, AlertCircle, CheckCircle, Camera, Scan } from 'lucide-react';
import { Recipe } from '../types';
import { importRecipesFromFile, validateRecipe } from '../utils/exportService';
import { Html5Qrcode } from 'html5-qrcode';

interface ImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (recipes: Recipe[]) => void;
    existingRecipes: Recipe[]; // To check for duplicates
}

type ImportMode = 'file' | 'qr';

export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImport, existingRecipes }) => {
    const [mode, setMode] = useState<ImportMode>('file');
    const [isDragging, setIsDragging] = useState(false);
    const [previewRecipes, setPreviewRecipes] = useState<Recipe[]>([]);
    const [duplicateRecipes, setDuplicateRecipes] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const qrReaderRef = useRef<Html5Qrcode | null>(null);
    const scannerDivRef = useRef<HTMLDivElement>(null);

    // Cleanup QR scanner on unmount or mode change
    useEffect(() => {
        return () => {
            if (qrReaderRef.current && isScanning) {
                qrReaderRef.current.stop().catch(console.error);
            }
        };
    }, [isScanning]);

    if (!isOpen) return null;

    const checkForDuplicates = (recipes: Recipe[]): string[] => {
        const duplicates: string[] = [];
        recipes.forEach(recipe => {
            const exists = existingRecipes.find(r =>
                r.name.toLowerCase() === recipe.name.toLowerCase()
            );
            if (exists) {
                duplicates.push(recipe.name);
            }
        });
        return duplicates;
    };

    const handleRecipesLoaded = (recipes: Recipe[]) => {
        const duplicates = checkForDuplicates(recipes);
        setDuplicateRecipes(duplicates);
        setPreviewRecipes(recipes);
    };

    const handleFileSelect = async (file: File) => {
        setLoading(true);
        setError(null);
        setPreviewRecipes([]);
        setDuplicateRecipes([]);

        try {
            const recipes = await importRecipesFromFile(file);
            handleRecipesLoaded(recipes);
        } catch (err: any) {
            setError(err.message || 'Failed to import recipes');
        } finally {
            setLoading(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && file.type === 'application/json') {
            handleFileSelect(file);
        } else {
            setError('Please drop a valid JSON file');
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const startQRScanner = async () => {
        if (!scannerDivRef.current) return;

        try {
            setIsScanning(true);
            setError(null);

            const qrReader = new Html5Qrcode("qr-reader");
            qrReaderRef.current = qrReader;

            await qrReader.start(
                { facingMode: "environment" }, // Use back camera
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 }
                },
                (decodedText) => {
                    // QR code successfully scanned
                    handleQRCodeScanned(decodedText);
                    stopQRScanner();
                },
                (errorMessage) => {
                    // Scanning errors (can be ignored, happens frequently)
                }
            );
        } catch (err: any) {
            console.error('QR Scanner error:', err);
            setError('Failed to access camera. Please check permissions.');
            setIsScanning(false);
        }
    };

    const stopQRScanner = async () => {
        if (qrReaderRef.current) {
            try {
                await qrReaderRef.current.stop();
            } catch (err) {
                console.error('Error stopping scanner:', err);
            }
            qrReaderRef.current = null;
            setIsScanning(false);
        }
    };

    const handleQRCodeScanned = (decodedText: string) => {
        try {
            const recipe = JSON.parse(decodedText);
            if (validateRecipe(recipe)) {
                handleRecipesLoaded([recipe]);
            } else {
                setError('Invalid recipe data in QR code');
            }
        } catch (err) {
            setError('Failed to parse QR code data');
        }
    };

    const handleConfirmImport = () => {
        if (previewRecipes.length > 0) {
            onImport(previewRecipes);
            resetModal();
            onClose();
        }
    };

    const resetModal = () => {
        setPreviewRecipes([]);
        setDuplicateRecipes([]);
        setError(null);
        setMode('file');
        if (isScanning) {
            stopQRScanner();
        }
    };

    const handleClose = () => {
        resetModal();
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
            onClick={handleClose}
        >
            <div
                className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-zinc-700 animate-scale-up max-h-[80vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center bg-gray-50 dark:bg-zinc-950">
                    <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Import Recipes</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Upload a file or scan a QR code</p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800 text-gray-500 dark:text-gray-400 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Mode Tabs */}
                <div className="flex border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950">
                    <button
                        onClick={() => {
                            if (isScanning) stopQRScanner();
                            setMode('file');
                        }}
                        className={`flex-1 py-3 px-4 font-medium transition-colors flex items-center justify-center gap-2 ${mode === 'file'
                            ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        <FileJson size={18} />
                        Upload File
                    </button>
                    <button
                        onClick={() => setMode('qr')}
                        className={`flex-1 py-3 px-4 font-medium transition-colors flex items-center justify-center gap-2 ${mode === 'qr'
                            ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        <Scan size={18} />
                        Scan QR Code
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 overflow-y-auto">
                    {mode === 'file' && previewRecipes.length === 0 && (
                        <div
                            className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${isDragging
                                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                                : 'border-gray-300 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500'
                                }`}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".json"
                                onChange={handleFileInputChange}
                                className="hidden"
                            />

                            <FileJson className="mx-auto text-gray-400 dark:text-gray-600 mb-4" size={48} />

                            {loading ? (
                                <div className="space-y-2">
                                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                    <p className="text-gray-600 dark:text-gray-400">Processing file...</p>
                                </div>
                            ) : (
                                <>
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">Drop JSON file here</h4>
                                    <p className="text-gray-500 dark:text-gray-400 mb-4">or</p>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
                                    >
                                        <Upload size={18} />
                                        Choose File
                                    </button>
                                </>
                            )}
                        </div>
                    )}

                    {mode === 'qr' && previewRecipes.length === 0 && (
                        <div className="space-y-4">
                            <div id="qr-reader" ref={scannerDivRef} className="rounded-xl overflow-hidden"></div>

                            {!isScanning && (
                                <div className="text-center space-y-4">
                                    <Camera className="mx-auto text-gray-400 dark:text-gray-600" size={48} />
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">Scan QR Code</h4>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                                            Point your camera at a recipe QR code
                                        </p>
                                    </div>
                                    <button
                                        onClick={startQRScanner}
                                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
                                    >
                                        <Camera size={18} />
                                        Start Camera
                                    </button>
                                </div>
                            )}

                            {isScanning && (
                                <button
                                    onClick={stopQRScanner}
                                    className="w-full bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                >
                                    Stop Scanning
                                </button>
                            )}
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-xl p-4 flex items-start gap-3 mb-4">
                            <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0" size={20} />
                            <div>
                                <h5 className="font-bold text-red-900 dark:text-red-200 mb-1">Import Failed</h5>
                                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Duplicate Warning */}
                    {duplicateRecipes.length > 0 && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 rounded-xl p-4 flex items-start gap-3 mb-4">
                            <AlertCircle className="text-yellow-600 dark:text-yellow-400 flex-shrink-0" size={20} />
                            <div>
                                <h5 className="font-bold text-yellow-900 dark:text-yellow-200 mb-1">Duplicate Detected</h5>
                                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                    The following recipe(s) already exist: <strong>{duplicateRecipes.join(', ')}</strong>.
                                    Importing will create duplicates.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Preview */}
                    {previewRecipes.length > 0 && (
                        <div className="space-y-4">
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/50 rounded-xl p-4 flex items-start gap-3">
                                <CheckCircle className="text-green-600 dark:text-green-400 flex-shrink-0" size={20} />
                                <div>
                                    <h5 className="font-bold text-green-900 dark:text-green-200 mb-1">
                                        {previewRecipes.length} recipe{previewRecipes.length > 1 ? 's' : ''} ready to import
                                    </h5>
                                    <p className="text-sm text-green-700 dark:text-green-300">Review below and click Import to confirm</p>
                                </div>
                            </div>

                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {previewRecipes.map((recipe, idx) => {
                                    const isDuplicate = duplicateRecipes.includes(recipe.name);
                                    return (
                                        <div
                                            key={idx}
                                            className={`rounded-lg p-4 border ${isDuplicate
                                                ? 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-300 dark:border-yellow-800'
                                                : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h5 className="font-bold text-gray-900 dark:text-white">{recipe.name}</h5>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{recipe.simulation} • {recipe.sensor}</p>
                                                </div>
                                                {isDuplicate && (
                                                    <span className="text-xs bg-yellow-200 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded">
                                                        Duplicate
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {previewRecipes.length > 0 && (
                    <div className="bg-gray-50 dark:bg-zinc-950 p-4 border-t border-gray-200 dark:border-zinc-800 flex gap-2">
                        <button
                            onClick={handleClose}
                            className="flex-1 py-3 px-4 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmImport}
                            className="flex-1 py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors"
                        >
                            Import {previewRecipes.length} Recipe{previewRecipes.length > 1 ? 's' : ''}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
