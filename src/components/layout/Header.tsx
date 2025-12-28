import { ShieldCheck } from "lucide-react";

export function Header() {
    return (
        <header className="flex items-center justify-between border-b bg-white p-4 dark:bg-gray-950">
            <div className="flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
                    Privacy Pixel
                </h1>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
                Secure, Browser-based Redaction
            </div>
        </header>
    );
}
