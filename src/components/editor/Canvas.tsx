"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useImageStore } from "@/store/image-store";
import { applyMosaic, applyBlur } from "@/lib/image-processing";
import { cn } from "@/lib/utils";

export function Canvas() {
    const {
        imageSrc,
        tool,
        intensity,
        addOperation,
        history,
        historyIndex
    } = useImageStore();

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);

    // Local state for interaction
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState<{ x: number, y: number } | null>(null);
    const [currentRect, setCurrentRect] = useState<{ x: number, y: number, w: number, h: number } | null>(null);
    const [scale, setScale] = useState(1);

    // Load image
    useEffect(() => {
        if (!imageSrc) return;
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
            imgRef.current = img;
            renderCanvas();
        };
    }, [imageSrc]);

    // Main Render Loop
    const renderCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        const img = imgRef.current;
        if (!canvas || !ctx || !img) return;

        // Reset canvas size to image size
        if (canvas.width !== img.width || canvas.height !== img.height) {
            canvas.width = img.width;
            canvas.height = img.height;
        }

        // 1. Draw Original Image
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.filter = "none"; // Reset filter
        ctx.drawImage(img, 0, 0);

        // 2. Apply History Operations
        // We only apply operations up to the current historyIndex
        const activeOps = history.slice(0, historyIndex + 1);

        activeOps.forEach(op => {
            if (op.type === 'mosaic') {
                applyMosaic(ctx, op.x, op.y, op.width, op.height, op.intensity);
            } else if (op.type === 'blur') {
                applyBlur(ctx, op.x, op.y, op.width, op.height, op.intensity);
            }
        });

        // 3. Draw Current Selection Rect (if any)
        if (currentRect) {
            // Fill with semi-transparent color for better visibility
            ctx.fillStyle = "rgba(255, 0, 0, 0.4)";
            ctx.fillRect(currentRect.x, currentRect.y, currentRect.w, currentRect.h);

            ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
            ctx.lineWidth = 2 / scale; // Keep line width constant relative to screen
            ctx.setLineDash([5 / scale, 5 / scale]);
            ctx.strokeRect(currentRect.x, currentRect.y, currentRect.w, currentRect.h);
            ctx.setLineDash([]);
        }

    }, [history, historyIndex, currentRect, scale]);

    // Trigger render when history changes
    useEffect(() => {
        renderCanvas();
    }, [renderCanvas]);

    // Handle Download Event
    useEffect(() => {
        const handleDownload = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const link = document.createElement('a');
            link.download = 'privacy-pixel-edited.jpg';
            link.href = canvas.toDataURL('image/jpeg', 0.9);
            link.click();
        };

        window.addEventListener('trigger-download', handleDownload);
        return () => window.removeEventListener('trigger-download', handleDownload);
    }, []);


    // --- Event Handlers ---

    const getCoords = (e: React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    };

    // Update scale state for line width adjustments
    useEffect(() => {
        const updateScale = () => {
            if (canvasRef.current && containerRef.current) {
                const rect = canvasRef.current.getBoundingClientRect();
                // approximation
                setScale(canvasRef.current.width / rect.width);
            }
        };
        window.addEventListener('resize', updateScale);
        updateScale();
        return () => window.removeEventListener('resize', updateScale);
    }, [imageSrc]);


    const onMouseDown = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent text selection
        const { x, y } = getCoords(e);
        setIsDrawing(true);
        setStartPos({ x, y });
        setCurrentRect({ x, y, w: 0, h: 0 });
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDrawing || !startPos) {
            // Cursor stuff could go here
            return;
        }
        const { x, y } = getCoords(e);

        const w = x - startPos.x;
        const h = y - startPos.y;

        setCurrentRect({ x: startPos.x, y: startPos.y, w, h });
    };

    const onMouseUp = () => {
        if (!isDrawing || !startPos || !currentRect) return;

        // Normalize Rect (width/height can be negative)
        let finalX = currentRect.x;
        let finalY = currentRect.y;
        let finalW = currentRect.w;
        let finalH = currentRect.h;

        if (finalW < 0) { finalX += finalW; finalW = Math.abs(finalW); }
        if (finalH < 0) { finalY += finalH; finalH = Math.abs(finalH); }

        // Minimum size check (e.g., 5px)
        if (finalW > 5 && finalH > 5) {
            addOperation({
                id: crypto.randomUUID(),
                type: tool,
                x: finalX,
                y: finalY,
                width: finalW,
                height: finalH,
                intensity: intensity
            });
        }

        setIsDrawing(false);
        setStartPos(null);
        setCurrentRect(null);
    };

    return (
        <div ref={containerRef} className="relative flex h-full w-full items-center justify-center overflow-auto bg-gray-100 p-8 dark:bg-gray-900">
            <div className="relative shadow-2xl">
                <canvas
                    ref={canvasRef}
                    className="bg-white object-contain"
                    style={{
                        maxWidth: '100%',
                        maxHeight: 'calc(100vh - 120px)',
                        cursor: 'crosshair'
                    }}
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                    onMouseLeave={onMouseUp} // Auto-commit if leaving canvas 
                />
            </div>
        </div>
    );
}
