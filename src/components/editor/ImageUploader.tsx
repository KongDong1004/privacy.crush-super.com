"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, AlertCircle } from "lucide-react";
import { useImageStore } from "@/store/image-store";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export function ImageUploader() {
    const setImage = useImageStore((state) => state.setImage);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = useCallback((file: File) => {
        if (!file.type.startsWith("image/")) {
            alert("Please upload an image file (JPG, PNG).");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            setImage(result);
        };
        reader.readAsDataURL(file);
    }, [setImage]);

    const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, [handleFile]);

    const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    return (
        <div className="flex w-full max-w-xl flex-col gap-6 text-center">

            <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Securely hide sensitive info.</h2>
                <p className="text-muted-foreground">
                    Blur faces or mosaic private details directly in your browser.<br className="hidden sm:inline" />
                    No image data is ever uploaded to a server. 100% Private.
                </p>
            </div>

            <div
                onClick={handleClick}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                className={cn(
                    "flex min-h-[400px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 transition-colors dark:border-gray-800 dark:bg-gray-950/50",
                    isDragOver && "border-blue-500 bg-blue-50/50 dark:border-blue-500 dark:bg-blue-950/20"
                )}
            >
                <div className="flex flex-col items-center gap-4 p-8 text-center">
                    <div className="rounded-full bg-white p-4 shadow-sm dark:bg-gray-900">
                        <Upload className="h-8 w-8 text-blue-500" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <h3 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                            Click or drag image here
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            JPG, PNG supported · Max 10MB
                        </p>
                    </div>
                    <div className="mt-4 flex items-center gap-2 rounded-md bg-blue-100/50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        <AlertCircle className="h-3 w-3" />
                        <span>Processed locally in your browser</span>
                    </div>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleInputChange}
                />
            </div>
        </div>
    );
}
