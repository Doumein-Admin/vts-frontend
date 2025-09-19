import { useState } from 'react';
import { Copy, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface TranscriptViewProps {
  transcript: string;
  isVisible: boolean;
  onNewRecording: () => void;
}

export function TranscriptView({ transcript, isVisible, onNewRecording }: TranscriptViewProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcript);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Your transcript has been copied successfully.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Unable to copy transcript to clipboard.",
        variant: "destructive",
      });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-40">
      <div className="w-full max-w-4xl h-full max-h-[80vh] glass-intense rounded-3xl overflow-hidden ai-scale-in flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-ai-glass/30 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ai-primary to-ai-secondary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Voice Transcript</h2>
              <p className="text-xs text-muted-foreground">AI-powered transcription</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              onClick={handleCopy}
              variant="outline"
              size="sm"
              className="glass border-ai-glass/30 hover:bg-ai-primary/20"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-1 text-green-400" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Transcript Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-ai-primary/5 to-ai-secondary/5 rounded-2xl" />
            <div className="relative p-4 rounded-2xl border border-ai-glass/20">
              <p className="text-foreground leading-relaxed text-base font-medium whitespace-pre-wrap">
                {transcript || "Your transcription will appear here..."}
              </p>
            </div>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="p-4 border-t border-ai-glass/30 flex justify-end">
          <Button
            onClick={onNewRecording}
            className="bg-gradient-to-r from-ai-primary to-ai-secondary hover:from-ai-primary/90 hover:to-ai-secondary/90"
          >
            New Recording
          </Button>
        </div>
      </div>
    </div>
  );
}
