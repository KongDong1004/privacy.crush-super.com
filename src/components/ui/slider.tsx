import * as React from "react";
import { cn } from "@/lib/utils";

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    value: number;
    onValueChange: (value: number) => void;
}

export function Slider({ className, label, value, onValueChange, ...props }: SliderProps) {
    return (
        <div className={cn("grid gap-2", className)}>
            {label && (
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {label}
                    </label>
                    <span className="text-sm text-muted-foreground">{value}</span>
                </div>
            )}
            <input
                type="range"
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={value}
                onChange={(e) => onValueChange(Number(e.target.value))}
                {...props}
            />
        </div>
    );
}
