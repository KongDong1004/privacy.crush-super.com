"use client";

import { useImageStore } from "@/store/image-store";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import { Grid3x3, Droplets, RotateCcw, RotateCw, Download, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Toolbar() {
    const {
        tool,
        setTool,
        intensity,
        setIntensity,
        undo,
        redo,
        resetOperations,
        setImage,
        historyIndex,
        history
    } = useImageStore();

    const canUndo = historyIndex >= 0;
    const canRedo = historyIndex < history.length - 1;

    const handleDownload = () => {
        // Dispatch a custom event that the canvas listens to
        window.dispatchEvent(new CustomEvent('trigger-download'));
    };

    return (
        <aside
            className="flex w-full flex-col gap-6 border-r bg-white p-6 dark:bg-gray-950 sm:w-80"
            aria-label="Image Editing Tools"
        >

            {/* Tool Selection */}
            <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500 text-muted-foreground">Effect</h3>
                <div className="grid grid-cols-2 gap-2">
                    <Button
                        variant={tool === 'mosaic' ? "default" : "outline"}
                        className={cn("h-20 flex-col gap-2", tool === 'mosaic' && "border-primary bg-primary/10 text-primary hover:bg-primary/20")}
                        onClick={() => setTool('mosaic')}
                    >
                        <Grid3x3 className="h-6 w-6" />
                        Mosaic
                    </Button>
                    <Button
                        variant={tool === 'blur' ? "default" : "outline"}
                        className={cn("h-20 flex-col gap-2", tool === 'blur' && "border-blue-500 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:border-blue-400 dark:bg-blue-900/20 dark:text-blue-400")}
                        onClick={() => setTool('blur')}
                    >
                        <Droplets className="h-6 w-6" />
                        Blur
                    </Button>
                </div>
            </div>

            {/* Intensity Slider */}
            <div className="space-y-4">
                <Slider
                    label="Intensity"
                    min={1}
                    max={50}
                    step={1}
                    value={intensity}
                    onValueChange={setIntensity}
                />
            </div>

            {/* History Controls */}
            <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" onClick={undo} disabled={!canUndo}>
                        <RotateCcw className="mr-2 h-4 w-4" /> Undo
                    </Button>
                    <Button variant="outline" size="sm" onClick={redo} disabled={!canRedo}>
                        <RotateCw className="mr-2 h-4 w-4" /> Redo
                    </Button>
                </div>
                <Button variant="outline" className="w-full mb-2" onClick={() => setImage(null)}>
                    Change Image
                </Button>
                <Button variant="outline" className="w-full text-red-500 hover:text-red-600" onClick={resetOperations}>
                    <Trash2 className="mr-2 h-4 w-4" /> Clear All Edits
                </Button>
            </div>

            <div className="mt-auto pt-6">
                <Button className="w-full" size="lg" onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" /> Download Result
                </Button>

            </div>
        </aside>
    );
}
