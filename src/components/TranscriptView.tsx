import { motion, AnimatePresence } from "framer-motion";

export const TranscriptView = ({ transcript, isVisible, onNewRecording, onCopy }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="fixed inset-0 bg-background/95 backdrop-blur-md z-40 flex flex-col p-4"
        >
          {/* Scrollable transcript */}
          <div className="flex-1 overflow-y-auto p-2 text-foreground text-lg leading-relaxed">
            {transcript}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <button
              onClick={onCopy}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-ai-primary text-white font-semibold shadow-md"
            >
              Copy
            </button>
            <button
              onClick={onNewRecording}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-ai-secondary text-white font-semibold shadow-md"
            >
              New Recording
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
