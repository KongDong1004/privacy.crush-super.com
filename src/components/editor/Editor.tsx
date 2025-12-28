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
                    <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-950">
                        {/* Animated Mesh Gradient Background */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] rounded-full bg-blue-400/20 blur-[120px] mix-blend-multiply dark:bg-blue-900/20 dark:mix-blend-normal animate-blob" />
                            <div className="absolute top-[-20%] right-[-20%] w-[50%] h-[50%] rounded-full bg-purple-400/20 blur-[120px] mix-blend-multiply dark:bg-purple-900/20 dark:mix-blend-normal animate-blob animation-delay-2000" />
                            <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-pink-400/20 blur-[120px] mix-blend-multiply dark:bg-pink-900/20 dark:mix-blend-normal animate-blob animation-delay-4000" />
                        </div>

                        {/* Scrolling Marquee Background */}
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 opacity-30 dark:opacity-20 pointer-events-none select-none overflow-hidden">
                            <div className="flex gap-8 animate-infinite-scroll w-max">
                                {/* Duplicate images to create infinite loop effect */}
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="flex gap-8 shrink-0">
                                        <div className="w-64 h-96 rounded-2xl overflow-hidden shadow-2xl rotate-3">
                                            <img src="/demo/1.png" className="w-full h-full object-cover" alt="Cyberpunk fashion model with face obfuscated for privacy" />
                                        </div>
                                        <div className="w-64 h-96 rounded-2xl overflow-hidden shadow-2xl -rotate-2 mt-12">
                                            <img src="/demo/2.png" className="w-full h-full object-cover" alt="High fashion photography with artistic mosaic censorship" />
                                        </div>
                                        <div className="w-64 h-96 rounded-2xl overflow-hidden shadow-2xl rotate-1">
                                            <img src="/demo/3.png" className="w-full h-full object-cover" alt="Fitness influencer mirror selfie with face blurred" />
                                        </div>
                                        <div className="w-64 h-96 rounded-2xl overflow-hidden shadow-2xl -rotate-3 mt-12">
                                            <img src="/demo/4.png" className="w-full h-full object-cover" alt="Abstract fashion portrait with pixelated privacy shield" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Center Content Card */}
                        <div className="relative z-10 w-full max-w-2xl p-4">
                            <div className="rounded-3xl border border-white/20 bg-white/80 p-8 shadow-2xl backdrop-blur-xl dark:bg-black/60 dark:border-white/10">
                                <ImageUploader />
                            </div>
                        </div>
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
