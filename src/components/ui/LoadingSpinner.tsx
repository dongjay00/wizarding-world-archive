"use client";

import { Loader2, Sparkles } from "lucide-react";

export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-amber-500`} />
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <Sparkles className="w-16 h-16 text-amber-500 animate-pulse mb-4" />
      <p className="text-muted text-lg">Loading magical content...</p>
    </div>
  );
}

export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">⚡</div>
        <h3 className="text-2xl font-magic font-bold text-red-400 mb-2">
          Something Went Wrong
        </h3>
        <p className="text-muted">{message}</p>
      </div>
    </div>
  );
}
