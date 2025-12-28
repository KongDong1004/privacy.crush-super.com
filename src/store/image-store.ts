import { create } from 'zustand';

export type ToolType = 'mosaic' | 'blur';

export interface Operation {
    id: string;
    type: ToolType;
    x: number;
    y: number;
    width: number;
    height: number;
    intensity: number;
}

interface ImageState {
    imageSrc: string | null;
    imageDimensions: { width: number; height: number } | null;

    tool: ToolType;
    intensity: number;

    history: Operation[];
    historyIndex: number; // Points to the current state in history. -1 means no ops applied.

    isDragging: boolean;

    // Actions
    setImage: (src: string | null) => void;
    setImageDimensions: (width: number, height: number) => void;
    setTool: (tool: ToolType) => void;
    setIntensity: (intensity: number) => void;
    setIsDragging: (isDragging: boolean) => void;

    addOperation: (op: Operation) => void;
    undo: () => void;
    redo: () => void;
    resetOperations: () => void;
}

export const useImageStore = create<ImageState>((set) => ({
    imageSrc: null,
    imageDimensions: null,

    tool: 'mosaic',
    intensity: 50,

    history: [],
    historyIndex: -1,

    isDragging: false,

    setImage: (src) => set({
        imageSrc: src,
        history: [],
        historyIndex: -1,
        imageDimensions: null
    }),

    setImageDimensions: (width, height) => set({ imageDimensions: { width, height } }),

    setTool: (tool) => set({ tool }),

    setIntensity: (intensity) => set({ intensity }),

    setIsDragging: (isDragging) => set({ isDragging }),

    addOperation: (op) => set((state) => {
        // If we are in the middle of history (undone some steps), discard the future
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push(op);
        return {
            history: newHistory,
            historyIndex: newHistory.length - 1,
        };
    }),

    undo: () => set((state) => ({
        historyIndex: Math.max(-1, state.historyIndex - 1)
    })),

    redo: () => set((state) => ({
        historyIndex: Math.min(state.history.length - 1, state.historyIndex + 1)
    })),

    resetOperations: () => set({
        historyIndex: -1
    })
}));
