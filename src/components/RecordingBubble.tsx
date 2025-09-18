import { useState, useRef } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecordingBubbleProps {
  isRecording: boolean;
  isTranscribing: boolean;
  isMinimized: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

export function RecordingBubble({ 
  isRecording, 
  isTranscribing,
  isMinimized,
  onStartRecording, 
  onStopRecording 
}: RecordingBubbleProps) {
  const handleClick = () => {
    if (isRecording) {
      onStopRecording();
    } else {
      onStartRecording();
    }
  };

  return (
    <div
      className={cn(
        "fixed transform -translate-x-1/2 -translate-y-1/2 z-50 transition-ai",
        isMinimized ? "top-20 left-20 scale-75" : "top-1/2 left-1/2"
      )}
    >
      {/* Outer glow rings for recording */}
      {isRecording && (
        <>
          <div className="absolute inset-0 rounded-full bg-ai-primary/20 scale-125 animate-ping" />
          <div className="absolute inset-0 rounded-full bg-ai-primary/10 scale-150 animate-ping animation-delay-200" />
        </>
      )}
      
      {/* Main bubble */}
      <button
        onClick={handleClick}
        disabled={isTranscribing}
        className={cn(
          "relative w-32 h-32 rounded-full glass-intense transition-ai",
          "hover:scale-105 active:scale-95",
          "focus:outline-none focus:ring-4 focus:ring-ai-primary/50",
          "group",
          isRecording && "recording-pulse recording-glow",
          isTranscribing && "animate-pulse"
        )}
        style={{
          background: isRecording 
            ? 'linear-gradient(135deg, hsl(var(--ai-primary) / 0.4), hsl(var(--ai-secondary) / 0.4))'
            : 'var(--gradient-glass)'
        }}
      >
        {/* Inner gradient overlay */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-ai-primary/20 to-ai-secondary/20" />
        
        {/* Icon container */}
        <div className="relative flex items-center justify-center h-full">
          {isTranscribing ? (
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-ai-primary rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-ai-secondary rounded-full animate-bounce animation-delay-100" />
              <div className="w-2 h-2 bg-ai-accent rounded-full animate-bounce animation-delay-200" />
            </div>
          ) : isRecording ? (
            <div className="relative">
              <MicOff className="w-8 h-8 text-white drop-shadow-lg" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            </div>
          ) : (
            <Mic className="w-8 h-8 text-ai-primary group-hover:text-white transition-colors" />
          )}
        </div>

        {/* Ripple effect on click */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className="absolute inset-0 bg-ai-primary/30 rounded-full scale-0 group-active:scale-100 transition-transform duration-300" />
        </div>
      </button>

      {/* Status text */}
      {!isMinimized && (
        <div className="absolute top-full mt-6 left-1/2 transform -translate-x-1/2 text-center">
          <p className="text-ai-primary font-medium mb-1">
            {isTranscribing 
              ? "Transcribing..." 
              : isRecording 
                ? "Recording..." 
                : "Tap to record"
            }
          </p>
          <p className="text-xs text-muted-foreground">
            {isTranscribing 
              ? "AI is processing your voice" 
              : isRecording 
                ? "Tap again to stop" 
                : "Speak your thoughts"
            }
          </p>
        </div>
      )}
    </div>
  );
}