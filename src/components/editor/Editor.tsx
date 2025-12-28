"use client";

import { useImageStore } from "@/store/image-store";
import { ImageUploader } from "./ImageUploader";
import { Toolbar } from "./Toolbar";
import { Canvas } from "./Canvas";
import { Header } from "../layout/Header";

export function Editor() {
    const imageSrc = useImageStore((state) => state.imageSrc);

    return (
        <div className="flex h-screen flex-col bg-background text-foreground">
            <Header />
            <main className="flex flex-1 overflow-hidden">
                {!imageSrc ? (
                    <div className="flex flex-1 items-center justify-center p-6">
                        <ImageUploader />
                    </div>
                ) : (
                    <>
                        <Toolbar />
                        <section className="flex-1 bg-muted/20" aria-label="Image Canvas">
                            <Canvas />
                        </section>
                    </>
                )}
            </main>
        </div>
    );
}
