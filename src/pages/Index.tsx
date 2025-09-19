import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';

interface TranscriptViewProps {
  transcript: string;
  isVisible: boolean;
  onNewRecording: () => void;
}

const TranscriptView = ({ transcript, isVisible, onNewRecording }: TranscriptViewProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
      transition={{ duration: 0.5 }}
      className={`w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 ${
        isVisible ? 'block' : 'hidden'
      }`}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 max-h-[70vh] overflow-y-auto">
        {/* Transcript content */}
        <div className="text-gray-800 dark:text-gray-200 text-base sm:text-lg leading-relaxed">
          {transcript}
        </div>

        {/* New Recording Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={onNewRecording}
            className="p-2 rounded-full bg-gradient-to-r from-ai-primary to-ai-accent text-white hover:opacity-90 transition-opacity"
            aria-label="Start new recording"
          >
            <X size={24} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const Index = () => {
  const API_TOKEN = import.meta.env.VITE_API_TOKEN;

  const {
    isRecording,
    isTranscribing,
    transcript,
    error,
    startRecording,
    stopRecording,
    resetTranscript,
  } = useVoiceRecording(API_TOKEN);

  const hasTranscript = transcript.length > 0;

  const handleNewRecording = () => {
    resetTranscript();
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden bg-background">
      {/* Subtle animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-ai-primary/5 via-ai-secondary/10 to-ai-accent/5 animate-gradient" />

      {/* Header */}
      {!hasTranscript && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 text-center z-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-ai-primary via-ai-secondary to-ai-accent bg-clip-text text-transparent">
              AI Voice
            </span>
            <br />
            <span className="text-foreground">Transcription</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Transform your voice into text with precision AI technology
          </p>
        </div>
      )}

      {/* Center AI Bubble */}
      <AnimatePresence>
        {!hasTranscript && (
          <motion.button
            key="ai-bubble"
            onClick={isRecording ? stopRecording : startRecording}
            className="relative flex items-center justify-center rounded-full w-32 h-32 md:w-40 md:h-40 bg-gradient-to-r from-ai-primary via-ai-secondary to-ai-accent shadow-xl"
            animate={{
              scale: isRecording ? [1, 1.1, 1] : 1,
              boxShadow: isRecording
                ? "0 0 40px rgba(99,102,241,0.6)"
                : "0 0 20px rgba(99,102,241,0.3)",
            }}
            transition={{
              duration: 1.5,
              repeat: isRecording ? Infinity : 0,
              ease: "easeInOut",
            }}
          >
            <span className="text-white font-semibold text-lg">
              {isRecording ? "Stop" : "Start"}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Bubble shrinks & moves bottom-right after transcript */}
      {hasTranscript && (
        <motion.div
          key="ai-bubble-min"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: 1,
            scale: 0.8,
            x: "calc(50vw - 5rem)",
            y: "calc(50vh - 5rem)",
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed bottom-8 right-8 w-20 h-20 rounded-full bg-gradient-to-r from-ai-primary via-ai-secondary to-ai-accent shadow-lg flex items-center justify-center"
        >
          <span className="text-white font-bold">AI</span>
        </motion.div>
      )}

      {/* Transcript */}
      <TranscriptView
        transcript={transcript}
        isVisible={hasTranscript}
        onNewRecording={handleNewRecording}
      />

      {/* Footer */}
      {!hasTranscript && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
          <p className="text-sm text-muted-foreground">
            Powered by advanced AI • Secure & Private
          </p>
        </div>
      )}
    </div>
  );
};

export default Index;